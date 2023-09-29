import { Entity } from "../entities/entity";

export interface RepositoryInterface<E extends Entity<Object>> {

    insert(entity: E): Promise<void>
    findById(id: string): Promise<E>
    findAll(): Promise<E[]>
    update(entity: E): Promise<void>
    delete(id: string): Promise<void>

}