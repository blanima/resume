import { Experience } from "../../entities/experience";

interface ExperienceInboundInput {
  props: Experience;
}

export class ExperienceInbound {
  props: Experience;

  private constructor(input: ExperienceInboundInput) {
    this.props = input.props;
  }

  static create(input: ExperienceInboundInput) {
    return new ExperienceInbound(input);
  }
}
