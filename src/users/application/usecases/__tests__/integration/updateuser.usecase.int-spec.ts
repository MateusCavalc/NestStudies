import { UserDataBuilder } from "@/users/domain/entities/__tests__/helpers/user-data-builder";
import { UserEntity, UserProps } from "@/users/domain/entities/user.entity";
import { UpdateUserUseCase } from "../../updateuser.usecase";
import { BadRequestError } from "@/shared/application/errors/BadRequest-error";
import { execSync } from "child_process";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { UserPrismaRepository } from "@/users/infrastructure/database/prisma/repositories/user.repository";
import { DatabaseModule } from "@/shared/infrastructure/database/database.module";
import { PrismaService } from "@/shared/infrastructure/database/prisma/prisma.service";
import { NotFoundError } from "@/shared/domain/errors/NotFound-error";
import { v4 as uuid_v4 } from "uuid"
import { EntityValidationError } from "@/shared/domain/errors/EntityValidation-error";

describe('UpdateUser UseCase integration tests (PrismaService)', () => {
    let userProps: UserProps;
    let entity: UserEntity
    const prismaService = new PrismaClient()
    let repository: UserPrismaRepository
    let module: TestingModule
    let useCase: UpdateUserUseCase.UseCase

    beforeAll(async () => {
        execSync("npx dotenv -e .env.test -- npx prisma migrate deploy --schema ./src/shared/infrastructure/database/prisma/schema.prisma");

        module = await Test.createTestingModule({
            imports: [DatabaseModule.forTest(prismaService)]
        }).compile();
        
        userProps = await UserDataBuilder({});
        entity = new UserEntity(userProps);

        repository = new UserPrismaRepository(module.get<PrismaService>(PrismaService));
        useCase = new UpdateUserUseCase.UseCase(repository);

    }, 60000); // 60 seconds timeout to apply the migrations, if any.

    afterAll(async () => {
        await module.close();
    });

    beforeEach(async () => {
        await prismaService.user.deleteMany();
    });

    it('Should nicely create UpdateUser UseCase', () => {
        expect(useCase).toBeDefined();
    });

    it('Should throw error when passing null \'id\' property', async () => {
        const invalidParams = {
            name: 'New Name'
        }

        await expect(useCase.execute(invalidParams as UpdateUserUseCase.Input))
            .rejects.toBeInstanceOf(BadRequestError);
    });

    it('Should throw error when passing null \'name\' property', async () => {
        const invalidParams = {
            id: uuid_v4()
        }

        await expect(useCase.execute(invalidParams as UpdateUserUseCase.Input))
            .rejects.toBeInstanceOf(BadRequestError);
    });

    it('Should throw error when not finding user entity in repository', async () => {
        const updateParams = {
            id: uuid_v4(),
            name: "Some New Name"
        }

        await expect(useCase.execute(updateParams as UpdateUserUseCase.Input))
            .rejects.toBeInstanceOf(NotFoundError);
    });

    it('Should throw error when trying to update user with non-valid name', async () => {
        await repository.insert(entity);

        let updateParams = {
            id: entity.id,
            name: "a".repeat(256)
        }
        await expect(useCase.execute(updateParams as UpdateUserUseCase.Input))
            .rejects.toBeInstanceOf(EntityValidationError);

        updateParams = {
            id: entity.id,
            name: 10 as any
        }
        await expect(useCase.execute(updateParams as UpdateUserUseCase.Input))
            .rejects.toBeInstanceOf(EntityValidationError);

    });

    it('Should nicely update the name of an user entity', async () => {
        await repository.insert(entity);
        
        let updateParams = {
            id: entity.id,
            name: "Novo nome para o Mateus"
        }
        await expect(useCase.execute(updateParams as UpdateUserUseCase.Input))
            .resolves.toStrictEqual({
                id: entity.id,
                name: "Novo nome para o Mateus",
                email: entity.email,
                password: entity.password,
                createdAt: entity.createdAt,
            });
    });

});