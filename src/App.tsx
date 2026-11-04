import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { InvitationPage } from './pages/InvitationPage';

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
        <Route path="/:category/:id" element={<InvitationPage />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </>
  );
}
