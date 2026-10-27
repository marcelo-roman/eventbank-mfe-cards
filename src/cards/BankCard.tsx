import { useLocale } from '../shared/i18n/LocaleContext';
import { type CardView } from '../shared/types';

export function BankCard({ card }: { card: CardView }) {
  const { t } = useLocale();
  const expiry = `${String(card.expiryMonth).padStart(2, '0')}/${String(card.expiryYear).slice(-2)}`;
  return (
    <div
      className={card.status === 'Blocked' ? 'bank-card blocked' : 'bank-card'}
      aria-label={t.bankCard.endingIn(card.last4)}
    >
      <span className="bank-card-brand">{t.bankCard.brand}</span>
      <span className="bank-card-number">•••• •••• •••• {card.last4}</span>
      <span className="bank-card-holder">{card.holder}</span>
      <span className="bank-card-expiry">{t.bankCard.validThru(expiry)}</span>
      {card.status === 'Blocked' && <span className="bank-card-blocked">{t.bankCard.blocked}</span>}
    </div>
  );
}
