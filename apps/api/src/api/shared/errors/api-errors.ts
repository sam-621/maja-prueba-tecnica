import type { HttpStatusCode } from '@/api/shared/http-status-code';

export class ApiError {
  constructor(
    readonly statusCode: HttpStatusCode,
    readonly message: string,
    readonly code: string
  ) {}
}
