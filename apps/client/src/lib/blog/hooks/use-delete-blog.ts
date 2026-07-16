import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError } from '@/lib/api/errors/api-error';
import { getErrorMessage } from '@/lib/api/errors/common.errors';
import { restFetcher } from '@/lib/api/fetchers/rest-fetcher';

import { BlogCacheKeys } from '../constants/cache-keys';

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) =>
      restFetcher<{ id: string }>(`/blogs/${id}`, { method: 'DELETE' }),
  });

  const deleteBlog = async (id: string) => {
    try {
      await mutateAsync(id);

      await queryClient.invalidateQueries({ queryKey: [BlogCacheKeys.List] });

      return { isSuccess: true as const };
    } catch (error) {
      const code = error instanceof ApiError ? error.code : undefined;

      return { isSuccess: false as const, error: getErrorMessage(code) };
    }
  };

  return { deleteBlog, isLoading: isPending };
};
