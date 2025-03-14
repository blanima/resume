export interface Experience {
  id: string;
  title: string;
  company: string;
  start_date: string;
  end_date: string;
  translations: Record<string, string>;
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
