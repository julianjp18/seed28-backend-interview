import {
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum OriginFilter {
  PROPIO = 'propio',
  CATALOGO = 'catalogo',
  FAVORITOS = 'favoritos',
}

export enum CoatFilter {
  NEGRO = 'negro',
  COLORADO = 'colorado',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class QueryBullsDto {
  @IsOptional()
  @IsString()
  search?: string; // Search by ear tag or name

  @IsOptional()
  @IsEnum(OriginFilter)
  origin?: OriginFilter;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  forHeifer?: boolean;

  @IsOptional()
  @IsEnum(CoatFilter)
  coat?: CoatFilter;

  @IsOptional()
  @IsEnum(SortOrder)
  sortBy?: SortOrder = SortOrder.DESC;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
