import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface ResponsibleTeamProps {
  value: string;
}

export class ResponsibleTeam extends ValueObject<ResponsibleTeamProps> {

  get value(): string {
    return this.props.value;
  }

  private constructor(props: ResponsibleTeamProps) {
    super(props);
  }

  public static create(team: string): Result<ResponsibleTeam> {
    const guardResult = Guard.againstNullOrUndefined(team, "responsibleTeam");

    if (!guardResult.succeeded) {
      return Result.fail<ResponsibleTeam>(guardResult.message);
    }

    return Result.ok<ResponsibleTeam>(
      new ResponsibleTeam({ value: team })
    );
  }
}
