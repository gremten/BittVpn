import { Card } from '../../components/ui';

export default function StatCard({ title, caption, icon }) {
  return (
    <Card className="stat-card surface-card">
      <div className="stat-copy">
        <div className="stat-value">{title}</div>
        <div className="caption">{caption}</div>
      </div>
      {typeof icon === 'string' ? <img className="stat-icon" src={icon} alt="" aria-hidden="true" /> : icon}
    </Card>
  );
}
