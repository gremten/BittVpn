import { BottomSheet } from '../../components/overlays';
import benefitDotlineIcon from '../../assets/icons/referral/benefit-dotline.svg';
import benefitDotIcon from '../../assets/icons/referral/benefit-dot.svg';
import './SlotsInfoSheet.css';

const SLOT_INFO_ITEMS = Object.freeze([
  {
    title: 'Связь с устройством',
    caption: 'Конфигурация связывает локацию с устройством',
  },
  {
    title: 'Один слот на устройство',
    caption: 'Каждая конфигурация занимает один слот',
  },
  {
    title: '5 слотов включено в подписку',
    caption: 'Можно докупить ещё 5 дополнительных слотов',
  },
]);

function SlotInfoMarker({ end = false }) {
  return (
    <img
      className={`slots-info-sheet__marker${end ? ' slots-info-sheet__marker--end' : ''}`}
      src={end ? benefitDotIcon : benefitDotlineIcon}
      alt=""
      aria-hidden="true"
    />
  );
}

export default function SlotsInfoSheet({ open, onClose }) {
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      className="slots-info-sheet"
      ariaLabel="Что такое слоты?"
      figmaNode="7335:28673"
      bottomSafeArea="stacked"
    >
      <div className="slots-info-sheet__content" data-figma-node="7335:28672">
        <h2>Что такое слоты?</h2>

        <div className="slots-info-sheet__table">
          <div className="slots-info-sheet__markers" aria-hidden="true">
            <SlotInfoMarker />
            <SlotInfoMarker />
            <SlotInfoMarker end />
          </div>

          <div className="slots-info-sheet__list">
            {SLOT_INFO_ITEMS.map((item, index) => (
              <div
                key={item.title}
                className={`slots-info-sheet__row${index === SLOT_INFO_ITEMS.length - 1 ? ' slots-info-sheet__row--last' : ''}`}
              >
                <b>{item.title}</b>
                <small>{item.caption}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BottomSheet>
  );
}
