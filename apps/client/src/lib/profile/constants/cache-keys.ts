export const ProfileCacheKeys = {
  Blogs: 'profile-blogs',
} as const;

export type ProfileCacheKeys =
  (typeof ProfileCacheKeys)[keyof typeof ProfileCacheKeys];
