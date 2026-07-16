import { ApiError } from '@/api/shared/errors/api-errors';

export class EmailAlreadyTaken extends ApiError {
  constructor() {
    super(409, `Provided email is already taken`, 'EMAIL_ALREADY_TAKEN');
  }
}

export class InvalidCredentials extends ApiError {
  constructor() {
    super(401, `Provided credentials are invalid`, 'INVALID_CREDENTIALS');
  }
}
