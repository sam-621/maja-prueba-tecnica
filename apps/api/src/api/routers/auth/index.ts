import { Router } from '../router';

import { LoginEndpoint } from './endpoints/login';
import { SignUpEndpoint } from './endpoints/sign-up';
import { WhoamiEndpoint } from './endpoints/whoami';

export class AuthRouter extends Router {
  constructor() {
    super([new SignUpEndpoint(), new LoginEndpoint(), new WhoamiEndpoint()]);
  }
}
