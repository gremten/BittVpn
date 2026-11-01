import { Badge, Card } from '../../components/ui';
import { PingDot } from '../../components/ui/internal';
import onlineIcon from '../../assets/icons/online.svg';
import genericCountryMapImage from '../../assets/images/generic-country-map.svg';

export default function CountryHero({ countryName, city, status = 'online' }) {
  const uppercaseCountryName = countryName.toLocaleUpperCase('ru-RU');
  const isOffline = status === 'offline';

  return (
    <Card className="country-hero surface-card" aria-label={`${countryName}, ${city}`}>
      <div className="country-hero-copy" data-figma-node="5964:23163">
        <h1>{uppercaseCountryName}</h1>
        <Badge
          size="xsmall"
          color="elevated"
          icon={isOffline ? undefined : onlineIcon}
          className="online-badge"
        >
          {isOffline ? 'Не в сети' : 'Онлайн'}
        </Badge>
      </div>
      <div className="country-map" aria-hidden="true">
        <img className="country-map-art" src={genericCountryMapImage} alt="" />
        <div className={`city-label${isOffline ? ' city-label--offline' : ''}`}>
          {!isOffline && <PingDot level="low" className="city-ping-dot" />}
          <span>{city}</span>
        </div>
      </div>
    </Card>
  );
}
