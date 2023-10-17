import { PaginationOutput } from "@/shared/application/dtos/pagination-output"
import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"

export abstract class PaginationView<Output> {
    @ApiProperty({description: 'Número total de registros da paginação'})
    @Transform(({value}) => parseInt(value))
    total: number
    
    @ApiProperty({description: 'Número da página atual'})
    @Transform(({value}) => parseInt(value))
    currentPage: number
    
    @ApiProperty({description: 'Número da última página da paginação'})
    @Transform(({value}) => parseInt(value))
    lastPage: number
    
    @ApiProperty({description: 'Número de registros por página'})
    @Transform(({value}) => parseInt(value))
    perPage: number

    constructor(output: PaginationOutput<Output>) {
        this.total = output.total;
        this.currentPage = output.currentPage;
        this.lastPage = output.lastPage;
        this.perPage = output.perPage;
    }

}