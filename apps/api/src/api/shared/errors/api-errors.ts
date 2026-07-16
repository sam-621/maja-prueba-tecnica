export class ApiError {
  constructor(
    readonly statusCode: number,
    readonly message: string,
    readonly code: string
  ) {}
}
