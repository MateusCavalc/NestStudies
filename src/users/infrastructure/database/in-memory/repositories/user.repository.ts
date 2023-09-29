import { ConflictError } from "@/shared/domain/errors/Conflict-error";
import { NotFoundError } from "@/shared/domain/errors/NotFound-error";
import { InMemoryRepository } from "@/shared/domain/repositories/InMemory.repository";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { UserRepository } from "@/users/domain/repositories/user.repository";

// UserInMemory repo only need to implement specific UserEntity based methods
export class UserInMemoryRepository extends InMemoryRepository<UserEntity>
    implements UserRepository<UserEntity> {

    async findByEMail(email: string): Promise<UserEntity> {
        const entity = this.items.find(item => item.email == email);

        if (!entity) {
            throw new NotFoundError(`Entity Not Found using email '${email}'`);
        }

        return entity;
    }

    async emailExists(email: string): Promise<void> {
        const entity = this.items.find(item => item.email == email);

        if (entity) {
            throw new ConflictError(`Entity already exists in the repository with email '${email}'`);
        }

    }

}