import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const { pathname } = useLocation();
  return <header className="header">
    <nav className="container navigation" aria-label="Main navigation">
      <Link className="brand" to="/">Product Store</Link>
      <div className="nav-links">
        <Link to="/" aria-current={pathname === '/' ? 'page' : undefined}>Home</Link>
        <Link to="/products" aria-current={pathname.startsWith('/products') ? 'page' : undefined}>Products</Link>
      </div>
    </nav>
  </header>;
}
