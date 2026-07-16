import { useQuery } from '@tanstack/react-query';

import { restFetcher } from '@/lib/api/fetchers/rest-fetcher';
import type { Blog } from '@/lib/api/types';

import { BlogCacheKeys } from '../constants/cache-keys';

export const useBlog = (id: string | undefined) => {
  return useQuery({
    queryKey: [BlogCacheKeys.Detail, id],
    queryFn: ({ signal }) =>
      restFetcher<Blog>(`/blogs/${id}`, { method: 'GET', signal }),
    enabled: !!id,
  });
};
