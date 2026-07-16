import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError } from '@/lib/api/errors/api-error';
import { getErrorMessage } from '@/lib/api/errors/common.errors';
import { restFetcher } from '@/lib/api/fetchers/rest-fetcher';
import type { Comment, CreateCommentInput } from '@/lib/api/types';

import { CommentCacheKeys } from '../constants/cache-keys';

export const useCreateComment = (blogId: string) => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (input: CreateCommentInput) =>
      restFetcher<Comment>(`/blogs/${blogId}/comments`, {
        method: 'POST',
        body: input,
      }),
  });

  const createComment = async (input: CreateCommentInput) => {
    try {
      const comment = await mutateAsync(input);

      await queryClient.invalidateQueries({
        queryKey: [CommentCacheKeys.List, blogId],
      });

      return { isSuccess: true as const, comment };
    } catch (error) {
      const code = error instanceof ApiError ? error.code : undefined;

      return { isSuccess: false as const, error: getErrorMessage(code) };
    }
  };

  return { createComment, isLoading: isPending };
};
