import { UserOutput } from '@/users/application/dtos/user-output';
import { UserEntity, UserProps } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/entities/__tests__/helpers/user-data-builder';
import { instanceToPlain } from 'class-transformer';
import { UserPaginationView, UserView } from '../../user.presenter';
import { PaginationOutput } from '@/shared/application/dtos/pagination-output';

let userProps: UserProps
let entity: UserEntity

beforeAll(async () => {
    userProps = await UserDataBuilder({});
    entity = new UserEntity(userProps);
})

describe('UserView Unit Tests', () => {

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

describe('UserPaginationView Unit Tests', () => {
    let paginationOutput: PaginationOutput<UserOutput>
    let userPaginationView: UserPaginationView

    beforeAll(async () => {
        paginationOutput = {
            items: [entity.toJSON() as UserOutput],
            total: 1,
            currentPage: 1,
            lastPage: 1,
            perPage: 1
        };

        userPaginationView = new UserPaginationView(paginationOutput);
    })

    it('Constructor should be defined', () => {
        expect(userPaginationView.total).toEqual(paginationOutput.total);
        expect(userPaginationView.currentPage).toEqual(paginationOutput.currentPage);
        expect(userPaginationView.lastPage).toEqual(paginationOutput.lastPage);
        expect(userPaginationView.perPage).toEqual(paginationOutput.perPage);

        expect(userPaginationView.items)
            .toStrictEqual(
                [new UserView(entity.toJSON() as UserOutput)]
            );
    });

    it('Should view pagination data', () => {
        const userPaginationDataView = instanceToPlain(userPaginationView);

        expect(userPaginationDataView).toStrictEqual({
            items: [instanceToPlain(new UserView(entity.toJSON() as UserOutput))],
            total: 1,
            currentPage: 1,
            lastPage: 1,
            perPage: 1
        })

    });

});