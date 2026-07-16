import { Column, Entity, Index, ManyToMany } from 'typeorm';

import { BaseEntity } from './base.entity';
import { Post } from './post.entity';

@Entity('category')
export class Category extends BaseEntity {
  @Index('idx_category_name', { unique: true })
  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Index('idx_category_slug', { unique: true })
  @Column({ type: 'varchar', length: 120 })
  slug!: string;

  @ManyToMany(() => Post, post => post.categories)
  posts!: Post[];
}
