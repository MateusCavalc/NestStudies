import { SignInUseCase } from "@/users/application/usecases/signin.usecase";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignInDto implements SignInUseCase.Input {
    @ApiProperty({description: 'E-mail do usuário'})
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @ApiProperty({description: 'Senha do usuário'})
    @IsString()
    @IsNotEmpty()
    password: string;

}