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
    sort?: string | null
    sortDir?: SortDirection | null
    filter?: string | null

}

export class SearchParams {
    protected _page: number
    protected _perPage: number = 10
    protected _sort: string | null
    protected _sortDir: SortDirection | null
    protected _filter: string | null


    constructor(props: SearchProps) {
        Object.assign(this, props);
    }

    get page() {
        return this._page;
    }

    private set page(value: number) {
        this._page = value;
    }

    get perPage() {
        return this._perPage;
    }

    private set perPage(value: number) {
        this._perPage = value;
    }

    get sort() {
        return this._sort;
    }

    private set sort(value: string | null) {
        this._sort = value;
    }

    get sortDir() {
        return this._sortDir;
    }

    private set sortDir(value: SortDirection | null) {
        this._sortDir = value;
    }

    get filter() {
        return this._filter;
    }

    private set filter(value: string | null) {
        this._filter = value;
    }
        
}

// Paginationable repo operations declarations
export interface Paginationable<
    E extends Entity<object>,
    SearchParams,
    PaginationOutput,
> extends RepositoryInterface<E> {

    paginate(searchProps: SearchParams): Promise<PaginationOutput>

}