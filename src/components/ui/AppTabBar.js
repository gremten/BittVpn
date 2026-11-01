import Button from './Button';
import Navigator from './Navigator';
import { joinClasses as join } from './utils';

/**
 * Shared bottom bar from Figma component set 5948:20739.
 *
 * Exactly two visual variants:
 * - navigation: transparent positioning host; Navigator owns the only pill;
 * - action: glass surface with the CTA.
 */
function AppTabBar({
  type = 'navigation',
  selected = 'home',
  onSelect,
  children,
  label = 'Label',
  subline,
  showSubtle = true,
  hidden = false,
}) {
  const hasSubline = showSubtle && Boolean(subline);

  if (type === 'navigation') {
    return (
      <div
        className={join('bitt-app-tabbar', 'bitt-app-tabbar--navigation', hidden && 'bitt-app-tabbar--hidden')}
        data-figma-node="5948:20583"
      >
        <div className="bitt-app-tabbar__navigation-wrap">
          <Navigator selected={selected} onSelect={onSelect} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={join(
        'bitt-app-tabbar',
        'bitt-app-tabbar--action',
        hasSubline && 'bitt-app-tabbar--action-with-subline',
        hidden && 'bitt-app-tabbar--hidden',
      )}
      data-figma-node="5948:20740"
    >
      <div className="bitt-app-tabbar__button-content">
        {children || <Button size="large" type="primary" form="circle" color="accent" label={label} fullWidth />}
        {hasSubline && <div className="bitt-app-tabbar__subline">{subline}</div>}
      </div>
    </div>
  );
}

export default AppTabBar;
