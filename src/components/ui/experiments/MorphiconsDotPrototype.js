import { useEffect, useRef, useState } from 'react';
import {
  DOT_MORPH_DASH_ARRAY,
  DOT_MORPH_ICONS,
  DOT_MORPH_STROKE_WIDTH,
  DOT_MORPH_VIEWBOX,
} from '../internal/dotMorphIcons';

let morphIconModulePromise = null;

function loadMorphIconComponent() {
  if (!morphIconModulePromise) {
    morphIconModulePromise = import('morphicons/react').then((module) => module.MorphIcon);
  }
  return morphIconModulePromise;
}

export function preloadDotMorphIconEngine() {
  return loadMorphIconComponent();
}

function StaticDotIcon({ icon, size, color, className, label, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={DOT_MORPH_VIEWBOX}
      fill="none"
      color={color}
      className={className}
      role={label ? 'img' : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      {...rest}
    >
      <path
        d={DOT_MORPH_ICONS[icon]}
        fill="none"
        stroke="currentColor"
        strokeWidth={DOT_MORPH_STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={DOT_MORPH_DASH_ARRAY}
      />
    </svg>
  );
}

/**
 * Dot-matrix icon morphing without animating individual circles.
 *
 * Original dot circles are losslessly represented as round-capped dotted
 * centerline strokes. Morphicons then morphs only those compact centerlines.
 * Endpoint rendering stays identical to the source dot SVGs.
 */
export default function DotMorphIcon({
  icon = 'trash',
  size = 64,
  color = 'currentColor',
  spring = 'snappy',
  reducedMotion = 'user',
  className,
  label,
  ...rest
}) {
  const initialIconRef = useRef(icon);
  const latestIconRef = useRef(icon);
  const [MorphIcon, setMorphIcon] = useState(null);
  const [morphIconName, setMorphIconName] = useState(icon);

  latestIconRef.current = icon;

  useEffect(() => {
    let alive = true;
    let frameId = 0;

    loadMorphIconComponent()
      .then((Component) => {
        if (!alive) return;

        // Mount the engine at the component's true initial endpoint, then let
        // a state change that happened during chunk loading morph normally.
        setMorphIconName(initialIconRef.current);
        setMorphIcon(() => Component);

        frameId = window.requestAnimationFrame(() => {
          if (alive) setMorphIconName(latestIconRef.current);
        });
      })
      .catch(() => {
        // Static endpoint remains a complete fail-open fallback.
      });

    return () => {
      alive = false;
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    if (MorphIcon) setMorphIconName(icon);
  }, [MorphIcon, icon]);

  if (!DOT_MORPH_ICONS[icon]) {
    throw new Error(`Unknown DotMorphIcon icon: ${icon}`);
  }

  if (!MorphIcon) {
    return (
      <StaticDotIcon
        icon={icon}
        size={size}
        color={color}
        className={className}
        label={label}
        {...rest}
      />
    );
  }

  return (
    <MorphIcon
      icon={DOT_MORPH_ICONS[morphIconName]}
      spring={spring}
      reducedMotion={reducedMotion}
      size={size}
      viewBox={DOT_MORPH_VIEWBOX}
      fill="none"
      color={color}
      strokeWidth={DOT_MORPH_STROKE_WIDTH}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={DOT_MORPH_DASH_ARRAY}
      className={className}
      label={label}
      {...rest}
    />
  );
}
