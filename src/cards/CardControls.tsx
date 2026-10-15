import { type SyntheticEvent, useState } from 'react';
import { ErrorMessage } from '../shared/ErrorMessage';
import { formatMoney } from '../shared/format';
import { type CardView } from '../shared/types';
import { useBlockToggle, useChangeLimit } from './api';

export function CardControls({ card }: { card: CardView }) {
  const toggle = useBlockToggle(card);
  const changeLimit = useChangeLimit(card.id);
  const [limit, setLimit] = useState(String(card.dailyLimit));
  const used = Math.min(100, (card.spentToday / card.dailyLimit) * 100);

  const saveLimit = (event: SyntheticEvent) => {
    event.preventDefault();
    changeLimit.mutate(Number(limit));
  };

  return (
    <div className="card-controls">
      <div className="limit-meter">
        <span>
          Spent today <strong>{formatMoney(card.spentToday, card.currency)}</strong> of{' '}
          {formatMoney(card.dailyLimit, card.currency)}
        </span>
        <div
          className="meter"
          role="meter"
          aria-valuenow={card.spentToday}
          aria-valuemin={0}
          aria-valuemax={card.dailyLimit}
          aria-label="Daily limit used"
        >
          <div className="meter-fill" style={{ width: `${used}%` }} />
        </div>
      </div>
      <form className="limit-form" onSubmit={saveLimit}>
        <label className="field">
          <span>Daily limit in {card.currency}</span>
          <input
            type="number"
            min="1"
            step="0.01"
            value={limit}
            onChange={(event) => {
              setLimit(event.target.value);
            }}
          />
        </label>
        <button type="submit" className="button" disabled={changeLimit.isPending}>
          Save limit
        </button>
      </form>
      <button
        type="button"
        className={card.status === 'Blocked' ? 'button primary' : 'button'}
        disabled={toggle.isPending}
        onClick={() => {
          toggle.mutate(undefined);
        }}
      >
        {card.status === 'Blocked' ? 'Unblock card' : 'Block card'}
      </button>
      <ErrorMessage error={toggle.error ?? changeLimit.error} />
    </div>
  );
}
