import { IsBooleanString, IsNumberString, IsOptional } from 'class-validator';

export class QueryParamsDto {
  @IsOptional()
  @IsNumberString()
  take?: number;
  @IsOptional()
  @IsNumberString()
  page?: number;
  @IsOptional()
  @IsBooleanString()
  encrypted?: boolean;
}
