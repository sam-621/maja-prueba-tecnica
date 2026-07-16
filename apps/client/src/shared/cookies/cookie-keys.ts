export const CookiesKeys = {
  UserToken: 'blog-user-token',
} as const;

export type CookiesKeys = (typeof CookiesKeys)[keyof typeof CookiesKeys];
