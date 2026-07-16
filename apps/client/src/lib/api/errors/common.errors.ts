export const GENERIC_ERROR = 'Something went wrong, please try again.';

const ERROR_MESSAGES: Record<string, string> = {
  EMAIL_ALREADY_TAKEN: 'That email is already registered.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  BLOG_NOT_FOUND: 'The blog you are looking for does not exist.',
  BLOG_FORBIDDEN: 'You are not allowed to modify this blog.',
  UNAUTHORIZED: 'Your session expired, please log in again.',
  CATEGORY_ALREADY_EXISTS: 'That category already exists.',
};

export const getErrorMessage = (code?: string): string => {
  if (!code) return GENERIC_ERROR;

  return ERROR_MESSAGES[code] ?? GENERIC_ERROR;
};
