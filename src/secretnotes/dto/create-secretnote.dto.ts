import { IsOptional, IsString } from 'class-validator';

export class CreateSecretnoteDto {
  @IsString()
  note: string;
  @IsString()
  @IsOptional()
  privateKey: string;
}
