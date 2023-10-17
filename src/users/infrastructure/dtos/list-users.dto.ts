import { SortDirection } from "@/shared/domain/repositories/repository-contracts";
import { ListUsersUseCase } from "@/users/application/usecases/listusers.usecase";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsOptional } from "class-validator";

export class ListUsersDto implements ListUsersUseCase.Input {
    @ApiPropertyOptional({description: 'Página que deve ser retornada'})
    @IsOptional()
    @Transform(({ value }) => Number(value))
    page?: number;
    
    @ApiPropertyOptional({description: 'Número de registros por página'})
    @IsOptional()
    @Transform(({ value }) => Number(value))
    perPage?: number;

    @ApiPropertyOptional({description: 'Campo que será utilizado para ordenação (\'name\' ou \'createdAt\')'})
    @IsOptional()
    sort?: string;
    
    @ApiPropertyOptional({description: 'Direção para ordenação (\'asc\' ou \'desc\')'})
    @IsOptional()
    sortDir?: SortDirection;
    
    @ApiPropertyOptional({description: 'Filtro aplicado para restrição de resultados (\'name\')'})
    @IsOptional()
    filter?: string;
}