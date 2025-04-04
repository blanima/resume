import { SkillEntity } from "./entities/skill";
import { SkillInteractorFactory } from "./interactors/skill";
import { SkillAddUseCaseFactory } from "./useCases/skillAdd";
import { SkillGetByIdUseCaseFactory } from "./useCases/skillGetById";
import { SkillGetManyUseCaseFactory } from "./useCases/skillGetMany";
import { SkillUpdateUseCaseFactory } from "./useCases/skillUpdate";
import { SkillDeleteUseCaseFactory } from "./useCases/skillDelete";
import { SkillLinkExperienceUseCaseFactory } from "./useCases/skillLinkExperience";
import { SkillLinkEducationUseCaseFactory } from "./useCases/skillLinkEducation";
import { SkillUnlinkExperienceUseCaseFactory } from "./useCases/skillUnlinkExperience";
import { SkillUnlinkEducationUseCaseFactory } from "./useCases/skillUnlinkEducation";
import { SkillGetLinkedEducationsUseCaseFactory } from "./useCases/skillGetLinkedEducations";
import { SkillGetLinkedExperiencesUseCaseFactory } from "./useCases/skillGetLinkedExperiences";
import { SkillGetLinkedSkillsByExperienceIdUseCaseFactory } from "./useCases/skillGetLinkedSkillsByExperienceId";
import { SkillGetLinkedSkillsByEducationIdUseCaseFactory } from "./useCases/skillGetLinkedSkillsByEducationId";

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
    LinkExperience: typeof SkillLinkExperienceUseCaseFactory;
    LinkEducation: typeof SkillLinkEducationUseCaseFactory;
    UnlinkExperience: typeof SkillUnlinkExperienceUseCaseFactory;
    UnlinkEducation: typeof SkillUnlinkEducationUseCaseFactory;
    GetLinkedEducations: typeof SkillGetLinkedEducationsUseCaseFactory;
    GetLinkedExperiences: typeof SkillGetLinkedExperiencesUseCaseFactory;
    GetLinkedSkillsByExperienceId: typeof SkillGetLinkedSkillsByExperienceIdUseCaseFactory;
    GetLinkedSkillsByEducationId: typeof SkillGetLinkedSkillsByEducationIdUseCaseFactory;
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
    LinkExperience: SkillLinkExperienceUseCaseFactory,
    LinkEducation: SkillLinkEducationUseCaseFactory,
    UnlinkExperience: SkillUnlinkExperienceUseCaseFactory,
    UnlinkEducation: SkillUnlinkEducationUseCaseFactory,
    GetLinkedEducations: SkillGetLinkedEducationsUseCaseFactory,
    GetLinkedExperiences: SkillGetLinkedExperiencesUseCaseFactory,
    GetLinkedSkillsByExperienceId:
      SkillGetLinkedSkillsByExperienceIdUseCaseFactory,
    GetLinkedSkillsByEducationId:
      SkillGetLinkedSkillsByEducationIdUseCaseFactory,
  },
  interactors: {
    Skill: SkillInteractorFactory,
  },
};
