import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SecretNote } from './entities/secretnotes.entity';

@Injectable()
export class SecretnotesService {
  constructor(
    @InjectRepository(SecretNote)
    private readonly secretNoteRepository: Repository<SecretNote>,
  ) {}

  async create(note: string): Promise<SecretNote> {
    const secretNote = new SecretNote();
    secretNote.note = note;
    return await this.secretNoteRepository.save(secretNote);
  }

  async findById(id: string): Promise<SecretNote> {
    return await this.secretNoteRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<SecretNote[]> {
    return await this.secretNoteRepository.find();
  }

  async updateById(id: string, note: string): Promise<SecretNote> {
    const secretNote = await this.findById(id);
    secretNote.note = note;
    return await this.secretNoteRepository.save(secretNote);
  }

  async deleteById(id: string): Promise<void> {
    await this.secretNoteRepository.delete(id);
  }
}
