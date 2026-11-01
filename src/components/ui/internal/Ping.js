import { joinClasses as join } from '../utils';

export const PING_LEVELS = Object.freeze({
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  OFFLINE: 'offline',
});

export function inferPingLevel(ping) {
  if (ping == null) return PING_LEVELS.LOW;
  if (ping < 100) return PING_LEVELS.LOW;
  if (ping < 500) return PING_LEVELS.MEDIUM;
  return PING_LEVELS.HIGH;
}

export function PingDot({ level = PING_LEVELS.LOW, className }) {
  return (
    <span
      className={join('bitt-ping-dot-slot', className)}
      data-figma-node="4984:5580"
      aria-hidden="true"
    >
      <span className={join('bitt-ping-dot', `bitt-ping-dot--${level}`)} />
    </span>
  );
}

export default function Ping({ value, label, level, className }) {
  const resolvedLevel = level || inferPingLevel(value);

  return (
    <span
      className={join('bitt-ping', resolvedLevel === PING_LEVELS.OFFLINE && 'bitt-ping--offline', className)}
      data-figma-node="5335:15616"
      aria-label={label || (value == null ? undefined : `${value} мс`)}
    >
      <PingDot level={resolvedLevel} />
      {(label || value != null) && <span className="bitt-ping__value">{label || `${value} мс`}</span>}
    </span>
  );
}
