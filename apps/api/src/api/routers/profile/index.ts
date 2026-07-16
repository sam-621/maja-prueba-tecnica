import { Router } from '../router';

import { ListMyBlogsEndpoint } from './endpoints/list-my-blogs';
import { WhoamiEndpoint } from './endpoints/whoami';

export class ProfileRouter extends Router {
  constructor() {
    super([new WhoamiEndpoint(), new ListMyBlogsEndpoint()]);
  }
}
