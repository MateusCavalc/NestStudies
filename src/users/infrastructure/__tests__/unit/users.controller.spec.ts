import { UserEntity, UserProps } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/entities/__tests__/helpers/user-data-builder';
import { UserRules } from '@/users/domain/validators/user.validator.rules';
import { UsersController } from '../../users.controller';
import { SignUpDto } from '../../dtos/sign-up.dto';
import { SignInDto } from '../../dtos/sign-in.dto';
import { UpdateUserDto } from '../../dtos/update-user.dto';
import { UpdatePasswordDto } from '../../dtos/update-password.dto';
import { UserOutput } from '@/users/application/dtos/user-output';
import { ListUsersDto } from '../../dtos/list-users.dto';
import { ListUsersUseCase } from '@/users/application/usecases/listusers.usecase';
import { UserPaginationView, UserView } from '../../presenters/user.presenter';

describe('UsersController', () => {
  let controller: UsersController
  let userProps: UserProps
  let user: UserEntity

  beforeAll(async () => {
    controller = new UsersController();
    userProps = await UserDataBuilder({});
    user = new UserEntity(
      new UserRules(userProps)
    );
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should sign up a new user', async () => {
    const mockSignUpUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(user.toJSON()))
    };

    controller['signUpUseCase'] = mockSignUpUseCase as any;

    const signUpParams : SignUpDto = {
      name: userProps.name,
      email: userProps.email,
      password: userProps.password
    }

    const result = await controller.create(signUpParams);

    const userView = new UserView(user.toJSON() as UserOutput);

    expect(result).toStrictEqual(userView);
    expect(mockSignUpUseCase.execute).toBeCalledWith(signUpParams);
  });

  it('Should sign in with user credentials', async () => {
    const mockSignInUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(user.toJSON()))
    };

    controller['signInUseCase'] = mockSignInUseCase as any;

    const signInParams : SignInDto = {
      email: userProps.email,
      password: userProps.password
    }

    const result = await controller.signin(signInParams);

    const userView = new UserView(user.toJSON() as UserOutput);

    expect(result).toStrictEqual(userView);
    expect(mockSignInUseCase.execute).toBeCalledWith(signInParams);
  });

  it('Should update user', async () => {
    user.setName('Novo nome para o Mateus');

    const mockUpdateUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(user.toJSON()))
    };

    controller['updateUserUseCase'] = mockUpdateUserUseCase as any;

    const updateParams : UpdateUserDto = {
      name: 'Novo nome para o Mateus'
    }

    const result = await controller.update(user.id, updateParams);
    
    const userView = new UserView(user.toJSON() as UserOutput);

    expect(result).toStrictEqual(userView);
    expect(mockUpdateUserUseCase.execute).toBeCalledWith(
      {
        id: user.id,
        ...updateParams
      }
    );
  });

  it('Should update user password', async () => {
    user.setPassword('novaSenha123');

    const mockUpdatePasswordUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(user.toJSON()))
    };

    controller['updatePasswordUseCase'] = mockUpdatePasswordUseCase as any;

    const updatePasswordParams : UpdatePasswordDto = {
      oldPassword: userProps.password,
      newPassword: 'novaSenha123'
    }

    const result = await controller.updatePassword(user.id, updatePasswordParams);

    const userView = new UserView(user.toJSON() as UserOutput);

    expect(result).toStrictEqual(userView);
    expect(mockUpdatePasswordUseCase.execute).toBeCalledWith(
      {
        id: user.id,
        ...updatePasswordParams
      }
    );
  });

  it('Should get user', async () => {
    const mockGetUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(user.toJSON()))
    };

    controller['getUserUseCase'] = mockGetUserUseCase as any;

    const result = await controller.findOne(user.id);

    const userView = new UserView(user.toJSON() as UserOutput);

    expect(result).toStrictEqual(userView);
    expect(mockGetUserUseCase.execute).toBeCalledWith(
      {
        id: user.id,
      }
    );
  });

  it('Should list users', async () => {
    const mockListUsersUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(
        {
          items: [user.toJSON()],
          total: 1,
          currentPage: 1,
          lastPage: 1,
          perPage: 1
        } as ListUsersUseCase.Output
      ))
    };

    controller['listUsersUseCase'] = mockListUsersUseCase as any;

    const listUsersParams : ListUsersDto = {
      page: 1,
      perPage: 1,
    }

    const result = await controller.findSome(listUsersParams);

    const userPaginationView = new UserPaginationView(
      {
        items: [user.toJSON()],
        total: 1,
        currentPage: 1,
        lastPage: 1,
        perPage: 1
      }
    );

    expect(result).toStrictEqual(userPaginationView);
    expect(mockListUsersUseCase.execute).toBeCalledWith(listUsersParams);
  });

  it('Should delete user', async () => {
    const mockDeleteUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve())
    };

    controller['deleteUserUseCase'] = mockDeleteUserUseCase as any;

    const result = await controller.remove(user.id);

    expect(result).toStrictEqual(undefined);
    expect(mockDeleteUserUseCase.execute).toBeCalledWith(
      {
        id: user.id,
      }
    );
  });
});
