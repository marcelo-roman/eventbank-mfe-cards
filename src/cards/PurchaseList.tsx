import { describeReason, formatMoney, formatTime } from '../shared/format';
import { useLocale } from '../shared/i18n/LocaleContext';
import { usePurchases } from './api';

export function PurchaseList({ cardId }: { cardId: string }) {
  const { locale, t } = useLocale();
  const purchases = usePurchases(cardId);

  if (!purchases.data?.length) {
    return <p className="empty">{t.purchases.empty}</p>;
  }

  return (
    <ul className="purchase-list" aria-label={t.purchases.label}>
      {purchases.data.map((purchase) => (
        <li key={purchase.id} className={`purchase purchase-${purchase.status.toLowerCase()}`}>
          <span className="purchase-merchant">{purchase.merchant}</span>
          <span className="purchase-status">
            {t.purchases.statuses[purchase.status]}
            {purchase.reason ? `: ${describeReason(purchase.reason, t.reasons)}` : ''}
          </span>
          <time className="muted" dateTime={purchase.requestedAt}>
            {formatTime(purchase.requestedAt, locale)}
          </time>
          <span className="amount">{formatMoney(purchase.amount, purchase.currency, locale)}</span>
        </li>
      ))}
    </ul>
  );
}
