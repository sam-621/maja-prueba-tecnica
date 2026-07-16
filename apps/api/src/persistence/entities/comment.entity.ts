import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from './base.entity';
import { Blog } from './blog.entity';
import { User } from './user.entity';

@Entity('comment')
export class Comment extends BaseEntity {
  @Column({ type: 'text' })
  content!: string;

  @Column({ name: 'blog_id', type: 'uuid' })
  blogId!: string;

  @Column({ name: 'author_id', type: 'uuid' })
  authorId!: string;

  @Index('idx_comment_blog_id')
  @ManyToOne(() => Blog, blog => blog.comments, {
    onDelete: 'CASCADE',
    nullable: false
  })
  @JoinColumn({ name: 'blog_id' })
  blog!: Blog;

  @Index('idx_comment_author_id')
  @ManyToOne(() => User, user => user.comments, {
    onDelete: 'CASCADE',
    nullable: false
  })
  @JoinColumn({ name: 'author_id' })
  author!: User;
}
