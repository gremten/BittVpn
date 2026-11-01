import { Card } from '../../components/ui';
import { ReactComponent as DevicesIcon } from '../../assets/icons/icn_m_devices.svg';

export default function SlotsNotice({ onClick }) {
  return (
    <Card className="slots-notice" data-figma-node="7181:25036" onClick={onClick}>
      <DevicesIcon className="slots-notice__icon" aria-hidden="true" focusable="false" />
      <div>
        <div className="small-body">Доступно 5 слотов для устройств</div>
        <div className="caption">Доп. слоты покупаются отдельно</div>
      </div>
    </Card>
  );
}
