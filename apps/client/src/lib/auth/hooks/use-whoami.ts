import { useQuery } from '@tanstack/react-query';

import { restFetcher } from '@/lib/api/fetchers/rest-fetcher';
import type { User } from '@/lib/api/types';
import { getCookie, CookiesKeys } from '@/shared/cookies';

import { AuthCacheKeys } from '../constants/cache-keys';

export const useWhoami = () => {
  return useQuery({
    queryKey: [AuthCacheKeys.Whoami],
    queryFn: ({ signal }) =>
      restFetcher<User>('/whoami', { method: 'GET', signal }),
    enabled: !!getCookie(CookiesKeys.UserToken),
    staleTime: Infinity,
  });
};
