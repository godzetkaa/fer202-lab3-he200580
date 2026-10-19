import { categories } from '../data/categories';

export default function CategoryFilter({ category, onChange }) {
  return <div className="category-filter">
    <label htmlFor="category">Category</label>
    <select id="category" value={category} onChange={event => onChange(event.target.value)}>
      <option value="">All Category</option>
      {categories.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
    </select>
  </div>;
}
