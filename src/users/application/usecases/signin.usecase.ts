import { UserRepository } from "@/users/domain/repositories/user.repository"
import { BadRequestError } from "../../../shared/application/errors/BadRequest-error"
import { AuthenticationError } from "@/shared/domain/errors/Authentication-error"
import { UseCase as DefaultUseCase } from "@/shared/application/usecases/use-case"
import { HashProvider } from "@/shared/application/providers/hash-provider"
import { UserOutput } from "../dtos/user-output"

export namespace SignInUseCase {

    export type Input = {
        email: string
        password: string
    }

    export type Output = UserOutput

    export class UseCase implements DefaultUseCase<Input, Output> {
        // Dependency Injection of userRepository
        constructor(private userRepositoy: UserRepository.Repository,
                    private hashProvider: HashProvider) { }

        async execute(input: Input): Promise<Output> {
            const { email, password } = input;

            if (!email || !password) {
                throw new BadRequestError('Missing email or password');
            }

            const user = await this.userRepositoy.findByEmail(email);

            if(!(await this.hashProvider.compareHash(password, user.password))) {
                throw new AuthenticationError("Password does not match");
            }

            return user.toJSON() as Output;

        }
    }

}