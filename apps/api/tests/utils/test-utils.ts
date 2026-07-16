import type { DeepPartial, EntityTarget, ObjectLiteral } from 'typeorm';

import { hasher } from '@/libs/hasher';
import { jwt } from '@/libs/jwt';
import { dataSource } from '@/persistence/data-source';
import { DefaultFixtures } from '@/tests/fixtures/defaults/default-fixtures';
import type { Fixture } from '@/tests/fixtures/fixture';

export class TestUtils {
  public dataSource = dataSource;

  static Regex = {
    UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    JWT: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/,
    HASH: /^\$2[ab]\$/
  };

  getRepository<T extends ObjectLiteral>(entity: EntityTarget<T>) {
    return this.dataSource.getRepository(entity);
  }

  async loadFixtures(fixtures: Fixture[]) {
    for (const fixture of fixtures) {
      const partialEntities = await fixture.build();

      const buildDefaults = DefaultFixtures.get(fixture.entity);

      if (!buildDefaults) {
        throw new Error(
          `No defaults found for fixture entity: ${this.entityName(fixture.entity)}`
        );
      }

      const repository = this.dataSource.getRepository(fixture.entity);

      const rows = partialEntities.map(entity =>
        repository.create({ ...buildDefaults(), ...entity } as DeepPartial<ObjectLiteral>)
      );

      await repository.save(rows);
    }
  }

  static async hashPassword(password: string): Promise<string> {
    return hasher.hash(password);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return hasher.compare(password, hash);
  }

  static generateJWT(payload: object): string {
    return jwt.generate(payload);
  }

  static generateUUID() {
    return crypto.randomUUID();
  }

  private entityName(entity: EntityTarget<ObjectLiteral>) {
    if (typeof entity === 'function') return entity.name;

    return typeof entity === 'string' ? entity : String(entity);
  }
}
