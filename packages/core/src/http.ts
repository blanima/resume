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

export function makeResponse<T, E>(
  result: T,
  error: E
): { result: T; error: E } {
  return {
    result,
    error,
  };
}

// TODO: add error and not found handlers
