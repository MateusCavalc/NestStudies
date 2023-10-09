import { NotFoundError } from "@/shared/domain/errors/NotFound-error";
import { PrismaService } from "@/shared/infrastructure/database/prisma/prisma.service";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { UserRepository } from "@/users/domain/repositories/user.repository";

export class UserPrismaRepository implements UserRepository.Repository {

    constructor(private prismaService: PrismaService) {}

    findByEmail(email: string): Promise<UserEntity> {
        throw new Error("Method not implemented.");
    }

    emailExists(email: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    search(searchProps: UserRepository.SearchParams): Promise<UserRepository.SearchResult> {
        throw new Error("Method not implemented.");
    }

    async insert(entity: UserEntity): Promise<void> {
        await this.prismaService.user.create({
            data: entity.toJSON()
        });
    }

    async findById(id: string): Promise<UserEntity> {
        try {
            const user = await this.prismaService.user.findUnique({
                where: { id }
            });

            return new UserEntity({
                name: user.name,
                email: user.email,
                password: user.password,
                createdAt: user.createdAt,
            }, id);

        } catch {
            throw new NotFoundError(`Could not found user with id ${id}`);
        }
    }

    findAll(): Promise<UserEntity[]> {
        throw new Error("Method not implemented.");
    }

    update(entity: UserEntity): Promise<void> {
        throw new Error("Method not implemented.");
    }

    delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

}