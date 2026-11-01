import checkboxOff from '../../assets/icons/nav/icn_m_checkbox-off.svg';
import checkboxOn from '../../assets/icons/nav/icn_m_checkbox-on.svg';
import { joinClasses as join } from './utils';

function CheckboxLabel({
  children,
  state = 'default',
  checked,
  onChange,
  className,
  ariaLabel,
  disabled = false,
}) {
  const isChecked = checked ?? state === 'active';

  return (
    <label
      className={join(
        'bitt-checkbox-label',
        isChecked && 'bitt-checkbox-label--active',
        disabled && 'bitt-checkbox-label--disabled',
        className,
      )}
      data-figma-node="6466:33667"
    >
      <input
        type="checkbox"
        checked={isChecked}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={(event) => onChange?.(event.target.checked)}
      />
      <img src={isChecked ? checkboxOn : checkboxOff} alt="" aria-hidden="true" />
      {children != null && children !== false && <span>{children}</span>}
    </label>
  );
}

export default CheckboxLabel;
