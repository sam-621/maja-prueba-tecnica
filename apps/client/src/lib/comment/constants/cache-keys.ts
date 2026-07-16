export const CommentCacheKeys = {
  List: 'comments',
} as const;

export type CommentCacheKeys =
  (typeof CommentCacheKeys)[keyof typeof CommentCacheKeys];
