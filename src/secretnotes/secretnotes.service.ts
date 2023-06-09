import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as NodeRSA from 'node-rsa';
import { CreateSecretnoteDto } from './dto/create-secretnote.dto';
import { SecretNote } from './entities/secretnotes.entity';
import { UpdateSecretNoteDto } from './dto/update-secretnote.dto';
import { QueryParamsDto } from './dto/query-params.dto';

@Injectable()
export class SecretNoteService {
  constructor(
    @InjectRepository(SecretNote)
    private readonly secretnoteRepository: Repository<SecretNote>,
  ) {}

  async create(secretNote: CreateSecretnoteDto): Promise<SecretNote> {
    // Encrypt note
    const { encryptedNote, privateKey } = await this.encrypter(secretNote.note);

    // Save encrypted note to database
    const newSecretNote = this.secretnoteRepository.create({
      ...secretNote,
      note: encryptedNote,
      privateKey,
    });
    return await this.secretnoteRepository.save(newSecretNote);
  }

  async findAll(query?: QueryParamsDto) {
    const take = Number(query?.take) || 10;
    const page = Number(query?.page) || 1;
    const skip = (page - 1) * take;

    const [result, count] = await this.secretnoteRepository.findAndCount({
      take: take,
      skip: skip,
    });

    if (!query.encrypted) {
      result.map((note) => {
        // Decrypt secret note with private key
        const decryptedNote = this.decrypter(note.note, note.privateKey);
        note.note = decryptedNote;
        note.privateKey = undefined;
        return note;
      });
    }

    return [result, count];
  }

  async findOne(id: string, encrypted?: boolean): Promise<SecretNote> {
    const note = await this.secretnoteRepository.findOne({ where: { id } });
    if (encrypted) {
      return note;
    }
    // Decrypt secret note with private key
    const decryptedNote = this.decrypter(note.note, note.privateKey);
    note.note = decryptedNote;
    note.privateKey = undefined;
    return note;
  }

  async updateOne(
    id: string,
    secretNote: UpdateSecretNoteDto,
    encrypted?: boolean,
  ): Promise<SecretNote> {
    // Encrypt note
    const { encryptedNote, privateKey } = await this.encrypter(secretNote.note);

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

  async encrypter(note: string) {
    // Generate RSA key pair
    const key = new NodeRSA({ b: 512 });
    const privateKey = key.exportKey('private');

    // Encrypt secret note with public key
    const encryptedNote = key.encrypt(note, 'base64');
    return { privateKey, encryptedNote };
  }

  decrypter(secreteNote: string, privateKey: string) {
    const key = new NodeRSA(privateKey);
    return key.decrypt(secreteNote, 'utf8');
  }
}
