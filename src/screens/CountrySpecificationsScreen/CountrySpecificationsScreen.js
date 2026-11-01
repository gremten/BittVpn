import './CountrySpecificationsScreen.css';
import { Block } from '../../components/ui';
import { DetailRow } from '../../components/ui/internal';

const PROTOCOL_ROWS = Object.freeze([
  ['Wireguard', 'доступен'],
  ['AmneziaWG', 'доступен'],
  ['OpenVPN', 'доступен'],
  ['MTU', 'auto / 1280'],
]);

const RESTRICTION_ROWS = Object.freeze([
  ['Подключения', '1 на устройство'],
  ['P2P', 'разрешен'],
  ['Трафик', 'безлимит'],
  ['Скорость', 'безлимит'],
  ['MTU', 'auto / 1280'],
]);

function SpecificationsSection({ title, rows }) {
  return (
    <section className="country-specifications-section">
      <h1>{title}</h1>
      <Block className="country-specifications-table">
        <div className="country-specifications-table__rows">
          {rows.map(([label, value], index) => (
            <DetailRow
              key={label}
              label={label}
              value={value}
              valueTone="secondary"
              end={index === rows.length - 1}
            />
          ))}
        </div>
      </Block>
    </section>
  );
}

export default function CountrySpecificationsScreen({ location }) {
  const countryName = location?.countryName || 'Германия';
  const city = location?.city || 'Франкфурт';

  const networkRows = [
    ['Локация', `${countryName}, ${city}`],
    ['Тип IP', 'Shared IPv4'],
    ['IPv6', 'Нет'],
    ['NAT', 'Shared NAT'],
    ['Post forwarding', 'нет'],
    ['DNS', 'BittDNS, защита от утечек'],
  ];

  return (
    <div className="scroll-area country-specifications-scroll-area" data-figma-node="7172:124235">
      <div className="country-specifications-content">
        <SpecificationsSection title="/сетевые данные" rows={networkRows} />
        <SpecificationsSection title="/протокол" rows={PROTOCOL_ROWS} />
        <SpecificationsSection title="/ограничения" rows={RESTRICTION_ROWS} />
      </div>
    </div>
  );
}
