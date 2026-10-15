import { describeReason, formatMoney, formatTime } from '../shared/format';
import { type PurchaseView } from '../shared/types';
import { usePurchases } from './api';

const statusLabels: Record<PurchaseView['status'], string> = {
  Authorized: 'Waiting for the account',
  Captured: 'Approved',
  Reversed: 'Reversed',
  Declined: 'Declined',
};

export function PurchaseList({ cardId }: { cardId: string }) {
  const purchases = usePurchases(cardId);

  if (!purchases.data?.length) {
    return <p className="empty">No purchases yet.</p>;
  }

  return (
    <ul className="purchase-list" aria-label="Purchases">
      {purchases.data.map((purchase) => (
        <li key={purchase.id} className={`purchase purchase-${purchase.status.toLowerCase()}`}>
          <span className="purchase-merchant">{purchase.merchant}</span>
          <span className="purchase-status">
            {statusLabels[purchase.status]}
            {purchase.reason ? `: ${describeReason(purchase.reason)}` : ''}
          </span>
          <time className="muted" dateTime={purchase.requestedAt}>
            {formatTime(purchase.requestedAt)}
          </time>
          <span className="amount">{formatMoney(purchase.amount, purchase.currency)}</span>
        </li>
      ))}
    </ul>
  );
}
