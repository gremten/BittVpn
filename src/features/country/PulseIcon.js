import { useEffect, useState } from 'react';
import pulseFrame01 from '../../assets/icons/pulse/frame01.svg';
import pulseFrame02 from '../../assets/icons/pulse/frame02.svg';
import pulseFrame03 from '../../assets/icons/pulse/frame03.svg';
import pulseFrame04 from '../../assets/icons/pulse/frame04.svg';
import pulseFrame05 from '../../assets/icons/pulse/frame05.svg';
import pulseFrame06 from '../../assets/icons/pulse/frame06.svg';
import pulseFrame07 from '../../assets/icons/pulse/frame07.svg';
import pulseFrame08 from '../../assets/icons/pulse/frame08.svg';
import pulseFrame09 from '../../assets/icons/pulse/frame09.svg';
import pulseFrame10 from '../../assets/icons/pulse/frame10.svg';
import pulseFrame11 from '../../assets/icons/pulse/frame11.svg';
import pulseFrame12 from '../../assets/icons/pulse/frame12.svg';
import pulseFrame13 from '../../assets/icons/pulse/frame13.svg';
import pulseFrame14 from '../../assets/icons/pulse/frame14.svg';
import pulseFrame15 from '../../assets/icons/pulse/frame15.svg';
import pulseFrame16 from '../../assets/icons/pulse/frame16.svg';
import pulseFrame17 from '../../assets/icons/pulse/frame17.svg';
import pulseFrame18 from '../../assets/icons/pulse/frame18.svg';

const PULSE_FRAME_MS = 35;

// Figma frame numbers are variant IDs, not playback order.
// The animation builds the pulse from dots and ends on frame12.
const PULSE_FRAMES = [
  pulseFrame01, pulseFrame02, pulseFrame03, pulseFrame04, pulseFrame05, pulseFrame06,
  pulseFrame07, pulseFrame08, pulseFrame09, pulseFrame10, pulseFrame11,
  pulseFrame18, pulseFrame17, pulseFrame16, pulseFrame15, pulseFrame14, pulseFrame13,
  pulseFrame12,
];

export default function PulseIcon({ animationKey = 0 }) {
  const [frameIndex, setFrameIndex] = useState(PULSE_FRAMES.length - 1);

  useEffect(() => {
    PULSE_FRAMES.forEach((src) => {
      const image = new Image();
      image.src = src;
    });
  }, []);

  useEffect(() => {
    if (animationKey === 0 || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setFrameIndex(PULSE_FRAMES.length - 1);
      return undefined;
    }

    let frameTimer = null;
    let cancelled = false;
    let nextFrame = 0;
    setFrameIndex(0);

    const advance = () => {
      if (cancelled) return;
      nextFrame += 1;
      if (nextFrame < PULSE_FRAMES.length) {
        setFrameIndex(nextFrame);
        frameTimer = window.setTimeout(advance, PULSE_FRAME_MS);
      }
    };

    frameTimer = window.setTimeout(advance, PULSE_FRAME_MS);
    return () => {
      cancelled = true;
      if (frameTimer) window.clearTimeout(frameTimer);
    };
  }, [animationKey]);

  return (
    <img
      className="stat-icon pulse-icon"
      src={PULSE_FRAMES[frameIndex]}
      alt=""
      aria-hidden="true"
      draggable="false"
    />
  );
}
