import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { SecretNoteController } from './secretnotes.controller';
import { SecretNote } from './entities/secretnotes.entity';
import { SecretNoteService } from './secretnotes.service';

describe('SecretNoteController', () => {
  let app: INestApplication;
  let secretNoteService: SecretNoteService;
  let secretNoteController: SecretNoteController;

  const secretNote: SecretNote = {
    id: 'c8820857-be54-4f14-9ed1-483aad0acc82',
    note: 'This is a secret note',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SecretNoteController],
      providers: [SecretNoteService],
    }).compile();

    app = module.createNestApplication();
    secretNoteService = module.get<SecretNoteService>(SecretNoteService);
    secretNoteController =
      module.get<SecretNoteController>(SecretNoteController);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /secret-note', () => {
    it('should create a new secret note', async () => {
      const spy = jest.spyOn(secretNoteService, 'create');
      const response = await request(app.getHttpServer())
        .post('/secret-note')
        .send({ note: secretNote.note });
      expect(response.status).toBe(201);
      expect(spy).toHaveBeenCalledWith(secretNote.note);
    });
  });

  // describe('GET /secret-note/:id', () => {
  //   it('should get the decrypted secret note with the given id', async () => {
  //     const spy = jest.spyOn(secretNoteService, 'findById');
  //     const encryptedNote = secretNoteController.encrypt(secretNote.note);
  //     jest
  //       .spyOn(secretNoteController, 'decrypt')
  //       .mockReturnValue(secretNote.note);
  //     const secretNoteWithEncryption = { ...secretNote, note: encryptedNote };
  //     jest
  //       .spyOn(secretNoteService, 'findById')
  //       .mockReturnValue(Promise.resolve(secretNoteWithEncryption));
  //     const response = await request(app.getHttpServer())
  //       .get(`/secret-note/${secretNote.id}`)
  //       .set('Accept', 'application/json');
  //     expect(response.status).toBe(200);
  //     expect(response.body.note).toEqual(secretNote.note);
  //     expect(spy).toHaveBeenCalledWith(secretNote.id);
  //   });

  //   it('should get the encrypted secret note with the given id', async () => {
  //     const spy = jest.spyOn(secretNoteService, 'findById');
  //     const encryptedNote = secretNoteController.encrypt(secretNote.note);
  //     const secretNoteWithEncryption = { ...secretNote, note: encryptedNote };
  //     jest
  //       .spyOn(secretNoteService, 'findById')
  //       .mockReturnValue(Promise.resolve(secretNoteWithEncryption));
  //     const response = await request(app.getHttpServer())
  //       .get(`/secret-note/${secretNote.id}`)
  //       .set('Accept', 'application/json')
  //       .query({ encrypted: true });
  //     expect(response.status).toBe(200);
  //     expect(response.body.note).toEqual(encryptedNote);
  //     expect(spy).toHaveBeenCalledWith(secretNote.id);
  //   });
  // });

  // describe('PUT /secret-note/:id', () => {
  //   it('should update the decrypted secret note with the given id', async () => {
  //     const spyFind = jest.spyOn(secretNoteService, 'findById');
  //     const spyUpdate = jest.spyOn(secretNoteService, 'update');
  //     const decryptedNote = 'This is the updated secret note';
  //     const encryptedNote = secretNoteController.encrypt(decryptedNote);
  //     jest.spyOn(secretNote)
  //   });
  // });
});
