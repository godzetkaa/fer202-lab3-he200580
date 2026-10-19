import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { products } from '../data/products';
import { formatPrice } from '../components/ProductItem';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { search } = useLocation();
  const product = products.find(item => String(item.id) === id);
  return <section className="page-section">
    <button onClick={() => navigate(`/products${search}`)}>Back To Products</button>
    {product ? <article>
      <h1>{product.name}</h1>
      <dl>
        <div><dt>ID</dt><dd>{product.id}</dd></div>
        <div><dt>Name</dt><dd>{product.name}</dd></div>
        <div><dt>Category</dt><dd>{product.category}</dd></div>
        <div><dt>Price</dt><dd>{formatPrice(product.price)}</dd></div>
        <div><dt>Description</dt><dd>{product.description}</dd></div>
      </dl>
    </article> : <div className="empty-state"><h1>Product not found</h1><p>Không tìm thấy sản phẩm có ID “{id}”.</p></div>}
  </section>;
}
