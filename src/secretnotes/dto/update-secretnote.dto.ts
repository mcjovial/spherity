import { PartialType } from '@nestjs/mapped-types';
import { CreateSecretnoteDto } from './create-secretnote.dto';

export class UpdateSecretNoteDto extends PartialType(CreateSecretnoteDto) {}
