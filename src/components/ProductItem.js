import { Link } from 'react-router-dom';

export const formatPrice = price => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

export default function ProductItem({ product, search }) {
  return <tr>
    <td>{product.name}</td>
    <td>{product.category}</td>
    <td>{formatPrice(product.price)}</td>
    <td><Link to={`/products/${product.id}${search}`} aria-label={`View Detail: ${product.name}`}>View Detail</Link></td>
  </tr>;
}
