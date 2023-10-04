import { UserDataBuilder } from "@/users/domain/entities/__tests__/helpers/user-data-builder";
import { UserEntity, UserProps } from "@/users/domain/entities/user.entity";
import { UserRepository } from "@/users/domain/repositories/user.repository";
import { UserInMemoryRepository } from "@/users/infrastructure/database/in-memory/repositories/user.inMemory.repository";
import { ListUsersUseCase } from "../../listusers.usecase";
import { BadRequestError } from "@/shared/application/errors/BadRequest-error";
import { SearchResult } from "@/shared/domain/repositories/repository-contracts";
import { PaginationOutput } from "@/shared/application/dtos/pagination-output";

describe('ListUsers UseCase unit tests', () => {
    let repository: UserRepository.Repository;
    let stubEntities: UserEntity[]
    let useCase: ListUsersUseCase.UseCase

    beforeAll(async () => {
        repository = new UserInMemoryRepository();

        stubEntities = [
            new UserEntity(await UserDataBuilder({ name: 'Mateus Freitas' })),
            new UserEntity(await UserDataBuilder({ name: 'Bruna Freitas' })),
            new UserEntity(await UserDataBuilder({ name: 'Júlia Fernanda' })),
            new UserEntity(await UserDataBuilder({ name: 'Magda Fernanda' })),
        ];

        stubEntities.forEach(e => {
            repository.insert(e);
        });

        useCase = new ListUsersUseCase.UseCase(repository);
    });

    it('Should nicely create ListUsers UseCase', () => {
        expect(useCase).toBeDefined();
    });

    it('Should throw error when passing null \'page\' property', () => {
        expect(useCase.execute({
            perPage: 10
        } as ListUsersUseCase.Input))
            .rejects.toBeInstanceOf(BadRequestError);
    });

    it('Should throw error when passing null \'perPage\' property', () => {
        expect(useCase.execute({
            page: 1
        } as ListUsersUseCase.Input))
            .rejects.toBeInstanceOf(BadRequestError);
    });

    it('Should nicely list all users in repository', () => {
        expect(useCase.execute({
            page: 1,
            perPage: 10,
            sortDir: 'asc'
        })).resolves.toStrictEqual(
            {
                items: [...stubEntities].map(item => item.toJSON()),
                total: stubEntities.length,
                currentPage: 1,
                lastPage: 1,
                perPage: 10,
            } as PaginationOutput<UserEntity>
        );

        expect(useCase.execute({
            page: 2,
            perPage: 3,
        })).resolves.toStrictEqual(
            {
                items: [stubEntities[0].toJSON()],
                total: 4,
                currentPage: 2,
                lastPage: 2,
                perPage: 3,
            } as PaginationOutput<UserEntity>
        );
    });

});
