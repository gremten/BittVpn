import { useEffect, useRef, useState } from 'react';
import { AppTabBar, Button } from '../../components/ui';
import './IntroScreen.css';

export default function IntroScreen({ onSkip, onContinue }) {
  const frameRef = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin === window.location.origin
        && event.source === frameRef.current?.contentWindow
        && event.data?.type === 'bitt-intro-ready') setStarted(true);
    };
    window.addEventListener('message', handleMessage);
    // Keep the controls reachable even if the decorative renderer cannot load.
    const fallback = window.setTimeout(() => setStarted(true), 3000);
    return () => {
      window.removeEventListener('message', handleMessage);
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <section className={`intro-screen${started ? ' intro-screen--started' : ''}`} aria-label="Знакомство с BittVPN">
      <iframe
        ref={frameRef}
        className="intro-screen__planet"
        src={`${process.env.PUBLIC_URL}/intro/planet.html`}
        title=""
        aria-hidden="true"
        tabIndex="-1"
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
          <Button size="large" type="primary" color="accent" fullWidth onClick={onContinue}>
            Начать путешествие
          </Button>
        </AppTabBar>
      </div>
    </section>
  );
}
