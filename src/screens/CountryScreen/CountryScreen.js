import { useEffect, useState } from 'react';
import './CountryScreen.css';
import { AppTabBar, Button } from '../../components/ui';
import {
  Characteristics,
  CountryHero,
  CountryNotice,
  IdealChoice,
  PulseIcon,
  PurchasedDevices,
  SlotsInfoSheet,
  SlotsNotice,
  StatCard,
  usePingStatus,
} from '../../features/country';
import { PurchaseDurationSheet, PurchaseTabBar, RenewAccessSheet } from '../../features/purchase';
import { COUNTRY_ACCESS_STATES } from '../../config/locations';
import { syncTelegramChrome } from '../../telegram';
import calendarIcon from '../../assets/icons/calendar-24.svg';
import regionIcon from '../../assets/icons/region.svg';

export const COUNTRY_SCREEN_FIGMA_NODES = Object.freeze({
  [COUNTRY_ACCESS_STATES.AVAILABLE]: '6643:24352',
  [COUNTRY_ACCESS_STATES.ACTIVE]: '7261:26032',
  [COUNTRY_ACCESS_STATES.LIMIT]: '6447:27934',
  [COUNTRY_ACCESS_STATES.MAINTENANCE]: '6520:46426',
});

export const COUNTRY_PURCHASED_NO_DEVICES_FIGMA_NODE = '7341:28790';
export const COUNTRY_LIMIT_EXPIRY_BELOW_CAPACITY_FIGMA_NODE = '6502:41574';

export function getCountryScreenFigmaNode(location, deviceCount) {
  if (!location) return null;
  if (location.accessState === COUNTRY_ACCESS_STATES.AVAILABLE) {
    return COUNTRY_SCREEN_FIGMA_NODES[COUNTRY_ACCESS_STATES.AVAILABLE];
  }

  const used = Math.max(0, Number(deviceCount) || 0);
  if (used === 0) {
    return COUNTRY_PURCHASED_NO_DEVICES_FIGMA_NODE;
  }

  const limit = Math.max(1, Number(location.deviceLimit) || 5);
  if (
    location.accessState === COUNTRY_ACCESS_STATES.LIMIT
    && used < limit
  ) {
    return COUNTRY_LIMIT_EXPIRY_BELOW_CAPACITY_FIGMA_NODE;
  }

  return COUNTRY_SCREEN_FIGMA_NODES[location.accessState];
}

function PurchasedCountry({
  location,
  deviceCount,
  onDeviceCountChange,
  onOpenSpecifications,
  onRenew,
  sheetOpen,
}) {
  const [devicesOwnBottomAction, setDevicesOwnBottomAction] = useState(false);
  const isMaintenance = location.accessState === COUNTRY_ACCESS_STATES.MAINTENANCE;
  const isLimited = location.accessState === COUNTRY_ACCESS_STATES.LIMIT;
  const pingValue = isMaintenance ? null : (location.detailPing ?? location.basePing);

  return (
    <>
      <div
        className="scroll-area country-scroll-area"
        data-figma-node={getCountryScreenFigmaNode(location, deviceCount)}
      >
        <div className="country-content country-content--purchased">
          <section className="country-control">
            {isMaintenance && (
              <CountryNotice>
                {location.maintenanceText || 'Ведем техработы до четверга, 19:00'}
              </CountryNotice>
            )}

            <CountryHero
              countryName={location.countryName}
              city={location.city}
              status={isMaintenance ? 'offline' : 'online'}
            />

            <div className="stats-grid">
              <StatCard
                title={location.accessExpiryDetail || location.accessExpiry || '—'}
                caption="Доступ активен"
                icon={calendarIcon}
              />
              <StatCard
                title={pingValue == null ? '—' : `${pingValue} мс`}
                caption="Задержка"
                icon={<PulseIcon animationKey={0} />}
              />
            </div>
          </section>

          <PurchasedDevices
            location={location}
            deviceCount={deviceCount}
            limited={isLimited}
            onDeviceCountChange={onDeviceCountChange}
            onBottomActionOwnershipChange={setDevicesOwnBottomAction}
          />

          <Characteristics
            countryName={location.countryName}
            city={location.city}
            onOpenSpecifications={onOpenSpecifications}
          />
        </div>
      </div>

      {!devicesOwnBottomAction && !sheetOpen && (
        <AppTabBar type="action" showSubtle={false}>
          <Button
            size="large"
            type="primary"
            form="circle"
            color="accent"
            label="Продлить доступ"
            fullWidth
            onClick={onRenew}
          />
        </AppTabBar>
      )}
    </>
  );
}

function AvailableCountry({ location, pingMs, animationKey, onOpenSpecifications, onOpenSlotsInfo, onBuy, sheetOpen }) {
  return (
    <>
      <div className="scroll-area country-scroll-area" data-figma-node="6643:24352">
        <div className="country-content">
          <section className="country-control">
            <CountryHero countryName={location.countryName} city={location.city} />
            <div className="stats-grid">
              <StatCard title={location.region} caption="Регион" icon={regionIcon} />
              <StatCard title={`${pingMs} мс`} caption="Задержка" icon={<PulseIcon animationKey={animationKey} />} />
            </div>
          </section>

          <SlotsNotice onClick={onOpenSlotsInfo} />
          <IdealChoice />
          <Characteristics
            countryName={location.countryName}
            city={location.city}
            onOpenSpecifications={onOpenSpecifications}
          />
        </div>
      </div>

      <PurchaseTabBar pricePerMonth={location.pricePerMonth} onBuy={onBuy} hidden={sheetOpen} />
    </>
  );
}

export default function CountryScreen({
  location,
  deviceCount,
  onDeviceCountChange,
  onCheckout,
  onOpenSpecifications,
}) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [slotsInfoOpen, setSlotsInfoOpen] = useState(false);
  const { pingMs, animationKey } = usePingStatus(location.basePing ?? 73);
  const isAvailable = location.accessState === COUNTRY_ACCESS_STATES.AVAILABLE;

  useEffect(() => {
    syncTelegramChrome(sheetOpen || slotsInfoOpen);
    return () => syncTelegramChrome(false);
  }, [sheetOpen, slotsInfoOpen]);

  return (
    <>
      {isAvailable ? (
        <AvailableCountry
          location={location}
          pingMs={pingMs}
          animationKey={animationKey}
          onOpenSpecifications={onOpenSpecifications}
          onOpenSlotsInfo={() => setSlotsInfoOpen(true)}
          onBuy={() => setSheetOpen(true)}
          sheetOpen={sheetOpen}
        />
      ) : (
        <PurchasedCountry
          location={location}
          deviceCount={deviceCount}
          onDeviceCountChange={onDeviceCountChange}
          onOpenSpecifications={onOpenSpecifications}
          onRenew={() => setSheetOpen(true)}
          sheetOpen={sheetOpen}
        />
      )}

      <SlotsInfoSheet
        open={slotsInfoOpen}
        onClose={() => setSlotsInfoOpen(false)}
      />

      {isAvailable ? (
        <PurchaseDurationSheet
          open={sheetOpen}
          pricePerMonth={location.pricePerMonth}
          onClose={() => setSheetOpen(false)}
          onProceed={(months) => {
            setSheetOpen(false);
            onCheckout(months);
          }}
        />
      ) : (
        <RenewAccessSheet
          open={sheetOpen}
          pricePerMonth={location.pricePerMonth}
          onClose={() => setSheetOpen(false)}
          onProceed={(months) => {
            setSheetOpen(false);
            onCheckout(months);
          }}
        />
      )}
    </>
  );
}
