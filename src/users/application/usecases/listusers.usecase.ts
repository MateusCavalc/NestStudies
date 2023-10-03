import { UserRepository } from "@/users/domain/repositories/user.repository"
import { BadRequestError } from "../../../shared/application/errors/BadRequest-error"
import { UseCase as DefaultUseCase } from "@/shared/application/usecases/use-case"
import { SearchInput } from "@/shared/application/dtos/search-input"
import { SearchParams } from "@/shared/domain/repositories/repository-contracts"
import { UserEntity } from "@/users/domain/entities/user.entity"
import { PaginationMapper, PaginationOutput } from "@/shared/application/dtos/pagination-output"

export namespace ListUsersUseCase {

    export type Input = SearchInput

    export type Output = PaginationOutput<UserEntity>

    export class UseCase implements DefaultUseCase<Input, Output> {
        // Dependency Injection of userRepository
        constructor(private userRepositoy: UserRepository.Repository) { }

        async execute(input: Input): Promise<Output> {
            const { page, perPage } = input;

            if (!page || !perPage) {
                throw new BadRequestError('Missing page or perPage search property');
            }

            const searchResult = await this.userRepositoy.search(
                new SearchParams(input)
            );

            return PaginationMapper.mapToPagination(searchResult);
        }
    }

}