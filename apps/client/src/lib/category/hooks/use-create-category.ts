import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError } from '@/lib/api/errors/api-error';
import { getErrorMessage } from '@/lib/api/errors/common.errors';
import { restFetcher } from '@/lib/api/fetchers/rest-fetcher';
import type { Category, CreateCategoryInput } from '@/lib/api/types';

import { CategoryCacheKeys } from '../constants/cache-keys';

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (input: CreateCategoryInput) =>
      restFetcher<Category>('/categories', { method: 'POST', body: input }),
  });

  const createCategory = async (name: string) => {
    try {
      const category = await mutateAsync({ name });

      await queryClient.invalidateQueries({
        queryKey: [CategoryCacheKeys.List],
      });

      return { isSuccess: true as const, category };
    } catch (error) {
      const code = error instanceof ApiError ? error.code : undefined;

      return { isSuccess: false as const, error: getErrorMessage(code) };
    }
  };

  return { createCategory, isLoading: isPending };
};
