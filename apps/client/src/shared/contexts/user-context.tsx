/* eslint-disable react-refresh/only-export-components */
import { useQueryClient } from '@tanstack/react-query';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';

import type { User } from '@/lib/api/types';
import { AuthCacheKeys } from '@/lib/auth/constants/cache-keys';
import { useWhoami } from '@/lib/auth/hooks/use-whoami';
import { removeCookie, setCookie, CookiesKeys } from '@/shared/cookies';

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

  const signIn = useCallback(
    async (token: string) => {
      setCookie(CookiesKeys.UserToken, token, { expires: 7 });
      await refetch();
    },
    [refetch]
  );

  const signOut = useCallback(() => {
    removeCookie(CookiesKeys.UserToken);
    queryClient.removeQueries({ queryKey: [AuthCacheKeys.Whoami] });
  }, [queryClient]);

  const value = useMemo<ContextSchema>(
    () => ({
      isLoading,
      isSignedIn: !!user,
      user: user ?? null,
      signIn,
      signOut,
    }),
    [user, isLoading, signIn, signOut]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useUser = () => useContext(Context);
