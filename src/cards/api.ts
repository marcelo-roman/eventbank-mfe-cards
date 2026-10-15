import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { get, post, put } from '../shared/api';
import { type AccountSummary, type CardView, type CommandResult, type PurchaseView } from '../shared/types';

const cardsKey = ['cards'] as const;
const purchasesKey = (cardId: string) => ['cards', cardId, 'purchases'] as const;

export function useAccounts() {
  return useQuery({ queryKey: ['accounts'], queryFn: () => get<AccountSummary[]>('/accounts') });
}

export function useCards() {
  return useQuery({ queryKey: cardsKey, queryFn: () => get<CardView[]>('/cards'), refetchInterval: 2000 });
}

export function usePurchases(cardId: string) {
  return useQuery({
    queryKey: purchasesKey(cardId),
    queryFn: () => get<PurchaseView[]>(`/cards/${cardId}/purchases`),
    refetchInterval: (query) => (query.state.data?.some((purchase) => purchase.status === 'Authorized') ? 600 : 3000),
  });
}

function useCardMutation<TInput>(mutationFn: (input: TInput) => Promise<CommandResult>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: TInput) => {
      const result = await mutationFn(input);
      await new Promise((resolve) => setTimeout(resolve, 500));
      return result;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: cardsKey }),
  });
}

export function useIssueCard() {
  return useCardMutation((accountId: string) => post<CommandResult>('/cards', { accountId }));
}

export function useBlockToggle(card: CardView) {
  return useCardMutation(() =>
    post<CommandResult>(`/cards/${card.id}/${card.status === 'Blocked' ? 'unblock' : 'block'}`),
  );
}

export function useChangeLimit(cardId: string) {
  return useCardMutation((dailyLimit: number) => put<CommandResult>(`/cards/${cardId}/daily-limit`, { dailyLimit }));
}

export function usePurchase(cardId: string) {
  return useCardMutation((input: { merchant: string; amount: number }) =>
    post<CommandResult>(`/cards/${cardId}/purchases`, input),
  );
}
