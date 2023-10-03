import { UserDataBuilder } from "@/users/domain/entities/__tests__/helpers/user-data-builder";
import { UserProps } from "@/users/domain/entities/user.entity";
import { UserRepository } from "@/users/domain/repositories/user.repository";
import { UserInMemoryRepository } from "@/users/infrastructure/database/in-memory/repositories/user.inMemory.repository";
import { SignUpUseCase } from "../../signup.usecase";
import { ConflictError } from "@/shared/domain/errors/Conflict-error";
import { BadRequestError } from "@/shared/application/errors/BadRequest-error";
import { BcryptHashProvider } from "@/users/infrastructure/providers/bcrypt-hash.provider";

describe('SignUp UseCase unit tests', () => {
    let repository: UserRepository.Repository;
    let hashProvider: BcryptHashProvider;
    let userProps: UserProps;
    let useCase: SignUpUseCase.UseCase

    beforeAll(async () => {
        repository = new UserInMemoryRepository();
        hashProvider = new BcryptHashProvider();
        userProps = await UserDataBuilder({});

        useCase = new SignUpUseCase.UseCase(repository, hashProvider);
    });

    it('Should nicely create SignUp UseCase', async () => {
        expect(useCase).toBeDefined();
    });

    it('Should nicely signup a new user', async () => {
        const insertSpy = jest.spyOn(repository, 'insert');
        const hashSpy = jest.spyOn(hashProvider, 'generateHash');

        const result = await useCase.execute(userProps as SignUpUseCase.Input);

        expect(insertSpy).toBeCalled();
        expect(hashSpy).toBeCalled();

        expect(result.id).toBeDefined();
        expect(result.name).toStrictEqual(userProps.name);
        expect(result.email).toStrictEqual(userProps.email);
        expect(result.password).toStrictEqual(userProps.password);
        expect(result.createdAt).toStrictEqual(userProps.createdAt);

    });

    it('Should throw error when trying to signup an existing user', async () => {
        expect(async () => await useCase.execute(userProps as SignUpUseCase.Input))
            .rejects.toBeInstanceOf(ConflictError);
    });

    it('Should throw error when passing null \'name\' property', async () => {
        const invalidProps = {
            ...userProps,
            name: null
        }

        expect(async () => await useCase.execute(invalidProps as SignUpUseCase.Input))
            .rejects.toBeInstanceOf(BadRequestError);
    });

    it('Should throw error when passing null \'email\' property', async () => {
        const invalidProps = {
            ...userProps,
            email: null
        }

        expect(async () => await useCase.execute(invalidProps as SignUpUseCase.Input))
            .rejects.toBeInstanceOf(BadRequestError);
    });

    it('Should throw error when passing null \'password\' property', async () => {
        const invalidProps = {
            ...userProps,
            password: null
        }

        expect(async () => await useCase.execute(invalidProps as SignUpUseCase.Input))
            .rejects.toBeInstanceOf(BadRequestError);
    });

});
