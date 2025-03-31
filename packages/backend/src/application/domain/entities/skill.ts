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

export class SkillEntity {
  props: Skill;
  protected constructor(props: Skill) {
    this.props = props;
  }
  static create(props: Skill) {
    return new SkillEntity(props);
  }
}
