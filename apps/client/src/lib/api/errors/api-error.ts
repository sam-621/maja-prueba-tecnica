export class ApiError {
  readonly code: string;
  readonly statusCode: number;
  readonly message: string;

  constructor(message: string, code: string, statusCode: number) {
    this.message = message;
    this.code = code;
    this.statusCode = statusCode;
  }
}
