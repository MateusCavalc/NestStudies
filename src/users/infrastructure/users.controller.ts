import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
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

  @Post()
  create(@Body() createUserDto: SignUpDto) {
    return this.signUpUseCase.execute(createUserDto);
  }

  @Post('/auth')
  signin(@Body() signInDto: SignInDto) {
    return this.signInUseCase.execute(signInDto);
  }

  @Get()
  findSome(@Body() listUsersDto: ListUsersDto) {
    return this.listUsersUseCase.execute(listUsersDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.getUserUseCase.execute({ id });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.updateUserUseCase.execute(
      {
        ...updateUserDto,
        id
      } as UpdateUserUseCase.Input
    );
  }

  @Patch('password/:id')
  updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto
  ) {
    return this.updatePasswordUseCase.execute(
      {
        ...updatePasswordDto,
        id
      } as UpdatePasswordUseCase.Input
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteUserUseCase.execute({ id });
  }
}
