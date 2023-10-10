import { UserDataBuilder } from "@/users/domain/entities/__tests__/helpers/user-data-builder";
import { UserEntity, UserProps } from "@/users/domain/entities/user.entity";
import { UpdatePasswordUseCase } from "../../updatepassword.usecase";
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
import { HashProvider } from "@/shared/application/providers/hash-provider";
import { BcryptHashProvider } from "@/users/infrastructure/providers/bcrypt-hash.provider";
import { InvalidPasswordError } from "@/shared/domain/errors/InvalidPassword-error";

describe('UpdatePassword UseCase integration tests (PrismaService)', () => {
    let userProps: UserProps;
    let entity: UserEntity
    const prismaService = new PrismaClient()
    let repository: UserPrismaRepository
    let hashProvider: HashProvider
    let module: TestingModule
    let useCase: UpdatePasswordUseCase.UseCase

    beforeAll(async () => {
        execSync("npx dotenv -e .env.test -- npx prisma migrate deploy --schema ./src/shared/infrastructure/database/prisma/schema.prisma");

        module = await Test.createTestingModule({
            imports: [DatabaseModule.forTest(prismaService)]
        }).compile();

        repository = new UserPrismaRepository(module.get<PrismaService>(PrismaService));
        hashProvider = new BcryptHashProvider();
        useCase = new UpdatePasswordUseCase.UseCase(repository, hashProvider);

        userProps = await UserDataBuilder(
            {
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

    it('Should nicely create UpdatePassword UseCase', () => {
        expect(useCase).toBeDefined();
    });

    it('Should throw error when passing null \'id\' property', async () => {
        const invalidParams = {
            oldPassword: entity.password,
            newPassword: 's0M3-n3W-p45SwOrD',
        }

        await expect(useCase.execute(invalidParams as UpdatePasswordUseCase.Input))
            .rejects.toBeInstanceOf(BadRequestError);
    });

    it('Should throw error when passing null \'oldPassword\' property', async () => {
        const invalidParams = {
            id: entity.id,
            newPassword: 's0M3-n3W-p45SwOrD',
        }

        await expect(useCase.execute(invalidParams as UpdatePasswordUseCase.Input))
            .rejects.toBeInstanceOf(BadRequestError);
    });

    it('Should throw error when passing null \'newPassword\' property', async () => {
        const invalidParams = {
            id: entity.id,
            oldPassword: entity.password,
        }

        await expect(useCase.execute(invalidParams as UpdatePasswordUseCase.Input))
            .rejects.toBeInstanceOf(BadRequestError);
    });

    it('Should throw error when not finding user entity in repository', async () => {
        const updateParams = {
            id: uuid_v4(),
            oldPassword: entity.password,
            newPassword: 's0M3-n3W-p45SwOrD',
        }

        await expect(useCase.execute(updateParams as UpdatePasswordUseCase.Input))
            .rejects.toBeInstanceOf(NotFoundError);
    });

    it('Should throw error when oldPassword does not match with user password', async () => {
        await repository.insert(entity);

        let updatePasswordParams = {
            id: entity.id,
            oldPassword: 'wrong password',
            newPassword: 's0M3-n3W-p45SwOrD',
        }

        await expect(useCase.execute(updatePasswordParams as UpdatePasswordUseCase.Input))
            .rejects.toBeInstanceOf(InvalidPasswordError);

    });

    it('Should throw error when trying to update with non-valid password', async () => {
        await repository.insert(entity);

        let updatePasswordParams = {
            id: entity.id,
            oldPassword: '1234',
            newPassword: 'a'.repeat(101),
        }
        await expect(useCase.execute(updatePasswordParams as UpdatePasswordUseCase.Input))
            .rejects.toBeInstanceOf(EntityValidationError);

        updatePasswordParams = {
            id: entity.id,
            oldPassword: '1234',
            newPassword: 10 as any,
        }
        await expect(useCase.execute(updatePasswordParams as UpdatePasswordUseCase.Input))
            .rejects.toBeInstanceOf(EntityValidationError);
    });

    it('Should nicely update the password of an user entity', async () => {
        await repository.insert(entity);

        const updatePasswordParams = {
            id: entity.id,
            oldPassword: '1234',
            newPassword: 's0M3-n3W-p45SwOrD',
        }

        const result = await useCase.execute(updatePasswordParams as UpdatePasswordUseCase.Input);

        await expect(hashProvider.compareHash(updatePasswordParams.newPassword, result.password))
            .resolves.toBeTruthy();
    });

});