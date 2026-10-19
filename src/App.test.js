import { fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';

function open(path) {
  window.history.replaceState({}, '', path);
  return render(<App />);
}

test('home links to the product list with three products per page', () => {
  open('/');
  fireEvent.click(screen.getByRole('link', { name: /View Products/ }));
  expect(screen.getByText('Total Product: 15')).toBeInTheDocument();
  expect(screen.getAllByRole('row')).toHaveLength(4);
  expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Next' }));
  expect(new URLSearchParams(window.location.search).get('page')).toBe('2');
});

test('search applies on submit, ignores case, combines with category and resets page', () => {
  open('/products?page=2');
  fireEvent.change(screen.getByLabelText('Search Product'), { target: { value: 'SAMSUNG' } });
  expect(screen.getByText('Total Product: 15')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Search' }));
  expect(screen.getByText('Total Product: 2')).toBeInTheDocument();
  expect(new URLSearchParams(window.location.search).get('page')).toBe('1');
  fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'tablet' } });
  expect(screen.getByText('Total Product: 1')).toBeInTheDocument();
  expect(screen.getByText('Samsung Galaxy Tab S10')).toBeInTheDocument();
  expect(new URLSearchParams(window.location.search).get('keyword')).toBe('SAMSUNG');
  fireEvent.change(screen.getByLabelText('Category'), { target: { value: '' } });
  expect(screen.getByText('Total Product: 2')).toBeInTheDocument();
});

test('pagination preserves filters and details return to the same list', () => {
  open('/products?keyword=&category=laptop&page=1');
  fireEvent.click(screen.getByRole('button', { name: 'Next' }));
  expect(window.location.search).toBe('?keyword=&category=laptop&page=2');
  expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  fireEvent.click(screen.getByRole('link', { name: 'View Detail: Lenovo ThinkPad E14' }));
  expect(window.location.pathname).toBe('/products/10');
  const detail = screen.getByRole('article');
  expect(within(detail).getByText('Laptop phục vụ công việc và lập trình.')).toBeInTheDocument();
  expect(within(detail).queryByText('MacBook Air M4')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /Back To Products/ }));
  expect(window.location.pathname + window.location.search).toBe('/products?keyword=&category=laptop&page=2');
});

test('empty results show a message and disable pagination', () => {
  open('/products?keyword=missing-product');
  expect(screen.getByText('No products available')).toBeInTheDocument();
  expect(screen.getByText('Total Product: 0')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
});

test.each(['0', '-2', 'abc', '1.5', '999'])('normalizes invalid page %s', page => {
  open('/products?category=laptop&page=' + page);
  const expected = page === '999' ? '2' : '1';
  expect(new URLSearchParams(window.location.search).get('page')).toBe(expected);
  expect(screen.getAllByRole('row').length).toBeGreaterThan(1);
});

test('unknown product shows a message with a working return button', () => {
  open('/products/999');
  expect(screen.getByRole('heading', { name: 'Product not found' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /Back To Products/ }));
  expect(window.location.pathname).toBe('/products');
});

test('unknown URL shows the 404 page', () => {
  open('/unknown-page');
  expect(screen.getByText('404 · PAGE NOT FOUND')).toBeInTheDocument();
});
