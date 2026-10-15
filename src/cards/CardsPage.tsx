import { ErrorMessage } from '../shared/ErrorMessage';
import { type AccountSummary, type CardView } from '../shared/types';
import { BankCard } from './BankCard';
import { CardControls } from './CardControls';
import { PurchaseList } from './PurchaseList';
import { PurchaseSimulator } from './PurchaseSimulator';
import { useAccounts, useCards, useIssueCard } from './api';

function RequestCard({ account }: { account: AccountSummary }) {
  const issue = useIssueCard();
  return (
    <section className="panel card-request">
      <h2>
        {account.currency} account {account.branch}/{account.number}
      </h2>
      <p className="muted">No card yet. A virtual debit card charges this account directly.</p>
      <button
        type="button"
        className="button primary"
        disabled={issue.isPending}
        onClick={() => {
          issue.mutate(account.id);
        }}
      >
        {issue.isPending ? 'Issuing…' : 'Request a virtual card'}
      </button>
      <ErrorMessage error={issue.error} />
    </section>
  );
}

function CardPanel({ card, account }: { card: CardView; account: AccountSummary }) {
  return (
    <section className="panel card-panel" aria-label={`Card for account ${account.number}`}>
      <div className="card-top">
        <BankCard card={card} />
        <CardControls card={card} />
      </div>
      <div className="card-bottom">
        <PurchaseSimulator card={card} />
        <PurchaseList cardId={card.id} />
      </div>
    </section>
  );
}

export function CardsPage() {
  const accounts = useAccounts();
  const cards = useCards();
  const open = (accounts.data ?? []).filter((account) => account.status === 'Open');

  return (
    <div className="page">
      <header className="page-header">
        <h1>Cards</h1>
        <p className="lede">
          Each card is an event-sourced aggregate that reserves its daily limit, asks the account to pay, and gives the
          limit back if the account declines.
        </p>
      </header>
      <ErrorMessage error={accounts.error ?? cards.error} />
      <div className="card-stack">
        {open.map((account) => {
          const card = cards.data?.find((candidate) => candidate.accountId === account.id);
          return card ? (
            <CardPanel key={account.id} card={card} account={account} />
          ) : (
            <RequestCard key={account.id} account={account} />
          );
        })}
      </div>
    </div>
  );
}
