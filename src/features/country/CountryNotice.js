import { Card } from '../../components/ui';
import maintenanceWarningIcon from '../../assets/icons/squircle-warning-filled.svg';

export default function CountryNotice({ children }) {
  return (
    <Card className="country-maintenance-notice">
      <img src={maintenanceWarningIcon} alt="" aria-hidden="true" />
      <span>{children}</span>
    </Card>
  );
}
