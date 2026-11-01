import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ReactComponent as SuccessIcon } from '../../assets/icons/nav/icn_m_circle-success-filled.svg';

const TOAST_CLOSED_OFFSET_Y = -40;
const TOAST_CLOSED_SCALE = 0.96;
const TOAST_MOTION_DURATION_S = 0.22;
const TOAST_OPEN_EASE = [0.16, 1, 0.3, 1];
const TOAST_CLOSE_EASE = [0.7, 0, 0.84, 0];
const SWIPE_DISMISS_DISTANCE = Math.abs(TOAST_CLOSED_OFFSET_Y) * 0.5;
const STACK_OFFSET_Y = 8;
const STACK_SCALE_STEP = 0.04;
const MAX_VISIBLE_STACK_DEPTH = 3;

const clamp01 = (value) => Math.min(1, Math.max(0, value));

function ToastItem({
  toast,
  stackIndex,
  interactive,
  onDismiss,
  onInteractionChange,
  reduceMotion,
}) {
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [returning, setReturning] = useState(false);
  const [returnProgress, setReturnProgress] = useState(0);
  const [dismissing, setDismissing] = useState(false);
  const gestureRef = useRef({ pointerId: null, startY: 0, dragY: 0 });
  const firstRenderRef = useRef(true);
  const dismissReportedRef = useRef(false);

  useEffect(() => {
    firstRenderRef.current = false;
  }, []);

  useEffect(() => () => {
    if (gestureRef.current.pointerId !== null) {
      onInteractionChange?.(toast.id, false);
    }
  }, [onInteractionChange, toast.id]);

  const handlePointerDown = (event) => {
    if (!interactive || dismissing || returning) return;

    dismissReportedRef.current = false;
    setReturnProgress(0);
    gestureRef.current = { pointerId: event.pointerId, startY: event.clientY, dragY: 0 };
    event.currentTarget.setPointerCapture?.(event.pointerId);
    onInteractionChange?.(toast.id, true);
    setDragging(true);
  };

  const handlePointerMove = (event) => {
    if (!dragging || gestureRef.current.pointerId !== event.pointerId) return;

    const nextDragY = Math.min(0, event.clientY - gestureRef.current.startY);
    gestureRef.current.dragY = nextDragY;
    setDragY(nextDragY);
  };

  const settleGesture = (event, cancelled = false) => {
    if (gestureRef.current.pointerId !== event.pointerId) return;

    const releaseDragY = cancelled
      ? gestureRef.current.dragY
      : Math.min(0, event.clientY - gestureRef.current.startY);

    gestureRef.current.dragY = releaseDragY;
    setDragY(releaseDragY);
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    gestureRef.current.pointerId = null;
    setDragging(false);

    const releaseProgress = clamp01(
      Math.abs(releaseDragY) / Math.abs(TOAST_CLOSED_OFFSET_Y),
    );

    if (!cancelled && releaseDragY <= -SWIPE_DISMISS_DISTANCE) {
      if (releaseProgress >= 1 || reduceMotion) {
        onDismiss?.(toast.id, 'swipe');
        return;
      }

      setDismissing(true);
      return;
    }

    gestureRef.current.dragY = 0;
    setDragY(0);

    if (releaseProgress === 0 || reduceMotion) {
      onInteractionChange?.(toast.id, false);
      return;
    }

    setReturnProgress(releaseProgress);
    setReturning(true);
  };

  const depth = Math.min(stackIndex, MAX_VISIBLE_STACK_DEPTH);
  const stackY = -depth * STACK_OFFSET_Y;
  const stackScale = 1 - depth * STACK_SCALE_STEP;
  const stackOpacity = stackIndex > MAX_VISIBLE_STACK_DEPTH ? 0 : 1;

  const openTransition = reduceMotion
    ? { duration: 0 }
    : { duration: TOAST_MOTION_DURATION_S, ease: TOAST_OPEN_EASE };

  const closeTransition = reduceMotion
    ? { duration: 0 }
    : { duration: TOAST_MOTION_DURATION_S, ease: TOAST_CLOSE_EASE };

  const stackTransition = reduceMotion
    ? { duration: 0 }
    : {
        y: { type: 'spring', stiffness: 520, damping: 36, mass: 0.72 },
        scale: { type: 'spring', stiffness: 520, damping: 36, mass: 0.72 },
        opacity: { duration: 0.16, ease: TOAST_OPEN_EASE },
      };

  const closeProgress = clamp01(Math.abs(dragY) / Math.abs(TOAST_CLOSED_OFFSET_Y));
  const scrubScale = stackScale * (1 - (1 - TOAST_CLOSED_SCALE) * closeProgress);
  const scrubOpacity = stackOpacity * (1 - closeProgress);
  const dismissY = stackY + Math.min(TOAST_CLOSED_OFFSET_Y, gestureRef.current.dragY);
  const dismissScale = stackScale * TOAST_CLOSED_SCALE;
  const manualCloseTransition = reduceMotion
    ? { duration: 0 }
    : {
        duration: TOAST_MOTION_DURATION_S * (1 - closeProgress),
        ease: TOAST_CLOSE_EASE,
      };
  const manualReturnTransition = reduceMotion
    ? { duration: 0 }
    : {
        duration: TOAST_MOTION_DURATION_S * returnProgress,
        ease: TOAST_OPEN_EASE,
      };

  let animateState = {
    y: stackY,
    scale: stackScale,
    opacity: stackOpacity,
  };
  let activeTransition = firstRenderRef.current ? openTransition : stackTransition;

  if (dragging) {
    animateState = {
      y: stackY + dragY,
      scale: scrubScale,
      opacity: scrubOpacity,
    };
    activeTransition = { duration: 0 };
  } else if (dismissing) {
    animateState = {
      y: dismissY,
      scale: dismissScale,
      opacity: 0,
    };
    activeTransition = manualCloseTransition;
  } else if (returning) {
    activeTransition = manualReturnTransition;
  }

  const handleAnimationComplete = () => {
    if (dismissing && !dismissReportedRef.current) {
      dismissReportedRef.current = true;
      onDismiss?.(toast.id, 'swipe');
      return;
    }

    if (returning) {
      setReturning(false);
      setReturnProgress(0);
      onInteractionChange?.(toast.id, false);
    }
  };

  const className = [
    'app-toast',
    interactive && 'app-toast--interactive',
    dismissing && 'app-toast--dismissing',
  ].filter(Boolean).join(' ');

  return (
    <motion.div
      className="app-toast-layer"
      initial={reduceMotion ? false : {
        y: stackY + TOAST_CLOSED_OFFSET_Y,
        scale: stackScale * TOAST_CLOSED_SCALE,
        opacity: 0,
      }}
      animate={animateState}
      exit={{
        y: stackY + TOAST_CLOSED_OFFSET_Y,
        scale: stackScale * TOAST_CLOSED_SCALE,
        opacity: 0,
        transition: closeTransition,
      }}
      transition={activeTransition}
      onAnimationComplete={handleAnimationComplete}
      style={{ zIndex: 100 - stackIndex }}
      aria-hidden={stackIndex > MAX_VISIBLE_STACK_DEPTH}
    >
      <div
        className={className}
        role="status"
        aria-live="polite"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={(event) => settleGesture(event)}
        onPointerCancel={(event) => settleGesture(event, true)}
      >
        <SuccessIcon className="app-toast__icon" aria-hidden="true" focusable="false" />
        <span className="app-toast__text">{toast.message}</span>
      </div>
    </motion.div>
  );
}

export default function AppToast({
  toasts = [],
  onDismiss,
  onInteractionChange,
}) {
  const reduceMotion = useReducedMotion();
  const stackedToasts = [...toasts].reverse();

  return (
    <div className="app-toast-stack" aria-label="Уведомления">
      <AnimatePresence>
        {stackedToasts.map((toast, stackIndex) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            stackIndex={stackIndex}
            interactive={stackIndex === 0}
            onDismiss={onDismiss}
            onInteractionChange={onInteractionChange}
            reduceMotion={reduceMotion}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
