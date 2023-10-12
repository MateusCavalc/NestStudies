import { SortDirection } from "@/shared/domain/repositories/repository-contracts";
import { ListUsersUseCase } from "@/users/application/usecases/listusers.usecase";
import { Transform } from "class-transformer";
import { IsOptional } from "class-validator";

export class ListUsersDto implements ListUsersUseCase.Input {
    @IsOptional()
    @Transform(({ value }) => Number(value))
    page?: number;

    @IsOptional()
    @Transform(({ value }) => Number(value))
    perPage?: number;

    @IsOptional()
    sort?: string;

    @IsOptional()
    sortDir?: SortDirection;

    @IsOptional()
    filter?: string;
}