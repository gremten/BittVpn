import { Fragment, useEffect, useRef, useState } from 'react';
import Button from './Button';
import { joinClasses as join } from './utils';

const HOLD_DELAY = 120;
const VERTICAL_SCRUB_THRESHOLD = 6;
const HORIZONTAL_CANCEL_THRESHOLD = 14;
const SCRUB_HORIZONTAL_SLOP = 36;

function hapticSelectionChanged() {
  try {
    window.Telegram?.WebApp?.HapticFeedback?.selectionChanged?.();
  } catch (_) {
    // Optional only.
  }
}

function ContextMenu({
  items = [],
  className,
  onSelect,
  ariaLabel = 'Контекстное меню',
  style,
}) {
  const [pressedId, setPressedId] = useState(null);
  const menuRef = useRef(null);
  const itemRefs = useRef(new Map());
  const pointerIdRef = useRef(null);
  const pointerStartRef = useRef(null);
  const holdTimerRef = useRef(0);
  const pressedIdRef = useRef(null);
  const isScrubbingRef = useRef(false);
  const gestureModeRef = useRef('idle');
  const suppressClickRef = useRef(false);
  const clickResetTimerRef = useRef(0);

  const actionableItems = items.filter((item) => !item.disabled);
  const itemById = new Map(
    actionableItems.map((item, index) => [String(item.id ?? item.label ?? index), item]),
  );

  useEffect(() => () => {
    window.clearTimeout(holdTimerRef.current);
    window.clearTimeout(clickResetTimerRef.current);
  }, []);

  const setItemRef = (id, node) => {
    if (node) itemRefs.current.set(id, node);
    else itemRefs.current.delete(id);
  };

  const setPressed = (nextId, withHaptic = false) => {
    if (!itemById.has(nextId) || nextId === pressedIdRef.current) return;
    pressedIdRef.current = nextId;
    setPressedId(nextId);
    if (withHaptic) hapticSelectionChanged();
  };

  const clearPressed = () => {
    pressedIdRef.current = null;
    setPressedId(null);
  };

  const idAtPointer = (clientX, clientY, fallback = pressedIdRef.current) => {
    const menu = menuRef.current;
    if (!menu) return fallback;

    const menuRect = menu.getBoundingClientRect();
    if (
      clientX < menuRect.left - SCRUB_HORIZONTAL_SLOP
      || clientX > menuRect.right + SCRUB_HORIZONTAL_SLOP
    ) {
      return fallback;
    }

    const element = document.elementFromPoint?.(clientX, clientY);
    const directItem = element?.closest?.('[data-context-menu-id]');
    if (directItem && menu.contains(directItem)) {
      const directId = directItem.getAttribute('data-context-menu-id');
      if (itemById.has(directId)) return directId;
    }

    let nearestId = fallback;
    let nearestDistance = Number.POSITIVE_INFINITY;

    itemRefs.current.forEach((node, id) => {
      const rect = node.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const distance = Math.abs(clientY - centerY);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestId = id;
      }
    });

    return nearestId;
  };

  const beginScrub = (clientX, clientY) => {
    if (isScrubbingRef.current) return;

    isScrubbingRef.current = true;
    gestureModeRef.current = 'scrub';
    suppressClickRef.current = true;
    const initialId = idAtPointer(clientX, clientY, pressedIdRef.current);
    if (initialId) setPressed(initialId);
  };

  const resetSyntheticClickGuard = () => {
    window.clearTimeout(clickResetTimerRef.current);
    clickResetTimerRef.current = window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 0);
  };

  const cancelGesture = () => {
    window.clearTimeout(holdTimerRef.current);
    pointerIdRef.current = null;
    pointerStartRef.current = null;
    isScrubbingRef.current = false;
    gestureModeRef.current = 'idle';
    suppressClickRef.current = false;
    clearPressed();
  };

  const finishGesture = (event) => {
    if (pointerIdRef.current !== event.pointerId) return;

    window.clearTimeout(holdTimerRef.current);
    pointerIdRef.current = null;
    pointerStartRef.current = null;

    try {
      menuRef.current?.releasePointerCapture?.(event.pointerId);
    } catch (_) {}

    const finalId = idAtPointer(event.clientX, event.clientY, pressedIdRef.current);
    const finalItem = finalId ? itemById.get(finalId) : null;
    const wasScrubbing = isScrubbingRef.current;
    const wasCancelled = gestureModeRef.current === 'cancelled';

    isScrubbingRef.current = false;
    gestureModeRef.current = 'idle';
    clearPressed();

    if (wasCancelled) {
      event.preventDefault();
      suppressClickRef.current = true;
      resetSyntheticClickGuard();
      return;
    }

    if (wasScrubbing && finalItem) {
      event.preventDefault();
      suppressClickRef.current = true;
      onSelect?.(finalItem);
      resetSyntheticClickGuard();
      return;
    }

    // Commit a normal pointer tap on pointer-up instead of relying on the
    // browser/WebView to retarget the synthetic click through pointer capture.
    // This mirrors Navigator and keeps Telegram WebView + desktop mouse taps
    // reliable while the click guard prevents the action from firing twice.
    if (finalItem) {
      suppressClickRef.current = true;
      onSelect?.(finalItem);
      resetSyntheticClickGuard();
    }
  };

  const handlePointerDown = (event) => {
    if (event.button != null && event.button !== 0) return;

    const itemNode = event.target.closest?.('[data-context-menu-id]');
    const id = itemNode?.getAttribute?.('data-context-menu-id');
    if (!id || !itemById.has(id)) return;

    window.clearTimeout(holdTimerRef.current);
    pointerIdRef.current = event.pointerId;
    pointerStartRef.current = { x: event.clientX, y: event.clientY };
    suppressClickRef.current = false;
    gestureModeRef.current = 'pending';
    setPressed(id);

    try {
      menuRef.current?.setPointerCapture?.(event.pointerId);
    } catch (_) {}

    holdTimerRef.current = window.setTimeout(() => {
      if (pointerIdRef.current === event.pointerId && pointerStartRef.current) {
        beginScrub(pointerStartRef.current.x, pointerStartRef.current.y);
      }
    }, HOLD_DELAY);
  };

  const handlePointerMove = (event) => {
    if (pointerIdRef.current !== event.pointerId || !pointerStartRef.current) return;

    const dx = event.clientX - pointerStartRef.current.x;
    const dy = event.clientY - pointerStartRef.current.y;

    if (gestureModeRef.current === 'cancelled') return;

    if (!isScrubbingRef.current) {
      if (
        Math.abs(dx) >= HORIZONTAL_CANCEL_THRESHOLD
        && Math.abs(dx) > Math.abs(dy)
      ) {
        window.clearTimeout(holdTimerRef.current);
        gestureModeRef.current = 'cancelled';
        clearPressed();
        return;
      }

      if (
        Math.abs(dy) >= VERTICAL_SCRUB_THRESHOLD
        && Math.abs(dy) >= Math.abs(dx)
      ) {
        window.clearTimeout(holdTimerRef.current);
        beginScrub(event.clientX, event.clientY);
      }
    }

    if (!isScrubbingRef.current) return;

    event.preventDefault();
    const nextId = idAtPointer(event.clientX, event.clientY, pressedIdRef.current);
    if (nextId) setPressed(nextId, true);
  };

  const handleItemClick = (item, event) => {
    if (suppressClickRef.current) {
      event.preventDefault();
      suppressClickRef.current = false;
      return;
    }

    clearPressed();
    onSelect?.(item);
  };

  return (
    <div
      ref={menuRef}
      className={join('bitt-context-menu', className)}
      role="menu"
      aria-label={ariaLabel}
      style={style}
      data-figma-node="6464:31187"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishGesture}
      onPointerCancel={cancelGesture}
      onContextMenu={(event) => event.preventDefault()}
      onLostPointerCapture={() => {
        if (pointerIdRef.current != null) cancelGesture();
      }}
    >
      {items.map((item, index) => {
        const id = String(item.id ?? item.label ?? index);
        const isPressed = pressedId === id;

        return (
          <Fragment key={id}>
            {item.separatorBefore && <span className="bitt-context-menu__separator" aria-hidden="true" />}
            <span
              ref={(node) => setItemRef(id, node)}
              className="bitt-context-menu__item-slot"
              data-context-menu-id={id}
            >
              <Button
                size="medium"
                type="menu"
                form="circle"
                color={item.danger ? 'danger' : 'none'}
                state={isPressed ? 'active' : 'default'}
                fullWidth
                className="bitt-context-menu__item"
                data-scrub-active={isPressed ? 'true' : undefined}
                role="menuitem"
                label={item.label}
                disabled={item.disabled}
                onClick={(event) => handleItemClick(item, event)}
              />
            </span>
          </Fragment>
        );
      })}
    </div>
  );
}

export default ContextMenu;

export {
  HOLD_DELAY as CONTEXT_MENU_HOLD_DELAY,
  VERTICAL_SCRUB_THRESHOLD as CONTEXT_MENU_VERTICAL_SCRUB_THRESHOLD,
};
