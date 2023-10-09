import { UserDataBuilder } from '../helpers/user-data-builder';
import { UserEntity, UserProps } from '../../user.entity';

describe('UserEntity unit tests', () => {
    let props: UserProps;
    let entity: UserEntity;

    beforeEach(async () => {
        props = await UserDataBuilder({});

        entity = new UserEntity(props);
    });

    it('User Entity constructor method', () => {
        expect(entity['props'].name).toEqual(props.name);
        expect(entity['props'].email).toEqual(props.email);
        expect(entity['props'].password).toEqual(props.password);
        expect(entity['props'].createdAt).toBeInstanceOf(Date);
    });

    it('id field Getter', () => {
        expect(entity.id).toBeDefined();
        expect(typeof entity.id).toBe('string');
    });

    it('name field Getter', () => {
        expect(entity.name).toBeDefined();
        expect(entity.name).toEqual(entity['props'].name);
        expect(typeof entity.name).toBe('string');
    });

    it('Should update name field', () => {
        const newName = "newName";
        entity.setName(newName);

        expect(entity.name).toEqual(newName);
    });

    it('email field Getter', () => {
        expect(entity.email).toBeDefined();
        expect(entity.email).toEqual(entity['props'].email);
        expect(typeof entity.email).toBe('string');
    });

    it('Should update email field', () => {
        const newEmail = "newEmail";
        entity.setEmail(newEmail);

        expect(entity.email).toEqual(newEmail);
    });

    it('password field Getter', () => {
        expect(entity.password).toBeDefined();
        expect(entity.password).toEqual(entity['props'].password);
        expect(typeof entity.password).toBe('string');
    });

    it('Should update password field', () => {
        const newPassword = "newPassword";
        entity.setPassword(newPassword);

        expect(entity.password).toEqual(newPassword);
    });

    it('createdAt field Getter', () => {
        expect(entity.createdAt).toBeDefined();
        expect(entity.createdAt).toEqual(entity['props'].createdAt);
        expect(entity.createdAt).toBeInstanceOf(Date);
    });

});
