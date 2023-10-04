import { UserRepository } from "@/users/domain/repositories/user.repository"
import { BadRequestError } from "../../../shared/application/errors/BadRequest-error"
import { UseCase as DefaultUseCase } from "@/shared/application/usecases/use-case"
import { SearchInput } from "@/shared/application/dtos/search-input"
import { SearchParams } from "@/shared/domain/repositories/repository-contracts"
import { PaginationMapper, PaginationOutput } from "@/shared/application/dtos/pagination-output"
import { UserOutput } from "../dtos/user-output"

export namespace UpdateUserUseCase {

    export type Input = {
        id: string
        name: string
    }

    export type Output = UserOutput

    export class UseCase implements DefaultUseCase<Input, Output> {
        // Dependency Injection of userRepository
        constructor(private userRepositoy: UserRepository.Repository) { }

        async execute(input: Input): Promise<Output> {
            const { id, name } = input;

            if (!id || !name) {
                throw new BadRequestError('Missing id or name property');
            }

            const user = await this.userRepositoy.findById(id);

            user.setName(name);
            user.validate();

            await this.userRepositoy.update(user);

            return user.toJSON() as Output;

        }
    }

}