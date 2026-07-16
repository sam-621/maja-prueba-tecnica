import type { EntityTarget, ObjectLiteral } from 'typeorm';

export interface Fixture<T extends ObjectLiteral = ObjectLiteral> {
  entity: EntityTarget<T>;

  build(): Promise<Partial<T>[]>;
}
