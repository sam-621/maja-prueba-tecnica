import { Router } from '../router';

import { CreateCommentEndpoint } from './endpoints/create-comment';
import { ListCommentsEndpoint } from './endpoints/list-comments';
import { RemoveCommentEndpoint } from './endpoints/remove-comment';

export class CommentRouter extends Router {
  constructor() {
    super([
      new CreateCommentEndpoint(),
      new ListCommentsEndpoint(),
      new RemoveCommentEndpoint()
    ]);
  }
}
