import { LanguageCodes } from "../enum";

export interface Experience {
  id: string;
  company_name: string;
  start_date: string;
  end_date?: string | null;
  translations: {
    [K in LanguageCodes]?: {
      title: string;
      description: string;
    };
  };
  created_at?: string;
  updated_at?: string;
}

export class ExperienceEntity {
  props: Experience;
  protected constructor(props: Experience) {
    this.props = props;
  }
  static create(props: Experience) {
    return new ExperienceEntity(props);
  }
}
