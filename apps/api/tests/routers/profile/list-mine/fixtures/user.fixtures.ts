import { User } from '@/persistence/entities';
import type { Fixture } from '@/tests/fixtures/fixture';
import { TestUtils } from '@/tests/utils/test-utils';

export const AliceAuthor = {
  ID: TestUtils.generateUUID(),
  Email: 'alice@test.com',
  Fullname: 'Alice Author'
};

export const BobAuthor = {
  ID: TestUtils.generateUUID(),
  Email: 'bob@test.com',
  Fullname: 'Bob Builder'
};

export class UserFixtures implements Fixture<User> {
  entity = User;

  async build(): Promise<Partial<User>[]> {
    return [
      {
        id: AliceAuthor.ID,
        email: AliceAuthor.Email,
        fullname: AliceAuthor.Fullname
      },
      {
        id: BobAuthor.ID,
        email: BobAuthor.Email,
        fullname: BobAuthor.Fullname
      }
    ];
  }
}
