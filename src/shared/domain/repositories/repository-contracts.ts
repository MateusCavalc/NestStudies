import { Entity } from "../entities/entity";

// Basic repo operations declarations
export interface RepositoryInterface<E extends Entity<Object>> {

    insert(entity: E): Promise<void>
    findById(id: string): Promise<E>
    findAll(): Promise<E[]>
    update(entity: E): Promise<void>
    delete(id: string): Promise<void>

}

export type SortDirection = 'asc' | 'desc';
export type SearchProps = {
    page?: number
    perPage?: number
    sort?: string
    sortDir?: SortDirection
    filter?: string

}

export class SearchParams {
    protected _page: number
    protected _perPage: number
    protected _sort: string
    protected _sertDir: SortDirection
    protected _filter: string


    constructor(props: SearchProps) { }
}

// Paginationable repo operations declarations
export interface Paginationable<
    E extends Entity<object>,
    SearchParams,
    PaginationOutput,
> extends RepositoryInterface<E> {

    paginate(searchProps: SearchParams): Promise<PaginationOutput>

}