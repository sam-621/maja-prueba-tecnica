export type ActionResult<TErrorCode = string> =
  | { isSuccess: true }
  | { isSuccess: false; error: string; errorCode?: TErrorCode };
