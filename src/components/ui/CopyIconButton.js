import { useEffect, useRef, useState } from 'react';
import IconButton from './IconButton';
import copyIcon from '../../assets/icons/nav/icn_m_copy.svg';
import checkIcon from '../../assets/icons/nav/icn_m_check.svg';

/**
 * Figma 6029:123 — icn_m_copy.
 *
 * The check state is coupled to the toast created by this exact button press.
 * It cannot be pressed again until that toast has fully left the global toast
 * stack, then it returns to the default copy glyph.
 */
export default function CopyIconButton({
  copyText,
  onCopy,
  activeToastIds,
  ariaLabel = 'Копировать',
  className,
  disabled = false,
  ...iconButtonProps
}) {
  const [toastId, setToastId] = useState(null);
  const observedActiveRef = useRef(false);
  const confirmed = toastId !== null;

  useEffect(() => {
    if (!toastId) {
      observedActiveRef.current = false;
      return;
    }

    if (activeToastIds?.has?.(toastId)) {
      observedActiveRef.current = true;
      return;
    }

    if (observedActiveRef.current) {
      observedActiveRef.current = false;
      setToastId(null);
    }
  }, [activeToastIds, toastId]);

  const handleClick = async (event) => {
    if (confirmed || disabled) return;

    if (copyText && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(copyText);
      } catch {
        // The visual acknowledgement still works when clipboard permissions
        // are unavailable (for example in a browser preview).
      }
    }

    const createdToastId = onCopy?.(event);
    if (createdToastId !== undefined && createdToastId !== null) {
      observedActiveRef.current = false;
      setToastId(createdToastId);
    }
  };

  return (
    <IconButton
      {...iconButtonProps}
      className={className}
      ariaLabel={confirmed ? 'Скопировано' : ariaLabel}
      onClick={handleClick}
      disabled={disabled || confirmed}
      aria-disabled={disabled || confirmed}
      data-figma-node="6029:123"
    >
      <span className={`bitt-copy-icon${confirmed ? ' bitt-copy-icon--confirmed' : ''}`} aria-hidden="true">
        <img className="bitt-copy-icon__copy" src={copyIcon} alt="" />
        <img className="bitt-copy-icon__check" src={checkIcon} alt="" />
      </span>
    </IconButton>
  );
}
