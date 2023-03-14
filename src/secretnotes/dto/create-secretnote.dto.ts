import { IsString } from 'class-validator';

export class CreateSecretnoteDto {
  @IsString()
  note: string;
}
