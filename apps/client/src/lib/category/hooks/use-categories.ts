import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { restFetcher } from '@/lib/api/fetchers/rest-fetcher';
import type { CategoriesResponse, ListCategoriesParams } from '@/lib/api/types';

import { CategoryCacheKeys } from '../constants/cache-keys';

export const useCategories = (params: ListCategoriesParams = {}) => {
  const queryParams = buildQueryParams(params);

  return useQuery({
    queryKey: [CategoryCacheKeys.List, queryParams.toString()],
    placeholderData: keepPreviousData,
    queryFn: ({ signal }) =>
      restFetcher<CategoriesResponse>('/categories', {
        method: 'GET',
        queryParams,
        signal,
      }),
  });
};

function buildQueryParams(params: ListCategoriesParams): URLSearchParams {
  const query = new URLSearchParams();

  if (params.search) query.set('search', params.search);
  if (params.page) query.set('page', String(params.page));
  if (params.size) query.set('size', String(params.size));

  return query;
}
