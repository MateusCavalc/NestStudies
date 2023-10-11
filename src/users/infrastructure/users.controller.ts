import { Controller, Get, Post, Body, Put, Patch, Param, Delete, Inject, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { SignUpUseCase } from '../application/usecases/signup.usecase';
import { SignInUseCase } from '../application/usecases/signin.usecase';
import { GetUserUseCase } from '../application/usecases/getuser.usecase';
import { ListUsersUseCase } from '../application/usecases/listusers.usecase';
import { UpdateUserUseCase } from '../application/usecases/updateuser.usecase';
import { UpdatePasswordUseCase } from '../application/usecases/updatepassword.usecase';
import { DeleteUserUseCase } from '../application/usecases/deleteuser.usecase';
import { ListUsersDto } from './dtos/list-users.dto';
import { UserOutput } from '../application/dtos/user-output';
import { UserPaginationView, UserView } from './presenters/user.presenter';
import { PaginationOutput } from '@/shared/application/dtos/pagination-output';

@Controller('users')
export class UsersController {
  @Inject(SignUpUseCase.UseCase)
  private signUpUseCase: SignUpUseCase.UseCase

  @Inject(SignInUseCase.UseCase)
  private signInUseCase: SignInUseCase.UseCase

  @Inject(GetUserUseCase.UseCase)
  private getUserUseCase: GetUserUseCase.UseCase

  @Inject(ListUsersUseCase.UseCase)
  private listUsersUseCase: ListUsersUseCase.UseCase

  @Inject(UpdateUserUseCase.UseCase)
  private updateUserUseCase: UpdateUserUseCase.UseCase

  @Inject(UpdatePasswordUseCase.UseCase)
  private updatePasswordUseCase: UpdatePasswordUseCase.UseCase

  @Inject(DeleteUserUseCase.UseCase)
  private deleteUserUseCase: DeleteUserUseCase.UseCase

  static userToView(output: UserOutput) {
    return new UserView(output);
  }

  static paginationToView(paginationOutput: PaginationOutput<UserOutput>) {
    return new UserPaginationView(paginationOutput);
  }

  @Post()
  async create(@Body() signUpDto: SignUpDto) {
    const userOutput = await this.signUpUseCase.execute(signUpDto);

    return UsersController.userToView(userOutput);

  }

  @HttpCode(HttpStatus.OK)
  @Post('auth')
  async signin(@Body() signInDto: SignInDto) {
    const userOutput = await this.signInUseCase.execute(signInDto);

    return UsersController.userToView(userOutput);
  }

  @Get()
  async findSome(@Query() searchParams: ListUsersDto) {
    const paginationOutput = await this.listUsersUseCase.execute(searchParams);

    return UsersController.paginationToView(paginationOutput);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const userOutput = await this.getUserUseCase.execute({ id });

    return UsersController.userToView(userOutput);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    const userOutput = await this.updateUserUseCase.execute(
      {
        id,
        ...updateUserDto
      } as UpdateUserUseCase.Input
    );

    return UsersController.userToView(userOutput);
  }

  @Patch('password/:id')
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto
  ) {
    const userOutput = await this.updatePasswordUseCase.execute(
      {
        id,
        ...updatePasswordDto
      } as UpdatePasswordUseCase.Input
    );

    return UsersController.userToView(userOutput);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteUserUseCase.execute({ id });
  }
}
