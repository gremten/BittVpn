import { useCallback, useEffect, useRef, useState } from 'react';
import { MAX_MONTHS } from '../../config/pricing';
import { formatMonths } from './formatters';

export default function DurationSlider({ value, onChange }) {
  const trackRef = useRef(null);
  const dotRefs = useRef(new Map());
  const draggingRef = useRef(false);
  const pillDragOffsetRef = useRef(0);
  const [anchors, setAnchors] = useState({});

  const measureLayout = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const trackRect = track.getBoundingClientRect();
    const nextAnchors = {};

    for (let month = 1; month <= MAX_MONTHS; month += 1) {
      const dot = dotRefs.current.get(month);
      if (!dot) continue;
      const dotRect = dot.getBoundingClientRect();
      nextAnchors[month] = dotRect.left - trackRect.left + dotRect.width / 2;
    }

    setAnchors(nextAnchors);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    measureLayout();
    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(measureLayout);
      observer.observe(track);
      return () => observer.disconnect();
    }

    window.addEventListener('resize', measureLayout);
    return () => window.removeEventListener('resize', measureLayout);
  }, [measureLayout]);

  const selectFromPointer = useCallback((clientX) => {
    const track = trackRef.current;
    if (!track) return;

    const trackRect = track.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - trackRect.left, 0), trackRect.width);
    let nearestMonth = value;
    let nearestDistance = Infinity;

    for (let month = 1; month <= MAX_MONTHS; month += 1) {
      const anchor = anchors[month];
      if (anchor == null) continue;
      const distance = Math.abs(x - anchor);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestMonth = month;
      }
    }

    onChange(nearestMonth);
  }, [anchors, onChange, value]);

  const beginPointer = (event) => {
    draggingRef.current = true;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    selectFromPointer(event.clientX);
  };

  const movePointer = (event) => {
    if (draggingRef.current) selectFromPointer(event.clientX);
  };

  const endPointer = (event) => {
    draggingRef.current = false;
    pillDragOffsetRef.current = 0;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  const beginPillPointer = (event) => {
    const track = trackRef.current;
    const activeAnchor = anchors[value];
    if (!track || activeAnchor == null) return;
    const trackRect = track.getBoundingClientRect();
    pillDragOffsetRef.current = event.clientX - (trackRect.left + activeAnchor);
    draggingRef.current = true;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const movePillPointer = (event) => {
    if (draggingRef.current) selectFromPointer(event.clientX - pillDragOffsetRef.current);
  };

  const onKeyDown = (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault();
      onChange(Math.min(MAX_MONTHS, value + 1));
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault();
      onChange(Math.max(1, value - 1));
    } else if (event.key === 'Home') {
      event.preventDefault();
      onChange(1);
    } else if (event.key === 'End') {
      event.preventDefault();
      onChange(MAX_MONTHS);
    }
  };

  const activeAnchor = anchors[value] ?? 0;
  const fillWidth = activeAnchor ? activeAnchor + 6 : 0;

  return (
    <div className="duration-control" data-figma-node="7166:121702">
      <div className="duration-value-row">
        <button
        type="button"
        className="duration-value-pill"
        style={{ '--duration-anchor-x': `${activeAnchor}px`, opacity: activeAnchor ? 1 : 0 }}
        onPointerDown={beginPillPointer}
        onPointerMove={movePillPointer}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
      >
        {formatMonths(value)}
        </button>
      </div>

      <div
        ref={trackRef}
        className="duration-track"
        role="slider"
        tabIndex={0}
        aria-label="Срок доступа"
        aria-valuemin={1}
        aria-valuemax={MAX_MONTHS}
        aria-valuenow={value}
        aria-valuetext={formatMonths(value)}
        onPointerDown={beginPointer}
        onPointerMove={movePointer}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onKeyDown={onKeyDown}
      >
        <div className="duration-step-grid" aria-hidden="true">
          {Array.from({ length: MAX_MONTHS }, (_, index) => index + 1).map((month) => (
            <span className="duration-point" key={month}>
              <span
                ref={(node) => {
                  if (node) dotRefs.current.set(month, node);
                  else dotRefs.current.delete(month);
                }}
                className="duration-dot"
              />
            </span>
          ))}
        </div>
        <div className="duration-filled" aria-hidden="true" style={{ width: `${fillWidth}px`, opacity: activeAnchor ? 1 : 0 }}>
          <span className="duration-filled-gradient" />
          <span className="duration-knob" />
        </div>
      </div>
    </div>
  );
}
