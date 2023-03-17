import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  Patch,
  UseInterceptors,
} from '@nestjs/common';
import { TransformInterceptor } from '../common/interceptors/response-transform.interceptor';
import { paginateResponse } from '../common/utils/helpers.utils';
import { CustomNotFoundException } from '../common/exceptions/customNotFound.exception';
import { CreateSecretnoteDto } from './dto/create-secretnote.dto';
import { QueryParamsDto } from './dto/query-params.dto';
import { UpdateSecretNoteDto } from './dto/update-secretnote.dto';
import { SecretNoteService } from './secretnotes.service';

@Controller('secretnotes')
export class SecretNoteController {
  constructor(private readonly secretNoteService: SecretNoteService) {}

  @Post()
  @UseInterceptors(TransformInterceptor)
  async create(@Body() secretNote: CreateSecretnoteDto) {
    const result = await this.secretNoteService.create(secretNote);
    return { message: 'Note Created', result };
  }

  @Get()
  async findAll(@Query() query: QueryParamsDto) {
    const [result, count] = await this.secretNoteService.findAll(query);
    return paginateResponse([result, count], query.page, query.take);
  }

  @Get(':id')
  @UseInterceptors(TransformInterceptor)
  async findOne(
    @Param('id') id: string,
    @Query('encrypted') encrypted: boolean,
  ) {
    try {
      const result = await this.secretNoteService.findOne(id, encrypted);
      return { message: '', result };
    } catch (error) {
      throw new CustomNotFoundException('Secret note', id);
    }
  }

  @Patch(':id')
  @UseInterceptors(TransformInterceptor)
  async updateOne(
    @Param('id') id: string,
    @Body() newtNote: UpdateSecretNoteDto,
    @Query('encrypted') encrypted: boolean,
  ) {
    try {
      const result = await this.secretNoteService.updateOne(
        id,
        newtNote,
        encrypted,
      );
      return { message: '', result };
    } catch (error) {
      throw new CustomNotFoundException('Secret note', id);
    }
  }

  @Delete(':id')
  @UseInterceptors(TransformInterceptor)
  async delete(@Param('id') id: string) {
    try {
      const result = await this.secretNoteService.delete(id);
      return { message: 'Deleted successfully!', result };
    } catch (error) {
      throw new CustomNotFoundException('Secret note', id);
    }
  }
}
