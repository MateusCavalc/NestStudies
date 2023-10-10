import { UserDataBuilder } from "@/users/domain/entities/__tests__/helpers/user-data-builder";
import { UserEntity, UserProps } from "@/users/domain/entities/user.entity";
import { GetUserUseCase } from "../../getuser.usecase";
import { BadRequestError } from "@/shared/application/errors/BadRequest-error";
import { execSync } from "child_process";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { UserPrismaRepository } from "@/users/infrastructure/database/prisma/repositories/user.repository";
import { DatabaseModule } from "@/shared/infrastructure/database/database.module";
import { PrismaService } from "@/shared/infrastructure/database/prisma/prisma.service";
import { NotFoundError } from "@/shared/domain/errors/NotFound-error";
import { v4 as uuid_v4 } from "uuid"

describe('GetUser UseCase integration tests (PrismaService)', () => {
    let userProps: UserProps;
    const prismaService = new PrismaClient()
    let repository: UserPrismaRepository
    let module: TestingModule
    let useCase: GetUserUseCase.UseCase

    beforeAll(async () => {
        execSync("npx dotenv -e .env.test -- npx prisma migrate deploy --schema ./src/shared/infrastructure/database/prisma/schema.prisma");

        module = await Test.createTestingModule({
            imports: [DatabaseModule.forTest(prismaService)]
        }).compile();
        
        userProps = await UserDataBuilder({});

        repository = new UserPrismaRepository(module.get<PrismaService>(PrismaService));
        useCase = new GetUserUseCase.UseCase(repository);

    }, 60000); // 60 seconds timeout to apply the migrations, if any.

    afterAll(async () => {
        await module.close();
    });

    beforeEach(async () => {
        await prismaService.user.deleteMany();
    });

    it('Should nicely create GetUser UseCase', () => {
        expect(useCase).toBeDefined();
    });

    it('Should throw error when not finding user', async () => {
        await expect(useCase.execute({
            id: uuid_v4()
        } as GetUserUseCase.Input)).rejects.toBeInstanceOf(NotFoundError);
    });

    it('Should throw error when passing null \'id\' property', async () => {
        const invalidProps = {
            ...userProps,
            id: null
        }

        await expect(useCase.execute(invalidProps as GetUserUseCase.Input))
            .rejects.toBeInstanceOf(BadRequestError);
    });

    it('Should nicely retrieve user from repository (by id)', async () => {
        const user = new UserEntity(userProps);
        await repository.insert(user);

        const findByIdSpy = jest.spyOn(repository, 'findById');

        await expect(useCase.execute(
            {
                id: user.id
            } as GetUserUseCase.Input
        )).resolves.toStrictEqual(
            user.toJSON()
        );

        expect(findByIdSpy).toBeCalled();

    });
});