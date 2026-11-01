import { LayoutGroup, motion, useReducedMotion } from 'motion/react';
import { useEffect, useId, useRef, useState } from 'react';
import { SLOT_CATCH_TRANSITION, SLOT_REST_TRANSITION } from './motionTransitions';
import { joinClasses as join } from './utils';

const DRAG_THRESHOLD = 5;
const VERTICAL_CANCEL_THRESHOLD = 14;
const POINTER_VERTICAL_SLOP = 28;

function hapticSelectionChanged() {
  try {
    window.Telegram?.WebApp?.HapticFeedback?.selectionChanged?.();
  } catch (_) {
    // Haptics are optional and must never affect the control itself.
  }
}

export default function SegmentedControl({
  options,
  value,
  onChange,
  className,
  ariaLabel = 'Переключатель',
}) {
  const safeOptions = Array.isArray(options) ? options.filter((option) => option?.value != null) : [];
  const fallbackValue = safeOptions[0]?.value;
  const safeValue = safeOptions.some((option) => option.value === value) ? value : fallbackValue;
  const shouldReduceMotion = useReducedMotion();
  const layoutGroupId = useId();

  const [committedValue, setCommittedValue] = useState(safeValue);
  const [previewValue, setPreviewValue] = useState(safeValue);
  const [isDragging, setIsDragging] = useState(false);

  const rootRef = useRef(null);
  const slotRefs = useRef(new Map());
  const pointerIdRef = useRef(null);
  const pointerStartRef = useRef(null);
  const isDraggingRef = useRef(false);
  const lastPreviewRef = useRef(safeValue);
  const suppressClickRef = useRef(false);
  const clickResetTimerRef = useRef(null);

  const activeValue = isDragging ? previewValue : committedValue;
  const transition = shouldReduceMotion
    ? { duration: 0 }
    : (isDragging ? SLOT_CATCH_TRANSITION : SLOT_REST_TRANSITION);

  useEffect(() => {
    if (!isDraggingRef.current && safeValue !== committedValue) {
      setCommittedValue(safeValue);
      setPreviewValue(safeValue);
      lastPreviewRef.current = safeValue;
    }
  }, [safeValue, committedValue]);

  useEffect(() => () => {
    clearTimeout(clickResetTimerRef.current);
  }, []);

  const setSlotRef = (optionValue, node) => {
    if (node) slotRefs.current.set(optionValue, node);
    else slotRefs.current.delete(optionValue);
  };

  const valueAtPointer = (clientX, clientY, fallback = lastPreviewRef.current) => {
    const root = rootRef.current;
    if (!root) return fallback;

    const rootRect = root.getBoundingClientRect();
    if (
      clientY < rootRect.top - POINTER_VERTICAL_SLOP
      || clientY > rootRect.bottom + POINTER_VERTICAL_SLOP
    ) {
      return fallback;
    }

    const element = document.elementFromPoint?.(clientX, clientY);
    const directSlot = element?.closest?.('[data-segment-value]');
    if (directSlot && root.contains(directSlot)) {
      const rawValue = directSlot.getAttribute('data-segment-value');
      const directOption = safeOptions.find((option) => String(option.value) === rawValue);
      if (directOption) return directOption.value;
    }

    let nearestValue = fallback;
    let nearestDistance = Number.POSITIVE_INFINITY;

    safeOptions.forEach((option) => {
      const node = slotRefs.current.get(option.value);
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const distance = Math.abs(clientX - centerX);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestValue = option.value;
      }
    });

    return nearestValue;
  };

  const previewSlot = (nextValue) => {
    if (nextValue == null || nextValue === lastPreviewRef.current) return;
    lastPreviewRef.current = nextValue;
    setPreviewValue(nextValue);
    hapticSelectionChanged();
  };

  const beginDrag = (clientX, clientY) => {
    if (isDraggingRef.current) return;
    const initialValue = valueAtPointer(clientX, clientY, committedValue);
    isDraggingRef.current = true;
    suppressClickRef.current = true;
    lastPreviewRef.current = initialValue;
    setPreviewValue(initialValue);
    setIsDragging(true);
    if (initialValue !== committedValue) hapticSelectionChanged();
  };

  const commit = (nextValue) => {
    if (nextValue == null) return;
    setCommittedValue(nextValue);
    setPreviewValue(nextValue);
    lastPreviewRef.current = nextValue;
    if (nextValue !== committedValue) onChange?.(nextValue);
  };

  const finishDrag = () => {
    const nextValue = lastPreviewRef.current ?? committedValue;
    isDraggingRef.current = false;
    setIsDragging(false);
    commit(nextValue);
  };

  const cancelGesture = () => {
    pointerIdRef.current = null;
    pointerStartRef.current = null;

    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
      setPreviewValue(committedValue);
      lastPreviewRef.current = committedValue;
    }
  };

  const handlePointerDown = (event) => {
    if (event.button != null && event.button !== 0) return;
    pointerIdRef.current = event.pointerId;
    pointerStartRef.current = { x: event.clientX, y: event.clientY };
    suppressClickRef.current = false;

    try {
      rootRef.current?.setPointerCapture?.(event.pointerId);
    } catch (_) {}
  };

  const handlePointerMove = (event) => {
    if (pointerIdRef.current !== event.pointerId || !pointerStartRef.current) return;

    const dx = event.clientX - pointerStartRef.current.x;
    const dy = event.clientY - pointerStartRef.current.y;

    if (!isDraggingRef.current) {
      if (Math.abs(dy) >= VERTICAL_CANCEL_THRESHOLD && Math.abs(dy) > Math.abs(dx)) {
        return;
      }

      if (Math.abs(dx) >= DRAG_THRESHOLD && Math.abs(dx) >= Math.abs(dy)) {
        beginDrag(event.clientX, event.clientY);
      }
    }

    if (isDraggingRef.current) {
      event.preventDefault();
      previewSlot(valueAtPointer(event.clientX, event.clientY));
    }
  };

  const resetSyntheticClickGuard = () => {
    clearTimeout(clickResetTimerRef.current);
    clickResetTimerRef.current = setTimeout(() => {
      suppressClickRef.current = false;
    }, 0);
  };

  const handlePointerUp = (event) => {
    if (pointerIdRef.current !== event.pointerId) return;

    pointerIdRef.current = null;
    pointerStartRef.current = null;

    try {
      rootRef.current?.releasePointerCapture?.(event.pointerId);
    } catch (_) {}

    if (isDraggingRef.current) {
      event.preventDefault();
      finishDrag();
      resetSyntheticClickGuard();
      return;
    }

    suppressClickRef.current = true;
    commit(valueAtPointer(event.clientX, event.clientY, committedValue));
    resetSyntheticClickGuard();
  };

  const handleOptionClick = (optionValue, event) => {
    if (suppressClickRef.current) {
      event.preventDefault();
      suppressClickRef.current = false;
      return;
    }
    commit(optionValue);
  };

  if (!safeOptions.length) return null;

  return (
    <LayoutGroup id={layoutGroupId}>
      <div
        ref={rootRef}
        className={join('bitt-segmented-control', isDragging && 'bitt-segmented-control--dragging', className)}
        role="group"
        aria-label={ariaLabel}
        data-figma-node="6606:23748"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={cancelGesture}
        onLostPointerCapture={() => {
          if (pointerIdRef.current != null) cancelGesture();
        }}
      >
        {safeOptions.map((option) => {
          const isActive = option.value === activeValue;
          return (
            <button
              ref={(node) => setSlotRef(option.value, node)}
              type="button"
              key={option.value}
              className="bitt-segmented-control__slot"
              data-segment-value={String(option.value)}
              aria-pressed={option.value === committedValue}
              onClick={(event) => handleOptionClick(option.value, event)}
            >
              {isActive && (
                <motion.span
                  className="bitt-segmented-control__pill"
                  layoutId="bitt-segmented-control-active-pill"
                  initial={false}
                  transition={transition}
                  aria-hidden="true"
                />
              )}
              <span className="bitt-segmented-control__label">{option.label}</span>
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
