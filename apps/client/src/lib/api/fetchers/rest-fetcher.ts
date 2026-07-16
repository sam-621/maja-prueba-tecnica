import { getCookie } from '@/shared/cookies';
import { CookiesKeys } from '@/shared/cookies/cookie-keys';

import { API_URL } from '../api.constants';
import { ApiError } from '../errors/api-error';

export type RestFetcherOptions = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  queryParams?: URLSearchParams;
  signal?: AbortSignal;
};

export const restFetcher = async <R>(
  url: string,
  options: RestFetcherOptions
): Promise<R> => {
  const { method, body, queryParams, signal } = options ?? {};

  const query = queryParams ? `?${queryParams.toString()}` : '';
  const token = getCookie(CookiesKeys.UserToken);

  const response = await fetch(`${API_URL}${url}${query}`, {
    method,
    signal,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const payload = await response.json();

  if (!response.ok) {
    const errorResponse = payload as { message: string; errorCode: string };

    throw new ApiError(
      errorResponse.message,
      errorResponse.errorCode,
      response.status
    );
  }

  return (payload as { data: R }).data;
};
