import { UserRepository } from "@/users/domain/repositories/user.repository"
import { BadRequestError } from "../../../shared/application/errors/BadRequest-error"
import { UserOutput } from "../dtos/user-output"
import { UseCase as DefaultUseCase } from "@/shared/application/usecases/use-case"

export namespace GetUserUseCase {

    export type Input = {
        id: string
    }

    export type Output = UserOutput

    export class UseCase implements DefaultUseCase<Input, Output> {
        // Dependency Injection of userRepository
        constructor(private userRepositoy: UserRepository.Repository) { }

        async execute(input: Input): Promise<Output> {
            const { id } = input;

            if (!id) {
                throw new BadRequestError('Missing id');
            }

            const user = await this.userRepositoy.findById(id);

            return user.toJSON() as Output;
        }
    }

}