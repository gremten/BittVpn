import { useCallback, useEffect, useRef, useState } from 'react';
import './HistoryScreen.css';
import { Block, SingleSelectChipGroup } from '../../components/ui';
import referralIcon from '../../assets/icons/history-referral.svg';

const MONTH_LABELS = Object.freeze({
  january: 'Январь',
  february: 'Февраль',
  march: 'Март',
  april: 'Апрель',
  may: 'Май',
  june: 'Июнь',
  july: 'Июль',
  august: 'Август',
  september: 'Сентябрь',
  october: 'Октябрь',
  november: 'Ноябрь',
  december: 'Декабрь',
});

const HISTORY_GROUPS = [
  {
    id: 'march-21',
    month: 'march',
    date: '21 марта, воскресенье',
    rows: [
      { code: 'DE', title: 'Германия — 1 мес.', status: 'В обработке', statusTone: 'neutral', detailState: 'processing', price: '139 ₽' },
      { code: 'KZ', title: 'Казахстан — 1 мес.', status: 'Ожидает оплату', statusTone: 'warning', detailState: 'waiting', price: '199 ₽' },
      { code: 'RU', title: 'BittRussia', status: 'Успешно', statusTone: 'success', detailState: 'success', price: '98 ₽' },
      { code: 'JP', title: 'Япония — 12 мес.', status: 'Платеж просрочен', statusTone: 'danger', detailState: 'expired', price: '3 132 ₽' },
    ],
  },
  {
    id: 'february-20',
    month: 'february',
    date: '20 февраля, четверг',
    rows: [
      { icon: referralIcon, kind: 'referral', title: 'Реферальный бонус', status: 'Успешно', statusTone: 'success', detailState: 'referral', price: '+29 ₽' },
    ],
  },
  {
    id: 'december-15',
    month: 'december',
    date: '15 декабря, среда',
    rows: [
      { code: 'KZ', title: 'Казахстан — 1 мес.', status: 'Ошибка платежа', statusTone: 'danger', detailState: 'error', price: '199 ₽' },
      { code: 'JP', title: 'Япония — 1 мес.', status: 'Успешно', statusTone: 'success', detailState: 'success', price: '132 ₽' },
    ],
  },
  {
    id: 'november-13',
    month: 'november',
    date: '13 ноября, понедельник',
    rows: [
      { code: 'RU', title: 'BittRussia — 1 мес.', status: 'Успешно', statusTone: 'success', detailState: 'success', price: '98 ₽' },
    ],
  },
  {
    id: 'september-24',
    month: 'september',
    date: '24 сентября, среда',
    rows: [
      { code: 'KZ', title: 'Казахстан — 1 мес.', status: 'Ошибка платежа', statusTone: 'danger', detailState: 'error', price: '299 ₽' },
      { code: 'JP', title: 'Япония — 1 мес.', status: 'Платеж просрочен', statusTone: 'danger', detailState: 'expired', price: '132 ₽' },
    ],
  },
];

const AVAILABLE_MONTHS = [...new Set(HISTORY_GROUPS.map((group) => group.month))];
const MONTH_OPTIONS = AVAILABLE_MONTHS.map((month) => ({
  value: month,
  label: MONTH_LABELS[month] || month,
}));
const FIRST_GROUP_BY_MONTH = HISTORY_GROUPS.reduce((map, group) => {
  if (!map.has(group.month)) map.set(group.month, group.id);
  return map;
}, new Map());

const INITIAL_MONTH = AVAILABLE_MONTHS[0] || null;
const LAST_CONTENT_MONTH = AVAILABLE_MONTHS[AVAILABLE_MONTHS.length - 1] || null;
const USER_SCROLL_GESTURE_THRESHOLD = 6;

function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

function getVerticalScrollRoot(scrollArea) {
  if (!scrollArea || typeof window === 'undefined') return null;
  const overflowY = window.getComputedStyle(scrollArea).overflowY;
  return /(auto|scroll)/.test(overflowY) ? scrollArea : null;
}

function getScrollMetrics(root) {
  if (root) {
    const max = Math.max(0, root.scrollHeight - root.clientHeight);
    return { current: root.scrollTop, max };
  }

  const scrollingElement = document.scrollingElement || document.documentElement;
  const current = window.scrollY ?? scrollingElement.scrollTop ?? 0;
  const max = Math.max(0, scrollingElement.scrollHeight - window.innerHeight);
  return { current, max };
}

function scrollRootTo(root, top, behavior) {
  if (root) {
    root.scrollTo({ top, behavior });
    return;
  }
  window.scrollTo({ top, behavior });
}

function isAtAbsoluteEnd(root) {
  const { current, max } = getScrollMetrics(root);
  return max <= 1 || current >= max - 1;
}

function OperationRow({ code, icon, title, status, statusTone = 'neutral', price, last = false, onClick }) {
  return (
    <button
      type="button"
      className={`history-operation-row${last ? ' history-operation-row--last' : ''}`}
      onClick={onClick}
      aria-label={`${title}, ${status}, ${price}`}
    >
      <span className="history-operation-row__leading" aria-hidden="true">
        {icon ? <img src={icon} alt="" /> : <span className="history-operation-row__code">{code}</span>}
      </span>
      <span className="history-operation-row__copy">
        <b>{title}</b>
        <small className={`history-operation-row__status history-operation-row__status--${statusTone}`}>{status}</small>
      </span>
      <span className="history-operation-row__price">{price}</span>
    </button>
  );
}

function HistoryGroup({ group, registerSection, registerAnchor, onOpenOperation }) {
  const single = group.rows.length === 1;

  return (
    <section
      ref={(node) => registerSection(group.id, node)}
      className="history-group"
      data-history-month={group.month}
    >
      <span
        ref={(node) => registerAnchor(group.id, node)}
        className="history-group__anchor"
        data-history-anchor={group.id}
        aria-hidden="true"
      />
      <p className="history-group__date">{group.date}</p>
      <Block className={`history-card${single ? ' history-card--single' : ' history-card--multi'}`}>
        <div className="history-card__rows">
          {group.rows.map((row, index) => (
            <OperationRow
              key={`${group.id}-${index}`}
              {...row}
              last={index === group.rows.length - 1}
              onClick={() => onOpenOperation?.({
                ...row,
                groupId: group.id,
                month: group.month,
                date: group.date,
              })}
            />
          ))}
        </div>
      </Block>
    </section>
  );
}

export default function HistoryScreen({ onOpenOperation }) {
  const [selectedMonth, setSelectedMonth] = useState(INITIAL_MONTH);
  const scrollAreaRef = useRef(null);
  const stickyRef = useRef(null);
  const monthsScrollRef = useRef(null);
  const sectionRefs = useRef(new Map());
  const anchorRefs = useRef(new Map());
  const endSentinelRef = useRef(null);
  const manualSelectionLockRef = useRef(false);
  const resolveActiveMonthRef = useRef(null);
  const gestureRef = useRef(null);

  const registerSection = useCallback((id, node) => {
    if (node) sectionRefs.current.set(id, node);
    else sectionRefs.current.delete(id);
  }, []);

  const registerAnchor = useCallback((id, node) => {
    if (node) anchorRefs.current.set(id, node);
    else anchorRefs.current.delete(id);
  }, []);

  const ensureMonthChipVisible = useCallback((month, behavior = 'smooth') => {
    const viewport = monthsScrollRef.current;
    if (!viewport) return;

    const index = MONTH_OPTIONS.findIndex((option) => option.value === month);
    if (index < 0) return;
    const chip = viewport.querySelectorAll('.bitt-chip')[index];
    if (!chip) return;

    const chipRect = chip.getBoundingClientRect();
    const viewportRect = viewport.getBoundingClientRect();
    let nextLeft = viewport.scrollLeft;

    if (chipRect.left < viewportRect.left) {
      nextLeft += chipRect.left - viewportRect.left;
    } else if (chipRect.right > viewportRect.right) {
      nextLeft += chipRect.right - viewportRect.right;
    } else {
      return;
    }

    const maxLeft = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    nextLeft = Math.max(0, Math.min(maxLeft, nextLeft));
    if (Math.abs(nextLeft - viewport.scrollLeft) < 1) return;

    viewport.scrollTo({ left: nextLeft, behavior });
  }, []);

  const selectObservedMonth = useCallback((month) => {
    if (!month || manualSelectionLockRef.current) return;
    setSelectedMonth((current) => current === month ? current : month);
    ensureMonthChipVisible(month, prefersReducedMotion() ? 'auto' : 'smooth');
  }, [ensureMonthChipVisible]);

  const unlockManualSelection = useCallback(() => {
    if (!manualSelectionLockRef.current) return;
    manualSelectionLockRef.current = false;
    window.requestAnimationFrame(() => resolveActiveMonthRef.current?.());
  }, []);

  const handleMonthSelect = useCallback((month) => {
    const scrollArea = scrollAreaRef.current;
    const sticky = stickyRef.current;
    const targetGroupId = FIRST_GROUP_BY_MONTH.get(month);
    const target = targetGroupId ? sectionRefs.current.get(targetGroupId) : null;

    if (!scrollArea || !sticky || !target) return;

    manualSelectionLockRef.current = true;
    setSelectedMonth(month);
    ensureMonthChipVisible(month, prefersReducedMotion() ? 'auto' : 'smooth');

    const root = getVerticalScrollRoot(scrollArea);
    const { current, max } = getScrollMetrics(root);
    const activationLine = sticky.getBoundingClientRect().bottom;
    const targetTop = target.getBoundingClientRect().top;
    const desired = Math.max(0, Math.min(max, current + (targetTop - activationLine)));
    if (Math.abs(desired - current) <= 1) return;

    scrollRootTo(root, desired, prefersReducedMotion() ? 'auto' : 'smooth');
  }, [ensureMonthChipVisible]);

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    const sticky = stickyRef.current;
    if (!scrollArea || !sticky || !HISTORY_GROUPS.length || typeof IntersectionObserver !== 'function') return undefined;

    let observer = null;
    let resizeTimer = 0;

    const setupObserver = () => {
      observer?.disconnect();

      const root = getVerticalScrollRoot(scrollArea);
      const rootRect = root?.getBoundingClientRect();
      const rootTop = rootRect?.top ?? 0;
      const activationLine = sticky.getBoundingClientRect().bottom;
      const activationOffset = Math.max(0, Math.round(activationLine - rootTop));

      const resolveActiveMonth = () => {
        if (manualSelectionLockRef.current) return;

        if (isAtAbsoluteEnd(root)) {
          selectObservedMonth(LAST_CONTENT_MONTH);
          return;
        }

        const line = sticky.getBoundingClientRect().bottom + 0.5;
        let nextMonth = HISTORY_GROUPS[0]?.month || null;

        for (const group of HISTORY_GROUPS) {
          const anchor = anchorRefs.current.get(group.id);
          if (!anchor) continue;
          if (anchor.getBoundingClientRect().top <= line) nextMonth = group.month;
          else break;
        }

        selectObservedMonth(nextMonth);
      };

      resolveActiveMonthRef.current = resolveActiveMonth;

      observer = new IntersectionObserver(resolveActiveMonth, {
        root,
        rootMargin: `-${activationOffset}px 0px 0px 0px`,
        threshold: 0,
      });

      HISTORY_GROUPS.forEach((group) => {
        const anchor = anchorRefs.current.get(group.id);
        if (anchor) observer.observe(anchor);
      });
      if (endSentinelRef.current) observer.observe(endSentinelRef.current);

      resolveActiveMonth();
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(setupObserver, 80);
    };

    const onPointerDown = (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      gestureRef.current = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
      };
    };

    const onPointerMove = (event) => {
      const gesture = gestureRef.current;
      if (!gesture || gesture.pointerId !== event.pointerId || !manualSelectionLockRef.current) return;

      const dx = event.clientX - gesture.x;
      const dy = event.clientY - gesture.y;
      if (Math.abs(dy) < USER_SCROLL_GESTURE_THRESHOLD || Math.abs(dy) <= Math.abs(dx)) return;

      gestureRef.current = null;
      unlockManualSelection();
    };

    const clearGesture = () => {
      gestureRef.current = null;
    };

    const onWheel = (event) => {
      if (!manualSelectionLockRef.current) return;
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX) || Math.abs(event.deltaY) < 1) return;
      unlockManualSelection();
    };

    const verticalRoot = getVerticalScrollRoot(scrollArea);
    const verticalScrollTarget = verticalRoot || window;
    const onVerticalScroll = () => {
      if (manualSelectionLockRef.current) return;
      if (isAtAbsoluteEnd(verticalRoot)) selectObservedMonth(LAST_CONTENT_MONTH);
    };

    setupObserver();
    window.addEventListener('resize', onResize, { passive: true });
    verticalScrollTarget.addEventListener('scroll', onVerticalScroll, { passive: true });
    scrollArea.addEventListener('pointerdown', onPointerDown, { passive: true });
    scrollArea.addEventListener('pointermove', onPointerMove, { passive: true });
    scrollArea.addEventListener('pointerup', clearGesture, { passive: true });
    scrollArea.addEventListener('pointercancel', clearGesture, { passive: true });
    scrollArea.addEventListener('wheel', onWheel, { passive: true });

    return () => {
      observer?.disconnect();
      resolveActiveMonthRef.current = null;
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      verticalScrollTarget.removeEventListener('scroll', onVerticalScroll);
      scrollArea.removeEventListener('pointerdown', onPointerDown);
      scrollArea.removeEventListener('pointermove', onPointerMove);
      scrollArea.removeEventListener('pointerup', clearGesture);
      scrollArea.removeEventListener('pointercancel', clearGesture);
      scrollArea.removeEventListener('wheel', onWheel);
    };
  }, [selectObservedMonth, unlockManualSelection]);

  return (
    <div ref={scrollAreaRef} className="scroll-area history-scroll-area" data-figma-node="6295:26387">
      {MONTH_OPTIONS.length > 0 && (
        <div ref={stickyRef} className="history-months-fixed">
          <div className="history-months-backdrop" data-figma-node="7122:119761" aria-hidden="true" />
          <div ref={monthsScrollRef} className="history-months-scroll">
            <SingleSelectChipGroup
              className="history-months"
              options={MONTH_OPTIONS}
              selected={selectedMonth}
              onChange={handleMonthSelect}
            />
          </div>
        </div>
      )}

      <div className="history-screen-content">
        {MONTH_OPTIONS.length > 0 && <div className="history-months-spacer" aria-hidden="true" />}

        <div className="history-groups">
          {HISTORY_GROUPS.map((group) => (
            <HistoryGroup
              key={group.id}
              group={group}
              registerSection={registerSection}
              registerAnchor={registerAnchor}
              onOpenOperation={onOpenOperation}
            />
          ))}
        </div>

        <span ref={endSentinelRef} className="history-end-sentinel" aria-hidden="true" />
        <p className="history-retention">Храним историю платежей до 12 месяцев</p>
      </div>
    </div>
  );
}
