import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

import { ComplementaryTaskCategoryId } from "./ComplementaryTaskCategoryId";
import { ComplementaryTaskCategoryCode } from "./ComplementaryTaskCategoryCode";
import { ComplementaryTaskCategoryName } from "./ComplementaryTaskCategoryName";
import { ComplementaryTaskCategoryDescription } from "./ComplementaryTaskCategoryDescription";

interface ComplementaryTaskCategoryProps {
  code: ComplementaryTaskCategoryCode;
  name: ComplementaryTaskCategoryName;
  description: ComplementaryTaskCategoryDescription;
}

export class ComplementaryTaskCategory extends AggregateRoot<ComplementaryTaskCategoryProps> {

  get id(): UniqueEntityID {
    return this._id;
  }

  get categoryId(): ComplementaryTaskCategoryId {
    return ComplementaryTaskCategoryId.create(this.id);
  }

  get code(): ComplementaryTaskCategoryCode {
    return this.props.code;
  }

  get name(): ComplementaryTaskCategoryName {
    return this.props.name;
  }

  get description(): ComplementaryTaskCategoryDescription {
    return this.props.description;
  }

  private constructor(props: ComplementaryTaskCategoryProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: ComplementaryTaskCategoryProps,
    id?: UniqueEntityID
  ): Result<ComplementaryTaskCategory> {

    const guardedProps = [
      { argument: props.code, argumentName: "code" },
      { argument: props.name, argumentName: "name" },
      { argument: props.description, argumentName: "description" }
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<ComplementaryTaskCategory>(guardResult.message);
    }

    const category = new ComplementaryTaskCategory({ ...props }, id);
    return Result.ok<ComplementaryTaskCategory>(category);
  }
}
