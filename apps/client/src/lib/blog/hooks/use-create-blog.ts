import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError } from '@/lib/api/errors/api-error';
import { getErrorMessage } from '@/lib/api/errors/common.errors';
import { restFetcher } from '@/lib/api/fetchers/rest-fetcher';
import type { Blog, CreateBlogInput } from '@/lib/api/types';

import { BlogCacheKeys } from '../constants/cache-keys';

export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (input: CreateBlogInput) =>
      restFetcher<Blog>('/blogs', { method: 'POST', body: input }),
  });

  const createBlog = async (input: CreateBlogInput) => {
    try {
      const blog = await mutateAsync(input);

      await queryClient.invalidateQueries({ queryKey: [BlogCacheKeys.List] });

      return { isSuccess: true as const, blog };
    } catch (error) {
      const code = error instanceof ApiError ? error.code : undefined;

      return { isSuccess: false as const, error: getErrorMessage(code) };
    }
  };

  return { createBlog, isLoading: isPending };
};
