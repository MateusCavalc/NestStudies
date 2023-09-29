import { v4 as uuid_v4 } from "uuid";
import { Validatable } from "../validators/validator";

export abstract class Entity<Props extends object> extends Validatable<Props> {
    private readonly _id: string

    constructor(props: Props, id?: string) {
        super(props);
        this._id = id ?? uuid_v4();
    }

    get id() {
        return this._id;
    }

    toJSON(): Required<Props & { id: string }> {
        return {
            ... this.toBeValidated,
            id: this.id,
        } as Required<Props & { id: string }>
    }

}