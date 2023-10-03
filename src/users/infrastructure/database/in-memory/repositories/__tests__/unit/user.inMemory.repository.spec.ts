import { UserEntity, UserProps } from "@/users/domain/entities/user.entity";
import { UserInMemoryRepository } from "../../user.inMemory.repository";
import { UserDataBuilder } from "@/users/domain/entities/__tests__/helpers/user-data-builder";
import { NotFoundError } from "@/shared/domain/errors/NotFound-error";
import { ConflictError } from "@/shared/domain/errors/Conflict-error";
import { SearchParams } from "@/shared/domain/repositories/repository-contracts";

describe('User InMemory Repository unit tests', () => {
    let userProps: UserProps;
    let entities: UserEntity[]
    let repository: UserInMemoryRepository

    beforeAll(async () => {
        entities = [
            new UserEntity(await UserDataBuilder({ name: 'Mateus Freitas' })),
            new UserEntity(await UserDataBuilder({ name: 'Bruna Freitas' })),
            new UserEntity(await UserDataBuilder({ name: 'Jonas Alguma coisa' })),
        ];

        repository = new UserInMemoryRepository();
    });

    it("Should throw error when searching user by email (findByEmail)", async () => {
        await expect(async () => await repository.findByEmail(entities[0].email))
            .rejects.toThrowError(NotFoundError);
    });

    it("Should not find an email in the repository (emailExists)", async () => {
        await expect(repository.emailExists(entities[0].email))
            .resolves.not.toThrow();
    });

    it("Should find user by email (findByEmail)", async () => {
        await repository.insert(entities[0]);

        await expect(repository.findByEmail(entities[0].email))
            .resolves.toStrictEqual(entities[0]);
    });

    it("Should throw error (emailExists)", async () => {
        await expect(async () => await repository.emailExists(entities[0].email))
            .rejects.toThrowError(ConflictError);
    });

    it("Should sort repository by 'createdAt' entity field", async () => {
        await repository.insert(entities[1]);

        let result = await repository.search(
            new SearchParams({
                page: 1,
                perPage: 10,
            })
        );

        expect(result.items).toStrictEqual([entities[1], entities[0]]);

        result = await repository.search(
            new SearchParams({
                page: 1,
                perPage: 10,
                sortDir: 'asc'
            })
        );

        expect(result.items).toStrictEqual([entities[0], entities[1]]);

    });

    it("Should sort repository by 'name' entity field", async () => {

        let result = await repository.search(
            new SearchParams({
                page: 1,
                perPage: 10,
                sort: 'name',
            })
        );

        expect(result.items).toStrictEqual([entities[0], entities[1]]);

        result = await repository.search(
            new SearchParams({
                page: 1,
                perPage: 10,
                sort: 'name',
                sortDir: 'asc',
            })
        );

        expect(result.items).toStrictEqual([entities[1], entities[0]]);
    });

    it("Should filter repository by 'name' entity field", async () => {
        await repository.insert(entities[2]);

        let result = await repository.search(
            new SearchParams({
                page: 1,
                perPage: 10,
            })
        );

        expect(result.items).toStrictEqual([entities[2], entities[1], entities[0]]);

        result = await repository.search(
            new SearchParams({
                page: 1,
                perPage: 10,
                filter: 'Freitas'
            })
        );

        expect(result.items).toStrictEqual([entities[1], entities[0]]);

    });

});
