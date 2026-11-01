import { useEffect, useRef, useState } from 'react';
import { getReferralRainSessionVideo, preloadReferralRainMedia } from '../../utils/referralRainSession';

const WIDTH = 600;
const HEIGHT = 440;
const FRAME_COUNT = 300;
const FRAME_RATE = 30;
const FRAME_MS = 1000 / FRAME_RATE;
const CYCLE_MS = FRAME_COUNT * FRAME_MS;

/**
 * Referral matrix-rain layer.
 *
 * The HTMLVideoElement is retained for the whole app session by
 * referralRainSession.js. Screen unmount/remount only detaches/reattaches that
 * same element, so buffered media/currentTime are not thrown away.
 */
export default function ReferralMatrixRain({ rootRef, clipTargetRef }) {
  const videoHostRef = useRef(null);
  const [clipHeight, setClipHeight] = useState(0);

  useEffect(() => {
    const root = rootRef?.current;
    const target = clipTargetRef?.current;
    if (!root || !target) return undefined;

    const updateClip = () => {
      const rootRect = root.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const targetBottomInRoot = targetRect.bottom - rootRect.top + root.scrollTop;
      setClipHeight(Math.max(0, Math.round(targetBottomInRoot)));
    };

    updateClip();

    const observer = typeof ResizeObserver === 'function'
      ? new ResizeObserver(updateClip)
      : null;

    observer?.observe(root);
    observer?.observe(target);
    window.addEventListener('resize', updateClip, { passive: true });
    root.addEventListener('scroll', updateClip, { passive: true });

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', updateClip);
      root.removeEventListener('scroll', updateClip);
    };
  }, [rootRef, clipTargetRef]);

  useEffect(() => {
    const host = videoHostRef.current;
    const video = getReferralRainSessionVideo();
    if (!host || !video) return undefined;

    // StrictMode-safe and Telegram-WebView-safe: move the same retained video
    // node without replaceChildren(), which is missing in some embedded WebViews.
    try {
      while (host.firstChild) {
        host.removeChild(host.firstChild);
      }
      host.appendChild(video);
    } catch (error) {
      console.warn('Referral rain attach warning:', error);
      return undefined;
    }

    preloadReferralRainMedia();

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const applyMotionPreference = async () => {
      if (reduceMotion.matches) {
        video.pause();
        try {
          video.currentTime = 0;
        } catch (_) {
          // Metadata may not be available yet; loadeddata will retry.
        }
        return;
      }

      try {
        await video.play();
      } catch (_) {
        // Autoplay may still be blocked until the Mini App is user-interacted.
      }
    };

    const onReady = () => applyMotionPreference();
    const onMotionPreferenceChange = () => applyMotionPreference();

    video.addEventListener('loadeddata', onReady);
    video.addEventListener('canplay', onReady);
    reduceMotion.addEventListener?.('change', onMotionPreferenceChange);
    applyMotionPreference();

    return () => {
      video.pause();
      video.removeEventListener('loadeddata', onReady);
      video.removeEventListener('canplay', onReady);
      reduceMotion.removeEventListener?.('change', onMotionPreferenceChange);

      // Detach only. Do NOT clear src, call load(), or destroy the session
      // element: that would cause the next Referral visit to buffer again.
      if (video.parentNode === host) host.removeChild(video);
    };
  }, []);

  return (
    <div
      className="referral-rain-clip"
      style={{ height: `${clipHeight}px` }}
      aria-hidden="true"
      data-animation-width={WIDTH}
      data-animation-height={HEIGHT}
      data-animation-frames={FRAME_COUNT}
      data-animation-frame-ms={FRAME_MS}
      data-animation-runtime="mp4-session-cache"
    >
      <span ref={videoHostRef} className="referral-rain-video-host" />
    </div>
  );
}

export const REFERRAL_RAIN_TIMING = Object.freeze({
  width: WIDTH,
  height: HEIGHT,
  frameCount: FRAME_COUNT,
  frameRate: FRAME_RATE,
  frameMs: FRAME_MS,
  cycleMs: CYCLE_MS,
});
