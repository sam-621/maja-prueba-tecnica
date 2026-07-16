import { Column, Entity, Index, OneToMany } from 'typeorm';

import { BaseEntity } from './base.entity';
import { Comment } from './comment.entity';
import { Post } from './post.entity';

@Entity('user')
export class User extends BaseEntity {
  @Index('idx_user_email', { unique: true })
  @Column({ type: 'varchar', length: 255 })
  email!: string;

  @Column({ name: 'full_name', type: 'varchar', length: 255 })
  fullname!: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash!: string;

  @OneToMany(() => Post, post => post.author)
  posts!: Post[];

  @OneToMany(() => Comment, comment => comment.author)
  comments!: Comment[];
}
