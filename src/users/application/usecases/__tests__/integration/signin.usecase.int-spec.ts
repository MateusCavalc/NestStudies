import { UserDataBuilder } from "@/users/domain/entities/__tests__/helpers/user-data-builder";
import { UserEntity, UserProps } from "@/users/domain/entities/user.entity";
import { SignInUseCase } from "../../signin.usecase";
import { BadRequestError } from "@/shared/application/errors/BadRequest-error";
import { execSync } from "child_process";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { UserPrismaRepository } from "@/users/infrastructure/database/prisma/repositories/user.repository";
import { DatabaseModule } from "@/shared/infrastructure/database/database.module";
import { PrismaService } from "@/shared/infrastructure/database/prisma/prisma.service";
import { HashProvider } from "@/shared/application/providers/hash-provider";
import { BcryptHashProvider } from "@/users/infrastructure/providers/bcrypt-hash.provider";
import { AuthenticationError } from "@/shared/domain/errors/Authentication-error";

describe('SignIn UseCase integration tests (PrismaService)', () => {
    let userProps: UserProps;
    let entity: UserEntity;
    const prismaService = new PrismaClient()
    let repository: UserPrismaRepository
    let hashProvider: HashProvider
    let module: TestingModule
    let useCase: SignInUseCase.UseCase

    beforeAll(async () => {
        execSync("npx dotenv -e .env.test -- npx prisma migrate deploy --schema ./src/shared/infrastructure/database/prisma/schema.prisma");

        module = await Test.createTestingModule({
            imports: [DatabaseModule.forTest(prismaService)]
        }).compile();
        
        repository = new UserPrismaRepository(module.get<PrismaService>(PrismaService));
        hashProvider = new BcryptHashProvider();
        useCase = new SignInUseCase.UseCase(repository, hashProvider);

        userProps = await UserDataBuilder(
            {
                email: 'mat.fcavalcanti@gmail.com',
                password: await hashProvider.generateHash('1234')
            }
        );

        entity = new UserEntity(userProps);

    }, 60000); // 60 seconds timeout to apply the migrations, if any.

    afterAll(async () => {
        await module.close();
    });

    beforeEach(async () => {
        await prismaService.user.deleteMany();
    });

    it('Should nicely create SignIn UseCase', () => {
        expect(useCase).toBeDefined();
    });

    it('Should throw error when passing null \'email\' property', async () => {
        let invalidParams = {
            email: '',
            password: '1234'
        }

        await expect(useCase.execute(invalidParams as SignInUseCase.Input))
            .rejects.toBeInstanceOf(BadRequestError);

        invalidParams = {
            email: null,
            password: '1234'
        }

        await expect(useCase.execute(invalidParams as SignInUseCase.Input))
            .rejects.toBeInstanceOf(BadRequestError);

        invalidParams = {
            email: 'mat.fcavalcanti@gmail.com',
            password: ''
        }

        await expect(useCase.execute(invalidParams as SignInUseCase.Input))
            .rejects.toBeInstanceOf(BadRequestError);

        invalidParams = {
            email: 'mat.fcavalcanti@gmail.com',
            password: null
        }

        await expect(useCase.execute(invalidParams as SignInUseCase.Input))
            .rejects.toBeInstanceOf(BadRequestError);
    });

    it('Should throw error when trying to sign in with wrong password', async () => {
        let invalidCredentials = {
            email: 'mat.fcavalcanti@gmail.com',
            password: 'wrong_password'
        }

        await repository.insert(entity);

        await expect(useCase.execute(invalidCredentials as SignInUseCase.Input))
            .rejects.toBeInstanceOf(AuthenticationError);

    });

    it('Should nicely sign in with credentials', async () => {
        let validCredentials = {
            email: 'mat.fcavalcanti@gmail.com',
            password: '1234'
        }

        await repository.insert(entity);

        await expect(useCase.execute(validCredentials as SignInUseCase.Input))
            .resolves.toStrictEqual(entity.toJSON());

    });

});