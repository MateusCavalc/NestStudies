import { SignInUseCase } from "@/users/application/usecases/signin.usecase";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignInDto implements SignInUseCase.Input {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

}