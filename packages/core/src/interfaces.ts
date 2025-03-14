import { type AppError } from "./errors";
import { type Result } from "./monads";

export interface UseCase<I, O> {
  execute(input: I): Promise<Result<O, AppError>>;
}
