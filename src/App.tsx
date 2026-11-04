import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Landing } from './pages/Landing';
/* The invitation page is its own chunk: the landing page never downloads it until a sample is opened. */
const InvitationPage = lazy(() => import('./pages/InvitationPage').then((mod) => ({ default: mod.InvitationPage })));

/* After a route change: jump to the #hash target if there is one, otherwise to the top. */
function ScrollToHash() {
  const { hash, pathname } = useLocation();
  useEffect(() => {
    if (hash) requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView());
    else window.scrollTo(0, 0);
  }, [hash, pathname]);
  return null;
}

export function App() {
  return (
    <>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/:category/:id" element={<Suspense fallback={null}><InvitationPage /></Suspense>} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </>
  );
}
