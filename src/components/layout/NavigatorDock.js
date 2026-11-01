import { AppTabBar } from '../ui';

export default function NavigatorDock({ selected, onSelect }) {
  return <AppTabBar type="navigation" selected={selected} onSelect={onSelect} />;
}
