import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserInMemoryRepository } from './database/in-memory/repositories/user.inMemory.repository';
import { BcryptHashProvider } from './providers/bcrypt-hash.provider';
import { UserRepository } from '../domain/repositories/user.repository';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { SignUpUseCase } from '../application/usecases/signup.usecase';
import { SignInUseCase } from '../application/usecases/signin.usecase';
import { GetUserUseCase } from '../application/usecases/getuser.usecase';
import { ListUsersUseCase } from '../application/usecases/listusers.usecase';
import { UpdateUserUseCase } from '../application/usecases/updateuser.usecase';
import { UpdatePasswordUseCase } from '../application/usecases/updatepassword.usecase';
import { DeleteUserUseCase } from '../application/usecases/deleteuser.usecase';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { UserPrismaRepositort } from './database/prisma/repositories/user.repository';

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: 'PrismaService',
      useClass: PrismaService
    },
    // {
    //   provide: 'UserRepository',
    //   useClass: UserInMemoryRepository
    // },
    {
      provide: 'UserRepository',
      inject: ['PrismaService'],
      useFactory: (prismaService: PrismaService) => {
        return new UserPrismaRepository(prismaService);
      }
    },
    {
      provide: 'HashProvider',
      useClass: BcryptHashProvider
    },
    {
      provide: SignUpUseCase.UseCase,
      inject: ['UserRepository', 'HashProvider'],
      useFactory: (
        userRepository: UserRepository.Repository,
        hashProvider: HashProvider
      ) => { return new SignUpUseCase.UseCase(userRepository, hashProvider) }
    },
    {
      provide: SignInUseCase.UseCase,
      inject: ['UserRepository', 'HashProvider'],
      useFactory: (
        userRepository: UserRepository.Repository,
        hashProvider: HashProvider
      ) => { return new SignInUseCase.UseCase(userRepository, hashProvider) }
    },
    {
      provide: GetUserUseCase.UseCase,
      inject: ['UserRepository'],
      useFactory: (
        userRepository: UserRepository.Repository
      ) => { return new GetUserUseCase.UseCase(userRepository) }
    },
    {
      provide: ListUsersUseCase.UseCase,
      inject: ['UserRepository'],
      useFactory: (
        userRepository: UserRepository.Repository
      ) => { return new ListUsersUseCase.UseCase(userRepository) }
    },
    {
      provide: UpdateUserUseCase.UseCase,
      inject: ['UserRepository'],
      useFactory: (
        userRepository: UserRepository.Repository
      ) => { return new UpdateUserUseCase.UseCase(userRepository) }
    },
    {
      provide: UpdatePasswordUseCase.UseCase,
      inject: ['UserRepository', 'HashProvider'],
      useFactory: (
        userRepository: UserRepository.Repository,
        hashProvider: HashProvider
      ) => { return new UpdatePasswordUseCase.UseCase(userRepository, hashProvider) }
    },
    {
      provide: DeleteUserUseCase.UseCase,
      inject: ['UserRepository'],
      useFactory: (
        userRepository: UserRepository.Repository
      ) => { return new DeleteUserUseCase.UseCase(userRepository) }
    },
  ],
})
export class UsersModule { }
