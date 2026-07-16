export const BlogCacheKeys = {
  List: 'blogs',
  Detail: 'blog-detail',
} as const;

export type BlogCacheKeys = (typeof BlogCacheKeys)[keyof typeof BlogCacheKeys];
