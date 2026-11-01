import './LocationsScreen.css';
import { LocationCard, Tabs } from '../../components/ui';
import { NavigatorDock } from '../../components/layout';
import {
  AVAILABLE_LOCATION_IDS,
  COUNTRY_ACCESS_STATES,
  LOCATIONS,
  PURCHASED_LOCATION_IDS,
} from '../../config/locations';

export const LOCATIONS_TABS = Object.freeze({
  PURCHASED: 'purchased',
  AVAILABLE: 'available',
});

export const LOCATIONS_FIGMA_NODES = Object.freeze({
  [LOCATIONS_TABS.PURCHASED]: '7435:36711',
  [LOCATIONS_TABS.AVAILABLE]: '7435:37052',
});

export default function LocationsScreen({
  selectedTab = LOCATIONS_TABS.PURCHASED,
  onSelectTab,
  deviceCounts,
  onOpenCountry,
  onOpenMain,
  onOpenProfile,
}) {
  const purchasedLocations = PURCHASED_LOCATION_IDS.map((id) => LOCATIONS[id]);
  const availableLocations = AVAILABLE_LOCATION_IDS.map((id) => LOCATIONS[id]);
  const isPurchased = selectedTab === LOCATIONS_TABS.PURCHASED;

  const selectTab = (nextTab) => {
    if (nextTab === selectedTab) return;
    onSelectTab?.(nextTab);
  };

  const handleTabSelect = (nextTab) => {
    if (nextTab === 'configurations') {
      const scroller = document.querySelector('.locations-scroll-area');
      if (scroller && typeof scroller.scrollTo === 'function') {
        scroller.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (nextTab === 'home') onOpenMain?.();
    if (nextTab === 'referrals') onOpenProfile?.();
  };

  return (
    <>
      <div
        className="scroll-area locations-scroll-area"
        data-figma-node={LOCATIONS_FIGMA_NODES[selectedTab] || LOCATIONS_FIGMA_NODES[LOCATIONS_TABS.PURCHASED]}
      >
        <div className="locations-content">
          <div className="locations-tabs" role="tablist" aria-label="Локации">
            <Tabs
              id="locations-tab-purchased"
              label="Купленные"
              state={isPurchased ? 'active' : 'default'}
              aria-controls="locations-panel"
              onClick={() => selectTab(LOCATIONS_TABS.PURCHASED)}
            />
            <Tabs
              id="locations-tab-available"
              label="Доступные"
              state={!isPurchased ? 'active' : 'default'}
              aria-controls="locations-panel"
              onClick={() => selectTab(LOCATIONS_TABS.AVAILABLE)}
            />
          </div>

          <div
            id="locations-panel"
            className={`locations-card-group locations-card-group--${isPurchased ? 'purchased' : 'available'}`}
            role="tabpanel"
            aria-labelledby={isPurchased ? 'locations-tab-purchased' : 'locations-tab-available'}
          >
            {isPurchased ? (
              purchasedLocations.map((location) => {
                const maintenance = location.accessState === COUNTRY_ACCESS_STATES.MAINTENANCE;
                const used = Math.max(0, Number(deviceCounts?.[location.id] ?? location.deviceUsed) || 0);
                const limit = Math.max(1, Number(location.deviceLimit) || 5);
                const limited = location.accessState === COUNTRY_ACCESS_STATES.LIMIT && used >= limit;

                return (
                  <LocationCard
                    key={location.id}
                    code={location.code}
                    title={location.cardTitle}
                    devices={`${used}/${limit} устройств`}
                    ping={maintenance ? null : location.basePing}
                    pingLabel={maintenance ? 'Техработы' : undefined}
                    pingLevel={maintenance ? 'offline' : (location.basePing >= 500 ? 'high' : 'low')}
                    expiry={location.accessExpiry}
                    limited={limited}
                    onClick={() => onOpenCountry?.(location.id)}
                  />
                );
              })
            ) : (
              <>
                {availableLocations.map((location) => (
                  <LocationCard
                    key={location.id}
                    code={location.code}
                    title={location.cardTitle}
                    description={location.description}
                    price={location.pricePerMonth}
                    ping={location.basePing}
                    tags={location.tags}
                    onClick={() => onOpenCountry?.(location.id)}
                  />
                ))}
                <LocationCard
                  code="ES"
                  title="Испания"
                  description="Временно недоступна"
                  price="На паузе"
                  tags={['Стриминг', 'Игры']}
                  disabled
                />
              </>
            )}
          </div>
        </div>
      </div>

      <NavigatorDock selected="configurations" onSelect={handleTabSelect} />
    </>
  );
}
