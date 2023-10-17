import { PaginationOutput } from "@/shared/application/dtos/pagination-output"
import { UserOutput } from "@/users/application/dtos/user-output"
import { ApiProperty } from "@nestjs/swagger"
import { Exclude, Transform } from "class-transformer"
import { PaginationView } from "../../../shared/infrastructure/presenters/pagination.presenter"

export class UserView {
    @ApiProperty({description: 'Id do usuário'})
    id: string

    @ApiProperty({description: 'Nome do usuário'})
    name: string

    @ApiProperty({description: 'E-mail do usuário'})
    email: string
    
    @ApiProperty({description: 'Data de criação do usuário'})
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
    @ApiProperty({description: 'Registros da página atual da paginação'})
    items: UserView[]

    constructor(paginationOutput: PaginationOutput<UserOutput>) {
        super(paginationOutput);

        this.items = paginationOutput.items.map(item => new UserView(item));
    }

}