import { useEffect } from 'react';
import BottomSheet from '../../components/overlays/BottomSheet';
import Button from '../../components/ui/Button';
import DotMorphIcon from '../../components/ui/DotMorphIcon';
import { ReactComponent as TrashIcon } from '../../assets/icons/morph-source/icn_el_trash.svg';
import './DeviceDeleteSheet.css';

const SUCCESS_AUTO_CLOSE_MS = 3000;

function pluralizeDevice(count) {
  const value = Math.abs(Number(count) || 0) % 100;
  const last = value % 10;

  if (value > 10 && value < 20) return 'устройств';
  if (last === 1) return 'устройство';
  if (last >= 2 && last <= 4) return 'устройства';
  return 'устройств';
}

export default function DeviceDeleteSheet({
  open,
  phase = 'confirm',
  count = 1,
  onConfirm,
  onCancel,
  onClose,
}) {
  const isPending = phase === 'pending';
  const isSuccess = phase === 'success';

  useEffect(() => {
    if (!open || !isSuccess) return undefined;

    const timer = window.setTimeout(() => {
      onClose?.();
    }, SUCCESS_AUTO_CLOSE_MS);

    return () => window.clearTimeout(timer);
  }, [isSuccess, onClose, open]);

  const title = count === 1
    ? <>Ты уверен, что хочешь удалить<br />это устройство?</>
    : <>Ты уверен, что хочешь удалить<br />эти {count} {pluralizeDevice(count)}?</>;

  const successTitle = count === 1
    ? 'Устройство было удалено'
    : 'Устройства были удалены';

  const closeHandler = isSuccess ? onClose : onCancel;

  return (
    <BottomSheet
      open={open}
      onClose={closeHandler}
      dismissible={!isPending}
      ariaLabel={
        isSuccess
          ? 'Устройства удалены'
          : isPending
            ? 'Удаляем устройства'
            : 'Подтверждение удаления устройств'
      }
      figmaNode={isSuccess ? '7318:30948' : isPending ? '7297:38554' : '7297:38422'}
      className={`country-device-delete-sheet country-device-delete-sheet--${isSuccess ? 'success' : isPending ? 'pending' : 'confirm'}`}
      overlayClassName="country-device-delete-overlay"
    >
      <div className="country-device-delete-sheet__data">
        <div className="country-device-delete-sheet__status">
          <div className="country-device-delete-sheet__icon-shell" aria-hidden="true">
            {isSuccess ? (
              <DotMorphIcon icon="check" size={64} color="#fff" />
            ) : (
              <TrashIcon className="country-device-delete-sheet__trash-icon" />
            )}
          </div>

          <div
            className="country-device-delete-sheet__title"
            aria-live={isPending || isSuccess ? 'polite' : undefined}
          >
            {isSuccess ? successTitle : title}
          </div>
        </div>
      </div>

      <div className="country-device-delete-sheet__actions">
        {isSuccess ? (
          <Button
            size="large"
            type="secondary"
            form="circle"
            color="elevated"
            fullWidth
            label="Готово"
            onClick={onClose}
          />
        ) : isPending ? (
          <Button
            size="large"
            type="primary"
            form="circle"
            color="accent"
            fullWidth
            label="Удаляем..."
            disabled
          />
        ) : (
          <>
            <Button
              size="large"
              type="primary"
              form="circle"
              color="danger"
              fullWidth
              className="country-device-delete-sheet__delete"
              label="Удалить"
              onClick={onConfirm}
            />
            <Button
              size="large"
              type="secondary"
              form="circle"
              color="elevated"
              fullWidth
              label="Отменить"
              onClick={onCancel}
            />
          </>
        )}
      </div>
    </BottomSheet>
  );
}

export { SUCCESS_AUTO_CLOSE_MS, pluralizeDevice };
