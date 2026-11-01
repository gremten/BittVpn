import { useEffect, useState } from 'react';
import './ProfileScreen.css';
import { Block, Button, ButtonGroup, CopyIconButton, Skeleton } from '../../components/ui';
import { NavigatorDock } from '../../components/layout';
import friendsIcon from '../../assets/icons/nav/icn_m_friends.svg';
import bonusIcon from '../../assets/icons/nav/icn_m_bonus.svg';
import profileIcon from '../../assets/icons/nav/icn_m_profile_filled.svg';
import copySmallIcon from '../../assets/icons/nav/icn_s_copy.svg';
import chevronRightIcon from '../../assets/icons/nav/icn_s_chevron_right.svg';
import { getReferralUrl, getTelegramWebApp, shareReferralInTelegram } from '../../telegram';

const loadedProfilePhotoUrls = new Set();
const profilePhotoSessionState = new Map();
const PROFILE_AVATAR_SKELETON_MAX_MS = 1200;

function stripDisplayEmoji(value = '') {
  return value
    .replace(/[\u200D\uFE0E\uFE0F]/gu, '')
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/\s+/gu, ' ')
    .trim();
}

function getProfileData() {
  const user = getTelegramWebApp()?.initDataUnsafe?.user;
  const fullName = stripDisplayEmoji([user?.first_name, user?.last_name].filter(Boolean).join(' '));
  const username = stripDisplayEmoji(user?.username || '');
  const displayName = fullName || username || 'Юзернеймич';
  const id = user?.id ? `id${user.id}` : 'id65436565';
  const photoUrl = typeof user?.photo_url === 'string' ? user.photo_url : '';
  return { displayName, id, photoUrl };
}

function ReferralStat({ value, label, icon, onClick }) {
  return (
    <button type="button" className="profile-referral-stat" onClick={onClick}>
      <span className="profile-referral-stat__copy">
        <b>{value}</b>
        <small>{label}</small>
      </span>
      <img src={icon} alt="" aria-hidden="true" />
    </button>
  );
}

function HistoryRow({ code, title, status, statusTone, price, last = false, onClick }) {
  return (
    <button
      type="button"
      className={`profile-history-row${last ? ' profile-history-row--last' : ''}`}
      onClick={onClick}
      aria-label={`${title}, ${status}, ${price}`}
    >
      <span className="profile-history-row__code">{code}</span>
      <span className="profile-history-row__copy">
        <b>{title}</b>
        <small className={`profile-history-row__status profile-history-row__status--${statusTone}`}>{status}</small>
      </span>
      <span className="profile-history-row__price">{price}</span>
    </button>
  );
}

export default function ProfileScreen({
  onOpenMain,
  onOpenLocations,
  onOpenReferral,
  onOpenHistory,
  onOpenHistoryOperation,
  onNotify,
  activeToastIds,
}) {
  const profile = getProfileData();
  const referralUrl = getReferralUrl();
  const initialPhotoState = profile.photoUrl
    ? profilePhotoSessionState.get(profile.photoUrl)
    : 'none';
  const [photoReady, setPhotoReady] = useState(
    () => !profile.photoUrl || initialPhotoState === 'loaded' || loadedProfilePhotoUrls.has(profile.photoUrl)
  );
  const [photoFailed, setPhotoFailed] = useState(
    () => initialPhotoState === 'failed'
  );
  const [photoSlow, setPhotoSlow] = useState(
    () => initialPhotoState === 'slow'
  );

  useEffect(() => {
    if (!profile.photoUrl || photoReady || photoFailed) {
      setPhotoSlow(false);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      profilePhotoSessionState.set(profile.photoUrl, 'slow');
      setPhotoSlow(true);
    }, PROFILE_AVATAR_SKELETON_MAX_MS);

    return () => window.clearTimeout(timer);
  }, [profile.photoUrl, photoReady, photoFailed]);

  const handleTabSelect = (nextTab) => {
    if (nextTab === 'referrals') {
      const scroller = document.querySelector('.profile-scroll-area');
      scroller?.scrollTo?.({ top: 0, behavior: 'smooth' });
      return;
    }
    if (nextTab === 'home') {
      onOpenMain?.();
      return;
    }
    if (nextTab === 'configurations') onOpenLocations?.();
  };

  return (
    <>
      <div className="scroll-area profile-scroll-area" data-figma-node="7015:114849">
        <div className="profile-screen-content">
          <section className="profile-user-data">
            <div className="profile-avatar" aria-hidden="true">
              {profile.photoUrl && !photoFailed ? (
                <>
                  {!photoReady && (
                    photoSlow ? (
                      <img className="profile-avatar__fallback" src={profileIcon} alt="" />
                    ) : (
                      <Skeleton
                        type="control"
                        width={106}
                        height={106}
                        radius={999}
                        className="profile-avatar__skeleton"
                      />
                    )
                  )}
                  <img
                    className={photoReady ? '' : 'profile-avatar__photo--loading'}
                    src={profile.photoUrl}
                    alt=""
                    referrerPolicy="no-referrer"
                    onLoad={() => {
                      loadedProfilePhotoUrls.add(profile.photoUrl);
                      profilePhotoSessionState.set(profile.photoUrl, 'loaded');
                      setPhotoSlow(false);
                      setPhotoFailed(false);
                      setPhotoReady(true);
                    }}
                    onError={() => {
                      profilePhotoSessionState.set(profile.photoUrl, 'failed');
                      setPhotoFailed(true);
                      setPhotoSlow(false);
                      setPhotoReady(true);
                    }}
                  />
                </>
              ) : (
                <img className="profile-avatar__fallback" src={profileIcon} alt="" />
              )}
            </div>
            <div className="profile-user-data__text">
              <h1>{profile.displayName}</h1>
              <button
                type="button"
                className="profile-user-id"
                onClick={async () => {
                  try {
                    await navigator.clipboard?.writeText?.(profile.id);
                  } catch (_) {
                    // Clipboard may be unavailable in a regular HTTP preview.
                  }
                  onNotify?.('ID скопирован');
                }}
              >
                <span>{profile.id}</span>
                <img className="profile-user-id__copy" src={copySmallIcon} alt="" aria-hidden="true" />
              </button>
            </div>
          </section>

          <Block className="profile-referral-card">
            <div className="profile-referral-card__data">
              <button type="button" className="profile-referral-card__entry" onClick={onOpenReferral}>
                <span className="profile-referral-card__bar">
                  <b>твоя рефералка</b>
                  <span className="profile-referral-card__chevron" aria-hidden="true"><img src={chevronRightIcon} alt="" /></span>
                </span>
                <span className="profile-referral-card__desc">даем 5% с каждой покупки друга</span>
              </button>

              <div className="profile-referral-card__stats">
                <ReferralStat value="15" label="Приглашено" icon={friendsIcon} onClick={onOpenReferral} />
                <ReferralStat value="560 ₽" label="Бонусы" icon={bonusIcon} onClick={onOpenReferral} />
              </div>
            </div>

            <ButtonGroup type="horizontal" className="profile-referral-card__actions">
              <Button
                size="large"
                type="secondary"
                form="squircle"
                color="elevated"
                label="Поделиться в тг"
                fullWidth
                onClick={() => shareReferralInTelegram()}
              />
              <CopyIconButton
                size="large"
                type="primary"
                form="squircle"
                color="elevated"
                ariaLabel="Копировать"
                copyText={referralUrl}
                onCopy={() => onNotify?.('Скопировано в буфер обмена')}
                activeToastIds={activeToastIds}
              />
            </ButtonGroup>
          </Block>

          <section className="profile-history-section">
            <div className="profile-history-bar">
              <h2>/история операций</h2>
              <Button size="xsmall" type="outlined" form="circle" color="none" label="Все" onClick={onOpenHistory} />
            </div>

            <Block className="profile-history-card">
              <div className="profile-history-group">
                <div className="profile-history-date">21 марта, воскресенье</div>
                <div className="profile-history-list">
                  <HistoryRow
                    code="DE"
                    title="Германия — 1 мес."
                    status="Ожидает оплату"
                    statusTone="warning"
                    price="199 ₽"
                    onClick={() => onOpenHistoryOperation?.({
                      code: 'DE',
                      title: 'Германия — 1 мес.',
                      status: 'Ожидает оплату',
                      statusTone: 'warning',
                      price: '199 ₽',
                      detailState: 'waiting',
                      month: 'Март',
                      date: '21 марта, воскресенье',
                    })}
                  />
                  <HistoryRow
                    code="JP"
                    title="Япония — 12 мес."
                    status="Платеж просрочен"
                    statusTone="danger"
                    price="3 132 ₽"
                    onClick={() => onOpenHistoryOperation?.({
                      code: 'JP',
                      title: 'Япония — 12 мес.',
                      status: 'Платеж просрочен',
                      statusTone: 'danger',
                      price: '3 132 ₽',
                      detailState: 'expired',
                      month: 'Март',
                      date: '21 марта, воскресенье',
                    })}
                    last
                  />
                </div>
              </div>

              <div className="profile-history-group">
                <div className="profile-history-date">20 февраля, четверг</div>
                <div className="profile-history-list">
                  <HistoryRow
                    code="RU"
                    title="BittRussia — 1 мес."
                    status="Успешно"
                    statusTone="success"
                    price="98 ₽"
                    onClick={() => onOpenHistoryOperation?.({
                      code: 'RU',
                      title: 'BittRussia — 1 мес.',
                      status: 'Успешно',
                      statusTone: 'success',
                      price: '98 ₽',
                      detailState: 'success',
                      month: 'Февраль',
                      date: '20 февраля, четверг',
                    })}
                    last
                  />
                </div>
              </div>
            </Block>
          </section>
        </div>
      </div>

      <NavigatorDock selected="referrals" onSelect={handleTabSelect} />
    </>
  );
}
