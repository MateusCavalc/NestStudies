import { Entity } from "../entities/entity";

// Basic repo operations declarations
export interface RepositoryInterface<E extends Entity<object>> {

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

export type SearchResultProps<E extends Entity<object>> = {
    items: E[]
    total: number
    currentPage: number
    perPage: number
    sort: string | null
    sortDir: SortDirection | null
    filter: string | null
}

export class SearchParams {
    protected _page: number = 1
    protected _perPage: number = 10
    protected _sort: string | null
    protected _sortDir: SortDirection | null
    protected _filter: string | null


    constructor(props: SearchProps = {}) {
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

export class SearchResult<E extends Entity<object>> {
    readonly items: E[]
    readonly total: number
    readonly currentPage: number
    readonly perPage: number
    readonly lastPage: number
    readonly sort: string | null
    readonly sortDir: SortDirection | null
    readonly filter: string | null

    constructor(props: SearchResultProps<E>) {
        Object.assign(this, props);

        this.lastPage = Math.ceil(this.total / this.perPage);
    }

    toJSON(forceJsonEntity = false) {
        return {
            items: forceJsonEntity ? this.items.map(item => {
                item.toJSON();
            }) : this.items,
            total: this.total,
            currentPage: this.currentPage,
            perPage: this.perPage,
            lastPage: this.lastPage,
            sort: this.sort,
            sortDir: this.sortDir,
            filter: this.filter,
        };
    }

}

// Searchable repo operations declarations
export interface SearchableRepositoryInterface<
    E extends Entity<object>,
    PaginationInput = SearchParams,
    PaginationOutput = SearchResult<E>,
> extends RepositoryInterface<E> {

    search(searchProps: PaginationInput): Promise<PaginationOutput>

}