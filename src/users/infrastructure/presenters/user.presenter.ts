import { PaginationOutput } from "@/shared/application/dtos/pagination-output"
import { UserOutput } from "@/users/application/dtos/user-output"
import { Exclude, Transform } from "class-transformer"
import { PaginationView } from "./pagination.presenter"

export class UserView {
    id: string
    name: string
    email: string

    @Transform(({ value }) => (value as Date).toISOString())
    createdAt: Date

    constructor(output: UserOutput) {
        this.id = output.id;
        this.name = output.name;
        this.email = output.email;
        this.createdAt = output.createdAt;
    }
}

export class UserPaginationView extends PaginationView<UserOutput> {
    items: UserView[]

    constructor(paginationOutput: PaginationOutput<UserOutput>) {
        super(paginationOutput);

        this.items = paginationOutput.items.map(item => new UserView(item));
    }

}