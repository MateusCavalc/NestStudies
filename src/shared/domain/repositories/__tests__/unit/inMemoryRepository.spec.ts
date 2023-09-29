import { Entity } from "@/shared/domain/entities/entity";
import { InMemoryRepository } from "../../repository-InMemory";

type StubProps = {
    f1: number,
    f2: number,
}

class StubEntity extends Entity<StubProps> {
    constructor(public props: StubProps) {
        super(props);
    }
}

class StubRepository extends InMemoryRepository<Entity<object>> { }

describe('InMemory Repository unit tests', () => {
    let entity: StubEntity
    let repository: InMemoryRepository<Entity<object>>

    beforeAll(() => {
        entity = new StubEntity({ f1: 1, f2: 2 });
        repository = new StubRepository();
    });

    it('Should throw error when entity not found', async () => {
        await expect(async () => await repository.findById(entity.id))
            .rejects.toThrowError(Error);
    });

    it('Should nicely insert en entity', async () => {
        await repository.insert(entity);

        expect(repository.items[0]).toStrictEqual(entity);
    });

    it('Should nicely find en entity by id', async () => {
        await expect(repository.findById(entity.id)).resolves.toStrictEqual(entity);
    });

    it('Should nicely find all entities', async () => {
        const anotherEntity = new StubEntity({ f1: 3, f2: 4 });
        await repository.insert(anotherEntity);

        await expect(repository.findAll())
            .resolves.toStrictEqual([entity, anotherEntity]);
    });

    it('Should nicely update a entity', async () => {
        entity.props.f1 = 5;

        await repository.update(entity);

        expect(repository.items[0])
            .toStrictEqual(entity);
    });

    it('Should nicely delete a entity', async () => {
        await repository.delete(entity.id);

        await expect(async () => await repository.findById(entity.id))
            .rejects.toThrowError(Error);
    });

});
