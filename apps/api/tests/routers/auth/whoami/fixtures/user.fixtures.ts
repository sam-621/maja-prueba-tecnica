import { User } from '@/persistence/entities';
import type { Fixture } from '@/tests/fixtures/fixture';
import { TestUtils } from '@/tests/utils/test-utils';

export const UserConstants = {
  ID: TestUtils.generateUUID(),
  Email: 'jane@test.com',
  Fullname: 'Jane Doe',
  Password: 'password123'
};

export class UserFixtures implements Fixture<User> {
  entity = User;

  async build(): Promise<Partial<User>[]> {
    const passwordHash = await TestUtils.hashPassword(UserConstants.Password);

    return [
      {
        id: UserConstants.ID,
        email: UserConstants.Email,
        fullname: UserConstants.Fullname,
        passwordHash
      }
    ];
  }
}
