export interface Result<T, E> {
  isOk(): boolean;
  isErr(): boolean;
  unwrap(): T | never;
  unwrapErr(): E;
}

export function Ok<T, E = never>(value: T): Result<T, E> {
  return {
    isOk: () => true,
    isErr: () => false,
    unwrap: () => value,
    unwrapErr: () => {
      throw new Error("Cannot unwrap error of Ok result");
    },
  };
}

export function Err<T, E>(error: E): Result<T, E> {
  return {
    isOk: () => false,
    isErr: () => true,
    unwrap: () => {
      throw new Error("Cannot unwrap value of Err result");
    },
    unwrapErr: () => error,
  };
}
