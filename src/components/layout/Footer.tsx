import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, MapPin, Phone, ArrowRight } from 'lucide-react';
import { config } from '../../config';

const quickLinks = [
  { to: '/', label: 'E‑shop' },
  { to: '/our-story', label: 'Náš příběh' },
  { to: '/care', label: 'Péče' },
];

const categories = [
  { to: '/?category=sviečky&focus=products', label: 'Svíčky' },
  { to: '/?category=včelí vosk&focus=products', label: 'Včelí vosk' },
  { to: '/?category=balzamy&focus=products', label: 'Balzámy na rty' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-anthracite text-cream/70 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Column 1 — Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-serif text-2xl font-semibold tracking-wide text-cream">
                rozto<span className="text-honey">mile</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-cream/60">
              Ručně vyráběné svíčky, včelí vosk a přírodní kosmetika s láskou pro váš domov. Každý kousek vzniká v malém ateliéru.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href={config.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 border border-cream/20 text-cream/50 hover:text-honey hover:border-honey transition-colors"
              >
                <Instagram size={14} />
              </a>
              <a
                href={config.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-2 border border-cream/20 text-cream/50 hover:text-honey hover:border-honey transition-colors"
              >
                <Facebook size={14} />
              </a>
            </div>
          </div>

          {/* Column 2 — Quick links */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-semibold text-cream/40 uppercase tracking-widest">
              Navigace
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-cream/60 hover:text-honey transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="text-[10px] font-semibold text-cream/40 uppercase tracking-widest pt-2">
              Kategorie
            </h4>
            <ul className="space-y-2.5">
              {categories.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-cream/60 hover:text-honey transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Contact */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-semibold text-cream/40 uppercase tracking-widest">
              Kontakt
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${config.contact.email}`}
                  className="flex items-start gap-2.5 text-sm text-cream/60 hover:text-honey transition-colors"
                >
                  <Mail size={14} className="mt-0.5 flex-shrink-0" />
                  <span>{config.contact.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${config.contact.phone}`}
                  className="flex items-start gap-2.5 text-sm text-cream/60 hover:text-honey transition-colors"
                >
                  <Phone size={14} className="mt-0.5 flex-shrink-0" />
                  <span>{config.contact.phone}</span>
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-cream/60">
                <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                <span>Česká republika</span>
              </li>
            </ul>
          </div>

          {/* Column 4 — Newsletter */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-semibold text-cream/40 uppercase tracking-widest">
              Newsletter
            </h4>
            <p className="text-sm text-cream/60 leading-relaxed">
              Přihlaste se a jako první se dozvíte o nových produktech a sezónních kolekcích.
            </p>
            {subscribed ? (
              <p className="text-sm font-medium text-honey">
                Děkujeme za přihlášení.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Váš e‑mail"
                  required
                  className="flex-1 min-w-0 px-3 py-2 text-sm bg-transparent border border-cream/20 text-cream placeholder-cream/30 focus:outline-none focus:border-honey transition-colors"
                />
                <button
                  type="submit"
                  aria-label="Prihlásiť sa"
                  className="flex-shrink-0 p-2 border border-cream/20 text-cream/60 hover:border-honey hover:text-honey transition-colors"
                >
                  <ArrowRight size={15} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-cream/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-cream/30 uppercase tracking-widest">
          <p>© {new Date().getFullYear()} Roztomile</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-honey transition-colors">Ochrana soukromí</Link>
            <Link to="/terms" className="hover:text-honey transition-colors">Obchodní podmínky</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
