import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, Phone, Mail } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { config } from '../../config';

const navLinks = [
  { to: '/', label: 'E-shop' },
  { to: '/our-story', label: 'Náš príbeh' },
  { to: '/care', label: 'Starostlivosť' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { toggleCart, totalItems } = useCartStore();
  const itemCount = totalItems();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 bg-cream transition-shadow duration-300 ${scrolled ? 'shadow-soft' : ''}`}>
      {/* Top contact bar — warm stone */}
      <div className="bg-anthracite/90 text-cream/80 text-[10px]">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <a href={`tel:${config.contact.phone}`} className="flex items-center gap-1.5 hover:text-cream transition-colors">
              <Phone size={10} />
              <span>{config.contact.phone}</span>
            </a>
            <a href={`mailto:${config.contact.email}`} className="flex items-center gap-1.5 hover:text-cream transition-colors">
              <Mail size={10} />
              <span>{config.contact.email}</span>
            </a>
          </div>
          <span className="hidden sm:block uppercase tracking-widest text-[9px]">Doprava zadarmo nad 40 €</span>
        </div>
      </div>

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
              aria-label="Vyhľadávanie"
              className="p-2 text-anthracite/60 hover:text-anthracite transition-colors"
            >
              <Search size={18} />
            </button>

            <button
              onClick={toggleCart}
              aria-label={`Košík (${itemCount} položiek)`}
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
