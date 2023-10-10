import { UserDataBuilder } from "@/users/domain/entities/__tests__/helpers/user-data-builder";
import { UserEntity, UserProps } from "@/users/domain/entities/user.entity";
import { ListUsersUseCase } from "../../listusers.usecase";
import { BadRequestError } from "@/shared/application/errors/BadRequest-error";
import { execSync } from "child_process";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { UserPrismaRepository } from "@/users/infrastructure/database/prisma/repositories/user.repository";
import { DatabaseModule } from "@/shared/infrastructure/database/database.module";
import { PrismaService } from "@/shared/infrastructure/database/prisma/prisma.service";
import { PaginationOutput } from "@/shared/application/dtos/pagination-output";

describe('ListUsers UseCase integration tests (PrismaService)', () => {
    const prismaService = new PrismaClient()
    let repository: UserPrismaRepository
    let module: TestingModule
    let useCase: ListUsersUseCase.UseCase
    let stubEntities: UserEntity[]


    beforeAll(async () => {
        execSync("npx dotenv -e .env.test -- npx prisma migrate deploy --schema ./src/shared/infrastructure/database/prisma/schema.prisma");

        module = await Test.createTestingModule({
            imports: [DatabaseModule.forTest(prismaService)]
        }).compile();

        repository = new UserPrismaRepository(module.get<PrismaService>(PrismaService));
        useCase = new ListUsersUseCase.UseCase(repository);

        stubEntities = [
            new UserEntity(await UserDataBuilder({ name: 'Mateus Freitas' })),
            new UserEntity(await UserDataBuilder({ name: 'Bruna Freitas' })),
            new UserEntity(await UserDataBuilder({ name: 'Júlia Fernanda' })),
            new UserEntity(await UserDataBuilder({ name: 'Magda Fernanda' })),
        ];

    }, 60000); // 60 seconds timeout to apply the migrations, if any.

    afterAll(async () => {
        await module.close();
    });

    beforeEach(async () => {
        await prismaService.user.deleteMany();
    });

    it('Should nicely create ListUsers UseCase', () => {
        expect(useCase).toBeDefined();
    });

    it('Should throw error when passing null \'page\' property', async () => {
        await expect(useCase.execute({
            perPage: 10
        } as ListUsersUseCase.Input))
            .rejects.toBeInstanceOf(BadRequestError);
    });

    it('Should throw error when passing null \'perPage\' property', async () => {
        await expect(useCase.execute({
            page: 1
        } as ListUsersUseCase.Input))
            .rejects.toBeInstanceOf(BadRequestError);
    });

    it('Should nicely list all users in repository', async () => {
        await prismaService.user.createMany({
            data: [...stubEntities].map(entity => entity.toJSON())
        });

        await expect(useCase.execute({
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

        await expect(useCase.execute({
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