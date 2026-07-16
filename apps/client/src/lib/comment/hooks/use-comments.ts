import { useInfiniteQuery } from '@tanstack/react-query';

import { restFetcher } from '@/lib/api/fetchers/rest-fetcher';
import type { CommentsResponse } from '@/lib/api/types';

import { CommentCacheKeys } from '../constants/cache-keys';

export const useComments = (blogId: string | undefined) => {
  return useInfiniteQuery({
    queryKey: [CommentCacheKeys.List, blogId],
    enabled: !!blogId,
    initialPageParam: 1,
    queryFn: ({ pageParam, signal }) => {
      const queryParams = new URLSearchParams();
      queryParams.set('page', String(pageParam));

      return restFetcher<CommentsResponse>(`/blogs/${blogId}/comments`, {
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
