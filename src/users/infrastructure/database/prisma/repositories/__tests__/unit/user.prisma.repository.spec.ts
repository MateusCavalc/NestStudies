import { UserEntity, UserProps } from "@/users/domain/entities/user.entity";
import { UserDataBuilder } from "@/users/domain/entities/__tests__/helpers/user-data-builder";
import { NotFoundError } from "@/shared/domain/errors/NotFound-error";
import { UserPrismaRepository } from "../../user.repository";
import { PrismaService } from "@/shared/infrastructure/database/prisma/prisma.service";
import { execSync } from "node:child_process";

describe('User Prisma Repository unit tests', () => {
    let userProps: UserProps;
    let entities: UserEntity[]
    let repository: UserPrismaRepository

    beforeAll(async () => {
        execSync("npx dotenv -e .env.test -- npx prisma migrate deploy --schema ./src/shared/infrastructure/database/prisma/schema.prisma");
        
        repository = new UserPrismaRepository(new PrismaService());
        await repository['prismaService'].user.deleteMany();
        
        entities = [
            new UserEntity(await UserDataBuilder({ name: 'Mateus Freitas' })),
        ];

    }, 60000); // 60 seconds timeout to apply the migrations, if any.

    it("User Prisma Repository should be defined", () => {
        expect(repository).toBeDefined();
    });

    it("Should throw error when searching user by Id (NotFound)", () => {
        expect(repository.findById(entities[0].id)).rejects.toThrowError(NotFoundError);
    });

});
