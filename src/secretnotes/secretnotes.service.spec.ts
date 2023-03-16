import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { async } from 'rxjs';
import { Repository } from 'typeorm';
import { SecretNote } from './entities/secretnotes.entity';
import { SecretNoteService } from './secretnotes.service';

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
    it('should accept id and delete note data', async () => {
      await secretNoteService.delete('502f0f3e-ae93-4225-ad4e-22994d431e7e');
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
