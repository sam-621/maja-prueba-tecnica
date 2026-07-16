import type { EntityTarget, ObjectLiteral } from 'typeorm';

import { Blog, Category, Comment, User } from '@/persistence/entities';

import { DefaultBlogFixture } from './blog.fixture';
import { DefaultCategoryFixture } from './category.fixture';
import { DefaultCommentFixture } from './comment.fixture';
import { DefaultUserFixture } from './user.fixture';

export const DefaultFixtures = new Map<
  EntityTarget<ObjectLiteral>,
  () => Partial<ObjectLiteral>
>([
  [User, DefaultUserFixture],
  [Blog, DefaultBlogFixture],
  [Category, DefaultCategoryFixture],
  [Comment, DefaultCommentFixture]
]);
