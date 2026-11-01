import Card from './Card';
import LocationCardData from './internal/LocationCardData';
import { joinClasses as join } from './utils';

function LocationCard({
  state = 'default',
  code = 'DE',
  title = 'Country',
  description = 'Description',
  price,
  expiry,
  devices,
  ping,
  pingLabel,
  pingLevel,
  limited = false,
  tags = [],
  disabled = false,
  onClick,
  className,
}) {
  const visualState = disabled ? 'disabled' : state;
  const isPurchased = Boolean(expiry || devices);

  return (
    <Card
      state={state === 'loading' ? 'loading' : 'default'}
      className={join('bitt-location-card', `bitt-location-card--${visualState}`, className)}
      onClick={disabled ? undefined : onClick}
      data-figma-node="5941:18084"
    >
      {state !== 'loading' && (
        <LocationCardData
          state={isPurchased ? 'current' : 'available'}
          code={code}
          title={title}
          description={description}
          price={price}
          expiry={expiry}
          devices={devices}
          ping={ping}
          pingLabel={pingLabel}
          pingLevel={pingLevel}
          limited={limited}
          tags={tags}
          disabled={disabled}
        />
      )}
    </Card>
  );
}

export default LocationCard;
