import { UserDataBuilder } from '../helpers/user-data-builder';
import { UserEntity, UserProps } from '../../user.entity';
import { UserRules } from '@/users/domain/validators/user.validator.rules';
import { EntityValidationError } from '@/shared/domain/errors/validation-error';

describe('UserEntity integration tests', () => {

    describe('UserEntity Validation tests', () => {
        let props: UserProps;
        let entity: UserEntity;

        beforeEach(() => {
            props = UserDataBuilder({});

            entity = new UserEntity(props);
        });

        it('Should validate user props using user rules without errors', () => {
            entity = new UserEntity(new UserRules(props));

            expect(() => entity.validate()).not.toThrow();
            expect(entity.errors).toBeNull();
        });

        it('Should validate user props using user rules with errors (null props)', () => {
            entity = new UserEntity(new UserRules(null));

            expect(() => entity.validate()).toThrowError(EntityValidationError);
            expect(entity.errors).not.toBeNull();
        });

        it('Should validate user props using user rules with errors (empty props)', () => {
            entity = new UserEntity(new UserRules({} as any));

            expect(() => entity.validate()).toThrowError(EntityValidationError);
            expect(entity.errors).not.toBeNull();
        });

        describe('Name validation', () => {

            it('Should throw EntityValidationError (missing name)', () => {
                entity = new UserEntity(new UserRules(
                    {
                        ...props,
                        name: null
                    } as UserProps)
                );

                expect(() => entity.validate()).toThrowError(EntityValidationError);
                expect(entity.errors).not.toBeNull();

                expect(entity.errors).toStrictEqual({
                    name: [
                        'name should not be empty',
                        'name must be a string',
                        'name must be shorter than or equal to 255 characters',
                    ]
                });
            });

            it('Should throw EntityValidationError (empty name)', () => {
                entity = new UserEntity(new UserRules(
                    {
                        ...props,
                        name: ''
                    } as UserProps)
                );

                expect(() => entity.validate()).toThrowError(EntityValidationError);
                expect(entity.errors).not.toBeNull();

                expect(entity.errors).toStrictEqual({
                    name: [
                        'name should not be empty',
                    ]
                });
            });

            it('Should throw EntityValidationError (number name)', () => {
                entity = new UserEntity(new UserRules(
                    {
                        ...props,
                        name: 10 as any
                    } as UserProps)
                );

                expect(() => entity.validate()).toThrowError(EntityValidationError);
                expect(entity.errors).not.toBeNull();

                expect(entity.errors).toStrictEqual({
                    name: [
                        'name must be a string',
                        'name must be shorter than or equal to 255 characters',
                    ]
                });
            });

            it('Should throw EntityValidationError (name.lenght > 255)', () => {
                entity = new UserEntity(new UserRules(
                    {
                        ...props,
                        name: 'a'.repeat(256)
                    } as UserProps)
                );

                expect(() => entity.validate()).toThrowError(EntityValidationError);
                expect(entity.errors).not.toBeNull();

                expect(entity.errors).toStrictEqual({
                    name: [
                        'name must be shorter than or equal to 255 characters',
                    ]
                });
            });

        });

        describe('Email validation', () => {

            it('Should throw EntityValidationError (missing email)', () => {
                entity = new UserEntity(new UserRules(
                    {
                        ...props,
                        email: null
                    } as UserProps)
                );

                expect(() => entity.validate()).toThrowError(EntityValidationError);
                expect(entity.errors).not.toBeNull();

                expect(entity.errors).toStrictEqual({
                    email: [
                        'email should not be empty',
                        'email must be a string',
                        'email must be shorter than or equal to 255 characters',
                        "email must be an email",
                    ]
                });
            });

            it('Should throw EntityValidationError (empty email)', () => {
                entity = new UserEntity(new UserRules(
                    {
                        ...props,
                        email: ''
                    } as UserProps)
                );

                expect(() => entity.validate()).toThrowError(EntityValidationError);
                expect(entity.errors).not.toBeNull();

                expect(entity.errors).toStrictEqual({
                    email: [
                        'email should not be empty',
                        "email must be an email",
                    ]
                });
            });

            it('Should throw EntityValidationError (invalid email format)', () => {
                entity = new UserEntity(new UserRules(
                    {
                        ...props,
                        email: 'someInvalidEmailFormat'
                    } as UserProps)
                );

                expect(() => entity.validate()).toThrowError(EntityValidationError);
                expect(entity.errors).not.toBeNull();

                expect(entity.errors).toStrictEqual({
                    email: [
                        "email must be an email",
                    ]
                });

            });

            it('Should throw EntityValidationError (number email)', () => {
                entity = new UserEntity(new UserRules(
                    {
                        ...props,
                        email: 10 as any
                    } as UserProps)
                );

                expect(() => entity.validate()).toThrowError(EntityValidationError);
                expect(entity.errors).not.toBeNull();

                expect(entity.errors).toStrictEqual({
                    email: [
                        'email must be a string',
                        'email must be shorter than or equal to 255 characters',
                        "email must be an email",
                    ]
                });
            });

            it('Should throw EntityValidationError (email.lenght > 255)', () => {
                entity = new UserEntity(new UserRules(
                    {
                        ...props,
                        email: 'a'.repeat(256)
                    } as UserProps)
                );

                expect(() => entity.validate()).toThrowError(EntityValidationError);
                expect(entity.errors).not.toBeNull();

                expect(entity.errors).toStrictEqual({
                    email: [
                        'email must be shorter than or equal to 255 characters',
                        "email must be an email",
                    ]
                });
            });

        });

        describe('Password validation', () => {

            it('Should throw EntityValidationError (missing password)', () => {
                entity = new UserEntity(new UserRules(
                    {
                        ...props,
                        password: null
                    } as UserProps)
                );

                expect(() => entity.validate()).toThrowError(EntityValidationError);
                expect(entity.errors).not.toBeNull();

                expect(entity.errors).toStrictEqual({
                    password: [
                        'password should not be empty',
                        'password must be a string',
                        'password must be shorter than or equal to 100 characters',
                    ]
                });
            });

            it('Should throw EntityValidationError (empty password)', () => {
                entity = new UserEntity(new UserRules(
                    {
                        ...props,
                        password: ''
                    } as UserProps)
                );

                expect(() => entity.validate()).toThrowError(EntityValidationError);
                expect(entity.errors).not.toBeNull();

                expect(entity.errors).toStrictEqual({
                    password: [
                        'password should not be empty',
                    ]
                });
            });

            it('Should throw EntityValidationError (number password)', () => {
                entity = new UserEntity(new UserRules(
                    {
                        ...props,
                        password: 10 as any
                    } as UserProps)
                );

                expect(() => entity.validate()).toThrowError(EntityValidationError);
                expect(entity.errors).not.toBeNull();

                expect(entity.errors).toStrictEqual({
                    password: [
                        'password must be a string',
                        'password must be shorter than or equal to 100 characters',
                    ]
                });
            });

            it('Should throw EntityValidationError (password.lenght > 100)', () => {
                entity = new UserEntity(new UserRules(
                    {
                        ...props,
                        password: 'a'.repeat(101)
                    } as UserProps)
                );

                expect(() => entity.validate()).toThrowError(EntityValidationError);
                expect(entity.errors).not.toBeNull();

                expect(entity.errors).toStrictEqual({
                    password: [
                        'password must be shorter than or equal to 100 characters',
                    ]
                });
            });

        });

        describe('CreatedAt validation', () => {

            it('Should throw EntityValidationError (empty createdAt)', () => {
                entity = new UserEntity(new UserRules(
                    {
                        ...props,
                        createdAt: '' as any
                    } as UserProps)
                );

                expect(() => entity.validate()).toThrowError(EntityValidationError);
                expect(entity.errors).not.toBeNull();

                expect(entity.errors).toStrictEqual({
                    createdAt: [
                        "createdAt must be a Date instance",
                    ]
                });
            });

            it('Should throw EntityValidationError (string createdAt)', () => {
                entity = new UserEntity(new UserRules(
                    {
                        ...props,
                        createdAt: 'alguma data' as any
                    } as UserProps)
                );

                expect(() => entity.validate()).toThrowError(EntityValidationError);
                expect(entity.errors).not.toBeNull();

                expect(entity.errors).toStrictEqual({
                    createdAt: [
                        "createdAt must be a Date instance",
                    ]
                });
            });

        });

    });

});
