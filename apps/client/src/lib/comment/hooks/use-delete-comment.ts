import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError } from '@/lib/api/errors/api-error';
import { getErrorMessage } from '@/lib/api/errors/common.errors';
import { restFetcher } from '@/lib/api/fetchers/rest-fetcher';

import { CommentCacheKeys } from '../constants/cache-keys';

export const useDeleteComment = (blogId: string) => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) =>
      restFetcher<{ id: string }>(`/blogs/${blogId}/comments/${id}`, {
        method: 'DELETE',
      }),
  });

  const deleteComment = async (id: string) => {
    try {
      await mutateAsync(id);

      await queryClient.invalidateQueries({
        queryKey: [CommentCacheKeys.List, blogId],
      });

      return { isSuccess: true as const };
    } catch (error) {
      const code = error instanceof ApiError ? error.code : undefined;

      return { isSuccess: false as const, error: getErrorMessage(code) };
    }
  };

  return { deleteComment, isLoading: isPending };
};
