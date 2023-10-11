import { UserOutput } from '@/users/application/dtos/user-output';
import { UserEntity, UserProps } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/entities/__tests__/helpers/user-data-builder';
import { instanceToPlain } from 'class-transformer';
import { UserView } from '../../user.presenter';

describe('UserView Unit Tests', () => {
    let userProps : UserProps
    let entity : UserEntity

    beforeAll(async () => {
        userProps = await UserDataBuilder({});
        entity = new UserEntity(userProps);
    })

    it('Constructor should be defined', () => {
        const userView = new UserView(entity.toJSON() as UserOutput);

        expect(userView).toBeDefined();

        expect(userView.id).toEqual(entity.id);
        expect(userView.name).toEqual(entity.name);
        expect(userView.email).toEqual(entity.email);
        expect(userView.createdAt).toEqual(entity.createdAt);

        expect(userView).not.toHaveProperty('password');

    });

    it('Should view user entity data', () => {
        const userView = new UserView(entity.toJSON() as UserOutput);

        const userDataView = instanceToPlain(userView);

        expect(userDataView).toStrictEqual({
            id: entity.id,
            name: entity.name,
            email: entity.email,
            createdAt: entity.createdAt.toISOString(),
        })

    });

});
