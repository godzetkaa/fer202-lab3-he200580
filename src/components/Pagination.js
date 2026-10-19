export default function Pagination({ page, totalPages, onPageChange }) {
  return <nav className="pagination" aria-label="Product pagination">
    <button className="button secondary" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Previous</button>
    <span>Page: <strong>{page}</strong> / {totalPages}</span>
    <button className="button secondary" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>Next</button>
  </nav>;
}
