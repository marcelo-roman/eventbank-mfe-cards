import { type CardView } from '../shared/types';

export function BankCard({ card }: { card: CardView }) {
  const expiry = `${String(card.expiryMonth).padStart(2, '0')}/${String(card.expiryYear).slice(-2)}`;
  return (
    <div
      className={card.status === 'Blocked' ? 'bank-card blocked' : 'bank-card'}
      aria-label={`Card ending in ${card.last4}`}
    >
      <span className="bank-card-brand">EventBank debit</span>
      <span className="bank-card-number">•••• •••• •••• {card.last4}</span>
      <span className="bank-card-holder">{card.holder}</span>
      <span className="bank-card-expiry">Valid thru {expiry}</span>
      {card.status === 'Blocked' && <span className="bank-card-blocked">Blocked</span>}
    </div>
  );
}
