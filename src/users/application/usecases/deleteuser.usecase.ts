import { UserRepository } from "@/users/domain/repositories/user.repository"
import { BadRequestError } from "../../../shared/application/errors/BadRequest-error"
import { UseCase as DefaultUseCase } from "@/shared/application/usecases/use-case"
import { UserOutput } from "../dtos/user-output"

export namespace DeleteUserUseCase {

    export type Input = {
        id: string
    }

    export type Output = void

    export class UseCase implements DefaultUseCase<Input, Output> {
        // Dependency Injection of userRepository
        constructor(private userRepositoy: UserRepository.Repository) { }

        async execute(input: Input): Promise<Output> {
            const { id } = input;

            if (!id) {
                throw new BadRequestError('Missing id property');
            }

            const user = await this.userRepositoy.delete(id);

            return;

        }
    }

}