import { ApiError } from '@/api/shared/errors/api-errors';

export class CategoryAlreadyExists extends ApiError {
  constructor() {
    super(409, 'Category already exists', 'CATEGORY_ALREADY_EXISTS');
  }
}
