import { UserEntity } from "@/users/domain/entities/user.entity";
import { UserDataBuilder } from "@/users/domain/entities/__tests__/helpers/user-data-builder";
import { NotFoundError } from "@/shared/domain/errors/NotFound-error";
import { UserPrismaRepository } from "../../user.repository";
import { PrismaService } from "@/shared/infrastructure/database/prisma/prisma.service";
import { execSync } from "node:child_process";
import { Test, TestingModule } from "@nestjs/testing";
import { DatabaseModule } from "@/shared/infrastructure/database/database.module";
import { PrismaClient } from "@prisma/client";
import { SearchParams } from "@/shared/domain/repositories/repository-contracts";
import { v4 as uuid_v4} from "uuid";

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

    describe('Repository methods', () => {

        beforeEach(async () => {
            await prismaService.user.deleteMany();
        });
    
        it("Database module should be defined", () => {
            expect(module).toBeDefined();
        });
    
        it("User Prisma Repository should be defined", () => {
            expect(repository).toBeDefined();
        });

        it("Should find all users", async () => {
            const users = [
                new UserEntity(await UserDataBuilder({ name: 'Mateus Freitas' })),
                new UserEntity(await UserDataBuilder({ name: 'Bruna Freitas' })),
                new UserEntity(await UserDataBuilder({ name: 'Jaciara Freitas' }))
            ];
    
            await prismaService.user.createMany({
                data: users.map(user => user.toJSON())
            });
    
            const result = await repository.findAll();
    
            expect(result).toHaveLength(3);
            expect(JSON.stringify(result)).toStrictEqual(JSON.stringify(users));
        });
    
        it("Should throw error when searching user by Id (NotFound)", () => {
            expect(repository.findById(uuid_v4())).rejects.toThrowError(NotFoundError);
        });
    
        it("Should find user by id", async () => {
            const user = new UserEntity(await UserDataBuilder({ name: 'Mateus Freitas' }));
    
            await prismaService.user.create({
                data: user.toJSON()
            });
    
            const result = await repository.findById(user.id);
    
            expect(result.toJSON()).toStrictEqual(user.toJSON());
        });
    
        it("Should insert new user in repository", async () => {
            const user = new UserEntity(await UserDataBuilder({ name: 'Mateus Freitas' }));
    
            await repository.insert(user);
    
            const result = await prismaService.user.findUnique({
                where: {id: user.id}
            });
    
            expect(result).toStrictEqual(user.toJSON());
        });

        it("Should throw error when trying to update non-existing user (NotFound)", async () => {
            const user = new UserEntity(await UserDataBuilder({ name: 'Mateus Freitas' }));

            expect(repository.update(user)).rejects.toThrowError(NotFoundError);
        });
    
        it("Should update user", async () => {
            const user = new UserEntity(await UserDataBuilder({ name: 'Mateus Freitas' }));
    
            await prismaService.user.create({
                data: user.toJSON()
            });
    
            user.setName('Some other name for this entity');
    
            await expect(repository.update(user)).resolves.not.toThrowError();
            expect(prismaService.user.findUnique({
                where: {
                    id: user.id
                }
            })).resolves.toStrictEqual(user.toJSON());
        });

    });

    describe('Search method', () => {
        let stubUsers: UserEntity[];

        beforeAll(async () => {
            stubUsers = [
                new UserEntity(await UserDataBuilder({ name: 'Mateus Freitas' })),
                new UserEntity(await UserDataBuilder({ name: 'Bruna Freitas' })),
                new UserEntity(await UserDataBuilder({ name: 'Jaciara Freitas' })),
                new UserEntity(await UserDataBuilder({})),
                new UserEntity(await UserDataBuilder({})),
                new UserEntity(await UserDataBuilder({})),
                new UserEntity(await UserDataBuilder({})),
                new UserEntity(await UserDataBuilder({})),
                new UserEntity(await UserDataBuilder({})),
                new UserEntity(await UserDataBuilder({})),
            ];

            // Clean up users from previous test cases
            await prismaService.user.deleteMany();
    
            await prismaService.user.createMany({
                data: stubUsers.map(user => user.toJSON())
            });
        }, 60000)

        it("Should ONLY paginate search result (when not providing any search parameters) (desc)", async () => {
            const result = await repository.search(new SearchParams());

            expect(JSON.stringify(result.items)).toStrictEqual(JSON.stringify([...stubUsers].reverse()))
        });

        it("Should filter by 'name' field (desc)", async () => {
            const result = await repository.search(new SearchParams(
                {
                    filter: 'Freitas'
                }
            ));

            expect(JSON.stringify(result.items)).toStrictEqual(JSON.stringify([stubUsers[2], stubUsers[1], stubUsers[0]]))
        });

        it("Should sort by 'name' field (desc)", async () => {
            const result = await repository.search(new SearchParams(
                {
                    sort: 'name'
                }
            ));

            expect(JSON.stringify(result.items))
                .toStrictEqual(JSON.stringify([...stubUsers].sort(function(a, b){
                    if(a.name < b.name) { return 1; }
                    if(a.name > b.name) { return -1; }
                    return 0;
                })))
        });

        it("Should sort by 'name' field (asc)", async () => {
            const result = await repository.search(new SearchParams(
                {
                    sort: 'name',
                    sortDir: 'asc'
                }
            ));

            expect(JSON.stringify(result.items))
                .toStrictEqual(JSON.stringify([...stubUsers].sort(function(a, b){
                    if(a.name < b.name) { return -1; }
                    if(a.name > b.name) { return 1; }
                    return 0;
                })))
        });

        it("Should sort by 'createdAt' field (desc)", async () => {
            const result = await repository.search(new SearchParams(
                {
                    sort: 'createdAt'
                }
            ));

            expect(JSON.stringify(result.items)).toStrictEqual(JSON.stringify([...stubUsers].reverse()))
        });

        it("Should sort by 'createdAt' field (asc)", async () => {
            const result = await repository.search(new SearchParams(
                {
                    sort: 'createdAt',
                    sortDir: 'asc'
                }
            ));

            expect(JSON.stringify(result.items)).toStrictEqual(JSON.stringify(stubUsers))
        });

        it("Should paginate search result ", async () => {
            let result = await repository.search(new SearchParams({
                page: 2,
                perPage: 3,
                sortDir: 'asc'
            }));

            expect(JSON.stringify(result.items)).toStrictEqual(JSON.stringify(stubUsers.slice(3, 6)));

            result = await repository.search(new SearchParams({
                page: 3,
                perPage: 4,
                sortDir: 'asc'
            }));

            expect(JSON.stringify(result.items)).toStrictEqual(JSON.stringify(stubUsers.slice(8)));

            result = await repository.search(new SearchParams({
                page: 2,
                perPage: 2,
                filter: "Freitas",
                sortDir: 'desc'
            }));

            expect(JSON.stringify(result.items)).toStrictEqual(JSON.stringify([stubUsers[0]]));
        });

    });

});
