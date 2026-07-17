import { ApiError } from '@/api/shared/errors/api-errors';
import { HttpStatusCode } from '@/api/shared/http-status-code';

export class EmailAlreadyTaken extends ApiError {
  constructor() {
    super(HttpStatusCode.Conflict, `Provided email is already taken`, 'EMAIL_ALREADY_TAKEN');
  }
}

export class InvalidCredentials extends ApiError {
  constructor() {
    super(HttpStatusCode.Unauthorized, `Provided credentials are invalid`, 'INVALID_CREDENTIALS');
  }
}
