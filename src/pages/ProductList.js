import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products } from '../data/products';
import { categories } from '../data/categories';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import ProductItem from '../components/ProductItem';
import Pagination from '../components/Pagination';

const PAGE_SIZE = 3;

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const rawCategory = searchParams.get('category') || '';
  const category = categories.some(item => item.value === rawCategory) ? rawCategory : '';
  const filteredProducts = useMemo(() => {
    const categoryLabel = categories.find(item => item.value === category)?.label;
    return products.filter(product =>
      product.name.toLowerCase().includes(keyword.trim().toLowerCase()) &&
      (!categoryLabel || product.category === categoryLabel)
    );
  }, [keyword, category]);
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const requestedPage = Number(searchParams.get('page') || 1);
  const page = Number.isSafeInteger(requestedPage) ? Math.min(totalPages, Math.max(1, requestedPage)) : 1;

  // Keep manually entered, invalid URLs consistent with the page displayed.
  useEffect(() => {
    if ((searchParams.has('page') && searchParams.get('page') !== String(page)) || rawCategory !== category) {
      const next = new URLSearchParams(searchParams);
      next.set('page', String(page));
      if (rawCategory !== category) next.delete('category');
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams, page, rawCategory, category]);

  function updateFilter(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.set('page', '1');
    setSearchParams(next);
  }
  function changePage(nextPage) {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(nextPage));
    setSearchParams(next);
  }
  const visibleProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const search = searchParams.toString() ? `?${searchParams.toString()}` : '';

  return <section className="page-section">
    <h1>Products</h1>
    <div className="filters">
      <SearchBar keyword={keyword} onSearch={value => updateFilter('keyword', value)} />
      <CategoryFilter category={category} onChange={value => updateFilter('category', value)} />
    </div>
    <p aria-live="polite">Total Product: {filteredProducts.length}</p>
    {visibleProducts.length ? (
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Category</th>
              <th scope="col">Price</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {visibleProducts.map(product => (
              <ProductItem key={product.id} product={product} search={search} />
            ))}
          </tbody>
        </table>
      </div>
    ) : <p>No products available</p>}
    <Pagination page={page} totalPages={totalPages} onPageChange={changePage} />
  </section>;
}
