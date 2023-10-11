import { PaginationOutput } from '@/shared/application/dtos/pagination-output';
import { UserEntity, UserProps } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/entities/__tests__/helpers/user-data-builder';
import { instanceToPlain } from 'class-transformer';
import { PaginationView } from '../../pagination.presenter';

type StubOutput = {
    field1: string,
    field2: string,
}

class StubPaginationView extends PaginationView<StubOutput> {
    constructor(output: PaginationOutput<StubOutput>) {
        super(output);
    }
}

describe('PaginationView Unit Tests', () => {
    let userProps : UserProps
    let entity : UserEntity

    beforeAll(async () => {
        userProps = await UserDataBuilder({});
        entity = new UserEntity(userProps);
    })

    it('Constructor should be defined', () => {
        const paginationOutput = {
            items: [{
                field1: 'bla',
                field2: 'ble',
            }],
            total: 1,
            currentPage: 1,
            lastPage: 1,
            perPage: 1
        };

        const paginationView = new StubPaginationView(paginationOutput);

        expect(paginationView).toBeDefined();

        expect(paginationView.total).toEqual(paginationOutput.total);
        expect(paginationView.currentPage).toEqual(paginationOutput.currentPage);
        expect(paginationView.lastPage).toEqual(paginationOutput.lastPage);
        expect(paginationView.perPage).toEqual(paginationOutput.perPage);

    });

});
