import { useEffect, useState } from 'react';

export default function SearchBar({ keyword, onSearch }) {
  const [input, setInput] = useState(keyword);
  useEffect(() => { setInput(keyword); }, [keyword]);
  function handleSubmit(event) {
    event.preventDefault();
    onSearch(input.trim());
  }
  return <form className="search-form" onSubmit={handleSubmit}>
    <label htmlFor="keyword">Search Product</label>
    <div className="search-controls">
      <input id="keyword" type="search" placeholder="Search by product name…" value={input} onChange={event => setInput(event.target.value)} />
      <button type="submit" className="button">Search</button>
    </div>
  </form>;
}
