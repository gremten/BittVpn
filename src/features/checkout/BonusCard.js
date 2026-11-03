import { Block, SegmentedControl } from '../../components/ui';
import infoIcon from '../../assets/icons/info.svg';

function getBonusOptions(maxDeduction) {
  return [
    { value: false, label: 'Не списывать' },
    { value: true, label: `Списать ${maxDeduction.toLocaleString('ru-RU')} ₽` },
  ];
}

export default function BonusCard({ enabled, onChange, onInfo, infoOpen = false, maxDeduction }) {
  return (
    <Block className="checkout-bonus-card surface-card">
      <div className="checkout-bonus-heading">
        <h2>бонусный баланс</h2>
        <button
          type="button"
          className="checkout-bonus-info"
          aria-label="Что за бонусный баланс?"
          aria-haspopup="dialog"
          aria-expanded={infoOpen}
          onClick={onInfo}
        >
          <img src={infoIcon} alt="" aria-hidden="true" />
        </button>
      </div>
      <SegmentedControl
        options={getBonusOptions(maxDeduction)}
        value={enabled}
        onChange={onChange}
        ariaLabel="Списание бонусных рублей"
      />
    </Block>
  );
}
