import { Entity } from "@/shared/domain/entities/entity";
import { InMemoryRepository } from "../../InMemory.repository";
import { SearchParams, SearchResult } from "../../repository-contracts";
import e from "express";

type StubProps = {
    someName: string,
    someNumber: number,
}

class StubEntity extends Entity<StubProps> { }

class StubRepository extends InMemoryRepository<StubEntity> {
    protected async applyFilter(items: StubEntity[], filter: string | null): Promise<StubEntity[]> {
        if (!filter) {
            return items;
        }

        return items.filter(item => {
            return item.props.someName.toLowerCase().includes(filter.toLowerCase());
        });

    }

}

describe('Searchable InMemory Repository unit tests', () => {
    let repository: StubRepository
    let stubEntities: StubEntity[]

    beforeAll(() => {
        repository = new StubRepository();
        stubEntities = [
            new StubEntity({
                someName: 'Mateus Freitas',
                someNumber: 3,
            }),
            new StubEntity({
                someName: 'José Aldo',
                someNumber: 4,
            }),
            new StubEntity({
                someName: 'Neymar Jr',
                someNumber: 2,
            }),
            new StubEntity({
                someName: 'Bruna Freitas',
                someNumber: 1,
            })
        ];

        stubEntities.forEach(e => {
            repository.insert(e);
        });


    });

    it('Should not apply search params when null', async () => {
        const result = await repository.search(
            new SearchParams({
                page: 1,
                perPage: 10,
            })
        );

        expect(result.items).toStrictEqual(stubEntities);
    });

    it('Should apply filter to repository', async () => {
        const result = await repository.search(
            new SearchParams({
                page: 1,
                perPage: 10,
                filter: 'Freitas'
            })
        );

        expect(result.items).toStrictEqual([stubEntities[0], stubEntities[3]]);
    });

    it('Should apply sort to repository', async () => {
        let result = await repository.search(
            new SearchParams({
                page: 1,
                perPage: 10,
                sort: 'someName',
                sortDir: 'asc'
            })
        );
        expect(result.items).toStrictEqual([stubEntities[3], stubEntities[1], stubEntities[0], stubEntities[2]]);

        result = await repository.search(
            new SearchParams({
                page: 1,
                perPage: 10,
                sort: 'someName',
                sortDir: 'desc'
            })
        );
        expect(result.items).toStrictEqual([stubEntities[2], stubEntities[0], stubEntities[1], stubEntities[3]]);

        result = await repository.search(
            new SearchParams({
                page: 1,
                perPage: 10,
                sort: 'someNumber',
                sortDir: 'asc'
            })
        );
        expect(result.items).toStrictEqual([stubEntities[3], stubEntities[2], stubEntities[0], stubEntities[1]]);

        result = await repository.search(
            new SearchParams({
                page: 1,
                perPage: 10,
                sort: 'someNumber',
                sortDir: 'desc'
            })
        );
        expect(result.items).toStrictEqual([stubEntities[1], stubEntities[0], stubEntities[2], stubEntities[3]]);
    });

    it('Should apply pagination to repository', async () => {
        let result = await repository.search(
            new SearchParams({
                page: 1,
                perPage: 2,
            })
        );

        expect(result.items).toStrictEqual([stubEntities[0], stubEntities[1]]);

        result = await repository.search(
            new SearchParams({
                page: 2,
                perPage: 2,
            })
        );

        expect(result.items).toStrictEqual([stubEntities[2], stubEntities[3]]);

        result = await repository.search(
            new SearchParams({
                page: 2,
                perPage: 3,
            })
        );

        expect(result.items).toStrictEqual([stubEntities[3]]);

        result = await repository.search(
            new SearchParams({
                page: 4,
                perPage: 2,
            })
        );

        expect(result.items).toStrictEqual([]);
    });

    it('Should nicely search repository', async () => {
        const result = await repository.search(
            new SearchParams({
                page: 2,
                perPage: 1,
                sort: 'someNumber',
                sortDir: 'asc',
                filter: 'Freitas'
            })
        );

        expect(result).toStrictEqual(
            new SearchResult({
                items: [stubEntities[0]],
                total: 1,
                currentPage: 2,
                perPage: 1,
                sort: 'someNumber',
                sortDir: 'asc',
                filter: 'Freitas'
            })
        );
    });

});
