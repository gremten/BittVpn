import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import sakuraPoster from '../../assets/images/main/sakura.png';
import {
  attachSakuraSession,
  isSakuraSessionReady,
  preloadSakuraAnimationSession,
  subscribeSakuraSessionReady,
} from '../../utils/sakuraSession';

function scheduleIdle(callback) {
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(callback, { timeout: 700 });
    return () => window.cancelIdleCallback?.(id);
  }

  const id = window.setTimeout(callback, 250);
  return () => window.clearTimeout(id);
}

export default function SakuraAnimation({ className = '' }) {
  const hostRef = useRef(null);
  const [animationReady, setAnimationReady] = useState(() => isSakuraSessionReady());

  useLayoutEffect(() => {
    try {
      return attachSakuraSession(hostRef.current);
    } catch (error) {
      // Fail open to the local poster in Telegram WebViews with partial DOM APIs.
      console.warn('Sakura attach warning:', error);
      return undefined;
    }
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeSakuraSessionReady(() => {
      setAnimationReady(true);
    });

    if (isSakuraSessionReady()) {
      setAnimationReady(true);
      return unsubscribe;
    }

    const cancelSchedule = scheduleIdle(() => {
      preloadSakuraAnimationSession().catch(() => {
        // Decorative animation is fail-open: the local poster remains visible.
      });
    });

    return () => {
      cancelSchedule?.();
      unsubscribe();
    };
  }, []);

  return (
    <div
      className={`sakura-animation${animationReady ? ' sakura-animation--ready' : ''} ${className}`.trim()}
      aria-hidden="true"
    >
      <img className="sakura-animation__poster" src={sakuraPoster} alt="" />
      <div ref={hostRef} className="sakura-animation__lottie" />
    </div>
  );
}
