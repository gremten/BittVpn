import Button from '../Button';
import Ping from './Ping';

function CountryIdentity({ code, title, children }) {
  return (
    <div className="bitt-location-card__country">
      <div className="bitt-location-card__code">{code}</div>
      <div className="bitt-location-card__copy">
        <div className="bitt-location-card__title">{title}</div>
        {children}
      </div>
    </div>
  );
}

function CurrentLocationData({ code, title, devices, ping, pingLabel, pingLevel, expiry, limited = false }) {
  return (
    <div className="bitt-location-card-data bitt-location-card-data--current" data-figma-node="5335:15750">
      <CountryIdentity code={code} title={title}>
        <div className="bitt-location-card__meta">
          {devices && (
            <span className={limited ? 'bitt-location-card__devices--limited' : 'bitt-location-card__secondary'}>
              <span>{devices}</span>
            </span>
          )}
          {(ping != null || pingLabel) && (
            <Ping value={ping} label={pingLabel} level={pingLevel} />
          )}
        </div>
      </CountryIdentity>
      {expiry && <div className="bitt-location-card__expiry">{expiry}</div>}
    </div>
  );
}

function AvailableLocationData({ code, title, description, price, ping, tags, disabled }) {
  return (
    <div className="bitt-location-card-data bitt-location-card-data--available" data-figma-node="5335:15752">
      <div className="bitt-location-card__top">
        <CountryIdentity code={code} title={title}>
          <div className="bitt-location-card__description">{description}</div>
        </CountryIdentity>
        {price != null && (
          <Button
            size="small"
            type="primary"
            form="squircle"
            color="accent"
            state={disabled ? 'disabled' : 'default'}
            label={disabled ? String(price) : `${price} ₽`}
            disabled={false}
            tabIndex={-1}
            aria-hidden="true"
            className="bitt-location-card__price"
          />
        )}
      </div>
      {tags.length > 0 && (
        <div className="bitt-location-card__available-bottom">
          <span className="bitt-location-card__divider" aria-hidden="true" />
          <div className="bitt-location-card__bar">
            {ping != null && <span>{`${ping} мс`}</span>}
            {ping != null && <span className="bitt-location-card__separator">•</span>}
            {tags.map((tag, index) => (
              <span className="bitt-location-card__bar-fragment" key={`${tag}-${index}`}>
                <span>{tag}</span>
                {index < tags.length - 1 && <span className="bitt-location-card__separator">•</span>}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LocationCardData({ state = 'available', ...props }) {
  if (state === 'current') return <CurrentLocationData {...props} />;
  return <AvailableLocationData {...props} tags={props.tags || []} />;
}
