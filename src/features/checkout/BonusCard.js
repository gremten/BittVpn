import { Block, SegmentedControl } from '../../components/ui';
import infoIcon from '../../assets/icons/info.svg';

const BONUS_OPTIONS = [
  { value: false, label: 'Не списывать' },
  { value: true, label: 'Списать 100' },
];

export default function BonusCard({ enabled, onChange, onInfo, infoOpen = false }) {
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
        options={BONUS_OPTIONS}
        value={enabled}
        onChange={onChange}
        ariaLabel="Списание бонусных рублей"
      />
    </Block>
  );
}
