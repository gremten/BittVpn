import PurchaseDurationSheet from './PurchaseDurationSheet';

export default function RenewAccessSheet(props) {
  return (
    <PurchaseDurationSheet
      {...props}
      title="На какой срок продлим доступ?"
      ctaPrefix="Продлить за"
      ariaLabel="Продление доступа"
      figmaNode="7353:30359"
      dataFigmaNode="7353:30358"
    />
  );
}
