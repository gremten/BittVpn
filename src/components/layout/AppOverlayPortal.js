import { createPortal } from 'react-dom';

const APP_OVERLAY_ROOT_ID = 'bitt-app-overlay-root';

export default function AppOverlayPortal({ children }) {
  if (typeof document === 'undefined') return null;

  const target = document.getElementById(APP_OVERLAY_ROOT_ID);
  if (!target) return null;

  return createPortal(children, target);
}

export { APP_OVERLAY_ROOT_ID };
