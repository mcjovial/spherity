import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { SecretnotesService } from './secretnotes.service';
import * as NodeRSA from 'node-rsa';
import { CreateSecretnoteDto } from './dto/create-secretnote.dto';
import { SecretNote } from './entities/secretnotes.entity';

@Controller('secretnotes')
export class SecretnotesController {
  constructor(private readonly secretNotesService: SecretnotesService) {}

  @Post()
  async create(@Body() secretNote: CreateSecretnoteDto): Promise<SecretNote> {
    const key = new NodeRSA({ b: 2048 });
    const encryptedNote = key.encrypt(secretNote.note, 'base64');
    const createdSecretNote = await this.secretNotesService.create(
      encryptedNote,
    );
    return {
      ...createdSecretNote,
      note: encryptedNote,
    };
  }

  @Get(':id')
  async findById(
    @Param('id') id: string,
    @Query('decrypted') decrypted: boolean,
  ): Promise<SecretNote> {
    const secretNote = await this.secretNotesService.findById(id);
    if (!secretNote) {
      throw new Error(`SecretNote with ID ${id} not found`);
    }
    const key = new NodeRSA({ b: 2048 });
    const decryptedNote = key.decrypt(secretNote.note, 'utf8');
    return {
      ...secretNote,
      note: decrypted ? decryptedNote : secretNote.note,
    };
  }

  @Get()
  async findAll(): Promise<SecretNote[]> {
    const secretNotes = await this.secretNotesService.findAll();
    const key = new NodeRSA({ b: 2048 });
    const decryptedNotes = secretNotes.map((secretNote) => {
      return {
        ...secretNote,
        note: key.decrypt(secretNote.note, 'utf8'),
      };
    });
    return decryptedNotes;
  }

  @Post(':id')
  async updateById(
    @Param('id') id: string,
    @Body() secretNote: SecretNote,
  ): Promise<SecretNote> {
    const key = new NodeRSA({ b: 2048 });
    const encryptedNote = key.encrypt(secretNote.note, 'base64');
    const updatedSecretNote = await this.secretNotesService.updateById(
      id,
      encryptedNote,
    );
    return {
      ...updatedSecretNote,
      note: encryptedNote,
    };
  }

  @Post(':id/delete')
  async deleteById(@Param('id') id: string): Promise<void> {
    await this.secretNotesService.deleteById(id);
  }
}
