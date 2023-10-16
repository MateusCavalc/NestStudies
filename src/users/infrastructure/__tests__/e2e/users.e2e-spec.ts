import { UserRepository } from "@/users/domain/repositories/user.repository";
import { HttpStatus, INestApplication } from "@nestjs/common";
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
import { SignInDto } from "../../dtos/sign-in.dto";
import { HashProvider } from "@/shared/application/providers/hash-provider";
import { BcryptHashProvider } from "../../providers/bcrypt-hash.provider";
import { UpdateUserDto } from "../../dtos/update-user.dto";
import { UpdatePasswordDto } from "../../dtos/update-password.dto";

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

    describe('POST /users', () => {
        let signUpDto: SignUpDto

        beforeEach(async () => {
            signUpDto = {
                name: 'test name',
                email: 'a@a.com',
                password: '12345678'
            };

            await prismaService.user.deleteMany();
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

            await request(app.getHttpServer())
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

    describe('POST /users/auth', () => {
        let signInDto: SignInDto
        let props: UserProps
        let hashProvider : HashProvider

        beforeAll(async () => {
            hashProvider = new BcryptHashProvider();

            props = {
                name: 'test user',
                email: 'b@b.com',
                password: await hashProvider.generateHash('12345678'),
            };

            const entity = new UserEntity(props);
            await repository.insert(entity);
        });

        beforeEach(async () => {
            signInDto = {
                email: 'b@b.com',
                password: '12345678'
            };
        });

        it('Should authenticate a user', async () => {
            const res = await request(app.getHttpServer())
                .post('/users/auth')
                .send(signInDto);

            expect(res.statusCode).toBe(HttpStatus.OK);

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
                .post('/users/auth')
                .send({});

            expect(res.statusCode).toBe(422);

            expect(Object.keys(res.body)).toContain('message');
            expect(res.body['message']).toStrictEqual([
                'email should not be empty',
                'email must be an email',
                'email must be a string',
                'password should not be empty',
                'password must be a string'
            ]);

            expect(Object.keys(res.body)).toContain('error');
            expect(res.body['error']).toStrictEqual('Unprocessable Entity');

        });

        it('Should receive error (422) when passing wrong email parameter to the route', async () => {
            delete signInDto.email;

            const res = await request(app.getHttpServer())
                .post('/users/auth')
                .send(signInDto);

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
            delete signInDto.password;

            const res = await request(app.getHttpServer())
                .post('/users/auth')
                .send(signInDto);

            expect(res.statusCode).toBe(422);

            expect(Object.keys(res.body)).toContain('message');
            expect(res.body['message']).toStrictEqual([
                'password should not be empty',
                'password must be a string'
            ]);

            expect(Object.keys(res.body)).toContain('error');
            expect(res.body['error']).toStrictEqual('Unprocessable Entity');

        });

        it('Should receive error (401) when trying to authenticate with wrong password', async () => {

            signInDto.password = 'wrong_one';
            
            await request(app.getHttpServer())
            .post('/users/auth')
            .send(signInDto)
            .expect(HttpStatus.UNAUTHORIZED)
            .expect({
                statusCode: HttpStatus.UNAUTHORIZED,
                error: 'Unauthorized',
                message: 'Password does not match'
            });

        });

        it('Should receive error (404) when user not found', async () => {
            await prismaService.user.deleteMany();

            await request(app.getHttpServer())
            .post('/users/auth')
            .send(signInDto)
            .expect(HttpStatus.NOT_FOUND)
            .expect({
                statusCode: HttpStatus.NOT_FOUND,
                error: 'NotFound',
                message: `Could not found user with email ${signInDto.email}`
            });

        });

    });

    describe('PUT /users/:id', () => {
        let updateUserDto: UpdateUserDto
        let props: UserProps
        let entity: UserEntity

        beforeAll(async () => {

            props = {
                name: 'test user',
                email: 'b@b.com',
                password: '12345678',
            };

            entity = new UserEntity(props);
            await repository.insert(entity);
        });

        beforeEach(async () => {
            updateUserDto = {
                name: 'new name'
            };
        });

        it('Should update a user', async () => {
            const res = await request(app.getHttpServer())
                .put(`/users/${entity.id}`)
                .send(updateUserDto);

            expect(res.statusCode).toBe(HttpStatus.OK);

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
                .put(`/users/${entity.id}`)
                .send({});

            expect(res.statusCode).toBe(422);

            expect(Object.keys(res.body)).toContain('message');
            expect(res.body['message']).toStrictEqual([
                'name should not be empty',
                'name must be a string',
            ]);

            expect(Object.keys(res.body)).toContain('error');
            expect(res.body['error']).toStrictEqual('Unprocessable Entity');

        });

        it('Should receive error (422) when passing wrong name parameter to the route', async () => {
            delete updateUserDto.name;

            const res = await request(app.getHttpServer())
                .put(`/users/${entity.id}`)
                .send(updateUserDto);

            expect(res.statusCode).toBe(422);

            expect(Object.keys(res.body)).toContain('message');
            expect(res.body['message']).toStrictEqual([
                'name should not be empty',
                'name must be a string',
            ]);

            expect(Object.keys(res.body)).toContain('error');
            expect(res.body['error']).toStrictEqual('Unprocessable Entity');

        });

        it('Should receive error (404) when user not found', async () => {
            await prismaService.user.deleteMany();

            await request(app.getHttpServer())
            .put(`/users/${entity.id}`)
            .send(updateUserDto)
            .expect(HttpStatus.NOT_FOUND)
            .expect({
                statusCode: HttpStatus.NOT_FOUND,
                error: 'NotFound',
                message: `Could not found user with id ${entity.id}`
            });

        });

    });

    describe('GET /users/:id', () => {
        let props: UserProps
        let entity: UserEntity

        beforeAll(async () => {
            props = {
                name: 'test user',
                email: 'c@c.com',
                password: '12345678',
            };

            entity = new UserEntity(props);
            await repository.insert(entity);
        });

        it('Should get a user', async () => {
            const res = await request(app.getHttpServer())
                .get(`/users/${entity.id}`);

            expect(res.statusCode).toBe(HttpStatus.OK);

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

        it('Should receive error (404) when user not found', async () => {
            await prismaService.user.deleteMany();

            await request(app.getHttpServer())
            .get(`/users/${entity.id}`)
            .expect(HttpStatus.NOT_FOUND)
            .expect({
                statusCode: HttpStatus.NOT_FOUND,
                error: 'NotFound',
                message: `Could not found user with id ${entity.id}`
            });

        });

    });

    describe('DELETE /users/:id', () => {
        let props: UserProps
        let entity: UserEntity

        beforeAll(async () => {
            props = {
                name: 'test user',
                email: 'd@d.com',
                password: '12345678',
            };

            entity = new UserEntity(props);
            await repository.insert(entity);
        });

        it('Should delete a user', async () => {
            const res = await request(app.getHttpServer())
                .delete(`/users/${entity.id}`);

            expect(res.statusCode).toBe(HttpStatus.NO_CONTENT);

            expect(res.body).toStrictEqual({});
        });

        it('Should receive error (404) when user not found', async () => {
            await prismaService.user.deleteMany();

            await request(app.getHttpServer())
            .delete(`/users/${entity.id}`)
            .expect(HttpStatus.NOT_FOUND)
            .expect({
                statusCode: HttpStatus.NOT_FOUND,
                error: 'NotFound',
                message: `Could not found user with id ${entity.id}`
            });

        });

    });

    describe('PATCH /users/password/:id', () => {
        let updatePasswordDto: UpdatePasswordDto
        let hashProvider: HashProvider
        let props: UserProps
        let entity: UserEntity

        beforeAll(async () => {

            hashProvider = new BcryptHashProvider();

            props = {
                name: 'test user',
                email: 'd@d.com',
                password: await hashProvider.generateHash('12345678'),
            };

            entity = new UserEntity(props);
            await repository.insert(entity);
        });

        beforeEach(async () => {
            updatePasswordDto = {
                oldPassword: '12345678',
                newPassword: 'some_new_pswd'
            };
        });

        it('Should update user password', async () => {
            const res = await request(app.getHttpServer())
                .patch(`/users/password/${entity.id}`)
                .send(updatePasswordDto);

            expect(res.statusCode).toBe(HttpStatus.OK);

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
                .patch(`/users/password/${entity.id}`)
                .send({});

            expect(res.statusCode).toBe(422);

            expect(Object.keys(res.body)).toContain('message');
            expect(res.body['message']).toStrictEqual([
                'oldPassword should not be empty',
                'oldPassword must be a string',
                'newPassword should not be empty',
                'newPassword must be a string'
            ]);

            expect(Object.keys(res.body)).toContain('error');
            expect(res.body['error']).toStrictEqual('Unprocessable Entity');

        });

        it('Should receive error (422) when passing wrong oldPassword parameter to the route', async () => {
            delete updatePasswordDto.oldPassword;

            const res = await request(app.getHttpServer())
                .patch(`/users/password/${entity.id}`)
                .send(updatePasswordDto);

            expect(res.statusCode).toBe(422);

            expect(Object.keys(res.body)).toContain('message');
            expect(res.body['message']).toStrictEqual([
                'oldPassword should not be empty',
                'oldPassword must be a string',
            ]);

            expect(Object.keys(res.body)).toContain('error');
            expect(res.body['error']).toStrictEqual('Unprocessable Entity');

        });

        it('Should receive error (422) when passing wrong newPassword parameter to the route', async () => {
            delete updatePasswordDto.newPassword;

            const res = await request(app.getHttpServer())
                .patch(`/users/password/${entity.id}`)
                .send(updatePasswordDto);

            expect(res.statusCode).toBe(422);

            expect(Object.keys(res.body)).toContain('message');
            expect(res.body['message']).toStrictEqual([
                'newPassword should not be empty',
                'newPassword must be a string',
            ]);

            expect(Object.keys(res.body)).toContain('error');
            expect(res.body['error']).toStrictEqual('Unprocessable Entity');

        });

        it('Should receive error (401) when wrong old password', async () => {
            updatePasswordDto.oldPassword = 'wrong-password'

            await request(app.getHttpServer())
            .patch(`/users/password/${entity.id}`)
            .send(updatePasswordDto)
            .expect(HttpStatus.UNAUTHORIZED)
            .expect({
                statusCode: HttpStatus.UNAUTHORIZED,
                error: 'Unauthorized',
                message: `Old password does not match`
            });

        });

        it('Should receive error (404) when user not found', async () => {
            await prismaService.user.deleteMany();

            await request(app.getHttpServer())
            .patch(`/users/password/${entity.id}`)
            .send(updatePasswordDto)
            .expect(HttpStatus.NOT_FOUND)
            .expect({
                statusCode: HttpStatus.NOT_FOUND,
                error: 'NotFound',
                message: `Could not found user with id ${entity.id}`
            });

        });

    });

});