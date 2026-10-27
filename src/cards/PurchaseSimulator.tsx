import { type SyntheticEvent, useState } from 'react';
import { ErrorMessage } from '../shared/ErrorMessage';
import { useLocale } from '../shared/i18n/LocaleContext';
import { type CardView } from '../shared/types';
import { usePurchase } from './api';

export function PurchaseSimulator({ card }: { card: CardView }) {
  const { t } = useLocale();
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
      <h3>{t.simulator.title}</h3>
      <p className="muted">{t.simulator.lede}</p>
      <div className="purchase-fields">
        <label className="field">
          <span>{t.simulator.merchant}</span>
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
          <span>{t.simulator.amountIn(card.currency)}</span>
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
        {purchase.isPending ? t.simulator.paying : t.simulator.pay}
      </button>
      <ErrorMessage error={purchase.error} />
    </form>
  );
}
