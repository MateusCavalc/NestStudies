import { UserEntity, UserProps } from "@/users/domain/entities/user.entity";
import { UserInMemoryRepository } from "../../user.repository";
import { UserDataBuilder } from "@/users/domain/entities/__tests__/helpers/user-data-builder";
import { NotFoundError } from "@/shared/domain/errors/NotFound-error";
import { ConflictError } from "@/shared/domain/errors/Conflict-error";

describe('InMemory Repository unit tests', () => {
    let userProps: UserProps;
    let entity: UserEntity
    let repository: UserInMemoryRepository

    beforeAll(() => {
        userProps = UserDataBuilder({});
        entity = new UserEntity(userProps);
        repository = new UserInMemoryRepository();
    });

    it("Should throw error when searching user by email", async () => {
        await expect(async () => await repository.findByEMail(entity.email))
            .rejects.toThrowError(NotFoundError);
    });

    it("Should not find an email in the repository (emailExists)", async () => {
        await expect(repository.emailExists(entity.email))
            .resolves.not.toThrow();
    });

    it("Should find user by email", async () => {
        await repository.insert(entity);

        await expect(repository.findByEMail(entity.email))
            .resolves.toStrictEqual(entity);
    });

    it("Should throw error (emailExists)", async () => {
        await expect(async () => await repository.emailExists(entity.email))
            .rejects.toThrowError(ConflictError);
    });

});
