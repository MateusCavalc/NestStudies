import { validateSync } from "class-validator";
import { FieldsErrors, ValidatorInterface } from "./validator.interface";

export abstract class Validatable<Props> implements ValidatorInterface<Props> {

    errors: FieldsErrors = null;
    toBeValidated: Props;

    constructor(props: Props) {
        this.toBeValidated = props;
    }

    validate(): boolean {
        // console.log(`Validating ${JSON.stringify(Object(this.toBeValidated))} object`);
        const errors = validateSync(Object(this.toBeValidated));

        if (errors.length > 0) {
            this.errors = {};
            for (const error of errors) {
                this.errors[error.property] = Object.values(error.constraints);
            }

            // console.log(this.errors);

            return false;
        }
        else return true;

    }

}