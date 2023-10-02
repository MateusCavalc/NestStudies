import { SearchParams, SearchProps, SearchResult, SearchResultProps } from "../../repository-contracts";

describe('SearchParams unit tests', () => {
    it('Should nicely create blank SearchParams instance', () => {

        const sParams = new SearchParams();

        expect(sParams.page).toBe(1);
        expect(sParams.perPage).toBe(10);
        expect(sParams.sort).toBe(undefined);
        expect(sParams.sortDir).toBe(undefined);
        expect(sParams.filter).toBe(undefined);
    });

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

describe('SearchResult unit tests', () => {
    it('Should nicely create blank SearchResult instance', () => {

        let sResult = new SearchResult({
            items: ['entity1', 'entity2', 'entity3', 'entity4'] as any,
            total: 4,
            currentPage: 1,
            perPage: 1,
            sort: 'none',
            sortDir: 'asc',
            filter: 'none',
        });

        expect(sResult.toJSON()).toStrictEqual({
            items: ['entity1', 'entity2', 'entity3', 'entity4'],
            total: 4,
            currentPage: 1,
            perPage: 1,
            lastPage: 4,
            sort: 'none',
            sortDir: 'asc',
            filter: 'none',
        });

        sResult = new SearchResult({
            items: ['entity1', 'entity2'] as any,
            total: 2,
            currentPage: 1,
            perPage: 2,
            sort: null,
            sortDir: null,
            filter: null,
        });

        expect(sResult.toJSON()).toStrictEqual({
            items: ['entity1', 'entity2'],
            total: 2,
            currentPage: 1,
            perPage: 2,
            lastPage: 1,
            sort: null,
            sortDir: null,
            filter: null,
        });

    });

    it('Should return correct perPage property', () => {

        let sResult = new SearchResult({
            items: ['entity1', 'entity2', 'entity3', 'entity4'] as any,
            total: 4,
            currentPage: 1,
            perPage: 10,
            sort: 'none',
            sortDir: 'asc',
            filter: 'none',
        });

        expect(sResult.lastPage).toBe(1); // ceil(4 / 10) = 1

        sResult = new SearchResult({
            items: ['entity1', 'entity2', 'entity3', 'entity4'] as any,
            total: 54,
            currentPage: 1,
            perPage: 10,
            sort: 'none',
            sortDir: 'asc',
            filter: 'none',
        });

        expect(sResult.lastPage).toBe(6);  // ceil(54 / 10) = 6

    });
});