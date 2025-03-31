import { LanguageCode } from "../enum";

export interface Education {
  id: string;
  institution: string;
  degree?: string;
  start_date: string;
  end_date?: string | null;
  translations: {
    [K in LanguageCode]?: {
      title: string;
      description: string;
    };
  };
  created_at?: string;
  updated_at?: string;
}

export class EducationEntity {
  props: Education;
  protected constructor(props: Education) {
    this.props = props;
  }
  static create(props: Education) {
    return new EducationEntity(props);
  }
}
