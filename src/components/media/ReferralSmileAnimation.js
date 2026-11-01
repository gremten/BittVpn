import { useEffect, useState } from 'react';
import smileRightFront from '../../assets/animations/referral/smile-right-front.svg';
import smileRightLook from '../../assets/animations/referral/smile-right-look.svg';
import smileLeftFront from '../../assets/animations/referral/smile-left-front.svg';
import smileLeftLook from '../../assets/animations/referral/smile-left-look.svg';
import heartFull from '../../assets/animations/referral/heart-full.svg';
import heartMini from '../../assets/animations/referral/heart-mini.svg';
import referralPoster from '../../assets/images/main/referral.png';
import './ReferralSmileAnimation.css';

let referralSmileActivatedThisSession = false;

function scheduleAnimationAssets(callback) {
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(callback, { timeout: 900 });
    return () => window.cancelIdleCallback?.(id);
  }

  const id = window.setTimeout(callback, 450);
  return () => window.clearTimeout(id);
}

/**
 * Figma 4790:17246 — Matrix smile prikol with heart.
 *
 * The 2 KB local poster is the first-frame visual. The six exact SVG animation
 * states are mounted after first paint/idle, avoiding six ~10–67 KB requests
 * competing with startup fonts and route UI.
 */
export default function ReferralSmileAnimation({ className = '', gap = 10 }) {
  const [animate, setAnimate] = useState(() => referralSmileActivatedThisSession);

  useEffect(() => {
    if (referralSmileActivatedThisSession) return undefined;

    return scheduleAnimationAssets(() => {
      referralSmileActivatedThisSession = true;
      setAnimate(true);
    });
  }, []);

  return (
    <div
      className={`referral-smile-animation${animate ? ' referral-smile-animation--ready' : ''} ${className}`.trim()}
      style={{ '--referral-smile-gap': `${gap}px` }}
      aria-hidden="true"
      data-figma-node="4790:17246"
    >
      <img className="referral-smile-animation__poster" src={referralPoster} alt="" />

      {animate && (
        <>
          <span className="referral-smile-face referral-smile-face--right">
            <img className="referral-smile-face__state referral-smile-face__state--front" src={smileRightFront} alt="" />
            <img className="referral-smile-face__state referral-smile-face__state--look" src={smileRightLook} alt="" />
          </span>

          <span className="referral-smile-heart">
            <img className="referral-smile-heart__state referral-smile-heart__state--mini" src={heartMini} alt="" />
            <img className="referral-smile-heart__state referral-smile-heart__state--full" src={heartFull} alt="" />
          </span>

          <span className="referral-smile-face referral-smile-face--left">
            <img className="referral-smile-face__state referral-smile-face__state--front" src={smileLeftFront} alt="" />
            <img className="referral-smile-face__state referral-smile-face__state--look" src={smileLeftLook} alt="" />
          </span>
        </>
      )}
    </div>
  );
}
