import { User } from '@/persistence/entities';
import type { Fixture } from '@/tests/fixtures/fixture';
import { TestUtils } from '@/tests/utils/test-utils';

export const UserConstants = {
  ID: TestUtils.generateUUID(),
  Email: 'jane@test.com',
  Fullname: 'Jane Doe'
};

export class UserFixtures implements Fixture<User> {
  entity = User;

  async build(): Promise<Partial<User>[]> {
    return [
      {
        id: UserConstants.ID,
        email: UserConstants.Email,
        fullname: UserConstants.Fullname
      }
    ];
  }
}
