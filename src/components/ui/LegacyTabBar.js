import homeFilled from '../../assets/icons/nav/icn_m_home-filled.svg';
import homeOutline from '../../assets/icons/nav/icn_m_home-outline.svg';
import setFilled from '../../assets/icons/nav/icn_m_set-filled.svg';
import setOutline from '../../assets/icons/nav/icn_m_set-outline.svg';
import heartFilled from '../../assets/icons/nav/icn_m_heart-filled.svg';
import heartOutline from '../../assets/icons/nav/icn_m_heart-outline.svg';
import helpFilled from '../../assets/icons/nav/icn_m_help-filled.svg';
import helpOutline from '../../assets/icons/nav/icn_m_help.svg';
import { joinClasses as join } from './utils';

const LEGACY_ITEMS = [
  { key: 'home', label: 'Главная', active: homeFilled, inactive: homeOutline },
  { key: 'devices', label: 'Девайсы', active: setFilled, inactive: setOutline },
  { key: 'friends', label: 'Друзья', active: heartFilled, inactive: heartOutline },
  { key: 'support', label: 'Поддержка', active: helpFilled, inactive: helpOutline },
];

function LegacyTabBar({ selected = 'home', property1, onSelect, className }) {
  const figmaSelected = property1 ? ({ Default: 'home', Variant4: 'devices', Variant2: 'friends', Variant3: 'support' }[property1] || selected) : selected;
  return (
    <nav className={join('bitt-legacy-tabbar', className)} data-figma-node="4745:134">
      {LEGACY_ITEMS.map((item) => {
        const active = figmaSelected === item.key;
        return (
          <button
            type="button"
            className={join('bitt-legacy-tabbar__item', active && 'bitt-legacy-tabbar__item--active')}
            key={item.key}
            onClick={() => onSelect?.(item.key)}
          >
            <img src={active ? item.active : item.inactive} alt="" aria-hidden="true" />
            {active && <span>{item.label}</span>}
          </button>
        );
      })}
    </nav>
  );
}


export default LegacyTabBar;
