import { Entity } from "@/shared/domain/entities/entity";
import { SearchResult } from "@/shared/domain/repositories/repository-contracts";

export type PaginationOutput<E extends Entity<object>> = {
    items: E[]
    total: number
    currentPage: number
    lastPage: number
    perPage: number
}

export class PaginationMapper {
    static mapToPagination<E extends Entity<object>>(searchResult: SearchResult<E>): PaginationOutput<E> {
        return {
            items: searchResult.items,
            total: searchResult.total,
            currentPage: searchResult.currentPage,
            lastPage: searchResult.lastPage,
            perPage: searchResult.perPage,
        } as PaginationOutput<E>;
    }
}