import { IsAlpha, IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { UserProps } from "../entities/user.entity";

export class UserRules {
    @MaxLength(255)
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @MaxLength(255)
    @IsString()
    @IsNotEmpty()
    email: string;

    @MaxLength(100)
    @IsString()
    @IsNotEmpty()
    password: string;

    @IsOptional()
    @IsDate()
    createdAt?: Date;

    constructor(data: UserProps) {
        Object.assign(this, data ?? {});
    }
}