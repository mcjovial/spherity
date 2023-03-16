import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as NodeRSA from 'node-rsa';
import { CreateSecretnoteDto } from './dto/create-secretnote.dto';
import { SecretNote } from './entities/secretnotes.entity';
import { UpdateSecretNoteDto } from './dto/update-secretnote.dto';

@Injectable()
export class SecretNoteService {
  constructor(
    @InjectRepository(SecretNote)
    private readonly secretnoteRepository: Repository<SecretNote>,
  ) {}

  async create(secretNote: CreateSecretnoteDto): Promise<SecretNote> {
    // Generate RSA key pair
    const key = new NodeRSA({ b: 512 });
    const privateKey = key.exportKey('private');

    // Encrypt secret note with public key
    const encryptedNote = key.encrypt(secretNote.note, 'base64');

    // Save encrypted note to database
    const newSecretNote = this.secretnoteRepository.create({
      ...secretNote,
      note: encryptedNote,
      privateKey,
    });
    return await this.secretnoteRepository.save(newSecretNote);
  }

  async findAll(): Promise<SecretNote[]> {
    const secretnotes = await this.secretnoteRepository.find();
    return secretnotes.map((note) => {
      // Decrypt secret note with private key
      const key = new NodeRSA(note.privateKey);
      const decryptedNote = key.decrypt(note.note, 'utf8');
      note.note = decryptedNote;
      return note;
    });
  }

  async findOne(id: string, encrypted?: boolean): Promise<SecretNote> {
    const note = await this.secretnoteRepository.findOne({ where: { id } });
    if (encrypted) {
      return note;
    }
    // Decrypt secret note with private key
    const key = new NodeRSA(note.privateKey);
    const decryptedNote = key.decrypt(note.note, 'utf8');
    note.note = decryptedNote;
    return note;
  }

  async updateOne(
    id: string,
    secretNote: UpdateSecretNoteDto,
    encrypted?: boolean,
  ): Promise<SecretNote> {
    // Generate RSA key pair
    const key = new NodeRSA({ b: 512 });
    const privateKey = key.exportKey('private');

    // Encrypt secret updated note with public key
    const encryptedNote = key.encrypt(secretNote.note, 'base64');

    // Save updated note and its private key
    await this.secretnoteRepository.update(id, {
      ...secretNote,
      note: encryptedNote,
      privateKey,
    });

    return await this.findOne(id, encrypted);
  }

  async delete(id: string): Promise<void> {
    await this.secretnoteRepository.delete(id);
  }
}
