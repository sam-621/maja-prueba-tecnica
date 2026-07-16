import { useMutation } from '@tanstack/react-query';

import { ApiError } from '@/lib/api/errors/api-error';
import { getErrorMessage } from '@/lib/api/errors/common.errors';
import { restFetcher } from '@/lib/api/fetchers/rest-fetcher';
import type { AccessToken, SignUpInput } from '@/lib/api/types';
import { useUser } from '@/shared/contexts/user-context';
import type { ActionResult } from '@/shared/utils/result';

export const useSignup = () => {
  const { signIn } = useUser();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (input: SignUpInput) =>
      restFetcher<AccessToken>('/signup', { method: 'POST', body: input }),
  });

  const signup = async (input: SignUpInput): Promise<ActionResult> => {
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

  return { signup, isLoading: isPending };
};
