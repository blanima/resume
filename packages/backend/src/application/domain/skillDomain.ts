import { SkillEntity } from "./entities/skill";
import { SkillInteractorFactory } from "./interactors/skill";
import { SkillAddUseCaseFactory } from "./useCases/skillAdd";
import { SkillGetByIdUseCaseFactory } from "./useCases/skillGetById";
import { SkillGetManyUseCaseFactory } from "./useCases/skillGetMany";
import { SkillUpdateUseCaseFactory } from "./useCases/skillUpdate";
import { SkillDeleteUseCaseFactory } from "./useCases/skillDelete";

export interface SkillDomain {
  entities: {
    SkillEntity: typeof SkillEntity;
  };
  useCases: {
    Add: typeof SkillAddUseCaseFactory;
    GetById: typeof SkillGetByIdUseCaseFactory;
    GetMany: typeof SkillGetManyUseCaseFactory;
    Update: typeof SkillUpdateUseCaseFactory;
    Delete: typeof SkillDeleteUseCaseFactory;
  };
  interactors: {
    Skill: typeof SkillInteractorFactory;
  };
}

export const skillDomain: SkillDomain = {
  entities: {
    SkillEntity,
  },
  useCases: {
    Add: SkillAddUseCaseFactory,
    GetById: SkillGetByIdUseCaseFactory,
    GetMany: SkillGetManyUseCaseFactory,
    Update: SkillUpdateUseCaseFactory,
    Delete: SkillDeleteUseCaseFactory,
  },
  interactors: {
    Skill: SkillInteractorFactory,
  },
};
