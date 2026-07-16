import { useMutation } from '@tanstack/react-query';

import { ApiError } from '@/lib/api/errors/api-error';
import { getErrorMessage } from '@/lib/api/errors/common.errors';
import { restFetcher } from '@/lib/api/fetchers/rest-fetcher';
import type { AccessToken, LoginInput } from '@/lib/api/types';
import { useUser } from '@/shared/contexts/user-context';
import type { ActionResult } from '@/shared/utils/result';

export const useLogin = () => {
  const { signIn } = useUser();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (input: LoginInput) =>
      restFetcher<AccessToken>('/login', { method: 'POST', body: input }),
  });

  const login = async (input: LoginInput): Promise<ActionResult> => {
    try {
      const token = await mutateAsync(input);

      await signIn(token);

      return { isSuccess: true };
    } catch (error) {
      const code = error instanceof ApiError ? error.code : undefined;

      return {
        isSuccess: false,
        error: getErrorMessage(code),
        errorCode: code,
      };
    }
  };

  return { login, isLoading: isPending };
};
