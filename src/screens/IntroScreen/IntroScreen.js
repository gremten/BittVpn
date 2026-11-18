import { useCallback, useEffect, useRef, useState } from 'react';
import { AppTabBar, Button } from '../../components/ui';
import './IntroScreen.css';

export default function IntroScreen({ onSkip, onContinue }) {
  const frameRef = useRef(null);
  const sectionRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [rendererReady, setRendererReady] = useState(false);
  const [goals, setGoals] = useState(false);

  const post = useCallback((message) => {
    frameRef.current?.contentWindow?.postMessage(message, window.location.origin);
  }, []);

  // The renderer lives in its own document, so it cannot read the app safe-area variable: send it as pixels.
  const postInsets = useCallback(() => {
    const probe = document.createElement('div');
    probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;padding-top:var(--app-safe-top,0px)';
    sectionRef.current?.appendChild(probe);
    const top = parseFloat(window.getComputedStyle(probe).paddingTop) || 0;
    probe.remove();
    post({ type: 'bitt-intro-insets', top });
  }, [post]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin || event.source !== frameRef.current?.contentWindow) return;
      if (event.data?.type === 'bitt-intro-ready') {
        setStarted(true);
        setRendererReady(true);
        postInsets();
      }
      // «Подобрать» in the goals stage: goals are not stored yet, the flow continues as «Начать путешествие» did.
      if (event.data?.type === 'bitt-intro-goals-submit') onContinue();
    };
    window.addEventListener('message', handleMessage);
    window.addEventListener('resize', postInsets);
    // Keep the controls reachable even if the decorative renderer cannot load.
    const fallback = window.setTimeout(() => setStarted(true), 3000);
    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('resize', postInsets);
      window.clearTimeout(fallback);
    };
  }, [onContinue, postInsets]);

  const handleStart = () => {
    // Without the renderer there is no goals stage: keep the previous behaviour.
    if (!rendererReady) { onContinue(); return; }
    post({ type: 'bitt-intro-goals-start' });
    setGoals(true);
  };

  return (
    <section
      ref={sectionRef}
      className={`intro-screen${started ? ' intro-screen--started' : ''}${goals ? ' intro-screen--goals' : ''}`}
      aria-label="Знакомство с BittVPN"
    >
      <iframe
        ref={frameRef}
        className="intro-screen__planet"
        src={`${process.env.PUBLIC_URL}/intro/planet.html`}
        title={goals ? 'Для чего тебе нужен ВПН?' : ''}
        aria-hidden={goals ? undefined : 'true'}
        tabIndex={goals ? 0 : -1}
      />
      <Button className="intro-screen__skip" size="small" type="ghost" color="none" onClick={onSkip}>
        Пропустить
      </Button>
      <div className="intro-screen__copy">
        <p className="intro-screen__brand">BITTVPN</p>
        <h1 className="intro-screen__title">Нужные сервисы<br />без границ</h1>
      </div>
      <div className="intro-screen__action">
        <AppTabBar type="action" color="ghost">
          <Button size="large" type="primary" color="accent" fullWidth onClick={handleStart}>
            Начать путешествие
          </Button>
        </AppTabBar>
      </div>
    </section>
  );
}
