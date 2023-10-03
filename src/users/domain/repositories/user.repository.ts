import { UserEntity } from "../entities/user.entity";
import {
    SearchParams as DefaultSearchParams,
    SearchResult as DefaultSearchResult,
    SearchableRepositoryInterface,
} from '@/shared/domain/repositories/repository-contracts'

export namespace UserRepository {

    export class SearchParams extends DefaultSearchParams { }
    export class SearchResult extends DefaultSearchResult<UserEntity> { }

    // Specific UserRepository operations, using strict UserEntity.
    export interface Repository<E = UserEntity>
        extends SearchableRepositoryInterface<
            UserEntity,
            SearchParams,
            SearchResult> {

        findByEmail(email: string): Promise<E>
        emailExists(email: string): Promise<void>

    }

}
