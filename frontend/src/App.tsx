import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import CookieConsent from './components/CookieConsent';
import ConsentScripts from './components/ConsentScripts';
import HomePage from './pages/HomePage';
import ComparateurPage from './pages/ComparateurPage';
import SimulateurPage from './pages/SimulateurPage';
import MigrationPage from './pages/MigrationPage';
import EligibilitePage from './pages/EligibilitePage';
import MentionsLegalesPage from './pages/MentionsLegalesPage';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/comparer" element={<ComparateurPage />} />
          <Route path="/simulateur" element={<SimulateurPage />} />
          <Route path="/migration" element={<MigrationPage />} />
          <Route path="/eligibilite" element={<EligibilitePage />} />
          <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground">
        {/* Global background tint */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 20% 10%, rgba(26, 58, 92, 0.04) 0%, transparent 50%)',
          }}
        />

        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative">
          <AnimatedRoutes />
        </main>

        {/* Footer */}
        <footer className="border-t border-border/40 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-muted text-sm">
                © 2026 Zitundo — Comparateur indépendant, 100% gratuit.
              </p>
              <div className="flex items-center gap-4">
                <p className="text-muted/50 text-xs">
                  Les prix affichés sont indicatifs et peuvent varier.
                </p>
                <Link to="/mentions-legales" className="text-xs text-muted/70 hover:text-primary transition-colors whitespace-nowrap">
                  Mentions légales
                </Link>
                <button
                  onClick={() => window.dispatchEvent(new Event('zitundo:open-cookie-manager'))}
                  className="text-xs text-muted/70 hover:text-primary transition-colors whitespace-nowrap"
                >
                  Gérer mes cookies
                </button>
              </div>
            </div>
          </div>
        </footer>

        <CookieConsent />
        <ConsentScripts />
      </div>
    </BrowserRouter>
  );
}
