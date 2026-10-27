import { type SyntheticEvent, useState } from 'react';
import { ErrorMessage } from '../shared/ErrorMessage';
import { formatMoney } from '../shared/format';
import { useLocale } from '../shared/i18n/LocaleContext';
import { type CardView } from '../shared/types';
import { useBlockToggle, useChangeLimit } from './api';

export function CardControls({ card }: { card: CardView }) {
  const { locale, t } = useLocale();
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
          {t.controls.spentToday} <strong>{formatMoney(card.spentToday, card.currency, locale)}</strong> {t.controls.of}{' '}
          {formatMoney(card.dailyLimit, card.currency, locale)}
        </span>
        <div
          className="meter"
          role="meter"
          aria-valuenow={card.spentToday}
          aria-valuemin={0}
          aria-valuemax={card.dailyLimit}
          aria-label={t.controls.limitUsed}
        >
          <div className="meter-fill" style={{ width: `${used}%` }} />
        </div>
      </div>
      <form className="limit-form" onSubmit={saveLimit}>
        <label className="field">
          <span>{t.controls.limitIn(card.currency)}</span>
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
          {t.controls.saveLimit}
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
        {card.status === 'Blocked' ? t.controls.unblock : t.controls.block}
      </button>
      <ErrorMessage error={toggle.error ?? changeLimit.error} />
    </div>
  );
}
