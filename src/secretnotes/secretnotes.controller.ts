import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  Patch,
} from '@nestjs/common';
import { CustomNotFoundException } from '../exceptions/customNotFound.exception';
import { CreateSecretnoteDto } from './dto/create-secretnote.dto';
import { UpdateSecretNoteDto } from './dto/update-secretnote.dto';
import { SecretNote } from './entities/secretnotes.entity';
import { SecretNoteService } from './secretnotes.service';

@Controller('secretnotes')
export class SecretNoteController {
  constructor(private readonly secretNoteService: SecretNoteService) {}

  @Post()
  async create(@Body() secretNote: CreateSecretnoteDto): Promise<SecretNote> {
    return await this.secretNoteService.create(secretNote);
  }

  @Get()
  async findAll(@Query('encrypted') encrypted: boolean): Promise<SecretNote[]> {
    return await this.secretNoteService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query('encrypted') encrypted: boolean,
  ): Promise<SecretNote> {
    try {
      return await this.secretNoteService.findOne(id, encrypted);
    } catch (error) {
      throw new CustomNotFoundException('Secret note', id);
    }
  }

  @Patch(':id')
  async updateOne(
    @Param('id') id: string,
    @Body() newtNote: UpdateSecretNoteDto,
    @Query('encrypted') encrypted: boolean,
  ): Promise<SecretNote> {
    try {
      return await this.secretNoteService.updateOne(id, newtNote, encrypted);
    } catch (error) {
      throw new CustomNotFoundException('Secret note', id);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return await this.secretNoteService.delete(id);
  }
}
