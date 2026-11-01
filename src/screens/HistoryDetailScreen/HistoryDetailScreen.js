import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import './HistoryDetailScreen.css';
import { AppTabBar, Block, Button, OrderStatus } from '../../components/ui';
import { DetailRow } from '../../components/ui/internal';

export const HISTORY_DETAIL_FIGMA_NODES = Object.freeze({
  success: '6128:23400',
  waiting: '6128:23570',
  processing: '6128:23670',
  error: '6137:30574',
  expired: '6409:29297',
  referral: '7166:120223',
  loading: '6532:50286',
});

const STATUS_CONFIG = Object.freeze({
  success: {
    type: 'success',
    title: 'Оплачено',
    subtitle: 'Платёж успешно обработан',
  },
  waiting: {
    type: 'processing',
    title: 'Ожидаем оплату',
    countdown: true,
    cta: 'Продолжить оплату',
  },
  processing: {
    type: 'processing',
    title: 'Платёж в обработке',
    subtitle: 'Ждем ответ от сервиса оплаты — до 5 минут',
  },
  error: {
    type: 'failure',
    title: 'Ошибка платежа',
    subtitle: 'Платёж не прошёл. Деньги не списаны',
    cta: 'Повторить оплату',
  },
  expired: {
    type: 'failure',
    title: 'Срок оплаты истёк',
    subtitle: 'Заказ отменён. Деньги не списаны',
    cta: 'Повторить оплату',
  },
  referral: {
    type: 'success',
    title: 'Бонус начислен',
    subtitle: 'Кто-то из ваших друзей совершил оплату',
  },
  loading: {
    type: 'failure',
    title: 'Ожидаем оплату',
    countdown: true,
  },
});

const LOCATION_BY_CODE = Object.freeze({
  DE: 'Германия',
  KZ: 'Казахстан',
  JP: 'Япония',
  RU: 'BittRussia',
});

const PAYMENT_SUCCESS_MORPH_MS = 450;
const PAYMENT_COUNTDOWN_SECONDS = 9 * 60 + 45;
const PAYMENT_COUNTDOWN_CYCLE_SECONDS = PAYMENT_COUNTDOWN_SECONDS + 1;
const paymentCountdownOrigins = new Map();

function pluralizeMonths(value) {
  const n = Number(value) || 1;
  const mod100 = n % 100;
  const mod10 = n % 10;
  if (mod100 >= 11 && mod100 <= 14) return `${n} месяцев`;
  if (mod10 === 1) return `${n} месяц`;
  if (mod10 >= 2 && mod10 <= 4) return `${n} месяца`;
  return `${n} месяцев`;
}

function getAccessTerm(title = '') {
  const match = title.match(/—\s*(\d+)\s*мес\./i);
  return pluralizeMonths(match?.[1] || 1);
}

function getOperationName(operation) {
  return operation?.locationName || LOCATION_BY_CODE[operation?.code] || operation?.title?.split(' — ')[0] || 'Германия';
}

function getOperationDate(operation) {
  const date = operation?.date?.split(',')[0]?.trim();
  return date ? `${date} 2026` : '24 июля 2026';
}

function getCreatedAt(operation) {
  return `${getOperationDate(operation)}, 16:42`;
}

function getReferralAmount(operation) {
  return (operation?.price || '24 ₽').replace(/^\+\s*/, '');
}

function getPaymentCountdownKey(operation) {
  if (operation?.paymentId) return String(operation.paymentId);

  const parts = [
    operation?.groupId,
    operation?.date,
    operation?.title,
    operation?.price,
  ].filter(Boolean);

  return parts.length ? parts.join('|') : 'history-detail-payment';
}

function getCountdownOrigin(key) {
  if (!paymentCountdownOrigins.has(key)) {
    paymentCountdownOrigins.set(key, Date.now());
  }
  return paymentCountdownOrigins.get(key);
}

function getRemainingPaymentSeconds(origin) {
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - origin) / 1000));
  return PAYMENT_COUNTDOWN_SECONDS - (elapsedSeconds % PAYMENT_COUNTDOWN_CYCLE_SECONDS);
}

function formatCountdown(seconds) {
  const minutes = Math.floor(seconds / 60);
  const restSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(restSeconds).padStart(2, '0')}`;
}

function usePaymentCountdown(operation, enabled) {
  const countdownKey = useMemo(() => getPaymentCountdownKey(operation), [
    operation?.paymentId,
    operation?.groupId,
    operation?.date,
    operation?.title,
    operation?.price,
  ]);

  const [remainingSeconds, setRemainingSeconds] = useState(PAYMENT_COUNTDOWN_SECONDS);

  useEffect(() => {
    if (!enabled) return undefined;

    const origin = getCountdownOrigin(countdownKey);
    let timer = 0;

    const tick = () => {
      setRemainingSeconds(getRemainingPaymentSeconds(origin));

      const elapsedMs = Math.max(0, Date.now() - origin);
      const msToNextSecond = 1000 - (elapsedMs % 1000);
      timer = window.setTimeout(tick, Math.max(50, msToNextSecond + 8));
    };

    tick();
    return () => window.clearTimeout(timer);
  }, [countdownKey, enabled]);

  return formatCountdown(remainingSeconds);
}

function DetailsBlock({ rows, className }) {
  return (
    <Block className={`history-detail-block${className ? ` ${className}` : ''}`}>
      <div className="history-detail-rows">
        {rows.map((row, index) => (
          <DetailRow
            key={`${row.label}-${index}`}
            label={row.label}
            value={row.value}
            end={index === rows.length - 1}
          >
            {row.children}
          </DetailRow>
        ))}
      </div>
    </Block>
  );
}

function ReceiptLink() {
  return (
    <button type="button" className="history-detail-link" onClick={() => {}}>
      Открыть
    </button>
  );
}

function SupportButton() {
  return (
    <Button
      size="large"
      type="secondary"
      form="circle"
      color="surface"
      fullWidth
      onClick={() => {}}
    >
      Обратиться в поддержку
    </Button>
  );
}

function SuccessDetails({ operation }) {
  return (
    <>
      <DetailsBlock rows={[
        { label: 'Локация', value: getOperationName(operation) },
        { label: 'Сумма', value: operation?.price || '199 ₽' },
        { label: 'Чек об оплате', children: <ReceiptLink /> },
      ]} />

      <DetailsBlock rows={[
        { label: 'Срок доступа', value: getAccessTerm(operation?.title) },
        { label: 'Начало', value: '24 июля 2026' },
        { label: 'Окончание', value: '24 августа 2026' },
      ]} />

      <div className="history-detail-block-button">
        <DetailsBlock rows={[
          { label: 'Платеж создан', value: getCreatedAt(operation) },
          { label: 'Способ оплаты', value: 'Карта *5678' },
          { label: 'Платежный сервис', value: operation?.paymentService || 'ЮKassa' },
          { label: 'Номер платежа', value: '2f47...8ac1' },
        ]} />
        <SupportButton />
      </div>
    </>
  );
}

function WaitingDetails({ operation }) {
  return (
    <>
      <DetailsBlock rows={[
        { label: 'Локация', value: getOperationName(operation) },
        { label: 'Сумма', value: operation?.price || '199 ₽' },
        { label: 'Чек об оплате', children: <ReceiptLink /> },
      ]} />

      <DetailsBlock rows={[
        { label: 'Платеж создан', value: getCreatedAt(operation) },
        { label: 'Платежный сервис', value: operation?.paymentService || 'ЮKassa' },
        { label: 'Номер платежа', value: '2f47...8ac1' },
      ]} />
    </>
  );
}

function ProcessingDetails({ operation }) {
  return (
    <>
      <DetailsBlock rows={[
        { label: 'Локация', value: getOperationName(operation) },
        { label: 'Срок доступа', value: getAccessTerm(operation?.title) },
        { label: 'Доп. устройства', value: operation?.extraDevices || '2 ед.' },
        { label: 'Сумма', value: operation?.price || '399 ₽' },
      ]} />

      <div className="history-detail-block-button">
        <DetailsBlock rows={[
          { label: 'Платеж создан', value: getCreatedAt(operation) },
          { label: 'Способ оплаты', value: 'Карта *5678' },
          { label: 'Платежный сервис', value: operation?.paymentService || 'ЮKassa' },
          { label: 'Номер платежа', value: '2f47...8ac1' },
        ]} />
        <SupportButton />
      </div>
    </>
  );
}

function FailureDetails({ operation, expired = false }) {
  return (
    <>
      <DetailsBlock rows={[
        { label: 'Локация', value: getOperationName(operation) },
        { label: 'Срок доступа', value: getAccessTerm(operation?.title) },
        { label: 'Сумма', value: operation?.price || '399 ₽' },
      ]} />

      <div className="history-detail-block-button">
        <DetailsBlock rows={[
          { label: 'Платеж создан', value: getCreatedAt(operation) },
          ...(!expired ? [{ label: 'Способ оплаты', value: 'Карта *5678' }] : []),
          { label: 'Платежный сервис', value: operation?.paymentService || 'ЮKassa' },
          { label: 'Номер платежа', value: '2f47...8ac1' },
        ]} />
        <SupportButton />
      </div>
    </>
  );
}

function ReferralDetails({ operation }) {
  return (
    <div className="history-detail-block-button">
      <DetailsBlock rows={[
        { label: 'Сумма', value: getReferralAmount(operation) },
        { label: 'Дата начисления', value: getOperationDate(operation) },
      ]} />
      <SupportButton />
    </div>
  );
}

function LoadingDetails() {
  return (
    <>
      <Block state="loading" className="history-detail-skeleton-block" aria-label="Загрузка деталей платежа" />
      <Block state="loading" className="history-detail-skeleton-block" aria-hidden="true" />
    </>
  );
}

function DetailBody({ state, operation }) {
  if (state === 'loading') return <LoadingDetails />;
  if (state === 'referral') return <ReferralDetails operation={operation} />;
  if (state === 'success') return <SuccessDetails operation={operation} />;
  if (state === 'waiting') return <WaitingDetails operation={operation} />;
  if (state === 'processing') return <ProcessingDetails operation={operation} />;
  if (state === 'expired') return <FailureDetails operation={operation} expired />;
  return <FailureDetails operation={operation} />;
}

export default function HistoryDetailScreen({ operation, onContinuePayment }) {
  const state = operation?.detailState && STATUS_CONFIG[operation.detailState]
    ? operation.detailState
    : 'loading';
  const previousStateRef = useRef(state);
  const [successMorphFrom, setSuccessMorphFrom] = useState(null);

  useLayoutEffect(() => {
    const previousState = previousStateRef.current;
    previousStateRef.current = state;

    if (
      previousState === 'waiting'
      && state === 'success'
      && operation?.paymentOrigin === 'checkout'
    ) {
      // useLayoutEffect prevents a one-frame flash of the final check before
      // the timer -> check morph is mounted.
      setSuccessMorphFrom('processing');
      return;
    }

    setSuccessMorphFrom(null);
  }, [operation?.paymentId, operation?.paymentOrigin, state]);

  useEffect(() => {
    if (!successMorphFrom) return undefined;

    const timer = window.setTimeout(() => {
      setSuccessMorphFrom(null);
    }, PAYMENT_SUCCESS_MORPH_MS);

    return () => window.clearTimeout(timer);
  }, [successMorphFrom]);

  const config = STATUS_CONFIG[state];
  const successTransitioning = state === 'success' && successMorphFrom === 'processing';
  const hasFixedCta = Boolean(config.cta) || successTransitioning;
  const countdown = usePaymentCountdown(operation, Boolean(config.countdown));
  const subtitle = config.countdown
    ? `Заказ без оплаты отменится через ${countdown}`
    : config.subtitle;

  return (
    <div
      className="scroll-area history-detail-scroll-area"
      data-figma-node={HISTORY_DETAIL_FIGMA_NODES[state]}
    >
      <div className={`history-detail-content${hasFixedCta ? ' history-detail-content--with-cta' : ''}`}>
        <div className={`history-detail-status history-detail-status--${state}`}>
          <OrderStatus
            type={config.type}
            state={state === 'loading' ? 'loading' : 'default'}
            morphFrom={successMorphFrom}
          />
          <div
            className={`history-detail-status__copy${successTransitioning ? ' history-detail-status__copy--success-transition' : ''}`}
          >
            <h1>{config.title}</h1>
            <p>{subtitle}</p>
          </div>
        </div>

        <div
          className={`history-detail-body${successTransitioning ? ' history-detail-body--success-transition' : ''}`}
        >
          <DetailBody state={state} operation={operation} />
        </div>
      </div>

      {hasFixedCta && (
        <AppTabBar type="action" showSubtle={false} hidden={successTransitioning}>
          <Button
            size="large"
            type="primary"
            form="circle"
            color="accent"
            fullWidth
            onClick={state === 'waiting' ? onContinuePayment : undefined}
          >
            {config.cta || STATUS_CONFIG.waiting.cta}
          </Button>
        </AppTabBar>
      )}
    </div>
  );
}
