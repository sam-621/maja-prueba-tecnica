import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';

import { restFetcher } from '@/lib/api/fetchers/rest-fetcher';
import type { BlogsResponse, ListBlogsParams } from '@/lib/api/types';

import { BlogCacheKeys } from '../constants/cache-keys';

export const useBlogs = (params: ListBlogsParams = {}) => {
  const baseParams = buildQueryParams(params);

  return useInfiniteQuery({
    queryKey: [BlogCacheKeys.List, baseParams.toString()],
    placeholderData: keepPreviousData,
    initialPageParam: 1,
    queryFn: ({ pageParam, signal }) => {
      const queryParams = buildQueryParams(params);
      queryParams.set('page', String(pageParam));

      return restFetcher<BlogsResponse>('/blogs', {
        method: 'GET',
        queryParams,
        signal,
      });
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pageInfo;

      return page < totalPages ? page + 1 : undefined;
    },
  });
};

function buildQueryParams(params: ListBlogsParams): URLSearchParams {
  const query = new URLSearchParams();

  if (params.search) query.set('search', params.search);
  if (params.categoryIds?.length) query.set('categoryIds', params.categoryIds.join(','));
  if (params.size) query.set('size', String(params.size));

  return query;
}
