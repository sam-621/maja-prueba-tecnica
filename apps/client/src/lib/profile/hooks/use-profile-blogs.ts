import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { restFetcher } from '@/lib/api/fetchers/rest-fetcher';
import type { BlogsResponse, ListBlogsParams } from '@/lib/api/types';

import { ProfileCacheKeys } from '../constants/cache-keys';

export const useProfileBlogs = (params: ListBlogsParams = {}) => {
  const queryParams = buildQueryParams(params);

  return useQuery({
    queryKey: [ProfileCacheKeys.Blogs, queryParams.toString()],
    placeholderData: keepPreviousData,
    queryFn: ({ signal }) =>
      restFetcher<BlogsResponse>('/me/blogs', {
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
