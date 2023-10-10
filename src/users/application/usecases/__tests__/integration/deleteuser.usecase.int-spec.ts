import { UserDataBuilder } from "@/users/domain/entities/__tests__/helpers/user-data-builder";
import { UserEntity, UserProps } from "@/users/domain/entities/user.entity";
import { DeleteUserUseCase } from "../../deleteuser.usecase";
import { BadRequestError } from "@/shared/application/errors/BadRequest-error";
import { execSync } from "child_process";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { UserPrismaRepository } from "@/users/infrastructure/database/prisma/repositories/user.repository";
import { DatabaseModule } from "@/shared/infrastructure/database/database.module";
import { PrismaService } from "@/shared/infrastructure/database/prisma/prisma.service";
import { NotFoundError } from "@/shared/domain/errors/NotFound-error";

describe('DeleteUser UseCase integration tests (PrismaService)', () => {
    let userProps: UserProps;
    let entity: UserEntity;
    const prismaService = new PrismaClient()
    let repository: UserPrismaRepository
    let module: TestingModule
    let useCase: DeleteUserUseCase.UseCase

    beforeAll(async () => {
        execSync("npx dotenv -e .env.test -- npx prisma migrate deploy --schema ./src/shared/infrastructure/database/prisma/schema.prisma");

        module = await Test.createTestingModule({
            imports: [DatabaseModule.forTest(prismaService)]
        }).compile();
        
        userProps = await UserDataBuilder({});
        entity = new UserEntity(userProps);

        repository = new UserPrismaRepository(module.get<PrismaService>(PrismaService));
        useCase = new DeleteUserUseCase.UseCase(repository);

    }, 60000); // 60 seconds timeout to apply the migrations, if any.

    afterAll(async () => {
        await module.close();
    });

    beforeEach(async () => {
        await prismaService.user.deleteMany();
    });

    it('Should nicely create DeleteUser UseCase', () => {
        expect(useCase).toBeDefined();
    });

    it('Should throw error when passing null \'id\' property', async () => {
        let invalidParams = {}

        await expect(useCase.execute(invalidParams as DeleteUserUseCase.Input))
            .rejects.toBeInstanceOf(BadRequestError);

        invalidParams = {
            id: ''
        }

        await expect(useCase.execute(invalidParams as DeleteUserUseCase.Input))
            .rejects.toBeInstanceOf(BadRequestError);
    });

    it('Should throw error when not finding user entity in repository', async () => {
        await expect(useCase.execute(
            {
                id: entity.id
            } as DeleteUserUseCase.Input
        )).rejects.toBeInstanceOf(NotFoundError);
    });

    it('Should nicely delete an user entity from the repository', async () => {
        const deleteSpy = jest.spyOn(repository, 'delete');
        await repository.insert(entity);

        await useCase.execute({id: entity.id} as DeleteUserUseCase.Input);

        expect(deleteSpy).toBeCalled();

        await expect(useCase.execute(
            {
                id: entity.id
            } as DeleteUserUseCase.Input
        )).rejects.toBeInstanceOf(NotFoundError); 

        
    });

});