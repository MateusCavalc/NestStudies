import { UserDataBuilder } from "@/users/domain/entities/__tests__/helpers/user-data-builder";
import { UserEntity, UserProps } from "@/users/domain/entities/user.entity";
import { UserRepository } from "@/users/domain/repositories/user.repository";
import { UserInMemoryRepository } from "@/users/infrastructure/database/in-memory/repositories/user.inMemory.repository";
import { UpdateUserUseCase } from "../../updateuser.usecase";
import { v4 as uuid_v4 } from "uuid";
import { BadRequestError } from "@/shared/application/errors/BadRequest-error";
import { NotFoundError } from "@/shared/domain/errors/NotFound-error";
import { EntityValidationError } from "@/shared/domain/errors/EntityValidation-error";
import { UserRules } from "@/users/domain/validators/user.validator.rules";

describe('ListUsers UseCase unit tests', () => {
    let repository: UserRepository.Repository;
    let entity: UserEntity
    let useCase: UpdateUserUseCase.UseCase

    beforeAll(async () => {
        repository = new UserInMemoryRepository();
        entity = new UserEntity(new UserRules(await UserDataBuilder({ name: 'Mateus Freitas' })));

        repository.insert(entity);

        useCase = new UpdateUserUseCase.UseCase(repository);
    });

    it('Should nicely create UpdateUser UseCase', () => {
        expect(useCase).toBeDefined();
    });

    it('Should throw error when passing null \'id\' property', () => {
        const invalidParams = {
            name: 'New Name'
        }

        expect(useCase.execute(invalidParams as UpdateUserUseCase.Input))
            .rejects.toBeInstanceOf(BadRequestError);
    });

    it('Should throw error when passing null \'name\' property', () => {
        const invalidParams = {
            id: uuid_v4()
        }

        expect(useCase.execute(invalidParams as UpdateUserUseCase.Input))
            .rejects.toBeInstanceOf(BadRequestError);
    });

    it('Should throw error when not finding user entity in repository', () => {
        const updateParams = {
            id: uuid_v4(),
            name: "Some New Name"
        }

        expect(useCase.execute(updateParams as UpdateUserUseCase.Input))
            .rejects.toBeInstanceOf(NotFoundError);
    });

    it('Should throw error when trying to update user with non-valid name', () => {
        let updateParams = {
            id: entity.id,
            name: "a".repeat(256)
        }
        expect(useCase.execute(updateParams as UpdateUserUseCase.Input))
            .rejects.toBeInstanceOf(EntityValidationError);

        updateParams = {
            id: entity.id,
            name: 10 as any
        }
        expect(useCase.execute(updateParams as UpdateUserUseCase.Input))
            .rejects.toBeInstanceOf(EntityValidationError);

    });

    it('Should nicely update the name of an user entity', () => {
        let updateParams = {
            id: entity.id,
            name: "Novo nome para o Mateus"
        }
        expect(useCase.execute(updateParams as UpdateUserUseCase.Input))
            .resolves.toStrictEqual({
                id: entity.id,
                name: "Novo nome para o Mateus",
                email: entity.email,
                password: entity.password,
                createdAt: entity.createdAt,
            });
    });

});
