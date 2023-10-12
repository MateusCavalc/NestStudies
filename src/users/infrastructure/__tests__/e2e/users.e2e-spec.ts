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
import { UserEntity, UserProps } from "@/users/domain/entities/user.entity";

describe('Users e2e tests', () => {
    let prismaService = new PrismaClient()
    let app: INestApplication
    let module: TestingModule
    let repository: UserRepository.Repository


    beforeAll(async () => {
        execSync("npx dotenv -e .env.test -- npx prisma migrate deploy --schema ./src/shared/infrastructure/database/prisma/schema.prisma");

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
        let signUpDto: SignUpDto

        beforeEach(async () => {
            signUpDto = {
                name: 'test name',
                email: 'a@a.com',
                password: '12345678'
            };
        });

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

        it('Should receive error (422) when passing no parameters to the route', async () => {
            const res = await request(app.getHttpServer())
                .post('/users')
                .send({});

            expect(res.statusCode).toBe(422);

            expect(Object.keys(res.body)).toContain('message');
            expect(res.body['message']).toStrictEqual([
                'name should not be empty',
                'name must be a string',
                'email should not be empty',
                'email must be an email',
                'email must be a string',
                'password should not be empty',
                'password must be a string'
            ]);

            expect(Object.keys(res.body)).toContain('error');
            expect(res.body['error']).toStrictEqual('Unprocessable Entity');

        });

        it('Should receive error (422) when passing wrong name parameter to the route', async () => {
            delete signUpDto.name;

            const res = await request(app.getHttpServer())
                .post('/users')
                .send(signUpDto);

            expect(res.statusCode).toBe(422);

            expect(Object.keys(res.body)).toContain('message');
            expect(res.body['message']).toStrictEqual([
                'name should not be empty',
                'name must be a string'
            ]);

            expect(Object.keys(res.body)).toContain('error');
            expect(res.body['error']).toStrictEqual('Unprocessable Entity');

        });

        it('Should receive error (422) when passing wrong email parameter to the route', async () => {
            delete signUpDto.email;

            const res = await request(app.getHttpServer())
                .post('/users')
                .send(signUpDto);

            expect(res.statusCode).toBe(422);

            expect(Object.keys(res.body)).toContain('message');
            expect(res.body['message']).toStrictEqual([
                'email should not be empty',
                'email must be an email',
                'email must be a string'
            ]);

            expect(Object.keys(res.body)).toContain('error');
            expect(res.body['error']).toStrictEqual('Unprocessable Entity');

        });

        it('Should receive error (422) when passing wrong password parameter to the route', async () => {
            delete signUpDto.password;

            const res = await request(app.getHttpServer())
                .post('/users')
                .send(signUpDto);

            expect(res.statusCode).toBe(422);

            expect(Object.keys(res.body)).toContain('message');
            expect(res.body['message']).toStrictEqual([
                'password should not be empty',
                'password must be a string'
            ]);

            expect(Object.keys(res.body)).toContain('error');
            expect(res.body['error']).toStrictEqual('Unprocessable Entity');

        });

        it('Should receive error (422) when passing not expected parameter to the route', async () => {
            const res = await request(app.getHttpServer())
                .post('/users')
                .send(Object.assign(signUpDto, { notExpected: 'some not expected field' }));

            expect(res.statusCode).toBe(422);

            expect(Object.keys(res.body)).toContain('message');
            expect(res.body['message']).toStrictEqual([
                'property notExpected should not exist'
            ]);

            expect(Object.keys(res.body)).toContain('error');
            expect(res.body['error']).toStrictEqual('Unprocessable Entity');

        });

        it('Should receive error (409) when trying to sign up existing email', async () => {
            const entity = new UserEntity({ ...signUpDto } as UserProps);
            await repository.insert(entity);

            const res = await request(app.getHttpServer())
                .post('/users')
                .send(signUpDto)
                .expect(409)
                .expect({
                    statusCode: 409,
                    error: 'Conflict',
                    message: `User with email ${signUpDto.email} already exists`
                });

        });

    });

});