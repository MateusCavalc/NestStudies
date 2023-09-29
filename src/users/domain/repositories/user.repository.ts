import { UserEntity } from "../entities/user.entity";

// Specific UserRepository operations, using strict UserEntity.
export interface UserRepository<E = UserEntity> {
    findByEMail(email: string): Promise<E>
    emailExists(email: string): Promise<void>
}