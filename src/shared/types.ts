export interface CommandResult {
  id: string;
  version: number;
}

export interface AccountSummary {
  id: string;
  branch: string;
  number: string;
  currency: string;
  balance: number;
  status: 'Open' | 'Closed';
}

export interface CardView {
  id: string;
  accountId: string;
  holder: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  status: 'Active' | 'Blocked';
  dailyLimit: number;
  spentToday: number;
  currency: string;
}

export type PurchaseStatus = 'Authorized' | 'Captured' | 'Reversed' | 'Declined';

export interface PurchaseView {
  id: string;
  cardId: string;
  merchant: string;
  amount: number;
  currency: string;
  status: PurchaseStatus;
  reason: string | null;
  requestedAt: string;
}
