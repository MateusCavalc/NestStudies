import { Entity } from "../entities/entity";
import { RepositoryInterface } from "./repository-contracts";

export abstract class InMemoryRepository<E extends Entity<object>>
    implements RepositoryInterface<E> {

    items: E[] = [];

    async insert(entity: E): Promise<void> {
        this.items.push(entity);
    }

    async findById(id: string): Promise<E> {
        let entity: E = null;

        entity = this.items.find(item => item.id == id);

        if (entity == null) {
            throw new Error("Entity Not Found");
        }

        return entity;
    }

    async findAll(): Promise<E[]> {
        return this.items;
    }

    async update(entity: E): Promise<void> {
        let index = this.items.findIndex(item => item.id == entity.id);

        if (index == -1) {
            throw new Error("Entity Not Found");
        }

        this.items[index] = entity;

    }

    async delete(id: string): Promise<void> {
        let index = this.items.findIndex(item => item.id == id);
        this.items.splice(index, 1);
    }

}