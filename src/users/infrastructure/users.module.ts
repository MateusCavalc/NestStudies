import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SignUpUseCase } from '../application/usecases/signup.usecase';
import { UserInMemoryRepository } from './database/in-memory/repositories/user.inMemory.repository';
import { BcryptHashProvider } from './providers/bcrypt-hash.provider';
import { UserRepository } from '../domain/repositories/user.repository';
import { HashProvider } from '@/shared/application/providers/hash-provider';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'UserRepository',
      useClass: UserInMemoryRepository
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
    }
  ],
})
export class UsersModule { }
