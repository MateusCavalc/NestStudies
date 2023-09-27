import { v4 as uuid_v4 } from "uuid";

export abstract class Entity {
    private readonly _id: string

    constructor(id?: string) {
        this._id = id ?? uuid_v4();
    }

    get id() {
        return this._id;
    }
}