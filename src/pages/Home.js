import { Link } from 'react-router-dom';

export default function Home() {
  return <section className="home">
    <h1>Welcome to Product Store</h1>
    <p>Manage and explore products for your needs</p>
    <Link to="/products">View Products</Link>
  </section>;
}
