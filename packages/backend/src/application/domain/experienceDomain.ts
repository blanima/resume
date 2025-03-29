import { ExperienceEntity } from "./entities/experience";
import { ExperienceInteractorFactory } from "./interactors/experience";
import { ExperienceAddUseCaseFactory } from "./useCases/experienceAdd";
import { ExperienceGetByIdUseCaseFactory } from "./useCases/experienceGetById";
import { ExperienceGetManyUseCaseFactory } from "./useCases/experienceGetMany";
import { ExperienceUpdateUseCaseFactory } from "./useCases/experienceUpdate";

export interface ExperienceDomain {
  entities: {
    ExperienceEntity: typeof ExperienceEntity;
  };
  useCases: {
    GetById: typeof ExperienceGetByIdUseCaseFactory;
    GetMany: typeof ExperienceGetManyUseCaseFactory;
    Add: typeof ExperienceAddUseCaseFactory;
    Update: typeof ExperienceUpdateUseCaseFactory;
  };
  interactors: {
    Experience: typeof ExperienceInteractorFactory;
  };
}

export const experienceDomain: ExperienceDomain = {
  entities: {
    ExperienceEntity,
  },
  useCases: {
    GetById: ExperienceGetByIdUseCaseFactory,
    GetMany: ExperienceGetManyUseCaseFactory,
    Add: ExperienceAddUseCaseFactory,
    Update: ExperienceUpdateUseCaseFactory,
  },
  interactors: {
    Experience: ExperienceInteractorFactory,
  },
};
