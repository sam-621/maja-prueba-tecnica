export const AuthCacheKeys = {
  Whoami: 'whoami',
} as const;

export type AuthCacheKeys = (typeof AuthCacheKeys)[keyof typeof AuthCacheKeys];
