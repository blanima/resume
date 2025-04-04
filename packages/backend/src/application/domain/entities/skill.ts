import { LanguageCode } from "../enum";

export interface Skill {
  id: string;
  translations: {
    [K in LanguageCode]?: {
      title: string;
    };
  };
  level: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface SkillExperienceLink {
  skill_id: string;
  experience_id: string;
}

export interface SkillEducationLink {
  skill_id: string;
  education_id: string;
}
export class SkillEntity {
  props: Skill;
  protected constructor(props: Skill) {
    this.props = props;
  }
  static create(props: Skill) {
    return new SkillEntity(props);
  }
}
