import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AppShell, AppToast } from './components/layout';
import { Block, Card, Skeleton } from './components/ui';
import MainScreen from './screens/MainScreen';
import LocationsScreen, { LOCATIONS_FIGMA_NODES, LOCATIONS_TABS } from './screens/LocationsScreen';
import CountryScreen, { getCountryScreenFigmaNode } from './screens/CountryScreen';
import CountrySpecificationsScreen from './screens/CountrySpecificationsScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import PaymentSimulationScreen, { PAYMENT_SIMULATION_FIGMA_NODE } from './screens/PaymentSimulationScreen';
import ProfileScreen from './screens/ProfileScreen';
import ReferralScreen from './screens/ReferralScreen';
import HistoryScreen from './screens/HistoryScreen';
import HistoryDetailScreen, { HISTORY_DETAIL_FIGMA_NODES } from './screens/HistoryDetailScreen';
import {
  DEFAULT_LOCATION,
  getLocation,
  LOCATIONS,
  PURCHASED_LOCATION_IDS,
} from './config/locations';
import { getTelegramWebApp, isTelegramMiniApp, markTelegramReady } from './telegram';
import { waitForAppFonts } from './utils/appReadiness';

const SCREEN = Object.freeze({
  MAIN: 'main',
  LOCATIONS: 'locations',
  COUNTRY: 'country',
  COUNTRY_SPECIFICATIONS: 'country-specifications',
  CHECKOUT: 'checkout',
  PAYMENT_SIMULATION: 'payment-simulation',
  PROFILE: 'profile',
  REFERRAL: 'referral',
  HISTORY: 'history',
  HISTORY_DETAIL: 'history-detail',
});

const FIGMA_NODE = Object.freeze({
  [SCREEN.MAIN]: '6429:29217',
  [SCREEN.LOCATIONS]: LOCATIONS_FIGMA_NODES[LOCATIONS_TABS.PURCHASED],
  [SCREEN.COUNTRY]: '6643:24352',
  [SCREEN.COUNTRY_SPECIFICATIONS]: '7172:124235',
  [SCREEN.CHECKOUT]: '6606:23733',
  [SCREEN.PAYMENT_SIMULATION]: PAYMENT_SIMULATION_FIGMA_NODE,
  [SCREEN.PROFILE]: '7015:114849',
  [SCREEN.REFERRAL]: '6995:114597',
  [SCREEN.HISTORY]: '6295:26387',
});

const TOAST_LIFETIME_MS = 5000;
const TOAST_EXIT_PRESENCE_MS = 220;
const DEVICE_COUNTS_STORAGE_KEY = 'bittvpn:device-counts:v1';
const DELETED_DEVICE_IDS_STORAGE_KEY = 'bittvpn:deleted-device-ids:v1';
const PAYMENT_SUCCESS_DELAY_MS = 3000;
let deviceSessionBootstrapped = false;

function getDefaultDeviceCounts() {
  return PURCHASED_LOCATION_IDS.reduce((result, locationId) => {
    const used = Number(LOCATIONS[locationId]?.deviceUsed);
    result[locationId] = Number.isFinite(used) ? Math.max(0, Math.floor(used)) : 0;
    return result;
  }, {});
}

function readStoredDeviceCounts() {
  const defaults = getDefaultDeviceCounts();
  if (typeof window === 'undefined') return defaults;

  try {
    const raw = window.sessionStorage.getItem(DEVICE_COUNTS_STORAGE_KEY) ?? '{}';
    const saved = JSON.parse(raw);
    return Object.keys(defaults).reduce((result, locationId) => {
      const value = Number(saved?.[locationId]);
      result[locationId] = Number.isFinite(value)
        ? Math.max(0, Math.floor(value))
        : defaults[locationId];
      return result;
    }, {});
  } catch {
    return defaults;
  }
}

function bootstrapDeviceSession() {
  const defaults = getDefaultDeviceCounts();
  if (typeof window === 'undefined') return defaults;

  // A page runtime is one prototype session. Telegram Desktop can reuse the
  // same WebView storage between Mini App launches, so sessionStorage alone is
  // not a reliable "app closed" boundary. Clear the prototype device snapshot
  // exactly once per document load and start from the fixture values.
  if (!deviceSessionBootstrapped) {
    deviceSessionBootstrapped = true;

    try {
      window.sessionStorage.removeItem(DEVICE_COUNTS_STORAGE_KEY);
      window.sessionStorage.removeItem(DELETED_DEVICE_IDS_STORAGE_KEY);
    } catch {
      // Keep the in-memory defaults if storage is unavailable.
    }

    try {
      window.localStorage.removeItem(DEVICE_COUNTS_STORAGE_KEY);
      window.localStorage.removeItem(DELETED_DEVICE_IDS_STORAGE_KEY);
    } catch {
      // Ignore hardened/private WebViews where localStorage is unavailable.
    }

    persistDeviceCounts(defaults);
    return defaults;
  }

  return readStoredDeviceCounts();
}

function persistDeviceCounts(counts) {
  if (typeof window === 'undefined') return;

  try {
    window.sessionStorage.setItem(DEVICE_COUNTS_STORAGE_KEY, JSON.stringify(counts));
  } catch {
    // Keep the in-memory React state even if browser storage is unavailable.
  }
}

function scrollToTop() {
  window.setTimeout(() => window.scrollTo(0, 0), 0);
}

function AppLoadingScreen() {
  return (
    <>
      <div className="scroll-area app-loading-scroll-area" aria-busy="true" aria-label="Загрузка интерфейса">
        <div className="app-loading-content">
          <div className="app-loading-logo">
            <Skeleton type="font" width={126} lineHeight={48} />
          </div>

          <Block state="loading" className="app-loading-promo" />

          <section className="app-loading-section">
            <div className="app-loading-section-bar">
              <Skeleton type="font" width={118} lineHeight={20} />
              <Skeleton type="control" width={45} height={24} radius={999} />
            </div>
            <div className="app-loading-stack">
              <Card state="loading" className="app-loading-card app-loading-card--68" />
              <Card state="loading" className="app-loading-card app-loading-card--68" />
              <Card state="loading" className="app-loading-card app-loading-card--68" />
            </div>
          </section>

          <section className="app-loading-section">
            <div className="app-loading-section-bar">
              <Skeleton type="font" width={156} lineHeight={20} />
            </div>
            <div className="app-loading-stack">
              <Card state="loading" className="app-loading-card app-loading-card--100" />
              <Card state="loading" className="app-loading-card app-loading-card--100" />
              <Card state="loading" className="app-loading-card app-loading-card--100" />
            </div>
          </section>

          <Block state="loading" className="app-loading-referral" />
        </div>
      </div>

      <div className="app-loading-navigator" aria-hidden="true">
        <Skeleton type="control" width={300} height={56} radius={999} />
      </div>
    </>
  );
}

export default function App() {
  const [appReady, setAppReady] = useState(
    () => typeof document === 'undefined'
  );
  const [screenStack, setScreenStack] = useState([SCREEN.MAIN]);
  const [selectedMonths, setSelectedMonths] = useState(1);
  const [locationsTab, setLocationsTab] = useState(LOCATIONS_TABS.PURCHASED);
  const [selectedLocationId, setSelectedLocationId] = useState(DEFAULT_LOCATION.id);
  const [deviceCounts, setDeviceCounts] = useState(bootstrapDeviceSession);
  const [selectedHistoryOperation, setSelectedHistoryOperation] = useState(null);
  const [paymentDraft, setPaymentDraft] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [activeToastIds, setActiveToastIds] = useState(() => new Set());
  const toastSequenceRef = useRef(0);
  const toastLifetimeRef = useRef(new Map());
  const toastPresenceTimerRef = useRef(new Map());
  const nativeBackVisibleRef = useRef(null);

  const screen = screenStack[screenStack.length - 1] || SCREEN.MAIN;
  const selectedLocation = useMemo(() => getLocation(selectedLocationId), [selectedLocationId]);
  const selectedDeviceCount = deviceCounts[selectedLocationId] ?? selectedLocation.deviceUsed ?? 0;
  const figmaNode = screen === SCREEN.HISTORY_DETAIL
    ? HISTORY_DETAIL_FIGMA_NODES[selectedHistoryOperation?.detailState || 'loading']
    : screen === SCREEN.COUNTRY
      ? getCountryScreenFigmaNode(selectedLocation, selectedDeviceCount) || FIGMA_NODE[SCREEN.COUNTRY]
      : screen === SCREEN.LOCATIONS
        ? LOCATIONS_FIGMA_NODES[locationsTab] || FIGMA_NODE[SCREEN.LOCATIONS]
        : FIGMA_NODE[screen];

  const updateDeviceCount = useCallback((locationId, nextCount) => {
    const normalizedCount = Math.max(0, Math.floor(Number(nextCount) || 0));

    setDeviceCounts((current) => {
      if (current[locationId] === normalizedCount) return current;

      const next = {
        ...current,
        [locationId]: normalizedCount,
      };

      persistDeviceCounts(next);
      return next;
    });
  }, []);

  const removeActiveToastId = useCallback((id) => {
    setActiveToastIds((current) => {
      if (!current.has(id)) return current;
      const next = new Set(current);
      next.delete(id);
      return next;
    });
  }, []);

  const removeToast = useCallback((id, presenceDelay = TOAST_EXIT_PRESENCE_MS) => {
    const lifetime = toastLifetimeRef.current.get(id);
    if (lifetime?.timer) window.clearTimeout(lifetime.timer);
    toastLifetimeRef.current.delete(id);

    const oldPresenceTimer = toastPresenceTimerRef.current.get(id);
    if (oldPresenceTimer) window.clearTimeout(oldPresenceTimer);
    toastPresenceTimerRef.current.delete(id);

    setToasts((current) => current.filter((toast) => toast.id !== id));

    if (presenceDelay <= 0) {
      removeActiveToastId(id);
      return;
    }

    const presenceTimer = window.setTimeout(() => {
      toastPresenceTimerRef.current.delete(id);
      removeActiveToastId(id);
    }, presenceDelay);
    toastPresenceTimerRef.current.set(id, presenceTimer);
  }, [removeActiveToastId]);

  const scheduleToastLifetime = useCallback((id, duration) => {
    const oldLifetime = toastLifetimeRef.current.get(id);
    if (oldLifetime?.timer) window.clearTimeout(oldLifetime.timer);

    const safeDuration = Math.max(0, duration);
    const deadline = Date.now() + safeDuration;
    const timer = window.setTimeout(() => {
      removeToast(id, TOAST_EXIT_PRESENCE_MS);
    }, safeDuration);

    toastLifetimeRef.current.set(id, {
      timer,
      deadline,
      remaining: safeDuration,
    });
  }, [removeToast]);

  const notify = useCallback((message) => {
    if (!message) return null;

    const id = `toast-${Date.now()}-${++toastSequenceRef.current}`;
    setToasts((current) => [...current, { id, message }]);
    setActiveToastIds((current) => {
      const next = new Set(current);
      next.add(id);
      return next;
    });
    scheduleToastLifetime(id, TOAST_LIFETIME_MS);
    return id;
  }, [scheduleToastLifetime]);

  const dismissToast = useCallback((id, reason = 'swipe') => {
    removeToast(id, reason === 'swipe' ? 0 : TOAST_EXIT_PRESENCE_MS);
  }, [removeToast]);

  const handleToastInteractionChange = useCallback((id, active) => {
    const lifetime = toastLifetimeRef.current.get(id);
    if (!lifetime) return;

    if (active) {
      if (lifetime.timer) window.clearTimeout(lifetime.timer);
      toastLifetimeRef.current.set(id, {
        timer: null,
        deadline: 0,
        remaining: Math.max(0, lifetime.deadline - Date.now()),
      });
      return;
    }

    scheduleToastLifetime(id, lifetime.remaining);
  }, [scheduleToastLifetime]);

  useEffect(() => () => {
    toastLifetimeRef.current.forEach(({ timer }) => {
      if (timer) window.clearTimeout(timer);
    });
    toastPresenceTimerRef.current.forEach((timer) => window.clearTimeout(timer));
    toastLifetimeRef.current.clear();
    toastPresenceTimerRef.current.clear();
  }, []);

  useEffect(() => {
    if (appReady) return undefined;

    let cancelled = false;
    waitForAppFonts()
      .catch(() => {
        // Font readiness is bounded/fail-open. Mobile WebViews must never
        // remain in the global skeleton because of a stalled font API.
      })
      .finally(() => {
        if (!cancelled) setAppReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [appReady]);

  useEffect(() => {
    markTelegramReady();
  }, []);

  // Establish the current session snapshot once. Subsequent writes happen in
  // updateDeviceCount; closing the Mini App drops this sessionStorage state.
  useEffect(() => {
    persistDeviceCounts(deviceCounts);
    // Initial session snapshot only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Purchased-location root screens are re-mounted after returning from Country.
  // Re-read storage there as a safety net so their counters cannot drift from
  // the device list even if a WebView delayed the parent callback.
  useEffect(() => {
    if (screen !== SCREEN.MAIN && screen !== SCREEN.LOCATIONS) return;

    const stored = readStoredDeviceCounts();
    setDeviceCounts((current) => {
      const changed = Object.keys(stored).some((locationId) => current[locationId] !== stored[locationId]);
      return changed ? stored : current;
    });
  }, [screen]);

  const goBack = useCallback(() => {
    const checkoutPaymentSucceeded = screen === SCREEN.HISTORY_DETAIL
      && selectedHistoryOperation?.paymentOrigin === 'checkout'
      && selectedHistoryOperation?.detailState === 'success';

    if (checkoutPaymentSucceeded) {
      setScreenStack([SCREEN.MAIN]);
      setPaymentDraft(null);
      setSelectedHistoryOperation(null);
    } else {
      setScreenStack((stack) => stack.length > 1 ? stack.slice(0, -1) : [SCREEN.MAIN]);
    }

    scrollToTop();
  }, [screen, selectedHistoryOperation?.detailState, selectedHistoryOperation?.paymentOrigin]);

  useEffect(() => {
    const tg = getTelegramWebApp();
    if (!tg || !isTelegramMiniApp()) return undefined;

    tg.BackButton?.onClick?.(goBack);
    return () => {
      tg.BackButton?.offClick?.(goBack);
    };
  }, [goBack]);

  useLayoutEffect(() => {
    const tg = getTelegramWebApp();
    if (!tg || !isTelegramMiniApp()) return;

    // Stack depth is the navigation truth. Do not hide BackButton in effect
    // cleanup: on Detail → History (depth 3 → 2) it must stay continuously
    // visible instead of briefly turning back into Telegram's Close control.
    const shouldShowBack = screenStack.length > 1;
    if (nativeBackVisibleRef.current === shouldShowBack) return;

    if (shouldShowBack) tg.BackButton?.show?.();
    else tg.BackButton?.hide?.();

    nativeBackVisibleRef.current = shouldShowBack;
  }, [screenStack.length]);

  const pushScreen = useCallback((nextScreen) => {
    setScreenStack((stack) => {
      const current = stack[stack.length - 1];
      if (current === nextScreen) return stack;
      return [...stack, nextScreen];
    });
    scrollToTop();
  }, []);

  const goHome = useCallback(() => {
    setScreenStack([SCREEN.MAIN]);
    scrollToTop();
  }, []);

  const openLocations = useCallback((nextTab) => {
    if (nextTab === LOCATIONS_TABS.PURCHASED || nextTab === LOCATIONS_TABS.AVAILABLE) {
      setLocationsTab(nextTab);
    }
    setScreenStack([SCREEN.LOCATIONS]);
    scrollToTop();
  }, []);

  const openCountry = useCallback((locationId) => {
    setSelectedLocationId(locationId);
    setSelectedMonths(1);
    pushScreen(SCREEN.COUNTRY);
  }, [pushScreen]);

  const openSpecifications = useCallback(() => {
    pushScreen(SCREEN.COUNTRY_SPECIFICATIONS);
  }, [pushScreen]);

  const openCheckout = useCallback((months) => {
    setSelectedMonths(months);
    pushScreen(SCREEN.CHECKOUT);
  }, [pushScreen]);

  const openPaymentSimulation = useCallback((draft) => {
    setPaymentDraft(draft);
    pushScreen(SCREEN.PAYMENT_SIMULATION);
  }, [pushScreen]);

  const completePaymentSimulation = useCallback(() => {
    if (!paymentDraft) return;

    const operation = {
      detailState: 'waiting',
      paymentOrigin: 'checkout',
      paymentId: `checkout-${paymentDraft.locationId || 'location'}`,
      code: paymentDraft.locationCode,
      locationName: paymentDraft.locationName,
      title: `${paymentDraft.locationName || 'Локация'} — ${paymentDraft.months || 1} мес.`,
      price: `${Math.max(0, Number(paymentDraft.total) || 0).toLocaleString('ru-RU')} ₽`,
      paymentService: paymentDraft.paymentService || 'ЮKassa',
      extraDevices: paymentDraft.extraDevices ? `${paymentDraft.extraDevices} ед.` : '0 ед.',
    };

    setSelectedHistoryOperation(operation);
    setScreenStack((stack) => {
      const withoutSimulation = stack[stack.length - 1] === SCREEN.PAYMENT_SIMULATION
        ? stack.slice(0, -1)
        : stack;
      return [...withoutSimulation, SCREEN.HISTORY_DETAIL];
    });
    scrollToTop();
  }, [paymentDraft]);

  const continueCheckoutPayment = useCallback(() => {
    if (selectedHistoryOperation?.paymentOrigin !== 'checkout' || !paymentDraft) return;
    setScreenStack((stack) => {
      if (stack[stack.length - 1] === SCREEN.HISTORY_DETAIL) {
        return [...stack.slice(0, -1), SCREEN.PAYMENT_SIMULATION];
      }
      return [...stack, SCREEN.PAYMENT_SIMULATION];
    });
    scrollToTop();
  }, [paymentDraft, selectedHistoryOperation?.paymentOrigin]);

  useEffect(() => {
    const checkoutPaymentWaiting = screen === SCREEN.HISTORY_DETAIL
      && selectedHistoryOperation?.paymentOrigin === 'checkout'
      && selectedHistoryOperation?.detailState === 'waiting';

    if (!checkoutPaymentWaiting) return undefined;

    const timer = window.setTimeout(() => {
      setSelectedHistoryOperation((current) => {
        if (current?.paymentOrigin !== 'checkout' || current?.detailState !== 'waiting') {
          return current;
        }

        return {
          ...current,
          detailState: 'success',
        };
      });
      scrollToTop();
    }, PAYMENT_SUCCESS_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [
    screen,
    selectedHistoryOperation?.detailState,
    selectedHistoryOperation?.paymentId,
    selectedHistoryOperation?.paymentOrigin,
  ]);

  const openProfile = useCallback(() => {
    setScreenStack([SCREEN.PROFILE]);
    scrollToTop();
  }, []);
  const openReferral = useCallback(() => pushScreen(SCREEN.REFERRAL), [pushScreen]);
  const openHistory = useCallback(() => pushScreen(SCREEN.HISTORY), [pushScreen]);
  const openHistoryDetail = useCallback((operation) => {
    setSelectedHistoryOperation(operation);
    pushScreen(SCREEN.HISTORY_DETAIL);
  }, [pushScreen]);

  return (
    <AppShell figmaNode={figmaNode}>
      {!appReady ? (
        <AppLoadingScreen />
      ) : (
        <>
      {screen === SCREEN.MAIN && (
        <MainScreen
          deviceCounts={deviceCounts}
          onOpenCountry={openCountry}
          onOpenLocations={openLocations}
          onOpenProfile={openProfile}
          onOpenReferral={openReferral}
          onNotify={notify}
          activeToastIds={activeToastIds}
        />
      )}
      {screen === SCREEN.LOCATIONS && (
        <LocationsScreen
          selectedTab={locationsTab}
          onSelectTab={setLocationsTab}
          deviceCounts={deviceCounts}
          onOpenCountry={openCountry}
          onOpenMain={goHome}
          onOpenProfile={openProfile}
        />
      )}
      {screen === SCREEN.COUNTRY && (
        <CountryScreen
          location={selectedLocation}
          deviceCount={selectedDeviceCount}
          onDeviceCountChange={(nextCount) => updateDeviceCount(selectedLocation.id, nextCount)}
          onCheckout={openCheckout}
          onOpenSpecifications={openSpecifications}
        />
      )}
      {screen === SCREEN.COUNTRY_SPECIFICATIONS && (
        <CountrySpecificationsScreen location={selectedLocation} />
      )}
      {screen === SCREEN.CHECKOUT && (
        <CheckoutScreen
          location={selectedLocation}
          months={selectedMonths}
          onStartPayment={openPaymentSimulation}
        />
      )}
      {screen === SCREEN.PAYMENT_SIMULATION && (
        <PaymentSimulationScreen onSimulatePayment={completePaymentSimulation} />
      )}
      {screen === SCREEN.PROFILE && (
        <ProfileScreen
          onOpenMain={goHome}
          onOpenLocations={openLocations}
          onOpenReferral={openReferral}
          onOpenHistory={openHistory}
          onOpenHistoryOperation={openHistoryDetail}
          onNotify={notify}
          activeToastIds={activeToastIds}
        />
      )}
      {screen === SCREEN.REFERRAL && (
        <ReferralScreen onNotify={notify} activeToastIds={activeToastIds} />
      )}
      {screen === SCREEN.HISTORY && <HistoryScreen onOpenOperation={openHistoryDetail} />}
      {screen === SCREEN.HISTORY_DETAIL && (
        <HistoryDetailScreen
          operation={selectedHistoryOperation}
          onContinuePayment={continueCheckoutPayment}
        />
      )}
      <AppToast
        toasts={toasts}
        onDismiss={dismissToast}
        onInteractionChange={handleToastInteractionChange}
      />
        </>
      )}
    </AppShell>
  );
}
