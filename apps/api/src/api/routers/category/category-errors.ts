import { ApiError } from '@/api/shared/errors/api-errors';
import { HttpStatusCode } from '@/api/shared/http-status-code';

export class CategoryAlreadyExists extends ApiError {
  constructor() {
    super(HttpStatusCode.Conflict, 'Category already exists', 'CATEGORY_ALREADY_EXISTS');
  }
}
