import { SignUpUseCase } from "@/users/application/usecases/signup.usecase";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignUpDto implements SignUpUseCase.Input {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
