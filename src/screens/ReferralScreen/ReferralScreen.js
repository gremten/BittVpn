import { useRef } from 'react';
import './ReferralScreen.css';
import { AppTabBar, Block, Button, CopyIconButton } from '../../components/ui';
import { ReferralMatrixRain } from '../../components/media';
import friendsIcon from '../../assets/icons/nav/icn_m_friends.svg';
import bonusIcon from '../../assets/icons/nav/icn_m_bonus.svg';
import benefitDotlineIcon from '../../assets/icons/referral/benefit-dotline.svg';
import benefitDotIcon from '../../assets/icons/referral/benefit-dot.svg';
import { getReferralUrl, shareReferralInTelegram } from '../../telegram';

function ReferralStat({ value, label, icon }) {
  return (
    <Block className="referral-stat-card">
      <span className="referral-stat-card__copy">
        <b>{value}</b>
        <small>{label}</small>
      </span>
      <img src={icon} alt="" aria-hidden="true" />
    </Block>
  );
}

function BenefitDotline({ end = false }) {
  return (
    <img
      className={`referral-benefit-dotline${end ? ' referral-benefit-dotline--end' : ''}`}
      src={end ? benefitDotIcon : benefitDotlineIcon}
      alt=""
      aria-hidden="true"
    />
  );
}

export default function ReferralScreen({ onNotify, activeToastIds, state = 'default' }) {
  const rootRef = useRef(null);
  const statsRef = useRef(null);
  const referralUrl = getReferralUrl();
  const isEmpty = state === 'empty';

  return (
    <>
      <div
        ref={rootRef}
        className="scroll-area referral-scroll-area"
        data-figma-node={isEmpty ? '7074:118527' : '6995:114597'}
      >
        <ReferralMatrixRain rootRef={rootRef} clipTargetRef={statsRef} />

        <div className="referral-screen-content">
          <section className={`referral-balance${isEmpty ? ' referral-balance--empty' : ''}`}>
            <strong>{isEmpty ? 'Пригласи друга' : '560 ₽'}</strong>
            <span>{isEmpty ? 'Поделись ссылкой или скопируй её' : 'Для покупок в BittVPN'}</span>
          </section>

          <section
            ref={statsRef}
            className={`referral-stats${isEmpty ? ' referral-stats--empty' : ''}`}
            data-figma-node={isEmpty ? '7074:118534' : '6995:114604'}
          >
            {!isEmpty && (
              <div className="referral-stats__pair">
                <ReferralStat value="15" label="Приглашено" icon={friendsIcon} />
                <ReferralStat value="+600 ₽" label="За декабрь" icon={bonusIcon} />
              </div>
            )}

            <Block className="referral-link-card">
              <span className="referral-link-card__copy">
                <b>ссылка</b>
                <span>{referralUrl.replace(/^https?:\/\//, '')}</span>
              </span>
              <CopyIconButton
                size="large"
                type="primary"
                form="squircle"
                color="elevated"
                ariaLabel="Копировать ссылку"
                copyText={referralUrl}
                onCopy={() => onNotify?.('Скопировано в буфер обмена')}
                activeToastIds={activeToastIds}
              />
            </Block>
          </section>

          <section className="referral-benefits">
            <h2>/в чем твоя выгода</h2>

            <Block className="referral-benefits-card">
              <div className="referral-benefits-card__markers">
                <BenefitDotline />
                <BenefitDotline />
                <BenefitDotline end />
              </div>

              <div className="referral-benefits-card__list">
                <div className="referral-benefit-row">
                  <b>Приглашай друзей</b>
                  <small>Они закрепятся как твои рефералы</small>
                </div>
                <div className="referral-benefit-row">
                  <b>Получай 5% с каждой их покупки</b>
                  <small>Бонусы начисляются автоматически</small>
                </div>
                <div className="referral-benefit-row referral-benefit-row--last">
                  <b>Плати бонусами</b>
                  <small>Можно оплатить свои покупки целиком</small>
                </div>
              </div>
            </Block>
          </section>
        </div>
      </div>

      <AppTabBar type="action" showSubtle={false}>
        <Button
          size="large"
          type="primary"
          form="circle"
          color="accent"
          label="Поделиться ссылкой"
          fullWidth
          onClick={() => shareReferralInTelegram()}
        />
      </AppTabBar>
    </>
  );
}
