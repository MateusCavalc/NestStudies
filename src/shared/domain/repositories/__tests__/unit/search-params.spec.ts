import { SearchParams, SearchProps } from "../../repository-contracts";

describe('SearchParams unit tests', () => {

    it('Should nicely create SearchParams instance', () => {
        const sProps: SearchProps = {
            page: 1,
            perPage: 10,
            sort: 'bla',
            sortDir: 'asc',
            filter: 'algum filtro'
        };

        const sParams = new SearchParams(sProps);

        expect(sParams.page).toEqual(sProps.page);
        expect(sParams.perPage).toEqual(sProps.perPage);
        expect(sParams.sort).toEqual(sProps.sort);
        expect(sParams.sortDir).toEqual(sProps.sortDir);
        expect(sParams.filter).toEqual(sProps.filter);
    });


});
