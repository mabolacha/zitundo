import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, Menu, X, Zap } from 'lucide-react';

const links = [
  { to: '/', label: 'Accueil' },
  { to: '/comparer', label: 'Comparer' },
  { to: '/simulateur', label: 'Simulateur de coût réel' },
  { to: '/migration', label: 'Changer d\'Opérateur' },
  { to: '/eligibilite', label: 'Éligibilité' },
  { to: '/blog', label: 'Blog' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-primary-dark"
      style={{
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Wifi className="w-6 h-6 text-cream transition-colors duration-200" />
              <Zap className="absolute -top-1 -right-1 w-3 h-3 text-accent" />
            </div>
            <span className="font-display font-bold text-lg hidden sm:block text-cream">
              zit<span className="text-accent">u</span>ndo
            </span>
          </NavLink>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* CTA + burger */}
          <div className="flex items-center gap-3">
            <NavLink to="/comparer" className="btn-primary text-sm hidden sm:inline-flex">
              Comparer maintenant
            </NavLink>
            <button
              className="md:hidden p-2 rounded-lg text-cream/75 hover:text-cream transition-colors"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="md:hidden border-t border-primary/30 px-4 py-3 space-y-1 bg-primary-dark"
          >
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-cream bg-white/10'
                      : 'text-cream/75 hover:text-cream hover:bg-white/5'
                  }`
                }
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <div className="pt-2">
              <NavLink
                to="/comparer"
                className="btn-primary w-full justify-center text-sm"
                onClick={() => setOpen(false)}
              >
                Comparer maintenant
              </NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
