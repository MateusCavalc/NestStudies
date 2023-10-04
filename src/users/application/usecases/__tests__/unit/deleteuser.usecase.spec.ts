import { UserDataBuilder } from "@/users/domain/entities/__tests__/helpers/user-data-builder";
import { UserEntity, UserProps } from "@/users/domain/entities/user.entity";
import { UserRepository } from "@/users/domain/repositories/user.repository";
import { UserInMemoryRepository } from "@/users/infrastructure/database/in-memory/repositories/user.inMemory.repository";
import { DeleteUserUseCase } from "../../deleteuser.usecase";
import { BadRequestError } from "@/shared/application/errors/BadRequest-error";
import { NotFoundError } from "@/shared/domain/errors/NotFound-error";
import { UserRules } from "@/users/domain/validators/user.validator.rules";

describe('DeleteUser UseCase unit tests', () => {
    let repository: UserRepository.Repository
    let userProps: UserProps
    let entity: UserEntity
    let useCase: DeleteUserUseCase.UseCase

    beforeAll(async () => {
        repository = new UserInMemoryRepository();
        userProps = await UserDataBuilder({name: 'Mateus Freitas'})
        entity = new UserEntity(new UserRules(userProps));

        useCase = new DeleteUserUseCase.UseCase(repository);
    });

    it('Should nicely create DeleteUser UseCase', () => {
        expect(useCase).toBeDefined();
    });

    it('Should throw error when passing null \'id\' property', () => {
        let invalidParams = {}

        expect(useCase.execute(invalidParams as DeleteUserUseCase.Input))
            .rejects.toBeInstanceOf(BadRequestError);

        invalidParams = {
            id: ''
        }

        expect(useCase.execute(invalidParams as DeleteUserUseCase.Input))
            .rejects.toBeInstanceOf(BadRequestError);
    });

    it('Should throw error when not finding user entity in repository', () => {
        expect(useCase.execute(
            {
                id: entity.id
            } as DeleteUserUseCase.Input
        )).rejects.toBeInstanceOf(NotFoundError);
    });

    it('Should nicely delete an user entity from the repository', async () => {
        const deleteSpy = jest.spyOn(repository, 'delete');
        repository.insert(entity);

        await useCase.execute({id: entity.id} as DeleteUserUseCase.Input);

        expect(deleteSpy).toBeCalled();

        expect(useCase.execute(
            {
                id: entity.id
            } as DeleteUserUseCase.Input
        )).rejects.toBeInstanceOf(NotFoundError); 
    });

});
