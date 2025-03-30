import { EducationEntity } from "./entities/education";
import { EducationInteractorFactory } from "./interactors/education";
import { EducationAddUseCaseFactory } from "./useCases/educationAdd";
import { EducationDeleteUseCaseFactory } from "./useCases/educationDelete";
import { EducationGetByIdUseCaseFactory } from "./useCases/educationGetById";
import { EducationGetManyUseCaseFactory } from "./useCases/educationGetMany";
import { EducationUpdateUseCaseFactory } from "./useCases/educationUpdate";

export interface EducationDomain {
  entities: {
    EducationEntity: typeof EducationEntity;
  };
  useCases: {
    GetById: typeof EducationGetByIdUseCaseFactory;
    GetMany: typeof EducationGetManyUseCaseFactory;
    Add: typeof EducationAddUseCaseFactory;
    Update: typeof EducationUpdateUseCaseFactory;
    Delete: typeof EducationDeleteUseCaseFactory;
  };
  interactors: {
    Education: typeof EducationInteractorFactory;
  };
}

export const educationDomain: EducationDomain = {
  entities: {
    EducationEntity,
  },
  useCases: {
    GetById: EducationGetByIdUseCaseFactory,
    GetMany: EducationGetManyUseCaseFactory,
    Add: EducationAddUseCaseFactory,
    Update: EducationUpdateUseCaseFactory,
    Delete: EducationDeleteUseCaseFactory,
  },
  interactors: {
    Education: EducationInteractorFactory,
  },
};
