import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  AppTabBar,
  Button,
  Card,
  CheckboxLabel,
  ContextMenu,
} from '../../components/ui';
import { EXTRA_DEVICE_PRICE } from '../../config/pricing';
import DeviceDeleteSheet, { pluralizeDevice } from './DeviceDeleteSheet';
import { syncTelegramChrome } from '../../telegram';
import moreIcon from '../../assets/icons/nav/icn_m_more.svg';
import appleIcon from '../../assets/icons/device-apple.svg';
import androidIcon from '../../assets/icons/device-android.svg';
import windowsIcon from '../../assets/icons/device-windows.svg';
import linuxIcon from '../../assets/icons/device-linux.svg';
import warningIcon from '../../assets/icons/circle-warning-filled.svg';
import warningSmallIcon from '../../assets/icons/circle-warning-16.svg';
import crossIcon from '../../assets/icons/cross-24.svg';

const LONG_PRESS_MS = 420;
const LONG_PRESS_MOVE_TOLERANCE = 10;
const DELETE_PROTOTYPE_DELAY_MS = 650;
const DELETE_PENDING_MIN_MS = 650;
const CONTEXT_MENU_WIDTH = 200;
const CONTEXT_MENU_HEIGHT = 217;
const CONTEXT_MENU_GAP = 8;
const CONTEXT_MENU_EDGE = 20;
const DELETED_DEVICE_IDS_STORAGE_KEY = 'bittvpn:deleted-device-ids:v1';
const DEVICE_COUNTS_STORAGE_KEY = 'bittvpn:device-counts:v1';
const DISMISSED_LIMIT_NOTICES_STORAGE_KEY = 'bittvpn:dismissed-limit-notices:v1';
const LIMIT_NOTICE_CLOSE_OFFSET_Y = -12;
const LIMIT_NOTICE_CLOSE_SCALE = 0.97;
const LIMIT_NOTICE_VISUAL_DURATION_S = 0.3;
const LIMIT_NOTICE_COLLAPSE_DURATION_S = 0.36;
const SOFT_EXIT_EASE = [0.22, 1, 0.36, 1];
const DEVICE_CARD_EXIT_OFFSET_Y = -16;
const DEVICE_CARD_EXIT_SCALE = 0.96;
const DEVICE_CARD_MOTION_DURATION_S = 0.32;

const PLATFORM_ICONS = Object.freeze({
  apple: appleIcon,
  android: androidIcon,
  windows: windowsIcon,
  linux: linuxIcon,
});

const DEVICE_TEMPLATES = Object.freeze([
  { platform: 'apple', name: 'iPhone', activity: 'Активен сейчас' },
  { platform: 'android', name: 'SamsungS23', activity: 'Сегодня в 9:17' },
  { platform: 'windows', name: 'DmitryPC', activity: 'Сегодня в 2:05' },
  { platform: 'linux', name: 'AlexNeighborhood', activity: '12.05.25 в 12:05' },
  { platform: 'windows', name: 'Dmitry', activity: '11.05.25 в 12:01' },
  { platform: 'linux', name: 'AlexNeigh', activity: '10.05.25 в 11:56' },
]);

const CONTEXT_MENU_ITEMS = Object.freeze([
  { id: 'download', label: 'Скачать' },
  { id: 'instruction', label: 'Инструкция' },
  { id: 'delete', label: 'Удалить', danger: true },
  { id: 'select', label: 'Выделить', separatorBefore: true },
]);

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function buildDeviceTemplates(location, usedCount = location.deviceUsed) {
  const used = Math.max(0, Number(usedCount) || 0);
  return DEVICE_TEMPLATES
    .slice(0, Math.min(used, DEVICE_TEMPLATES.length))
    .map((device, index) => ({
      ...device,
      id: `${device.platform}:${device.name}:${index}`,
      suffix: location.code,
    }));
}

function readDeletedDeviceMap() {
  if (typeof window === 'undefined') return {};

  try {
    // Deleted identities are session-only too. Remove the previous persistent
    // prototype cache so a fresh Mini App launch restores fixture devices.
    try {
      window.localStorage.removeItem(DELETED_DEVICE_IDS_STORAGE_KEY);
    } catch {
      // Ignore hardened/private WebViews where localStorage is unavailable.
    }

    const raw = window.sessionStorage.getItem(DELETED_DEVICE_IDS_STORAGE_KEY) ?? '{}';
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function persistDeletedDeviceIds(locationId, deletedIds) {
  if (typeof window === 'undefined') return;

  const next = {
    ...readDeletedDeviceMap(),
    [locationId]: [...deletedIds],
  };

  try {
    window.sessionStorage.setItem(DELETED_DEVICE_IDS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // React state remains valid for the current render session.
  }
}


function readDismissedLimitNoticeIds() {
  if (typeof window === 'undefined') return new Set();

  try {
    const raw = window.sessionStorage.getItem(DISMISSED_LIMIT_NOTICES_STORAGE_KEY) ?? '[]';
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : []);
  } catch {
    return new Set();
  }
}

function isLimitNoticeDismissed(locationId) {
  return readDismissedLimitNoticeIds().has(locationId);
}

function persistLimitNoticeDismissed(locationId) {
  if (typeof window === 'undefined') return;

  const dismissed = readDismissedLimitNoticeIds();
  dismissed.add(locationId);

  try {
    window.sessionStorage.setItem(
      DISMISSED_LIMIT_NOTICES_STORAGE_KEY,
      JSON.stringify([...dismissed]),
    );
  } catch {
    // The current React state still hides the notice for this render session.
  }
}

function persistDeviceCountDirect(locationId, nextCount) {
  if (typeof window === 'undefined') return;

  const normalizedCount = Math.max(0, Math.floor(Number(nextCount) || 0));

  try {
    const raw = window.sessionStorage.getItem(DEVICE_COUNTS_STORAGE_KEY) ?? '{}';
    const current = JSON.parse(raw);
    const next = {
      ...(current && typeof current === 'object' ? current : {}),
      [locationId]: normalizedCount,
    };

    window.sessionStorage.setItem(DEVICE_COUNTS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Parent React state still receives the same value below.
  }
}

function readDeletedDeviceIds(location, deviceCount) {
  const baseDevices = buildDeviceTemplates(location, location.deviceUsed);
  const validIds = new Set(baseDevices.map((device) => device.id));
  const stored = readDeletedDeviceMap()[location.id];

  if (Array.isArray(stored)) {
    return new Set(stored.filter((id) => validIds.has(id)));
  }

  // Migration path from the previous count-only implementation. If the user
  // already removed devices before this patch, preserve that count instead of
  // resurrecting the original list on re-entry. Exact identities become
  // stable after the first delete performed with this version.
  const normalizedCount = Math.max(0, Math.floor(Number(deviceCount) || 0));
  const visibleCount = Math.min(normalizedCount, baseDevices.length);
  return new Set(baseDevices.slice(visibleCount).map((device) => device.id));
}

function DeviceCount({ used, limit, warning, warningTone = 'warning' }) {
  const warningAtCapacity = warning && warningTone === 'warning';

  return (
    <Button
      size="xsmall"
      type="outlined"
      form="circle"
      color={warningAtCapacity ? 'warning' : 'none'}
      className={`country-device-count${warning && !warningAtCapacity ? ' country-device-count--expiry' : ''}`}
      tabIndex={-1}
      ariaLabel={`Использовано ${used} из ${limit} устройств`}
    >
      <span className="country-device-count__text">{`${used}/${limit}`}</span>
      {warning && (
        <img
          className={`country-device-count__warning${warningAtCapacity ? '' : ' country-device-count__warning--primary'}`}
          src={warningSmallIcon}
          alt=""
          aria-hidden="true"
        />
      )}
    </Button>
  );
}

function DeviceCard({
  device,
  selected,
  selectionMode,
  contextOpen,
  contextShiftY = 0,
  onToggle,
  onLongPress,
  onOpenContextMenu,
}) {
  const timerRef = useRef(0);
  const pointerRef = useRef(null);
  const longPressedRef = useRef(false);

  const clearLongPress = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = 0;
    }
    pointerRef.current = null;
  }, []);

  useEffect(() => clearLongPress, [clearLongPress]);

  const handlePointerDown = (event) => {
    if (selectionMode || event.button > 0) return;

    pointerRef.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
    longPressedRef.current = false;

    timerRef.current = window.setTimeout(() => {
      timerRef.current = 0;
      longPressedRef.current = true;
      onLongPress(device.id);
    }, LONG_PRESS_MS);
  };

  const handlePointerMove = (event) => {
    const pointer = pointerRef.current;
    if (!pointer || pointer.id !== event.pointerId) return;

    const dx = event.clientX - pointer.x;
    const dy = event.clientY - pointer.y;
    if (Math.hypot(dx, dy) > LONG_PRESS_MOVE_TOLERANCE) clearLongPress();
  };

  const handlePointerEnd = () => {
    clearLongPress();
  };

  const handleCardClick = () => {
    if (longPressedRef.current) {
      longPressedRef.current = false;
      return;
    }
    if (selectionMode) onToggle(device.id);
  };

  return (
    <Card
      className={`country-device-card country-device-card--interactive${contextOpen ? ' country-device-card--context-open' : ''}`}
      onClick={handleCardClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onContextMenu={(event) => event.preventDefault()}
      data-device-id={device.id}
      style={contextOpen ? { '--context-shift-y': `${contextShiftY}px` } : undefined}
    >
      <div className="country-device-card__content">
        <div className="country-device-card__data">
          <span className="country-device-card__icon" aria-hidden="true">
            <img src={PLATFORM_ICONS[device.platform] || windowsIcon} alt="" />
          </span>
          <span className="country-device-card__copy">
            <b>{`${device.name}_${device.suffix}`}</b>
            <small>{device.activity}</small>
          </span>
        </div>

        {selectionMode ? (
          <span
            className="country-device-card__selection"
            onClick={(event) => event.stopPropagation()}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <CheckboxLabel
              checked={selected}
              ariaLabel={`Выбрать ${device.name}_${device.suffix}`}
              onChange={() => onToggle(device.id)}
            />
          </span>
        ) : (
          <button
            type="button"
            className="country-device-card__more"
            aria-label={`Действия для ${device.name}_${device.suffix}`}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              onOpenContextMenu(device.id, event.currentTarget);
            }}
          >
            <img src={moreIcon} alt="" aria-hidden="true" />
          </button>
        )}
      </div>
    </Card>
  );
}

export default function PurchasedDevices({
  location,
  deviceCount,
  limited = false,
  onBottomActionOwnershipChange,
  onDeleteDevices,
  onDeviceCountChange,
  onAddDevice,
}) {
  const initialDevices = useMemo(
    () => buildDeviceTemplates(location, location.deviceUsed),
    [location.code, location.deviceUsed, location.id],
  );
  const [deletedIds, setDeletedIds] = useState(() => readDeletedDeviceIds(location, deviceCount));
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const [limitNoticeVisible, setLimitNoticeVisible] = useState(
    () => !isLimitNoticeDismissed(location.id),
  );
  const [contextState, setContextState] = useState(null);
  const [deleteFlow, setDeleteFlow] = useState(null);
  const reduceMotion = useReducedMotion();
  const mountedRef = useRef(true);
  const contextShiftFrameRef = useRef(0);

  const devices = useMemo(() => {
    const hiddenIds = new Set(deletedIds);

    // Treat success as the post-delete UI immediately. This protects the
    // underlying screen from briefly showing stale selected devices if React
    // commits the success phase before the deletedIds update.
    if (deleteFlow?.phase === 'success') {
      deleteFlow.ids?.forEach((id) => hiddenIds.add(id));
    }

    return initialDevices.filter((device) => !hiddenIds.has(device.id));
  }, [deleteFlow, deletedIds, initialDevices]);

  const used = devices.length;
  const limit = Math.max(1, Number(location.deviceLimit) || 5);
  const atCapacity = used >= limit;
  const hasLimitExpiryWarning = limited;
  const hasBelowCapacityExpiryWarning = hasLimitExpiryWarning && used < limit;
  const limitNoticeText = location.limitNotice || 'Завтра лимит уменьшится на 1';
  const selectedCount = selectedIds.size;
  const overlayOpen = Boolean(contextState || deleteFlow);
  // Success is already a post-delete state. Even if React has not committed
  // the selection flag reset yet, never keep the selection UI visible under
  // the success sheet. This is especially important when the last/all devices
  // were removed: the 0/5 empty state must be visible immediately.
  const showSelectionMode = selectionMode && deleteFlow?.phase !== 'success' && used > 0;
  const ownsBottomAction = showSelectionMode || overlayOpen;

  useEffect(() => {
    const restoredDeletedIds = readDeletedDeviceIds(location, deviceCount);
    setDeletedIds(restoredDeletedIds);
    setSelectedIds(new Set());
    setSelectionMode(false);
    setContextState(null);
    setDeleteFlow(null);
    setLimitNoticeVisible(!isLimitNoticeDismissed(location.id));
    persistDeletedDeviceIds(location.id, restoredDeletedIds);
    // A location change is the only time the prototype device identity model
    // should be rehydrated. Count changes inside the same location are derived
    // from deletedIds instead of rebuilding the default list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.id]);

  useEffect(() => {
    persistDeletedDeviceIds(location.id, deletedIds);
  }, [deletedIds, location.id]);

  useEffect(() => () => {
    mountedRef.current = false;
    if (contextShiftFrameRef.current) {
      window.cancelAnimationFrame(contextShiftFrameRef.current);
    }
  }, []);

  useLayoutEffect(() => {
    onBottomActionOwnershipChange?.(ownsBottomAction);
  }, [onBottomActionOwnershipChange, ownsBottomAction]);

  useEffect(() => () => {
    onBottomActionOwnershipChange?.(false);
  }, [onBottomActionOwnershipChange]);

  // Keep the App/session-level device count derived from the actual list on
  // screen. This avoids the country screen and the main location card drifting
  // apart after one or several deletes.
  useEffect(() => {
    // The device list is the source of truth. Persist its count here as well as
    // notifying App, so Main can recover the correct value even if a Telegram
    // WebView delays/drops a parent state callback during a BottomSheet phase.
    persistDeviceCountDirect(location.id, used);
    onDeviceCountChange?.(used);
  }, [location.id, onDeviceCountChange, used]);

  useEffect(() => {
    syncTelegramChrome(overlayOpen);
    return () => syncTelegramChrome(false);
  }, [overlayOpen]);

  useEffect(() => {
    if (!contextState) return undefined;

    const close = () => {
      if (contextShiftFrameRef.current) {
        window.cancelAnimationFrame(contextShiftFrameRef.current);
        contextShiftFrameRef.current = 0;
      }
      setContextState(null);
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') close();
    };

    window.addEventListener('resize', close);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', close);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [contextState]);

  const toggleSelected = useCallback((deviceId) => {
    setSelectedIds((previous) => {
      const next = new Set(previous);
      if (next.has(deviceId)) next.delete(deviceId);
      else next.add(deviceId);
      return next;
    });
  }, []);

  const enterSelectionMode = useCallback((deviceId) => {
    setContextState(null);
    setSelectionMode(true);
    setSelectedIds(new Set([deviceId]));
  }, []);

  const cancelSelectionMode = useCallback(() => {
    if (deleteFlow) return;
    setSelectionMode(false);
    setSelectedIds(new Set());
  }, [deleteFlow]);

  const openContextMenu = useCallback((deviceId, trigger) => {
    const card = trigger.closest('.country-device-card');
    const rect = card?.getBoundingClientRect();
    const shell = document.querySelector('.app-shell')?.getBoundingClientRect();

    if (!rect) return;

    if (contextShiftFrameRef.current) {
      window.cancelAnimationFrame(contextShiftFrameRef.current);
      contextShiftFrameRef.current = 0;
    }

    const visualViewport = window.visualViewport;
    const viewportTop = visualViewport?.offsetTop ?? 0;
    const viewportBottom = viewportTop + (visualViewport?.height ?? window.innerHeight);

    const shellLeft = shell?.left ?? 0;
    const shellRight = shell?.right ?? window.innerWidth;
    const shellTop = shell?.top ?? viewportTop;
    const shellBottom = shell?.bottom ?? viewportBottom;

    const usableTop = Math.max(viewportTop, shellTop) + CONTEXT_MENU_EDGE;
    const usableBottom = Math.min(viewportBottom, shellBottom) - CONTEXT_MENU_EDGE;

    const minLeft = shellLeft + CONTEXT_MENU_EDGE;
    const maxRight = shellRight - CONTEXT_MENU_EDGE;
    const left = Math.min(
      Math.max(rect.right - CONTEXT_MENU_WIDTH, minLeft),
      maxRight - CONTEXT_MENU_WIDTH,
    );

    // Current Figma keeps the menu 8px below the active Card. If that pair
    // would leave the visible viewport, lift BOTH Card and menu by the same
    // amount instead of flipping the menu above or clipping it.
    const baseTop = rect.bottom + CONTEXT_MENU_GAP;
    const overflowBottom = Math.max(
      0,
      baseTop + CONTEXT_MENU_HEIGHT - usableBottom,
    );
    const maxLift = Math.max(0, rect.top - usableTop);
    const targetShiftY = -Math.min(overflowBottom, maxLift);

    // First paint at the tapped Card's real location, then animate the shared
    // translate on the next frame. This makes the active Card and menu travel
    // upward together rather than teleporting.
    setContextState({
      deviceId,
      top: baseTop,
      left,
      shiftY: 0,
    });

    if (targetShiftY) {
      contextShiftFrameRef.current = window.requestAnimationFrame(() => {
        contextShiftFrameRef.current = window.requestAnimationFrame(() => {
          setContextState((current) => (
            current?.deviceId === deviceId
              ? { ...current, shiftY: targetShiftY }
              : current
          ));
          contextShiftFrameRef.current = 0;
        });
      });
    }
  }, []);

  const openDeleteConfirmation = useCallback((ids, source) => {
    const deviceIds = [...ids].filter((id) => devices.some((device) => device.id === id));
    if (!deviceIds.length) return;

    setContextState(null);
    setDeleteFlow({
      phase: 'confirm',
      source,
      ids: deviceIds,
    });
  }, [devices]);

  const closeConfirmation = useCallback(() => {
    if (!deleteFlow || deleteFlow.phase !== 'confirm') return;

    if (deleteFlow.source === 'context') {
      setSelectedIds(new Set());
    }
    setDeleteFlow(null);
  }, [deleteFlow]);

  const finishSuccess = useCallback(() => {
    setDeleteFlow(null);
    setSelectionMode(false);
    setSelectedIds(new Set());
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteFlow || deleteFlow.phase !== 'confirm') return;

    const operation = {
      ...deleteFlow,
      phase: 'pending',
    };
    setDeleteFlow(operation);

    try {
      const deleteRequest = onDeleteDevices
        ? onDeleteDevices(operation.ids)
        : Promise.resolve();

      // Keep the Figma pending BottomSheet visible long enough to be perceived,
      // even when a prototype/backend deletion resolves immediately.
      await Promise.all([
        deleteRequest,
        delay(onDeleteDevices ? DELETE_PENDING_MIN_MS : DELETE_PROTOTYPE_DELAY_MS),
      ]);

      if (!mountedRef.current) return;

      setDeletedIds((previous) => {
        const next = new Set(previous);
        operation.ids.forEach((id) => next.add(id));
        persistDeletedDeviceIds(location.id, next);
        return next;
      });

      // Persist the new count immediately as well as through the derived-list
      // effect above. This keeps Main/persisted storage in sync even if the user
      // navigates away while the success sheet is still open.
      const nextUsed = Math.max(0, used - operation.ids.length);
      persistDeviceCountDirect(location.id, nextUsed);
      onDeviceCountChange?.(nextUsed);

      // Success is already the post-delete state. Drop selection immediately
      // so deleting the last device (or all selected devices) reveals the
      // Figma 0/5 empty state underneath the success BottomSheet, not only
      // after the sheet is closed.
      setSelectionMode(false);
      setSelectedIds(new Set());
      setDeleteFlow({ ...operation, phase: 'success' });
    } catch (error) {
      console.warn('Device delete warning:', error);
      if (mountedRef.current) {
        setDeleteFlow({ ...operation, phase: 'confirm' });
      }
    }
  }, [deleteFlow, location.id, onDeleteDevices, onDeviceCountChange, used]);

  const handleContextMenuAction = useCallback((item) => {
    const deviceId = contextState?.deviceId;
    if (!deviceId) return;

    if (item.id === 'delete') {
      setSelectedIds(new Set([deviceId]));
      openDeleteConfirmation([deviceId], 'context');
      return;
    }

    if (item.id === 'select') {
      enterSelectionMode(deviceId);
      return;
    }

    // Download / instruction are outside this prototype task. Preserve the
    // existing menu action semantics by simply dismissing the menu.
    setContextState(null);
  }, [contextState, enterSelectionMode, openDeleteConfirmation]);

  const selectionHeading = `/выбрано ${selectedCount} ${pluralizeDevice(selectedCount)}`;
  const deleteLabel = `Удалить ${selectedCount} ${pluralizeDevice(selectedCount)}`;

  return (
    <>
      <section className={`country-devices-section${showSelectionMode ? ' country-devices-section--selection' : ''}`}>
        <div className="country-section-bar">
          {showSelectionMode ? (
            <>
              <h2>{selectionHeading}</h2>
              <Button
                size="xsmall"
                type="secondary"
                form="circle"
                color="surface"
                label="Отмена"
                onClick={cancelSelectionMode}
              />
            </>
          ) : (
            <>
              <h2>/мои устройства</h2>
              <DeviceCount
                used={used}
                limit={limit}
                warning={hasLimitExpiryWarning}
                warningTone={hasBelowCapacityExpiryWarning ? 'primary' : 'warning'}
              />
            </>
          )}
        </div>

        <AnimatePresence initial={false}>
          {hasLimitExpiryWarning && limitNoticeVisible && !showSelectionMode && (
            <motion.div
              key={`limit-notice-${location.id}`}
              className="country-limit-notice-motion"
              initial={false}
              animate={{ opacity: 1, y: 0, scale: 1, height: 'auto', marginBottom: 0 }}
              exit={{
                opacity: 0,
                y: LIMIT_NOTICE_CLOSE_OFFSET_Y,
                scale: LIMIT_NOTICE_CLOSE_SCALE,
                height: 0,
                marginBottom: -12,
              }}
              transition={reduceMotion
                ? { duration: 0 }
                : {
                    opacity: { duration: LIMIT_NOTICE_VISUAL_DURATION_S, ease: SOFT_EXIT_EASE },
                    y: { duration: LIMIT_NOTICE_VISUAL_DURATION_S, ease: SOFT_EXIT_EASE },
                    scale: { duration: LIMIT_NOTICE_VISUAL_DURATION_S, ease: SOFT_EXIT_EASE },
                    height: { duration: LIMIT_NOTICE_COLLAPSE_DURATION_S, ease: SOFT_EXIT_EASE },
                    marginBottom: { duration: LIMIT_NOTICE_COLLAPSE_DURATION_S, ease: SOFT_EXIT_EASE },
                  }}
              style={{ transformOrigin: 'center top' }}
            >
              <Card
                className={`country-limit-notice${hasBelowCapacityExpiryWarning ? ' country-limit-notice--expiry' : ''}`}
              >
                <div className="country-limit-notice__data">
                  <img src={warningIcon} alt="" aria-hidden="true" />
                  <span>{limitNoticeText}</span>
                </div>
                <button
                  type="button"
                  className="country-limit-notice__close"
                  aria-label="Скрыть предупреждение"
                  onClick={() => {
                    persistLimitNoticeDismissed(location.id);
                    setLimitNoticeVisible(false);
                  }}
                >
                  <img src={crossIcon} alt="" aria-hidden="true" />
                </button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {atCapacity && !showSelectionMode && (
          <Button
            size="large"
            type="secondary"
            form="circle"
            color="surface"
            fullWidth
            className="country-limit-upgrade"
          >
            <span className="country-limit-upgrade__copy">
              <span>Увеличить лимит</span>
              <small>{`+1 устройство за ${EXTRA_DEVICE_PRICE} ₽/мес.`}</small>
            </span>
          </Button>
        )}

        {used === 0 && !showSelectionMode && (
          <Button
            size="large"
            type="secondary"
            form="circle"
            color="surface"
            fullWidth
            label="Добавить устройство"
            onClick={onAddDevice}
          />
        )}

        <div className="country-device-list">
          <AnimatePresence initial={false} mode="popLayout">
            {devices.map((device) => (
              <motion.div
                key={device.id}
                layout="position"
                className="country-device-card-motion"
                initial={false}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{
                  opacity: 0,
                  y: DEVICE_CARD_EXIT_OFFSET_Y,
                  scale: DEVICE_CARD_EXIT_SCALE,
                }}
                transition={reduceMotion
                  ? { duration: 0 }
                  : {
                      layout: { duration: DEVICE_CARD_MOTION_DURATION_S, ease: SOFT_EXIT_EASE },
                      opacity: { duration: 0.26, ease: SOFT_EXIT_EASE },
                      y: { duration: DEVICE_CARD_MOTION_DURATION_S, ease: SOFT_EXIT_EASE },
                      scale: { duration: DEVICE_CARD_MOTION_DURATION_S, ease: SOFT_EXIT_EASE },
                    }}
                style={{ transformOrigin: 'center top' }}
              >
                <DeviceCard
                  device={device}
                  selected={selectedIds.has(device.id)}
                  selectionMode={showSelectionMode}
                  contextOpen={contextState?.deviceId === device.id}
                  contextShiftY={contextState?.deviceId === device.id ? contextState.shiftY : 0}
                  onToggle={toggleSelected}
                  onLongPress={enterSelectionMode}
                  onOpenContextMenu={openContextMenu}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {contextState && (
        <>
          <button
            type="button"
            className="country-device-context-overlay"
            aria-label="Закрыть контекстное меню"
            onClick={() => setContextState(null)}
          />
          <ContextMenu
            className="country-device-context-menu"
            items={CONTEXT_MENU_ITEMS}
            onSelect={handleContextMenuAction}
            ariaLabel="Действия с устройством"
            style={{
              top: contextState.top,
              left: contextState.left,
              '--context-shift-y': `${contextState.shiftY || 0}px`,
            }}
          />
        </>
      )}

      <DeviceDeleteSheet
        open={Boolean(deleteFlow)}
        phase={deleteFlow?.phase || 'confirm'}
        count={deleteFlow?.ids?.length || selectedCount || 1}
        onConfirm={confirmDelete}
        onCancel={closeConfirmation}
        onClose={finishSuccess}
      />

      {ownsBottomAction && (
        showSelectionMode ? (
          <AppTabBar type="action" showSubtle={false}>
            <Button
              size="large"
              type="primary"
              form="circle"
              color="danger"
              fullWidth
              className="country-delete-tabbar__button"
              label={deleteLabel}
              disabled={selectedCount === 0}
              onClick={() => openDeleteConfirmation(selectedIds, 'selection')}
            />
          </AppTabBar>
        ) : null
      )}
    </>
  );
}

export {
  CONTEXT_MENU_ITEMS,
  DELETE_PROTOTYPE_DELAY_MS,
  LONG_PRESS_MS,
};
