import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

const navLinks = [
  { to: '/', label: 'E‑shop' },
  { to: '/our-story', label: 'Náš příběh' },
  { to: '/care', label: 'Péče' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { toggleCart, totalItems } = useCartStore();
  const itemCount = totalItems();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 bg-cream transition-shadow duration-300 ${scrolled ? 'shadow-soft' : ''}`}>
      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 border-b border-anthracite/8">
        <div className="flex items-center justify-between h-16">
          {/* Logo — serif */}
          <Link to="/" className="flex-shrink-0">
            <span className="font-serif text-2xl font-semibold tracking-wide text-anthracite">
              rozto<span className="text-honey">mile</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `text-[11px] font-medium uppercase tracking-widest transition-colors ${
                    isActive
                      ? 'text-honey'
                      : 'text-anthracite hover:text-honey'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-2">
            <button
              aria-label="Vyhledávání"
              className="p-2 text-anthracite/60 hover:text-anthracite transition-colors"
              onClick={() => {
                navigate('/?focus=search');
                setMobileOpen(false);
              }}
            >
              <Search size={18} />
            </button>

            <button
              onClick={toggleCart}
              aria-label={`Košík (${itemCount} položek)`}
              className="relative p-2 text-anthracite/60 hover:text-anthracite transition-colors"
            >
              <ShoppingBag size={18} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] flex items-center justify-center bg-honey text-cream text-[9px] font-bold rounded-full px-1">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-anthracite/60 hover:text-anthracite transition-colors"
              aria-label="Menu"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-anthracite/8 bg-cream">
          <nav className="max-w-7xl mx-auto px-4 py-5 flex flex-col gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 text-xs font-medium uppercase tracking-widest transition-colors ${
                    isActive
                      ? 'text-honey'
                      : 'text-anthracite hover:text-honey'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
