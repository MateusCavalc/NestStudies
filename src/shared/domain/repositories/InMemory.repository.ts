import { Entity } from "../entities/entity";
import { NotFoundError } from "../errors/NotFound-error";
import { SearchableRepositoryInterface, RepositoryInterface, SearchParams, SearchResult, SortDirection } from "./repository-contracts";

// InMemoryRepository implements all basic repo and pagination operations
export abstract class InMemoryRepository<E extends Entity<object>>
    implements SearchableRepositoryInterface<E, SearchParams, SearchResult<E>> {

    items: E[] = [];

    async insert(entity: E): Promise<void> {
        this.items.push(entity);
    }

    async findById(id: string): Promise<E> {
        let entity: E = null;

        entity = this.items.find(item => item.id == id);

        if (entity == null) {
            throw new NotFoundError("Entity Not Found");
        }

        return entity;
    }

    async findAll(): Promise<E[]> {
        return this.items;
    }

    async update(entity: E): Promise<void> {
        let index = this.items.findIndex(item => item.id == entity.id);

        if (index == -1) {
            throw new NotFoundError("Entity Not Found");
        }

        this.items[index] = entity;

    }

    async delete(id: string): Promise<void> {
        let index = this.items.findIndex(item => item.id == id);

        if (index == -1) {
            throw new NotFoundError("Entity Not Found");
        }

        this.items.splice(index, 1);
    }

    async search(searchProps: SearchParams): Promise<SearchResult<E>> {
        const filteredItems = await this.applyFilter(this.items, searchProps.filter);
        const sortedItems = await this.applySort(filteredItems, searchProps.sort, searchProps.sortDir);
        const paginatedItems = await this.applyPagination(sortedItems, searchProps.page, searchProps.perPage);

        return new SearchResult({
            items: paginatedItems,
            total: sortedItems.length,
            currentPage: searchProps.page,
            perPage: searchProps.perPage,
            sort: searchProps.sort,
            sortDir: searchProps.sortDir,
            filter: searchProps.filter,
        });
    }

    protected abstract applyFilter(items: E[], filter: string | null): Promise<E[]>

    protected async applySort(items: E[], sort: string | null, sortDir: SortDirection | null): Promise<E[]> {
        if (!sort) {
            return items;
        }

        // apply sort to copy of items array
        return [...items].sort((a, b) => {
            if (a.props[sort] < b.props[sort]) {
                return sortDir === 'asc' ? -1 : 1;
            }

            if (a.props[sort] > b.props[sort]) {
                return sortDir === 'asc' ? 1 : -1;
            }

            return 0;
        });
    }

    protected async applyPagination(items: E[], page: number, perPage: number | null): Promise<E[]> {
        const start = (page - 1) * perPage;
        const end = start + perPage;

        return items.slice(start, end);
    }

}