import { Router } from '../router';

import { SignUpEndpoint } from './endpoints/sign-up';

export class AuthRouter extends Router {
  constructor() {
    super([new SignUpEndpoint()]);
  }
}
