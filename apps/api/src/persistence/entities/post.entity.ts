import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany
} from 'typeorm';

import { BaseEntity } from './base.entity';
import { Category } from './category.entity';
import { Comment } from './comment.entity';
import { User } from './user.entity';

// Stored as string instead of a pg enum so new status don't require a migration.
export type PostStatus = 'draft' | 'published' | 'archived';

@Entity('post')
export class Post extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text' })
  content!: string;

  @Index('idx_post_status')
  @Column({ type: 'varchar', length: 20, default: 'draft' })
  status!: PostStatus;

  @Column({ name: 'author_id', type: 'uuid' })
  authorId!: string;

  @Index('idx_post_author_id')
  @ManyToOne(() => User, user => user.posts, {
    onDelete: 'CASCADE',
    nullable: false
  })
  @JoinColumn({ name: 'author_id' })
  author!: User;

  @ManyToMany(() => Category, category => category.posts)
  @JoinTable({
    name: 'post_category',
    joinColumn: { name: 'post_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' }
  })
  categories!: Category[];

  @OneToMany(() => Comment, comment => comment.post)
  comments!: Comment[];
}
