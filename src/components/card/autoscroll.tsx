import { useCallback, useEffect, useRef, useState } from 'react';
import { useI18n } from '../../lib/i18n';

/* Slow story-style auto-scroll of the opened invitation. Starts shortly after the card opens (not with
   reduced motion). Any touch, wheel, key or click on the page stops it; the button starts it again. */
const SPEED = 34; // px per second

export function useAutoScroll(active: boolean, reduce: boolean) {
  const [running, setRunning] = useState(false);
  const raf = useRef(0);

  const stop = useCallback(() => { cancelAnimationFrame(raf.current); setRunning(false); }, []);
  const start = useCallback(() => {
    cancelAnimationFrame(raf.current);
    setRunning(true);
    let last = performance.now();
    let y = window.scrollY;
    const tick = (now: number) => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      y = Math.max(y, window.scrollY) + ((now - last) / 1000) * SPEED;
      last = now;
      if (y >= max - 1) { window.scrollTo(0, max); setRunning(false); return; }
      window.scrollTo(0, y);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (!running) return;
    const halt = (e: Event) => {
      if (e.target instanceof Element && e.target.closest('.iv-autoscroll')) return; // the button handles itself
      stop();
    };
    const opts = { passive: true } as const;
    window.addEventListener('wheel', halt, opts);
    window.addEventListener('touchstart', halt, opts);
    window.addEventListener('keydown', halt);
    window.addEventListener('pointerdown', halt, opts);
    return () => {
      window.removeEventListener('wheel', halt);
      window.removeEventListener('touchstart', halt);
      window.removeEventListener('keydown', halt);
      window.removeEventListener('pointerdown', halt);
    };
  }, [running, stop]);

  useEffect(() => {
    if (!active || reduce) return;
    const id = window.setTimeout(start, 1800);
    return () => { window.clearTimeout(id); };
  }, [active, reduce, start]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return { running, start, stop };
}

export function AutoScrollButton({ running, onToggle }: { running: boolean; onToggle: () => void }) {
  const { t } = useI18n();
  return (
    <button type="button" className="iv-music iv-autoscroll" aria-pressed={running} aria-label={t(running ? 'inv.scroll.off' : 'inv.scroll.on')} onClick={(e) => { e.stopPropagation(); onToggle(); }}>
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {running ? <><path d="M9 5v14" /><path d="M15 5v14" /></> : <path d="M12 5v14M6 13l6 6 6-6" />}
      </svg>
    </button>
  );
}
