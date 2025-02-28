export function makeSuccessResponse<T>(result: T): { result: T; error: null } {
  return {
    result,
    error: null,
  };
}

export function makeErrorResponse<E>(error: E): {
  result: null;
  error: E;
} {
  return {
    result: null,
    error,
  };
}
