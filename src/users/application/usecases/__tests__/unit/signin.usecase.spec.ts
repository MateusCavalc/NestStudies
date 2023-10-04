import { UserDataBuilder } from "@/users/domain/entities/__tests__/helpers/user-data-builder";
import { UserEntity, UserProps } from "@/users/domain/entities/user.entity";
import { UserRepository } from "@/users/domain/repositories/user.repository";
import { UserInMemoryRepository } from "@/users/infrastructure/database/in-memory/repositories/user.inMemory.repository";
import { SignInUseCase } from "../../signin.usecase";
import { BadRequestError } from "@/shared/application/errors/BadRequest-error";
import { NotFoundError } from "@/shared/domain/errors/NotFound-error";
import { UserRules } from "@/users/domain/validators/user.validator.rules";
import { HashProvider } from "@/shared/application/providers/hash-provider";
import { BcryptHashProvider } from "@/users/infrastructure/providers/bcrypt-hash.provider";
import { AuthenticationError } from "@/shared/domain/errors/Authentication-error";

describe('DeleteUser UseCase unit tests', () => {
    let repository: UserRepository.Repository
    let hashProvider: HashProvider
    let userProps: UserProps
    let entity: UserEntity
    let useCase: SignInUseCase.UseCase

    beforeAll(async () => {
        repository = new UserInMemoryRepository();
        hashProvider = new BcryptHashProvider();
        
        userProps = await UserDataBuilder(
            {
                email: 'mat.fcavalcanti@gmail.com',
                password: await hashProvider.generateHash('1234')
            }
        );

        entity = new UserEntity(new UserRules(userProps));
        repository.insert(entity);

        useCase = new SignInUseCase.UseCase(repository, hashProvider);
    });

    it('Should nicely create SignIn UseCase', () => {
        expect(useCase).toBeDefined();
    });

    it('Should throw error when passing null \'email\' property', () => {
        let invalidParams = {
            email: '',
            password: '1234'
        }

        expect(useCase.execute(invalidParams as SignInUseCase.Input))
            .rejects.toBeInstanceOf(BadRequestError);

        invalidParams = {
            email: null,
            password: '1234'
        }

        expect(useCase.execute(invalidParams as SignInUseCase.Input))
            .rejects.toBeInstanceOf(BadRequestError);

        invalidParams = {
            email: 'mat.fcavalcanti@gmail.com',
            password: ''
        }

        expect(useCase.execute(invalidParams as SignInUseCase.Input))
            .rejects.toBeInstanceOf(BadRequestError);

        invalidParams = {
            email: 'mat.fcavalcanti@gmail.com',
            password: null
        }

        expect(useCase.execute(invalidParams as SignInUseCase.Input))
            .rejects.toBeInstanceOf(BadRequestError);
    });

    it('Should throw error when trying to sign in with wrong password', () => {
        let invalidCredentials = {
            email: 'mat.fcavalcanti@gmail.com',
            password: 'wrong_password'
        }

        expect(useCase.execute(invalidCredentials as SignInUseCase.Input))
            .rejects.toBeInstanceOf(AuthenticationError);

    });

    it('Should nicely sign in with credentials', () => {
        let validCredentials = {
            email: 'mat.fcavalcanti@gmail.com',
            password: '1234'
        }

        expect(useCase.execute(validCredentials as SignInUseCase.Input))
            .resolves.toStrictEqual(entity.toJSON());

    });

});
