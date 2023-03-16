import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSecretnoteDto {
  @IsString()
  @IsNotEmpty()
  note: string;
  @IsString()
  @IsOptional()
  privateKey?: string;
}
