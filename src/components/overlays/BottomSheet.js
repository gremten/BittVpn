import './BottomSheet.css';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Reusable bottom-sheet shell.
 *
 * Owns only overlay mechanics: fixed positioning, safe-area, grabber,
 * document scroll lock, downward swipe-to-close and the sheet transition.
 * Content is intentionally provided by children so this shell can be reused
 * by every flow without duplicating gesture/safe-area logic.
 */
export default function BottomSheet({
  open,
  onClose,
  children,
  className = '',
  overlayClassName = '',
  ariaLabel = 'Bottom sheet',
  closeThreshold = 72,
  figmaNode = '7166:122124',
  dismissible = true,
}) {
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragYRef = useRef(0);
  const gestureRef = useRef({
    active: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    mode: 'pending',
  });

  const setSheetDragY = useCallback((nextY) => {
    dragYRef.current = nextY;
    setDragY(nextY);
  }, []);

  useEffect(() => {
    if (!open) {
      setSheetDragY(0);
      setIsDragging(false);
      return undefined;
    }

    const scrollY = window.scrollY;
    const root = document.documentElement;
    const body = document.body;

    // Do not freeze the body with position:fixed/top:-scrollY here. In iOS
    // Telegram WebViews a fixed BottomSheet can then inherit that translated
    // document coordinate space and end up partly below the visible viewport
    // when it is opened after the page was scrolled. The lock classes already
    // stop background scrolling without moving the document itself.
    root.classList.add('sheet-scroll-locked');
    body.classList.add('sheet-scroll-locked');

    return () => {
      root.classList.remove('sheet-scroll-locked');
      body.classList.remove('sheet-scroll-locked');

      // Keep the exact content position the user had before the sheet opened.
      // Normally overflow locking does not move it, but restoring is harmless
      // and protects against WebView-specific scroll adjustments.
      if (window.scrollY !== scrollY) window.scrollTo(0, scrollY);
    };
  }, [open, setSheetDragY]);

  useEffect(() => {
    if (!open || !dismissible) return undefined;

    const resetGesture = () => {
      const gesture = gestureRef.current;
      gesture.active = false;
      gesture.pointerId = null;
      gesture.mode = 'pending';
      setIsDragging(false);
    };

    const handlePointerDown = (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;

      gestureRef.current = {
        active: true,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        mode: 'pending',
      };
    };

    const handlePointerMove = (event) => {
      const gesture = gestureRef.current;
      if (!gesture.active || gesture.pointerId !== event.pointerId) return;

      const deltaX = event.clientX - gesture.startX;
      const deltaY = event.clientY - gesture.startY;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (gesture.mode === 'pending') {
        if (Math.max(absX, absY) < 8) return;

        // A horizontal interaction (for example the duration slider) wins.
        // Only a clearly downward, vertical gesture drags the whole sheet.
        if (deltaY > 0 && absY > absX * 1.12) {
          gesture.mode = 'vertical';
          setIsDragging(true);
        } else {
          gesture.mode = 'horizontal';
          return;
        }
      }

      if (gesture.mode !== 'vertical') return;

      event.preventDefault();
      event.stopPropagation();
      setSheetDragY(Math.max(0, deltaY));
    };

    const handlePointerEnd = (event) => {
      const gesture = gestureRef.current;
      if (!gesture.active || gesture.pointerId !== event.pointerId) return;

      const shouldClose = gesture.mode === 'vertical' && dragYRef.current > closeThreshold;
      resetGesture();

      if (shouldClose) onClose?.();
      else setSheetDragY(0);
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') onClose?.();
    };

    // Capture on window deliberately: the user's downward close gesture can
    // start anywhere over the open sheet, not only on its grabber.
    window.addEventListener('pointerdown', handlePointerDown, true);
    window.addEventListener('pointermove', handlePointerMove, { capture: true, passive: false });
    window.addEventListener('pointerup', handlePointerEnd, true);
    window.addEventListener('pointercancel', handlePointerEnd, true);
    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown, true);
      window.removeEventListener('pointermove', handlePointerMove, true);
      window.removeEventListener('pointerup', handlePointerEnd, true);
      window.removeEventListener('pointercancel', handlePointerEnd, true);
      window.removeEventListener('keydown', handleEscape);
      resetGesture();
    };
  }, [closeThreshold, dismissible, onClose, open, setSheetDragY]);

  return (
    <>
      <button
        type="button"
        className={`bottom-sheet-overlay ${open ? 'bottom-sheet-overlay--open' : ''} ${overlayClassName}`.trim()}
        aria-label={dismissible ? 'Закрыть' : undefined}
        aria-hidden={!open}
        tabIndex={open && dismissible ? 0 : -1}
        disabled={!dismissible}
        onClick={dismissible ? onClose : undefined}
      />
      <section
        className={`bottom-sheet ${open ? 'bottom-sheet--open' : ''} ${isDragging ? 'bottom-sheet--dragging' : ''} ${className}`.trim()}
        aria-hidden={!open}
        aria-label={ariaLabel}
        style={{ '--sheet-drag-y': `${dragY}px` }}
        data-component="BottomSheet"
        data-figma-node={figmaNode}
      >
        <button
          className="sheet-grabber-zone"
          type="button"
          aria-label={dismissible ? 'Закрыть' : undefined}
          tabIndex={open && dismissible ? 0 : -1}
          disabled={!dismissible}
          onClick={dismissible ? onClose : undefined}
        >
          <span className="sheet-grabber" />
        </button>
        {children}
      </section>
    </>
  );
}
