import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from './base.entity';
import { Post } from './post.entity';
import { User } from './user.entity';

@Entity('comment')
export class Comment extends BaseEntity {
  @Column({ type: 'text' })
  content!: string;

  @Column({ name: 'post_id', type: 'uuid' })
  postId!: string;

  @Column({ name: 'author_id', type: 'uuid' })
  authorId!: string;

  @Index('idx_comment_post_id')
  @ManyToOne(() => Post, post => post.comments, {
    onDelete: 'CASCADE',
    nullable: false
  })
  @JoinColumn({ name: 'post_id' })
  post!: Post;

  @Index('idx_comment_author_id')
  @ManyToOne(() => User, user => user.comments, {
    onDelete: 'CASCADE',
    nullable: false
  })
  @JoinColumn({ name: 'author_id' })
  author!: User;
}
