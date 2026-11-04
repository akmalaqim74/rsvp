import { useCallback, useEffect, useRef, useState } from 'react';
import type { DemoInvite } from '../../demos/data';
import { useI18n } from '../../lib/i18n';

/* Optional background music: public/audio/<category>-<n>.mp3 (n from the design id, rotating over the
   tracks that exist), else public/audio/<category>.mp3. No file: no button, no sound. The audio element
   is only created on the "Open invitation" tap (a user gesture) and nothing is fetched before that. */
const KEY = 'iv-music-off';
const TARGET = 0.35;
const store = {
  off: (): boolean => { try { return sessionStorage.getItem(KEY) === '1'; } catch { return false; } },
  set: (off: boolean): void => { try { sessionStorage.setItem(KEY, off ? '1' : '0'); } catch { /* private mode */ } }
};

async function isAudio(src: string): Promise<boolean> {
  try {
    const r = await fetch(src, { method: 'HEAD' });
    return r.ok && (r.headers.get('content-type') ?? '').startsWith('audio');
  } catch { return false; }
}

async function findTrack(demo: DemoInvite): Promise<string | null> {
  const n = Number(demo.id.replace(/\D/g, '')) || 1;
  const c = demo.category;
  const tries = [`/audio/${c}-${n}.mp3`];
  for (let k = n - 5; k >= 1; k -= 5) tries.push(`/audio/${c}-${k}.mp3`); // id-6+ reuse in rotation
  tries.push(`/audio/${c}.mp3`);
  for (const src of tries) if (await isAudio(src)) return src;
  return null;
}

export function useMusic(demo: DemoInvite) {
  const [src, setSrc] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);
  const fade = useRef<number | undefined>(undefined);
  const wanted = useRef(false); // playing before the tab was hidden

  useEffect(() => {
    if (demo.category === 'funeral') return; // tahlil: never any music
    let live = true;
    void findTrack(demo).then((s) => { if (live) setSrc(s); });
    return () => { live = false; };
  }, [demo]);

  const rampTo = useCallback((el: HTMLAudioElement, to: number, done?: () => void) => {
    window.clearInterval(fade.current);
    fade.current = window.setInterval(() => {
      const step = to > el.volume ? 0.02 : -0.04;
      const next = Math.min(1, Math.max(0, el.volume + step));
      el.volume = next;
      if (Math.abs(next - to) < 0.025) { el.volume = to; window.clearInterval(fade.current); done?.(); }
    }, 60);
  }, []);

  const play = useCallback(async () => {
    if (!src) return;
    let el = audio.current;
    if (!el) {
      el = new Audio();
      el.preload = 'none';
      el.loop = true;
      el.src = src;
      audio.current = el;
    }
    el.volume = 0;
    try {
      await el.play();
    } catch { setPlaying(false); return; } // blocked: the button shows the muted state
    setPlaying(true);
    rampTo(el, TARGET);
  }, [src, rampTo]);

  const pause = useCallback(() => {
    const el = audio.current;
    setPlaying(false);
    if (el) rampTo(el, 0, () => el.pause());
  }, [rampTo]);

  /* Called from the Open tap. A guest who muted earlier in this session stays muted. */
  const start = useCallback(() => { if (src && !store.off()) void play(); }, [src, play]);
  const toggle = useCallback(() => {
    if (playing) { store.set(true); pause(); } else { store.set(false); void play(); }
  }, [playing, play, pause]);

  useEffect(() => {
    const onVis = () => {
      const el = audio.current;
      if (!el) return;
      if (document.hidden) { wanted.current = !el.paused; el.pause(); setPlaying(false); }
      else if (wanted.current) { wanted.current = false; void play(); }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      window.clearInterval(fade.current);
      audio.current?.pause();
      audio.current = null;
    };
  }, [play]);

  return { available: Boolean(src), playing, start, toggle };
}

export function MusicButton({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  const { t } = useI18n();
  return (
    <button type="button" className="iv-music" aria-pressed={playing} aria-label={t(playing ? 'inv.music.off' : 'inv.music.on')} onClick={onToggle}>
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V6l10-2v12" /><circle cx="6.5" cy="18" r="2.5" /><circle cx="16.5" cy="16" r="2.5" />
        {!playing && <path d="M3 3l18 18" />}
      </svg>
    </button>
  );
}
