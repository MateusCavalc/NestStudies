import { UserRepository } from "@/users/domain/repositories/user.repository";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { SignUpDto } from "../../dtos/sign-up.dto";
import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import { EnvConfModule } from "@/shared/infrastructure/env-conf/env-conf.module";
import { UsersModule } from "../../users.module";
import { DatabaseModule } from "@/shared/infrastructure/database/database.module";
import request from "supertest"
import { UsersController } from "../../users.controller";
import { instanceToPlain } from "class-transformer";
import { applyGlobalConfig } from "@/global-config";

describe('Users e2e tests', () => {
    let prismaService = new PrismaClient()
    let app: INestApplication
    let module: TestingModule
    let repository: UserRepository.Repository
    let signUpDto: SignUpDto

    beforeAll(async () => {
        execSync("npx dotenv -e .env.test -- npx prisma migrate deploy --schema ./src/shared/infrastructure/database/prisma/schema.prisma");

        signUpDto = {
            name: 'test name',
            email: 'a@a.com',
            password: '12345678'
        };

        module = await Test.createTestingModule({
            imports: [
                EnvConfModule,
                UsersModule,
                DatabaseModule.forTest(prismaService)
            ]
        }).compile();

        app = module.createNestApplication();
        applyGlobalConfig(app);

        await app.init();

        repository = module.get<UserRepository.Repository>('UserRepository');
    }, 60000);

    beforeEach(async () => {
        await prismaService.user.deleteMany();
    });

    describe('POST /users', () => {
        it('Should create a user', async () => {
            const res = await request(app.getHttpServer())
                .post('/users')
                .send(signUpDto);

            expect(res.statusCode).toBe(201);

            expect(Object.keys(res.body)).toContain('id');
            expect(Object.keys(res.body)).toContain('name');
            expect(Object.keys(res.body)).toContain('email');
            expect(Object.keys(res.body)).toContain('createdAt');

            const user = await repository.findById(res.body.id);

            expect(res.body).toStrictEqual(
                instanceToPlain(
                    UsersController.userToView(
                        user.toJSON()
                    )
                )
            );
        });

    });

});