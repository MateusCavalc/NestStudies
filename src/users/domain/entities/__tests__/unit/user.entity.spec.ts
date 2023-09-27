import { UserDataBuilder } from '../helpers/user-data-builder';
import { UserEntity, UserProps } from '../../user.entity';
import * as libClassValidator from 'class-validator';
import { UserRules } from '@/users/domain/validators/user.validator.rules';
import { EntityValidationError } from '@/shared/domain/errors/validation-error';

describe('UserEntity unit tests', () => {
    let props: UserProps;
    let entity: UserEntity;

    beforeEach(() => {
        props = UserDataBuilder({});

        entity = new UserEntity(props);
    });

    it('User Entity constructor method', () => {
        expect(entity.props.name).toEqual(props.name);
        expect(entity.props.email).toEqual(props.email);
        expect(entity.props.password).toEqual(props.password);
        expect(entity.props.createdAt).toBeInstanceOf(Date);
    });

    it('id field Getter', () => {
        expect(entity.id).toBeDefined();
        expect(typeof entity.id).toBe('string');
    });

    it('name field Getter', () => {
        expect(entity.name).toBeDefined();
        expect(entity.name).toEqual(entity.name);
        expect(typeof entity.name).toBe('string');
    });

    it('Should update name field', () => {
        const newName = "newName";
        entity.setName(newName);

        expect(entity.name).toEqual(newName);
    });

    it('email field Getter', () => {
        expect(entity.email).toBeDefined();
        expect(entity.email).toEqual(entity.email);
        expect(typeof entity.email).toBe('string');
    });

    it('Should update email field', () => {
        const newEmail = "newEmail";
        entity.setEmail(newEmail);

        expect(entity.email).toEqual(newEmail);
    });

    it('password field Getter', () => {
        expect(entity.password).toBeDefined();
        expect(entity.password).toEqual(entity.password);
        expect(typeof entity.password).toBe('string');
    });

    it('Should update password field', () => {
        const newPassword = "newPassword";
        entity.setPassword(newPassword);

        expect(entity.password).toEqual(newPassword);
    });

    it('createdAt field Getter', () => {
        expect(entity.createdAt).toBeDefined();
        expect(entity.createdAt).toBeInstanceOf(Date);
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

    it('Should validate user props using user rules with errors (missing name)', () => {
        entity = new UserEntity(new UserRules(
            {
                email: props.email,
                password: props.password,
                createdAt: props.createdAt
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

});
