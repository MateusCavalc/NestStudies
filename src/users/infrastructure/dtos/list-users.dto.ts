import { SortDirection } from "@/shared/domain/repositories/repository-contracts";
import { ListUsersUseCase } from "@/users/application/usecases/listusers.usecase";
import { Transform } from "class-transformer";

export class ListUsersDto implements ListUsersUseCase.Input {
    @Transform(({ value }) => Number(value))
    page?: number;
    @Transform(({ value }) => Number(value))
    perPage?: number;
    sort?: string;
    sortDir?: SortDirection;
    filter?: string;
}