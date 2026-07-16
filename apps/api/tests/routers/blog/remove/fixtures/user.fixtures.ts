import { User } from '@/persistence/entities';
import type { Fixture } from '@/tests/fixtures/fixture';
import { TestUtils } from '@/tests/utils/test-utils';

export const UserConstants = {
  ID: TestUtils.generateUUID(),
  Email: 'jane@test.com',
  Password: 'password123'
};

export const OtherUserConstants = {
  ID: TestUtils.generateUUID(),
  Email: 'john@test.com'
};

export class UserFixtures implements Fixture<User> {
  entity = User;

  async build(): Promise<Partial<User>[]> {
    const passwordHash = await TestUtils.hashPassword(UserConstants.Password);

    return [
      {
        id: UserConstants.ID,
        email: UserConstants.Email,
        passwordHash
      },
      {
        id: OtherUserConstants.ID,
        email: OtherUserConstants.Email,
        passwordHash
      }
    ];
  }
}
