import { Entity } from "@/shared/domain/entities/entity"
import { FieldsErrors, ValidatorInterface } from "@/shared/domain/validators/validator.interface"
import { isEmail, validateSync } from "class-validator"

export type UserProps = {
    name: string
    email: string
    password: string
    createdAt?: Date
}

export class UserEntity extends Entity<UserProps> {
    constructor(public readonly props: UserProps) {
        super(props);
        this.props.createdAt = this.props.createdAt ?? new Date();
    }

    get name() {
        return this.props.name;
    }

    private set name(value: string) {
        this.props.name = value;
    }

    public setName(value: string) {
        this.name = value;
    }

    get email() {
        return this.props.email;
    }

    private set email(value: string) {
        this.props.email = value;
    }

    public setEmail(value: string) {
        this.email = value;
    }

    get password() {
        return this.props.password;
    }

    private set password(value: string) {
        this.props.password = value;
    }

    public setPassword(value: string) {
        this.password = value;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    toJSON(): Required<UserProps & { id: string }> {
        return {
            ... this.props,
            id: this.id,
        } as Required<UserProps & { id: string }>
    }

}
