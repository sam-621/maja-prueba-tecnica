import { useQuery } from '@tanstack/react-query';

import { restFetcher } from '@/lib/api/fetchers/rest-fetcher';
import type { Blog } from '@/lib/api/types';

import { BlogCacheKeys } from '../constants/cache-keys';

export const useBlog = (slug: string | undefined) => {
  return useQuery({
    queryKey: [BlogCacheKeys.Detail, slug],
    queryFn: ({ signal }) =>
      restFetcher<Blog>(`/blogs/${slug}`, { method: 'GET', signal }),
    enabled: !!slug,
  });
};
