import { UserDataBuilder } from "@/users/domain/entities/__tests__/helpers/user-data-builder";
import { UserProps } from "@/users/domain/entities/user.entity";
import { UserRepository } from "@/users/domain/repositories/user.repository";
import { UserInMemoryRepository } from "@/users/infrastructure/database/in-memory/repositories/user.inMemory.repository";
import { SignUpUseCase } from "../../signup.usecase";
import { ConflictError } from "@/shared/domain/errors/Conflict-error";
import { BadRequestError } from "@/users/application/errors/BadRequest-error";
import { BcryptHashProvider } from "@/users/infrastructure/providers/bcrypt-hash.provider";

describe('SignUp UseCase unit tests', () => {
    let repository: UserRepository.Repository;
    let hashProvider: BcryptHashProvider;
    let userProps: UserProps;

    beforeAll(async () => {
        repository = new UserInMemoryRepository();
        hashProvider = new BcryptHashProvider();
        userProps = await UserDataBuilder({});
    });

    it('Should nicely create SignUp UseCase', async () => {
        const useCase = new SignUpUseCase.UseCase(repository, hashProvider);

        expect(useCase).toBeDefined();
    });

    it('Should nicely signup a new user', async () => {
        const useCase = new SignUpUseCase.UseCase(repository, hashProvider);

        const insertSpy = jest.spyOn(repository, 'insert');
        const hashSpy = jest.spyOn(hashProvider, 'generateHash');

        const result = await useCase.execute(userProps);

        expect(insertSpy).toBeCalled();
        expect(hashSpy).toBeCalled();

        expect(result).toHaveProperty('id');
        expect(result.name).toStrictEqual(userProps.name);
        expect(result.email).toStrictEqual(userProps.email);
        expect(result.password).toStrictEqual(userProps.password);
        expect(result.createdAt).toStrictEqual(userProps.createdAt);

    });

    it('Should throw error when trying to signup an existing user', async () => {
        const useCase = new SignUpUseCase.UseCase(repository, hashProvider);

        expect(async () => await useCase.execute(userProps))
            .rejects.toThrow(new ConflictError(`Entity already exists in the repository with email '${userProps.email}'`))

    });

    it('Should throw error when passing null \'name\' property', async () => {
        const useCase = new SignUpUseCase.UseCase(repository, hashProvider);

        const invalidProps = {
            ...userProps,
            name: null
        }

        expect(async () => await useCase.execute(invalidProps))
            .rejects.toThrow(new BadRequestError('Some necessary input data not provided'))

    });

    it('Should throw error when passing null \'email\' property', async () => {
        const useCase = new SignUpUseCase.UseCase(repository, hashProvider);

        const invalidProps = {
            ...userProps,
            email: null
        }

        expect(async () => await useCase.execute(invalidProps))
            .rejects.toThrow(new BadRequestError('Some necessary input data not provided'))

    });

    it('Should throw error when passing null \'password\' property', async () => {
        const useCase = new SignUpUseCase.UseCase(repository, hashProvider);

        const invalidProps = {
            ...userProps,
            password: null
        }

        expect(async () => await useCase.execute(invalidProps))
            .rejects.toThrow(new BadRequestError('Some necessary input data not provided'))

    });

});
