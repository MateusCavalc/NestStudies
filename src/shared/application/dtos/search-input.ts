import { SortDirection } from "@/shared/domain/repositories/repository-contracts"

export type SearchInput = {
    page?: number
    perPage?: number
    sort?: string | null
    sortDir?: SortDirection | null
    filter?: string | null
}