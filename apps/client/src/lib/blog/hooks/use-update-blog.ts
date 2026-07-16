import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError } from '@/lib/api/errors/api-error';
import { getErrorMessage } from '@/lib/api/errors/common.errors';
import { restFetcher } from '@/lib/api/fetchers/rest-fetcher';
import type { Blog, UpdateBlogInput } from '@/lib/api/types';

import { BlogCacheKeys } from '../constants/cache-keys';

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateBlogInput }) =>
      restFetcher<Blog>(`/blogs/${id}`, { method: 'PATCH', body: input }),
  });

  const updateBlog = async (id: string, input: UpdateBlogInput) => {
    try {
      const blog = await mutateAsync({ id, input });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [BlogCacheKeys.List] }),
        queryClient.invalidateQueries({ queryKey: [BlogCacheKeys.Detail, id] }),
      ]);

      return { isSuccess: true as const, blog };
    } catch (error) {
      const code = error instanceof ApiError ? error.code : undefined;

      return { isSuccess: false as const, error: getErrorMessage(code) };
    }
  };

  return { updateBlog, isLoading: isPending };
};
