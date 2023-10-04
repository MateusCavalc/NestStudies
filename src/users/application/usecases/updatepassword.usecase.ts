import { UserRepository } from "@/users/domain/repositories/user.repository"
import { BadRequestError } from "../../../shared/application/errors/BadRequest-error"
import { UseCase as DefaultUseCase } from "@/shared/application/usecases/use-case"
import { UserOutput } from "../dtos/user-output"
import { HashProvider } from "@/shared/application/providers/hash-provider"
import { InvalidPasswordError } from "@/shared/domain/errors/InvalidPassword-error"

export namespace UpdatePasswordUseCase {

    export type Input = {
        id: string
        oldPassword: string
        newPassword: string
    }

    export type Output = UserOutput

    export class UseCase implements DefaultUseCase<Input, Output> {
        // Dependency Injection of userRepository
        constructor(private userRepositoy: UserRepository.Repository,
            private hashProvider: HashProvider) { }

        async execute(input: Input): Promise<Output> {
            const { id, oldPassword, newPassword } = input;

            if (!id || !oldPassword || !newPassword) {
                throw new BadRequestError('Missing necessary properties');
            }

            const user = await this.userRepositoy.findById(id);

            if (!(await this.hashProvider.compareHash(oldPassword, user.password))) {
                throw new InvalidPasswordError('Old password does not match');
            }

            // Set plain password first (to validate), then set the hashed one!
            user.setPassword(newPassword);
            user.validate();

            const newHashedPassword = await this.hashProvider.generateHash(newPassword);

            user.setPassword(newHashedPassword);

            await this.userRepositoy.update(user);

            return user.toJSON() as Output;

        }
    }

}