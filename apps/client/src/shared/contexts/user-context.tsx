/* eslint-disable react-refresh/only-export-components */
import { useQueryClient } from '@tanstack/react-query';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { User } from '@/lib/api/types';
import { AuthCacheKeys } from '@/lib/auth/constants/cache-keys';
import { useWhoami } from '@/lib/auth/hooks/use-whoami';
import {
  getCookie,
  removeCookie,
  setCookie,
  CookiesKeys,
} from '@/shared/cookies';

type ContextSchema = {
  isLoading: boolean;
  isSignedIn: boolean;
  user: User | null;
  signIn: (token: string) => Promise<void>;
  signOut: () => void;
};

const Context = createContext<ContextSchema>({
  isLoading: false,
  isSignedIn: false,
  user: null,
  signIn: async () => void 0,
  signOut: () => void 0,
});

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const { data: user, isLoading, refetch } = useWhoami();

  const [token, setToken] = useState<string | null>(
    () => getCookie(CookiesKeys.UserToken) ?? null
  );

  const signIn = useCallback(
    async (nextToken: string) => {
      setCookie(CookiesKeys.UserToken, nextToken, { expires: 7 });
      setToken(nextToken);
      await refetch();
    },
    [refetch]
  );

  const signOut = useCallback(() => {
    removeCookie(CookiesKeys.UserToken);
    setToken(null);
    queryClient.removeQueries({ queryKey: [AuthCacheKeys.Whoami] });
  }, [queryClient]);

  const currentUser = token ? (user ?? null) : null;

  const value = useMemo<ContextSchema>(
    () => ({
      isLoading,
      isSignedIn: !!currentUser,
      user: currentUser,
      signIn,
      signOut,
    }),
    [currentUser, isLoading, signIn, signOut]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useUser = () => useContext(Context);
