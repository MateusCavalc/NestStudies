import { UserRepository } from "@/users/domain/repositories/user.repository"
import { BadRequestError } from "../errors/BadRequest-error"
import { UserEntity, UserProps } from "@/users/domain/entities/user.entity"
import { HashProvider } from "@/shared/application/providers/hash-provider"

export namespace SignUpUseCase {

    export type Input = {
        name: string
        email: string
        password: string
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
        constructor(private userRepositoy: UserRepository.Repository,
            private hashProvider: HashProvider) { }

        async execute(input: Input): Promise<Output> {
            const { name, email, password } = input;

            if (!name || !email || !password) {
                throw new BadRequestError('Some necessary input data not provided');
            }

            // Hash user password
            input.password = await this.hashProvider.generateHash(password);

            const user = new UserEntity(
                input as UserProps
            );

            // Verify if email already exists in the repository
            await this.userRepositoy.emailExists(email);

            // Insert user in the repository
            await this.userRepositoy.insert(user);

            return user.toJSON() as Output;

        }
    }

}