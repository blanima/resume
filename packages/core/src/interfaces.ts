import { AppError } from "./errors";
import { Result } from "./monads";

export interface UseCase<I, O> {
  execute(input: I): Result<O, AppError>;
}
