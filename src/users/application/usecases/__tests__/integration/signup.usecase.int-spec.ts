import { UserDataBuilder } from "@/users/domain/entities/__tests__/helpers/user-data-builder";
import { UserEntity, UserProps } from "@/users/domain/entities/user.entity";
import { SignUpUseCase } from "../../signup.usecase";
import { ConflictError } from "@/shared/domain/errors/Conflict-error";
import { BadRequestError } from "@/shared/application/errors/BadRequest-error";
import { BcryptHashProvider } from "@/users/infrastructure/providers/bcrypt-hash.provider";
import { execSync } from "child_process";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { UserPrismaRepository } from "@/users/infrastructure/database/prisma/repositories/user.repository";
import { DatabaseModule } from "@/shared/infrastructure/database/database.module";
import { PrismaService } from "@/shared/infrastructure/database/prisma/prisma.service";

describe('SignUp UseCase integration tests (PrismaService)', () => {
    let userProps: UserProps;
    const prismaService = new PrismaClient()
    let repository: UserPrismaRepository
    let module: TestingModule
    let hashProvider: BcryptHashProvider;
    let useCase: SignUpUseCase.UseCase

    beforeAll(async () => {
        execSync("npx dotenv -e .env.test -- npx prisma migrate deploy --schema ./src/shared/infrastructure/database/prisma/schema.prisma");

        module = await Test.createTestingModule({
            imports: [DatabaseModule.forTest(prismaService)]
        }).compile();
        
        userProps = await UserDataBuilder({});

        repository = new UserPrismaRepository(module.get<PrismaService>(PrismaService));
        hashProvider = new BcryptHashProvider();
        useCase = new SignUpUseCase.UseCase(repository, hashProvider);

    }, 60000); // 60 seconds timeout to apply the migrations, if any.

    afterAll(async () => {
        await module.close();
    });

    beforeEach(async () => {
        await prismaService.user.deleteMany();
    });

    it('Should nicely create SignUp UseCase', async () => {
        expect(useCase).toBeDefined();
    });

    it('Should nicely signup a new user', async () => {
        const insertSpy = jest.spyOn(repository, 'insert');
        const hashSpy = jest.spyOn(hashProvider, 'generateHash');

        const result = await useCase.execute(userProps as SignUpUseCase.Input);

        expect(insertSpy).toBeCalled();
        expect(hashSpy).toBeCalled();

        expect(result.id).toBeDefined();
        expect(result.name).toStrictEqual(userProps.name);
        expect(result.email).toStrictEqual(userProps.email);
        expect(result.password).toStrictEqual(userProps.password);
        expect(result.createdAt).toStrictEqual(userProps.createdAt);

    });

    it('Should throw error when trying to signup an existing user', async () => {
        const entity = new UserEntity(userProps);
        await repository.insert(entity);

        await expect(useCase.execute(userProps as SignUpUseCase.Input))
            .rejects.toBeInstanceOf(ConflictError);
    });

    it('Should throw error when passing null \'name\' property', async () => {
        const invalidProps = {
            ...userProps,
            name: null
        }

        await expect(useCase.execute(invalidProps as SignUpUseCase.Input))
            .rejects.toBeInstanceOf(BadRequestError);
    });

    it('Should throw error when passing null \'email\' property', async () => {
        const invalidProps = {
            ...userProps,
            email: null
        }

        await expect(useCase.execute(invalidProps as SignUpUseCase.Input))
            .rejects.toBeInstanceOf(BadRequestError);
    });

    it('Should throw error when passing null \'password\' property', async () => {
        const invalidProps = {
            ...userProps,
            password: null
        }

        await expect(useCase.execute(invalidProps as SignUpUseCase.Input))
            .rejects.toBeInstanceOf(BadRequestError);
    });

});