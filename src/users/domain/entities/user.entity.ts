import { Entity } from "@/shared/domain/entities/entity"

export type UserProps = {
    name: string
    email: string
    password: string
    createdAt?: Date
}

export class UserEntity extends Entity {
    constructor(public readonly props: UserProps) {
        super();
        this.props.createdAt = this.props.createdAt ?? new Date();
    }

    get name() {
        return this.props.name;
    }

    get email() {
        return this.props.email;
    }

    get password() {
        return this.props.password;
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
