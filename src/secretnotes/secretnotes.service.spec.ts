import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SecretNote } from './entities/secretnotes.entity';
import { SecretNoteService } from './secretnotes.service';
import * as NodeRSA from 'node-rsa';

describe('SecretNoteService', () => {
  let secretNoteService: SecretNoteService;
  let secretNotesRepository: Repository<SecretNote>;

  const SECRET_NOTE_REPOSITORY_TOKEN = getRepositoryToken(SecretNote);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SecretNoteService,
        {
          provide: SECRET_NOTE_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            updateOne: jest.fn(),
            delete: jest.fn(),
            note: { note: 'hey' },
          },
        },
      ],
    }).compile();

    secretNoteService = module.get<SecretNoteService>(SecretNoteService);
    secretNotesRepository = module.get<Repository<SecretNote>>(
      SECRET_NOTE_REPOSITORY_TOKEN,
    );
  });

  it('secretNoteService: should be defined', () => {
    expect(secretNoteService).toBeDefined();
  });

  it('secretNotesRepository: should be defined', () => {
    expect(secretNotesRepository).toBeDefined();
  });

  describe('createSecretNote', () => {
    it('should create a new secret note', async () => {
      jest.spyOn(secretNotesRepository, 'create').mockReturnValueOnce({
        id: '502f0f3e-ae93-4225-ad4e-22994d431e7e',
        note: 'TNrPd8+rQAFi7tKLIVV6oaF4jvypcNmpej4K0wNP4Pn24ko3bGCQwM19TZPTiUoVZP9LdsnkOflOKUAeYWhO3g==',
        privateKey:
          '-----BEGIN RSA PRIVATE KEY-----\nMIIBOQIBAAJBAKCinXJLu5u4TJgCXjZPILtT06Cgqy5YqNNuw4/ljnAC5qLl+eyL\nhiO5KXufo5y7zuMr9YPYisdg/URNbUUHZ6MCAwEAAQJAL9PbHyHPbTD1lTj3RiJP\nM5dk5mmQLk91jOZo0dpei5jIsLZuwMYBXlvJVu4fqG/7eGpaNjBROGCasE2koE81\nuQIhANHhSZ/z1GVXzsIEtTpWzJ39C25aBeMgW8TbhYmg9VE3AiEAw+8UyC93TNIX\nxnP/QBV2cNMonU1Ke4/ajhSg1WFzwvUCIGxXtvD6Jq92B4aCdac6/X+lC8yYbieU\nIatagvHMBDc7AiAEXvMBvD1XE2DAZpoNHe10euFvEOhWdVEU1lT4LaJdeQIgUqL8\nHz3PSNaIXyO2deHckbSfg5sFy/1FNsMeq7aDoNw=\n-----END RSA PRIVATE KEY-----',
      });
      await secretNoteService.create({
        note: 'This is a new note',
      });
    });
  });

  describe('findOneSecretNote', () => {
    it('should accept id parameter to find secret note', async () => {
      await secretNoteService.findOne(
        '502f0f3e-ae93-4225-ad4e-22994d431e7e',
        true,
      );
    });
    it('should accept id and boolean parameters to return note as encrypted or decrypted', async () => {
      await secretNoteService.findOne(
        '502f0f3e-ae93-4225-ad4e-22994d431e7e',
        true,
      );
    });
  });

  describe('deleteSecretNote', () => {
    it('should call secretNotesRepository.delete with correct params', async () => {
      const id = '502f0f3e-ae93-4225-ad4e-22994d431e7e';
      await secretNoteService.delete(id);
      expect(secretNotesRepository.delete).toHaveBeenCalledWith(id);
      expect(secretNotesRepository.delete);
    });
  });

  describe('encryptNote', () => {
    it('should generate public and private key pairs and encrypt the provided string with the public key then return both encrypted note an private key', async () => {
      const cryptVal = await secretNoteService.encrypter('test message');

      expect(cryptVal).toHaveProperty('privateKey');
      expect(cryptVal).toHaveProperty('encryptedNote');
      expect(cryptVal.privateKey).toContain('-----BEGIN RSA PRIVATE KEY-----');
    });
  });

  describe('encryptNote', () => {
    it('should decrypt secretnote with private key', async () => {
      const note = 'Beautiful soup';
      const { privateKey, encryptedNote } = await secretNoteService.encrypter(
        note,
      );

      const decryptedNote = secretNoteService.decrypter(
        encryptedNote,
        privateKey,
      );

      expect(decryptedNote).toBe(note);
    });
  });
});
