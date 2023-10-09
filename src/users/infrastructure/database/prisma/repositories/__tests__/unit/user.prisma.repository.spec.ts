import { UserEntity } from "@/users/domain/entities/user.entity";
import { UserDataBuilder } from "@/users/domain/entities/__tests__/helpers/user-data-builder";
import { NotFoundError } from "@/shared/domain/errors/NotFound-error";
import { UserPrismaRepository } from "../../user.repository";
import { PrismaService } from "@/shared/infrastructure/database/prisma/prisma.service";
import { execSync } from "node:child_process";
import { Test, TestingModule } from "@nestjs/testing";
import { DatabaseModule } from "@/shared/infrastructure/database/database.module";
import { PrismaClient } from "@prisma/client";

describe('User Prisma Repository unit tests', () => {
    const prismaService = new PrismaClient()
    let repository: UserPrismaRepository
    let module: TestingModule

    beforeAll(async () => {
        execSync("npx dotenv -e .env.test -- npx prisma migrate deploy --schema ./src/shared/infrastructure/database/prisma/schema.prisma");

        module = await Test.createTestingModule({
            imports: [DatabaseModule.forTest(prismaService)]
        }).compile();
        
        repository = new UserPrismaRepository(module.get<PrismaService>(PrismaService));

    }, 60000); // 60 seconds timeout to apply the migrations, if any.

    beforeEach(async () => {
        await prismaService.user.deleteMany();
    });

    it("Database module should be defined", () => {
        expect(module).toBeDefined();
    });

    it("User Prisma Repository should be defined", () => {
        expect(repository).toBeDefined();
    });

    it("Should throw error when searching user by Id (NotFound)", () => {
        expect(repository.findById('fake ID')).rejects.toThrowError(NotFoundError);
    });

    it("Should find user by id", async () => {
        const user = new UserEntity(await UserDataBuilder({ name: 'Mateus Freitas' }));

        await prismaService.user.create({
            data: user.toJSON()
        });

        const result = await repository.findById(user.id);

        expect(result.toJSON()).toStrictEqual(user.toJSON());
    });

    it("Should find user by id", async () => {
        const user = new UserEntity(await UserDataBuilder({ name: 'Mateus Freitas' }));

        await repository.insert(user);

        const result = await prismaService.user.findUnique({
            where: {id: user.id}
        });

        expect(result).toStrictEqual(user.toJSON());
    });

});
