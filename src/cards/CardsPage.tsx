import { ErrorMessage } from '../shared/ErrorMessage';
import { useLocale } from '../shared/i18n/LocaleContext';
import { type AccountSummary, type CardView } from '../shared/types';
import { BankCard } from './BankCard';
import { CardControls } from './CardControls';
import { PurchaseList } from './PurchaseList';
import { PurchaseSimulator } from './PurchaseSimulator';
import { useAccounts, useCards, useIssueCard } from './api';

function RequestCard({ account }: { account: AccountSummary }) {
  const { t } = useLocale();
  const issue = useIssueCard();
  return (
    <section className="panel card-request">
      <h2>{t.cards.accountTitle(account.currency, account.branch, account.number)}</h2>
      <p className="muted">{t.cards.noCard}</p>
      <button
        type="button"
        className="button primary"
        disabled={issue.isPending}
        onClick={() => {
          issue.mutate(account.id);
        }}
      >
        {issue.isPending ? t.cards.issuing : t.cards.requestCard}
      </button>
      <ErrorMessage error={issue.error} />
    </section>
  );
}

function CardPanel({ card, account }: { card: CardView; account: AccountSummary }) {
  const { t } = useLocale();
  return (
    <section className="panel card-panel" aria-label={t.cards.cardForAccount(account.number)}>
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
  const { t } = useLocale();
  const accounts = useAccounts();
  const cards = useCards();
  const open = (accounts.data ?? []).filter((account) => account.status === 'Open');

  return (
    <div className="page">
      <header className="page-header">
        <h1>{t.cards.title}</h1>
        <p className="lede">{t.cards.lede}</p>
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
