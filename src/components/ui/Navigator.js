import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react';
import { useEffect, useId, useRef, useState } from 'react';
import { ReactComponent as HomeFilledIcon } from '../../assets/icons/nav/icn_m_home-filled.svg';
import { ReactComponent as HomeOutlineIcon } from '../../assets/icons/nav/icn_m_home-outline.svg';
import { ReactComponent as SetFilledIcon } from '../../assets/icons/nav/icn_m_set-filled.svg';
import { ReactComponent as SetOutlineIcon } from '../../assets/icons/nav/icn_m_set-outline.svg';
import { ReactComponent as ProfileFilledIcon } from '../../assets/icons/nav/icn_m_profile_filled.svg';
import { ReactComponent as ProfileOutlineIcon } from '../../assets/icons/nav/icn_m_profile_filled-1.svg';
import { ReactComponent as HelpFilledIcon } from '../../assets/icons/nav/icn_m_help-filled.svg';
import { ReactComponent as HelpOutlineIcon } from '../../assets/icons/nav/icn_m_help.svg';
import { SLOT_CATCH_TRANSITION, SLOT_REST_TRANSITION } from './motionTransitions';
import { joinClasses as join } from './utils';

const NAV_ITEMS = [
  { key: 'home', label: 'Главная', activeIcon: HomeFilledIcon, icon: HomeOutlineIcon },
  { key: 'configurations', label: 'Локации', activeIcon: SetFilledIcon, icon: SetOutlineIcon },
  { key: 'referrals', label: 'Профиль', activeIcon: ProfileFilledIcon, icon: ProfileOutlineIcon },
  { key: 'help', label: 'Помощь', activeIcon: HelpFilledIcon, icon: HelpOutlineIcon },
];

/*
 * Exact geometry of the four Figma variants from navigator 5951:24662.
 * These values are not approximations:
 *   home           124 + 56 + 56 + 56 + 8       = 300
 *   configurations 8 + 56 + 128 + 56 + 56 + 8  = 312
 *   referrals      8 + 56 + 56 + 131 + 56 + 8  = 315
 *   help           8 + 56 + 56 + 56 + 125       = 301
 *
 * During scrub every slot is 56px wide. The same edge-padding rule is kept,
 * so the black navigator HUGs the four compact buttons instead of retaining
 * an invisible label-sized hole.
 */
const NAV_VARIANTS = {
  home: { width: 300, activeWidth: 124, paddingLeft: 0, paddingRight: 8 },
  configurations: { width: 312, activeWidth: 128, paddingLeft: 8, paddingRight: 8 },
  referrals: { width: 315, activeWidth: 131, paddingLeft: 8, paddingRight: 8 },
  help: { width: 301, activeWidth: 125, paddingLeft: 8, paddingRight: 0 },
};

const COMPACT_BUTTONS_WIDTH = NAV_ITEMS.length * 56;
const HOLD_DELAY = 120;
const HORIZONTAL_SCRUB_THRESHOLD = 6;
const VERTICAL_CANCEL_THRESHOLD = 14;
const SCRUB_VERTICAL_SLOP = 38;

function hapticSelectionChanged() {
  try {
    window.Telegram?.WebApp?.HapticFeedback?.selectionChanged?.();
  } catch (_) {
    // Haptics are optional and must never affect navigation itself.
  }
}

function Navigator({ selected = 'home', onSelect, className }) {
  const safeSelected = NAV_VARIANTS[selected] ? selected : 'home';
  const shouldReduceMotion = useReducedMotion();
  const layoutGroupId = useId();

  const [committedKey, setCommittedKey] = useState(safeSelected);
  const [previewKey, setPreviewKey] = useState(safeSelected);
  const [isScrubbing, setIsScrubbing] = useState(false);

  const navRef = useRef(null);
  const slotRefs = useRef(new Map());
  const pointerIdRef = useRef(null);
  const pointerStartRef = useRef(null);
  const holdTimerRef = useRef(null);
  const clickResetTimerRef = useRef(null);
  const isScrubbingRef = useRef(false);
  const suppressClickRef = useRef(false);
  const lastPreviewRef = useRef(safeSelected);

  const activeKey = isScrubbing ? previewKey : committedKey;
  const activeVariant = NAV_VARIANTS[activeKey] || NAV_VARIANTS.home;
  const navWidth = isScrubbing
    ? COMPACT_BUTTONS_WIDTH + activeVariant.paddingLeft + activeVariant.paddingRight
    : activeVariant.width;
  const layoutTransition = shouldReduceMotion
    ? { duration: 0 }
    : (isScrubbing ? SLOT_CATCH_TRANSITION : SLOT_REST_TRANSITION);

  useEffect(() => {
    if (!isScrubbingRef.current && safeSelected !== committedKey) {
      setCommittedKey(safeSelected);
      setPreviewKey(safeSelected);
      lastPreviewRef.current = safeSelected;
    }
  }, [safeSelected, committedKey]);

  useEffect(() => () => {
    clearTimeout(holdTimerRef.current);
    clearTimeout(clickResetTimerRef.current);
  }, []);

  const setSlotRef = (key, node) => {
    if (node) slotRefs.current.set(key, node);
    else slotRefs.current.delete(key);
  };

  const keyAtPointer = (clientX, clientY, fallback = lastPreviewRef.current) => {
    const nav = navRef.current;
    if (!nav) return fallback;

    const navRect = nav.getBoundingClientRect();
    if (clientY < navRect.top - SCRUB_VERTICAL_SLOP || clientY > navRect.bottom + SCRUB_VERTICAL_SLOP) {
      return fallback;
    }

    // First use the actual rendered slot under the finger. This keeps hit
    // testing in sync with Motion while the compact layout is itself moving.
    const element = document.elementFromPoint?.(clientX, clientY);
    const slot = element?.closest?.('[data-nav-key]');
    if (slot && nav.contains(slot)) {
      const directKey = slot.getAttribute('data-nav-key');
      if (NAV_VARIANTS[directKey]) return directKey;
    }

    // Pointer capture can make elementFromPoint less useful in some WebViews.
    // Fall back to the nearest *real slot centre*, never to a free x position.
    let nearestKey = fallback;
    let nearestDistance = Number.POSITIVE_INFINITY;

    NAV_ITEMS.forEach((item) => {
      const node = slotRefs.current.get(item.key);
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const distance = Math.abs(clientX - centerX);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestKey = item.key;
      }
    });

    return nearestKey;
  };

  const catchSlot = (nextKey) => {
    if (!NAV_VARIANTS[nextKey] || nextKey === lastPreviewRef.current) return;
    lastPreviewRef.current = nextKey;
    setPreviewKey(nextKey);
    hapticSelectionChanged();
  };

  const beginScrub = (clientX, clientY) => {
    if (isScrubbingRef.current) return;

    const initialKey = keyAtPointer(clientX, clientY, committedKey);
    isScrubbingRef.current = true;
    suppressClickRef.current = true;
    lastPreviewRef.current = initialKey;
    setPreviewKey(initialKey);
    setIsScrubbing(true);

    if (initialKey !== committedKey) hapticSelectionChanged();
  };

  const finishScrub = () => {
    const nextKey = NAV_VARIANTS[lastPreviewRef.current]
      ? lastPreviewRef.current
      : committedKey;

    isScrubbingRef.current = false;
    setCommittedKey(nextKey);
    setPreviewKey(nextKey);
    setIsScrubbing(false);
    lastPreviewRef.current = nextKey;
    onSelect?.(nextKey);
  };

  const cancelGesture = () => {
    clearTimeout(holdTimerRef.current);
    pointerIdRef.current = null;
    pointerStartRef.current = null;

    if (isScrubbingRef.current) {
      isScrubbingRef.current = false;
      setIsScrubbing(false);
      setPreviewKey(committedKey);
      lastPreviewRef.current = committedKey;
    }
  };

  const handlePointerDown = (event) => {
    if (event.button != null && event.button !== 0) return;

    clearTimeout(holdTimerRef.current);
    pointerIdRef.current = event.pointerId;
    pointerStartRef.current = { x: event.clientX, y: event.clientY };
    suppressClickRef.current = false;

    try {
      navRef.current?.setPointerCapture?.(event.pointerId);
    } catch (_) {}

    holdTimerRef.current = setTimeout(() => {
      if (pointerIdRef.current === event.pointerId && pointerStartRef.current) {
        beginScrub(pointerStartRef.current.x, pointerStartRef.current.y);
      }
    }, HOLD_DELAY);
  };

  const handlePointerMove = (event) => {
    if (pointerIdRef.current !== event.pointerId || !pointerStartRef.current) return;

    const dx = event.clientX - pointerStartRef.current.x;
    const dy = event.clientY - pointerStartRef.current.y;

    if (!isScrubbingRef.current) {
      if (Math.abs(dy) >= VERTICAL_CANCEL_THRESHOLD && Math.abs(dy) > Math.abs(dx)) {
        clearTimeout(holdTimerRef.current);
        return;
      }

      if (Math.abs(dx) >= HORIZONTAL_SCRUB_THRESHOLD && Math.abs(dx) >= Math.abs(dy)) {
        clearTimeout(holdTimerRef.current);
        beginScrub(event.clientX, event.clientY);
        return;
      }
    }

    if (isScrubbingRef.current) {
      event.preventDefault();
      catchSlot(keyAtPointer(event.clientX, event.clientY));
    }
  };

  const resetSyntheticClickGuard = () => {
    clearTimeout(clickResetTimerRef.current);
    clickResetTimerRef.current = setTimeout(() => {
      suppressClickRef.current = false;
    }, 0);
  };

  const selectImmediately = (nextKey) => {
    if (!NAV_VARIANTS[nextKey]) return;
    setCommittedKey(nextKey);
    setPreviewKey(nextKey);
    lastPreviewRef.current = nextKey;
    onSelect?.(nextKey);
  };

  const handlePointerUp = (event) => {
    if (pointerIdRef.current !== event.pointerId) return;
    clearTimeout(holdTimerRef.current);

    pointerIdRef.current = null;
    pointerStartRef.current = null;

    try {
      navRef.current?.releasePointerCapture?.(event.pointerId);
    } catch (_) {}

    if (isScrubbingRef.current) {
      event.preventDefault();
      finishScrub();
      resetSyntheticClickGuard();
      return;
    }

    suppressClickRef.current = true;
    selectImmediately(keyAtPointer(event.clientX, event.clientY, committedKey));
    resetSyntheticClickGuard();
  };

  const handleItemClick = (itemKey, event) => {
    // Pointer taps are already handled on pointer-up at the navigator level.
    // A click that reaches here is either keyboard/AT activation or the
    // browser's synthetic click immediately after a pointer gesture.
    if (suppressClickRef.current) {
      event.preventDefault();
      suppressClickRef.current = false;
      return;
    }

    selectImmediately(itemKey);
  };

  return (
    <LayoutGroup id={layoutGroupId}>
      <motion.nav
        ref={navRef}
        className={join('bitt-navigator', isScrubbing && 'bitt-navigator--scrubbing', className)}
        data-figma-node="5951:24662"
        data-selected={committedKey}
        data-preview={isScrubbing ? previewKey : undefined}
        data-phase={isScrubbing ? 'scrub' : 'rest'}
        aria-label="Основная навигация"
        layout
        initial={false}
        style={{
          width: navWidth,
          paddingLeft: activeVariant.paddingLeft,
          paddingRight: activeVariant.paddingRight,
        }}
        transition={layoutTransition}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={cancelGesture}
        onLostPointerCapture={() => {
          if (pointerIdRef.current != null) cancelGesture();
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = item.key === activeKey;
          const slotWidth = isActive && !isScrubbing ? activeVariant.activeWidth : 56;
          const Icon = item.icon;
          const ActiveIcon = item.activeIcon;

          return (
            <motion.button
              ref={(node) => setSlotRef(item.key, node)}
              type="button"
              className="bitt-navigator__slot"
              key={item.key}
              data-nav-key={item.key}
              layout
              initial={false}
              style={{ width: slotWidth }}
              transition={layoutTransition}
              onClick={(event) => handleItemClick(item.key, event)}
              aria-current={!isScrubbing && item.key === committedKey ? 'page' : undefined}
              aria-label={item.label}
            >
              <Icon
                className="bitt-navigator__slot-icon"
                aria-hidden="true"
                focusable="false"
              />

              {isActive && (
                <motion.span
                  className="bitt-navigator__active-pill"
                  layoutId="bitt-navigator-active-pill"
                  transition={layoutTransition}
                  aria-hidden="true"
                >
                  <ActiveIcon
                    className="bitt-navigator__active-icon"
                    aria-hidden="true"
                    focusable="false"
                  />

                  <AnimatePresence initial={false}>
                    {!isScrubbing && (
                      <motion.span
                        key={`${item.key}-label`}
                        className="bitt-navigator__label"
                        initial={shouldReduceMotion ? false : { opacity: 0, x: -3 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={shouldReduceMotion ? undefined : { opacity: 0, x: -3 }}
                        transition={shouldReduceMotion ? { duration: 0 } : {
                          type: 'tween',
                          duration: 0.11,
                          delay: 0.09,
                          ease: 'easeOut',
                        }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </motion.nav>
    </LayoutGroup>
  );
}

export default Navigator;
