export const CategoryCacheKeys = {
  List: 'categories',
} as const;

export type CategoryCacheKeys =
  (typeof CategoryCacheKeys)[keyof typeof CategoryCacheKeys];
