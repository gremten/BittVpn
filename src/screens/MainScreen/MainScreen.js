import './MainScreen.css';
import { Block, Button, ButtonGroup, CopyIconButton, LocationCard } from '../../components/ui';
import { NavigatorDock } from '../../components/layout';
import SakuraAnimation from '../../components/media/SakuraAnimation';
import ReferralSmileAnimation from '../../components/media/ReferralSmileAnimation';
import { AVAILABLE_LOCATION_IDS, COUNTRY_ACCESS_STATES, LOCATIONS, LOCATION_IDS, PURCHASED_LOCATION_IDS } from '../../config/locations';
import { getReferralUrl, shareReferralInTelegram } from '../../telegram';

function SectionBar({ title, showAll = false, onShowAll }) {
  return (
    <div className="main-section-bar">
      <h2>{title}</h2>
      {showAll && (
        <Button
          size="xsmall"
          type="outlined"
          form="circle"
          color="none"
          label="Все"
          className="main-section-all"
          onClick={onShowAll}
        />
      )}
    </div>
  );
}

function PromoBlock({ onOpenJapan }) {
  return (
    <Block type="inverse" className="main-promo main-promo--clickable" onClick={onOpenJapan}>
      <div className="main-promo__copy">
        <h2>
          открой для себя<br />
          <span className="main-promo__japan">японию</span>
        </h2>
        <p>игры, шоппинг<br /><span>и азиатские сервисы</span></p>
        <Button
          size="small"
          type="primary"
          form="circle"
          color="inverse"
          label="Посмотреть"
          onClick={(event) => {
            event.stopPropagation();
            onOpenJapan?.();
          }}
        />
      </div>
      <div className="main-promo__art" aria-hidden="true">
        <SakuraAnimation />
      </div>
    </Block>
  );
}

function ReferralBlock({ onOpenReferral, onNotify, activeToastIds }) {
  const referralUrl = getReferralUrl();

  const activate = (event) => {
    if (event.target.closest('button')) return;
    onOpenReferral?.();
  };

  const handleKeyDown = (event) => {
    if (event.target !== event.currentTarget) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    onOpenReferral?.();
  };

  return (
    <Block
      className="main-referral main-referral--clickable"
      onClick={activate}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Открыть реферальную программу"
    >
      <div className="main-referral__top">
        <div className="main-referral__copy">
          <h2>пригласи друга</h2>
          <p>и получай 5%<br />с каждой его покупки</p>
        </div>
        <ReferralSmileAnimation className="main-referral__art" gap={8} />
      </div>
      <ButtonGroup type="horizontal" className="main-referral__actions" onClick={(event) => event.stopPropagation()}>
        <Button
          size="large"
          type="secondary"
          form="squircle"
          color="elevated"
          label="Поделиться ссылкой"
          fullWidth
          onClick={() => shareReferralInTelegram()}
        />
        <CopyIconButton
          size="large"
          type="primary"
          form="squircle"
          color="elevated"
          ariaLabel="Копировать"
          copyText={referralUrl}
          onCopy={() => onNotify?.('Скопировано в буфер обмена')}
          activeToastIds={activeToastIds}
        />
      </ButtonGroup>
    </Block>
  );
}

export default function MainScreen({
  deviceCounts,
  onOpenCountry,
  onOpenLocations,
  onOpenProfile,
  onOpenReferral,
  onNotify,
  activeToastIds,
}) {
  const russia = LOCATIONS[LOCATION_IDS.RUSSIA];
  const japan = LOCATIONS[LOCATION_IDS.JAPAN];
  const purchasedLocations = PURCHASED_LOCATION_IDS.map((id) => LOCATIONS[id]);
  const availableLocations = AVAILABLE_LOCATION_IDS.map((id) => LOCATIONS[id]);

  const handleTabSelect = (nextTab) => {
    if (nextTab === 'home') {
      const scroller = document.querySelector('.main-scroll-area');
      if (scroller && typeof scroller.scrollTo === 'function') {
        scroller.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (nextTab === 'configurations') {
      onOpenLocations?.();
      return;
    }

    if (nextTab === 'referrals') {
      onOpenProfile?.();
    }
  };

  return (
    <>
      <div className="scroll-area main-scroll-area" data-figma-node="6429:29217">
        <div className="main-content">
          <section className="main-head">
            <h1 className="main-logo">BITTVPN</h1>
            <PromoBlock onOpenJapan={() => onOpenCountry(japan.id)} />
          </section>

          <section className="main-section">
            <SectionBar
              title="/мои локации"
              showAll
              onShowAll={() => onOpenLocations?.('purchased')}
            />
            <div className="main-card-group main-card-group--purchased">
              {purchasedLocations.map((location) => {
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
                    onClick={() => onOpenCountry(location.id)}
                  />
                );
              })}
            </div>
          </section>

          <section className="main-section">
            <SectionBar
              title="/доступные локации"
              showAll
              onShowAll={() => onOpenLocations?.('available')}
            />
            <div className="main-card-group main-card-group--available">
              {availableLocations.map((location) => (
                <LocationCard
                  key={location.id}
                  code={location.code}
                  title={location.cardTitle}
                  description={location.description}
                  price={location.pricePerMonth}
                  ping={location.basePing}
                  tags={location.tags}
                  onClick={() => onOpenCountry(location.id)}
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
            </div>
          </section>

          <ReferralBlock onOpenReferral={onOpenReferral} onNotify={onNotify} activeToastIds={activeToastIds} />
        </div>
      </div>

      <NavigatorDock selected="home" onSelect={handleTabSelect} />
    </>
  );
}
