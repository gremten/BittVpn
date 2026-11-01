import { BottomSheet } from '../../components/overlays';
import benefitDotlineIcon from '../../assets/icons/referral/benefit-dotline.svg';
import benefitDotIcon from '../../assets/icons/referral/benefit-dot.svg';
import './BonusBalanceSheet.css';

const BONUS_BALANCE_ITEMS = Object.freeze([
  {
    title: 'Используй при оплате',
    caption: 'Бонусами можно покрыть всю стоимость',
  },
  {
    title: 'Пополняется с покупок друзей',
    caption: 'Начисляется 5% с каждой их покупки',
  },
  {
    title: 'Только внутри BittVPN',
    caption: 'Вывести или обменять на деньги нельзя',
  },
]);

function BonusBalanceMarker({ end = false }) {
  return (
    <img
      className={`bonus-balance-sheet__marker${end ? ' bonus-balance-sheet__marker--end' : ''}`}
      src={end ? benefitDotIcon : benefitDotlineIcon}
      alt=""
      aria-hidden="true"
    />
  );
}

export default function BonusBalanceSheet({ open, onClose }) {
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      className="bonus-balance-sheet"
      ariaLabel="Что такое бонусный баланс?"
      figmaNode="7223:25222"
      bottomSafeArea="stacked"
    >
      <div className="bonus-balance-sheet__content" data-figma-node="7239:25567">
        <h2>Что такое бонусный баланс?</h2>

        <div className="bonus-balance-sheet__table">
          <div className="bonus-balance-sheet__markers" aria-hidden="true">
            <BonusBalanceMarker />
            <BonusBalanceMarker />
            <BonusBalanceMarker end />
          </div>

          <div className="bonus-balance-sheet__list">
            {BONUS_BALANCE_ITEMS.map((item, index) => (
              <div
                key={item.title}
                className={`bonus-balance-sheet__row${index === BONUS_BALANCE_ITEMS.length - 1 ? ' bonus-balance-sheet__row--last' : ''}`}
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
