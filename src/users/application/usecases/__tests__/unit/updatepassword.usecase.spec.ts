import { UserDataBuilder } from "@/users/domain/entities/__tests__/helpers/user-data-builder";
import { UserEntity, UserProps } from "@/users/domain/entities/user.entity";
import { UserRepository } from "@/users/domain/repositories/user.repository";
import { UserInMemoryRepository } from "@/users/infrastructure/database/in-memory/repositories/user.inMemory.repository";
import { UpdatePasswordUseCase } from "../../updatepassword.usecase";
import { v4 as uuid_v4 } from "uuid";
import { BadRequestError } from "@/shared/application/errors/BadRequest-error";
import { NotFoundError } from "@/shared/domain/errors/NotFound-error";
import { EntityValidationError } from "@/shared/domain/errors/EntityValidation-error";
import { UserRules } from "@/users/domain/validators/user.validator.rules";
import { BcryptHashProvider } from "@/users/infrastructure/providers/bcrypt-hash.provider";
import { InvalidPasswordError } from "@/shared/domain/errors/InvalidPassword-error";

describe('UpdatePassword UseCase unit tests', () => {
    let repository: UserRepository.Repository
    let hashProvider: BcryptHashProvider
    let userProps: UserProps
    let entity: UserEntity
    let useCase: UpdatePasswordUseCase.UseCase

    beforeAll(async () => {
        repository = new UserInMemoryRepository();
        hashProvider = new BcryptHashProvider();
        userProps = await UserDataBuilder(
            {
                name: 'Mateus Freitas',
                password: await hashProvider.generateHash('1234')
            }
        );

        entity = new UserEntity(new UserRules(userProps));

        repository.insert(entity);

        useCase = new UpdatePasswordUseCase.UseCase(repository, hashProvider);
    });

    it('Should nicely create UpdatePassword UseCase', () => {
        expect(useCase).toBeDefined();
    });

    it('Should throw error when passing null \'id\' property', () => {
        const invalidParams = {
            oldPassword: entity.password,
            newPassword: 's0M3-n3W-p45SwOrD',
        }

        expect(useCase.execute(invalidParams as UpdatePasswordUseCase.Input))
            .rejects.toBeInstanceOf(BadRequestError);
    });

    it('Should throw error when passing null \'oldPassword\' property', () => {
        const invalidParams = {
            id: entity.id,
            newPassword: 's0M3-n3W-p45SwOrD',
        }

        expect(useCase.execute(invalidParams as UpdatePasswordUseCase.Input))
            .rejects.toBeInstanceOf(BadRequestError);
    });

    it('Should throw error when passing null \'newPassword\' property', () => {
        const invalidParams = {
            id: entity.id,
            oldPassword: entity.password,
        }

        expect(useCase.execute(invalidParams as UpdatePasswordUseCase.Input))
            .rejects.toBeInstanceOf(BadRequestError);
    });

    it('Should throw error when not finding user entity in repository', () => {
        const updateParams = {
            id: uuid_v4(),
            oldPassword: entity.password,
            newPassword: 's0M3-n3W-p45SwOrD',
        }

        expect(useCase.execute(updateParams as UpdatePasswordUseCase.Input))
            .rejects.toBeInstanceOf(NotFoundError);
    });

    it('Should throw error when oldPassword does not match with user password', () => {
        let updatePasswordParams = {
            id: entity.id,
            oldPassword: 'wrong password',
            newPassword: 's0M3-n3W-p45SwOrD',
        }

        expect(useCase.execute(updatePasswordParams as UpdatePasswordUseCase.Input))
            .rejects.toBeInstanceOf(InvalidPasswordError);

    });

    it('Should throw error when trying to update with non-valid password', () => {
        let updatePasswordParams = {
            id: entity.id,
            oldPassword: '1234',
            newPassword: 'a'.repeat(101),
        }
        expect(useCase.execute(updatePasswordParams as UpdatePasswordUseCase.Input))
            .rejects.toBeInstanceOf(EntityValidationError);

        updatePasswordParams = {
            id: entity.id,
            oldPassword: '1234',
            newPassword: 10 as any,
        }
        expect(useCase.execute(updatePasswordParams as UpdatePasswordUseCase.Input))
            .rejects.toBeInstanceOf(EntityValidationError);
    });

    it('Should nicely update the password of an user entity', async () => {
        const updatePasswordParams = {
            id: entity.id,
            oldPassword: '1234',
            newPassword: 's0M3-n3W-p45SwOrD',
        }

        const result = await useCase.execute(updatePasswordParams as UpdatePasswordUseCase.Input);

        expect(hashProvider.compareHash(updatePasswordParams.newPassword, result.password))
            .resolves.toBeTruthy();
    });

});
