import { SignUpUseCase } from "@/users/application/usecases/signup.usecase";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignUpDto implements SignUpUseCase.Input {
    @ApiProperty({description: 'Nome do usuário'})
    @IsString()
    @IsNotEmpty()
    name: string;
    
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
