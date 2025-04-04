import { LanguageCode } from "../enum";

export interface Experience {
  id: string;
  company_name: string;
  start_date: string;
  end_date?: string | null;
  translations: {
    [K in LanguageCode]?: {
      title: string;
      description: string;
    };
  };
  created_at: string | null;
  updated_at?: string | null;
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
