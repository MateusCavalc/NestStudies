import { PaginationOutput } from "@/shared/application/dtos/pagination-output"
import { Transform } from "class-transformer"

export abstract class PaginationView<Output> {
    @Transform(({value}) => parseInt(value))
    total: number

    @Transform(({value}) => parseInt(value))
    currentPage: number
    
    @Transform(({value}) => parseInt(value))
    lastPage: number
    
    @Transform(({value}) => parseInt(value))
    perPage: number

    constructor(output: PaginationOutput<Output>) {
        this.total = output.total;
        this.currentPage = output.currentPage;
        this.lastPage = output.lastPage;
        this.perPage = output.perPage;
    }

}