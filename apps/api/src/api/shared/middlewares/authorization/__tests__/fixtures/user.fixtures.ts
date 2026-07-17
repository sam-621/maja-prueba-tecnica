import { User } from '@/persistence/entities';
import type { Fixture } from '@/tests/fixtures/fixture';
import { TestUtils } from '@/tests/utils/test-utils';

export const UserConstants = {
  ID: TestUtils.generateUUID(),
  Email: 'ellie@williams.com'
};

export class UserFixtures implements Fixture<User> {
  entity = User;

  async build(): Promise<Partial<User>[]> {
    return [
      {
        id: UserConstants.ID,
        email: UserConstants.Email
      }
    ];
  }
}
