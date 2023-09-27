import { Entity } from '../../entity';
import {
    validate as uuidValidator,
    v4 as uuid_v4,
} from 'uuid';

class StubEntity extends Entity { }

describe('Entity unit tests', () => {
    let entity: StubEntity;

    beforeEach(() => {
        entity = new StubEntity();
    });

    it('Stub Entity constructor method', () => {
        expect(entity).toBeDefined();
        expect(entity.id).toBeDefined();
    });

    it('Should have id parameter nicely set by the constructor', () => {
        expect(entity.id).not.toBeNull();
        expect(entity.id).toBeDefined();
        expect(typeof entity.id).toBe('string');
        expect(uuidValidator(entity.id)).toBeTruthy();
    });

    it('Should be nicely built using a valid id', () => {
        entity = new StubEntity(uuid_v4());

        expect(uuidValidator(entity.id)).toBeTruthy();
    });

});
