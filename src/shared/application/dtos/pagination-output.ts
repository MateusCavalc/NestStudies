import { Entity } from "@/shared/domain/entities/entity";
import { SearchResult } from "@/shared/domain/repositories/repository-contracts";

export type PaginationOutput<E> = {
    items: E[]
    total: number
    currentPage: number
    lastPage: number
    perPage: number
}

export class PaginationMapper {
    static mapToPagination<E>(searchResult: SearchResult<Entity<object>>): PaginationOutput<E> {
        return {
            items: searchResult.items.map(item => item.toJSON()),
            total: searchResult.total,
            currentPage: searchResult.currentPage,
            lastPage: searchResult.lastPage,
            perPage: searchResult.perPage,
        } as PaginationOutput<E>;
    }
}