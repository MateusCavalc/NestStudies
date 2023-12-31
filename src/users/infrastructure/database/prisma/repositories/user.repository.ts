import { ConflictError } from "@/shared/domain/errors/Conflict-error";
import { NotFoundError } from "@/shared/domain/errors/NotFound-error";
import { PrismaService } from "@/shared/infrastructure/database/prisma/prisma.service";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { UserRepository } from "@/users/domain/repositories/user.repository";
import { UserRules } from "@/users/domain/validators/user.validator.rules";

export class UserPrismaRepository implements UserRepository.Repository {

    constructor(private prismaService: PrismaService) {}

    async findByEmail(email: string): Promise<UserEntity> {
        const user = await this.prismaService.user.findUnique({
            where: { email }
        });

        if(!user) {
            throw new NotFoundError(`Could not found user with email ${email}`);
        }

        return new UserEntity(new UserRules({
            name: user.name,
            email: email,
            password: user.password,
            createdAt: user.createdAt,
        }), user.id);
    }

    async emailExists(email: string): Promise<void> {
        const user = await this.prismaService.user.findUnique({
            where: { email }
        });

        if(user) {
            throw new ConflictError(`User with email ${email} already exists`);
        }
    }

    async search(searchProps: UserRepository.SearchParams): Promise<UserRepository.SearchResult> {
        const count = await this.prismaService.user.count({
            ...(searchProps.filter && { // If searchProps contains filter, apply it to count 
                where: {
                    name: {
                        contains: searchProps.filter,
                        mode: 'insensitive'
                    }
                }
            })
        });

        const models = await this.prismaService.user.findMany({
            ...(searchProps.filter && {
                where: {
                    name: {
                        contains: searchProps.filter,
                        mode: 'insensitive'
                    }
                }
            }),
            orderBy: {
                    [searchProps.sort ? searchProps.sort : 'createdAt']: (searchProps.sortDir ? searchProps.sortDir : 'desc')
            },
            take: searchProps.perPage,
            skip: (searchProps.page - 1) * searchProps.perPage
        });

        return new UserRepository.SearchResult({
            items: models.map(item => new UserEntity(new UserRules({
                name: item.name,
                email: item.email,
                password: item.password,
                createdAt: item.createdAt,
            }), item.id)),
            total: count,
            currentPage: searchProps.page,
            perPage: searchProps.perPage,
            sort: searchProps.sort,
            sortDir: searchProps.sortDir,
            filter: searchProps.filter
        });
    }

    async insert(entity: UserEntity): Promise<void> {
        await this.prismaService.user.create({
            data: entity.toJSON()
        });
    }

    async findById(id: string): Promise<UserEntity> {
        const user = await this.prismaService.user.findUnique({
            where: { id }
        });

        if(!user) {
            throw new NotFoundError(`Could not found user with id ${id}`);
        }

        return new UserEntity(new UserRules({
            name: user.name,
            email: user.email,
            password: user.password,
            createdAt: user.createdAt,
        }), id);
    }

    async findAll(): Promise<UserEntity[]> {
        return (await this.prismaService.user.findMany())
                    .map(model => new UserEntity(new UserRules({
                        name: model.name,
                        email: model.email,
                        password: model.password,
                        createdAt: model.createdAt,
                    }), model.id));
    }

    async update(entity: UserEntity): Promise<void> {
        const user = await this.prismaService.user.findUnique({
            where: { id: entity.id }
        });
        
        if(!user) {
            throw new NotFoundError(`Could not found user with id ${entity.id}`);
        }

        await this.prismaService.user.update({
            data: entity.toJSON(),
            where: {
                id: entity.id
            }
        });
    }

    async delete(id: string): Promise<void> {
        const user = await this.prismaService.user.findUnique({
            where: { id: id }
        });
        
        if(!user) {
            throw new NotFoundError(`Could not found user with id ${id}`);
        }

        await this.prismaService.user.delete({
            where: {
                id: id
            }
        });
    }

}