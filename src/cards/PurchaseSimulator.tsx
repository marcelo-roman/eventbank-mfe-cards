import { type SyntheticEvent, useState } from 'react';
import { ErrorMessage } from '../shared/ErrorMessage';
import { type CardView } from '../shared/types';
import { usePurchase } from './api';

export function PurchaseSimulator({ card }: { card: CardView }) {
  const purchase = usePurchase(card.id);
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');

  const pay = (event: SyntheticEvent) => {
    event.preventDefault();
    purchase.mutate(
      { merchant, amount: Number(amount) },
      {
        onSuccess: () => {
          setAmount('');
        },
      },
    );
  };

  return (
    <form className="form purchase-form" onSubmit={pay}>
      <h3>Simulate a purchase</h3>
      <p className="muted">
        Acts as the card terminal of a shop. The card checks its status and limit, then charges the account.
      </p>
      <div className="purchase-fields">
        <label className="field">
          <span>Merchant</span>
          <input
            value={merchant}
            onChange={(event) => {
              setMerchant(event.target.value);
            }}
            placeholder="Padaria Real"
            required
          />
        </label>
        <label className="field">
          <span>Amount in {card.currency}</span>
          <input
            type="number"
            inputMode="decimal"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(event) => {
              setAmount(event.target.value);
            }}
            required
          />
        </label>
      </div>
      <button type="submit" className="button primary" disabled={purchase.isPending}>
        {purchase.isPending ? 'Paying…' : 'Pay with this card'}
      </button>
      <ErrorMessage error={purchase.error} />
    </form>
  );
}
