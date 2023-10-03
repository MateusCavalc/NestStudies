import { UserRepository } from "@/users/domain/repositories/user.repository"
import { BadRequestError } from "../errors/BadRequest-error"

export namespace GetUserUseCase {

    export type Input = {
        id: string
    }

    export type Output = {
        id: string
        name: string
        email: string
        password: string
        createdAt: Date
    }

    export class UseCase {
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