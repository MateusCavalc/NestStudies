import { UserDataBuilder } from "@/users/domain/entities/__tests__/helpers/user-data-builder";
import { UserEntity, UserProps } from "@/users/domain/entities/user.entity";
import { UserRepository } from "@/users/domain/repositories/user.repository";
import { UserInMemoryRepository } from "@/users/infrastructure/database/in-memory/repositories/user.inMemory.repository";
import { ListUsersUseCase } from "../../listusers.usecase";
import { BadRequestError } from "@/shared/application/errors/BadRequest-error";
import { SearchResult } from "@/shared/domain/repositories/repository-contracts";

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
            new SearchResult({
                items: stubEntities,
                total: stubEntities.length,
                currentPage: 1,
                perPage: 10,
                sort: undefined,
                sortDir: 'asc',
                filter: undefined,
            })
        );

        expect(useCase.execute({
            page: 2,
            perPage: 2,
        })).resolves.toStrictEqual(
            new SearchResult({
                items: [stubEntities[0]],
                total: 1,
                currentPage: 2,
                perPage: 2,
                sort: undefined,
                sortDir: undefined,
                filter: undefined,
            })
        );
    });

});
