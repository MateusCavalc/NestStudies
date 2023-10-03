import { UserDataBuilder } from "@/users/domain/entities/__tests__/helpers/user-data-builder";
import { UserEntity, UserProps } from "@/users/domain/entities/user.entity";
import { UserRepository } from "@/users/domain/repositories/user.repository";
import { UserInMemoryRepository } from "@/users/infrastructure/database/in-memory/repositories/user.inMemory.repository";
import { GetUserUseCase } from "../../getuser.usecase";
import { v4 as uuid_v4 } from "uuid";
import { NotFoundError } from "@/shared/domain/errors/NotFound-error";
import { BadRequestError } from "@/users/application/errors/BadRequest-error";

describe('GetUser UseCase unit tests', () => {
    let repository: UserRepository.Repository;
    let userProps: UserProps;
    let useCase: GetUserUseCase.UseCase

    beforeAll(async () => {
        repository = new UserInMemoryRepository();
        userProps = await UserDataBuilder({});

        useCase = new GetUserUseCase.UseCase(repository);
    });

    it('Should nicely create GetUser UseCase', () => {
        expect(useCase).toBeDefined();
    });

    it('Should throw error when not finding user', async () => {
        expect(useCase.execute({
            id: uuid_v4()
        } as GetUserUseCase.Input)).rejects.toBeInstanceOf(NotFoundError);
    });

    it('Should throw error when passing null \'id\' property', async () => {
        const invalidProps = {
            ...userProps,
            id: null
        }

        expect(useCase.execute(invalidProps as GetUserUseCase.Input))
            .rejects.toBeInstanceOf(BadRequestError);
    });

    it('Should nicely retrieve user from repository (by id)', async () => {
        const user = new UserEntity(userProps);
        await repository.insert(user);

        const findByIdSpy = jest.spyOn(repository, 'findById');

        expect(useCase.execute(
            {
                id: user.id
            } as GetUserUseCase.Input
        )).resolves.toStrictEqual(
            user.toJSON()
        );

        expect(findByIdSpy).toBeCalled();

    });

});
