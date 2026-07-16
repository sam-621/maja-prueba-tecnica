import type { EntityTarget, ObjectLiteral } from 'typeorm';

import { Category, Comment, Post, User } from '@/persistence/entities';

import { DefaultCategoryFixture } from './category.fixture';
import { DefaultCommentFixture } from './comment.fixture';
import { DefaultPostFixture } from './post.fixture';
import { DefaultUserFixture } from './user.fixture';

export const DefaultFixtures = new Map<
  EntityTarget<ObjectLiteral>,
  () => Partial<ObjectLiteral>
>([
  [User, DefaultUserFixture],
  [Post, DefaultPostFixture],
  [Category, DefaultCategoryFixture],
  [Comment, DefaultCommentFixture]
]);
