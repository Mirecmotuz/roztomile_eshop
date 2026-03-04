import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence, motion, type Variants, type Easing } from 'framer-motion';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CartDrawer from './components/layout/CartDrawer';

import ShopPage from './pages/ShopPage';
import ProductDetail from './pages/ProductDetail';
import OurStoryPage from './pages/OurStoryPage';
import CarePage from './pages/CarePage';
import CheckoutPage, { usePacketaScript } from './pages/CheckoutPage';
import SuccessPage from './pages/SuccessPage';

const easeOut: Easing = 'easeOut';
const easeIn: Easing = 'easeIn';

const pageVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: easeOut } },
  exit:    { opacity: 0, y: -6, transition: { duration: 0.2, ease: easeIn } },
};

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}

function AppRoutes() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const shouldSkipTopScroll = params.get('focus') === 'search';

    if (!shouldSkipTopScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><ShopPage /></PageWrapper>} />
        <Route path="/product/:slug" element={<PageWrapper><ProductDetail /></PageWrapper>} />
        <Route path="/our-story" element={<PageWrapper><OurStoryPage /></PageWrapper>} />
        <Route path="/care" element={<PageWrapper><CarePage /></PageWrapper>} />
        <Route path="/checkout" element={<PageWrapper><CheckoutPage /></PageWrapper>} />
        <Route path="/success" element={<PageWrapper><SuccessPage /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  usePacketaScript();
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        {/* pt-16 = hlavný nav (64px) */}
        <div className="flex-1 pt-16">
          <AppRoutes />
        </div>
        <Footer />
        <CartDrawer />
      </div>
    </BrowserRouter>
  );
}
