import { Block, Button } from '../../components/ui';
import { DetailRow } from '../../components/ui/internal';
import openVpnIcon from '../../assets/icons/openvpn.svg';
import amneziaIcon from '../../assets/icons/amnezia.svg';
import wireGuardIcon from '../../assets/icons/wireguard.svg';
import { EXTRA_DEVICE_PRICE } from '../../config/pricing';

function ProtocolIcons() {
  return (
    <div className="protocol-icons" aria-label="WireGuard, AmneziaWG, OpenVPN">
      <img className="protocol-icon" src={wireGuardIcon} alt="" aria-hidden="true" />
      <img className="protocol-icon" src={amneziaIcon} alt="" aria-hidden="true" />
      <img className="protocol-icon" src={openVpnIcon} alt="" aria-hidden="true" />
    </div>
  );
}

export default function Characteristics({ countryName, city, onOpenSpecifications }) {
  const handleKeyDown = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    onOpenSpecifications?.();
  };

  return (
    <section className="section-block characteristics-section">
      <div className="section-heading-row">
        <h2 className="section-title">/характеристики</h2>
        <Button
          size="xsmall"
          type="outlined"
          form="circle"
          color="none"
          label="Все"
          className="characteristics-all"
          onClick={onOpenSpecifications}
        />
      </div>
      <Block
        className="characteristics-card characteristics-card--clickable surface-card"
        onClick={onOpenSpecifications}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label="Открыть все характеристики"
      >
        <DetailRow label="Локация" value={`${countryName}, ${city}`} valueTone="secondary" />
        <DetailRow label="Протоколы"><ProtocolIcons /></DetailRow>
        <DetailRow label="Трафик" value="безлимитный" valueTone="secondary" />
        <DetailRow label="Скорость" value="без границ" valueTone="secondary" />
        <DetailRow label="Подключение" value="1 на конфигурацию" valueTone="secondary" />
        <DetailRow
          label="Доп. устройство"
          value={`${EXTRA_DEVICE_PRICE} ₽ / месяц`}
          valueTone="secondary"
          end
        />
      </Block>
    </section>
  );
}
