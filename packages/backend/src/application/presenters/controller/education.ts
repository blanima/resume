import { EducationGetByIdUseCase } from "../../domain/useCases/educationGetById";
import { EducationAddUseCase } from "../../domain/useCases/educationAdd";
import { EducationGetManyUseCase } from "../../domain/useCases/educationGetMany";
import { EducationUpdateUseCase } from "../../domain/useCases/educationUpdate";
import { EducationDeleteUseCase } from "../../domain/useCases/educationDelete";
import { type Education } from "../../domain/entities/education";
import { AppError, Ok, Result } from "@resume/core/src";

export interface EducationController {
  getById: (id: string) => Promise<Result<Education, AppError>>;
  getMany: () => Promise<Result<Education[], AppError>>;
  add: (
    education: Omit<Education, "id" | "created_at" | "updated_at">
  ) => Promise<Result<Education, AppError>>;
  update: (
    education: Partial<Education> & { id: string }
  ) => Promise<Result<Education, AppError>>;
  deleteEducation: (id: string) => Promise<Result<Education, AppError>>;
}

export interface EducationControllerDependencies {
  useCases: {
    getById: EducationGetByIdUseCase;
    add: EducationAddUseCase;
    getMany: EducationGetManyUseCase;
    update: EducationUpdateUseCase;
    deleteEducation: EducationDeleteUseCase;
  };
}

export function EducationControllerFactory({
  useCases: { getById, add, getMany, update, deleteEducation },
}: EducationControllerDependencies): EducationController {
  return {
    getById: async (id: string) => {
      const result = await getById.execute(id);

      if (result.isErr()) {
        return result as Result<never, AppError>;
      }

      return Ok(result.unwrap().props);
    },
    getMany: async () => {
      const result = await getMany.execute();

      if (result.isErr()) {
        return result as Result<never, AppError>;
      }

      return Ok(result.unwrap().map((edu) => edu.props));
    },
    add: async (
      education: Omit<Education, "id" | "created_at" | "updated_at">
    ) => {
      const result = await add.execute(education);

      if (result.isErr()) {
        return result as Result<never, AppError>;
      }

      return Ok(result.unwrap().props);
    },
    update: async (education: Partial<Education> & { id: string }) => {
      const result = await update.execute(education);

      if (result.isErr()) {
        return result as Result<never, AppError>;
      }

      return Ok(result.unwrap().props);
    },
    deleteEducation: async (id: string) => {
      const result = await deleteEducation.execute(id);

      if (result.isErr()) {
        return result as Result<never, AppError>;
      }
      
      return Ok(result.unwrap().props);
    },
  };
}
