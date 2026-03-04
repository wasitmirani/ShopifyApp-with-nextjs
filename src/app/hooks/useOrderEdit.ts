import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@shopify/app-bridge-react';
import api from '@/lib/api';

export function useOrderEdit(orderId: string) {
  const queryClient = useQueryClient();
  const { show } = useToast();

  return useMutation({
    mutationFn: (data: EditOrderPayload) =>
      api.post(`/orders/${encodeURIComponent(orderId)}/edit`, data).then(r => r.data),

    onSuccess: () => {
      show('Order updated successfully', { duration: 3000 });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      queryClient.invalidateQueries({ queryKey: ['audit'] });
    },

    onError: (err: any) => {
      show(err.response?.data?.message ?? 'Edit failed', { isError: true });
    },
  });
}