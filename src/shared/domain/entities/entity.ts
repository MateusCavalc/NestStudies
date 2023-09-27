import { v4 as uuid_v4 } from "uuid";
import { Validatable } from "../validators/validator";

export abstract class Entity<Props> extends Validatable<Props> {
    private readonly _id: string

    constructor(props: Props, id?: string) {
        super(props);
        this._id = id ?? uuid_v4();
    }

    get id() {
        return this._id;
    }
}