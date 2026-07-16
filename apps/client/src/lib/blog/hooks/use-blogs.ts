import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { restFetcher } from '@/lib/api/fetchers/rest-fetcher';
import type { BlogsResponse, ListBlogsParams } from '@/lib/api/types';

import { BlogCacheKeys } from '../constants/cache-keys';

export const useBlogs = (params: ListBlogsParams = {}) => {
  const queryParams = buildQueryParams(params);

  return useQuery({
    queryKey: [BlogCacheKeys.List, queryParams.toString()],
    placeholderData: keepPreviousData,
    queryFn: ({ signal }) =>
      restFetcher<BlogsResponse>('/blogs', {
        method: 'GET',
        queryParams,
        signal,
      }),
  });
};

function buildQueryParams(params: ListBlogsParams): URLSearchParams {
  const query = new URLSearchParams();

  if (params.search) query.set('search', params.search);
  if (params.categoryId) query.set('categoryId', params.categoryId);
  if (params.page) query.set('page', String(params.page));
  if (params.size) query.set('size', String(params.size));

  return query;
}
