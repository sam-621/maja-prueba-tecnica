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
export type BlogStatus = 'draft' | 'published' | 'archived';

@Entity('blog')
export class Blog extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Index('idx_blog_slug', { unique: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  slug!: string | null;

  @Column({ type: 'text' })
  content!: string;

  @Index('idx_blog_status')
  @Column({ type: 'varchar', length: 20, default: 'draft' })
  status!: BlogStatus;

  @Column({ name: 'author_id', type: 'uuid' })
  authorId!: string;

  @Index('idx_blog_author_id')
  @ManyToOne(() => User, user => user.blogs, {
    onDelete: 'CASCADE',
    nullable: false
  })
  @JoinColumn({ name: 'author_id' })
  author!: User;

  @ManyToMany(() => Category, category => category.blogs)
  @JoinTable({
    name: 'blog_category',
    joinColumn: { name: 'blog_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' }
  })
  categories!: Category[];

  @OneToMany(() => Comment, comment => comment.blog)
  comments!: Comment[];
}
