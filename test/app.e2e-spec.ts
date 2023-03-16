import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateSecretnoteDto } from 'src/secretnotes/dto/create-secretnote.dto';
import { mainConfig } from '../main.config';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    mainConfig(app);
    await app.init();
  });

  describe('(POST): /secretnotes', () => {
    it('should create a new secret note', async () => {
      const secretNoteData: CreateSecretnoteDto = {
        note: 'This is a test note',
      };

      const response = await request(app.getHttpServer())
        .post('/secretnotes')
        .send(secretNoteData)
        .expect(201);
      console.log(response.body.note);
      expect(response.body.note).not.toEqual(secretNoteData.note); // Verify that the note is encrypted in the database
      expect(response.body.privateKey).toBeDefined();
      expect(response.body.created_at).toBeDefined();
      expect(response.body.updated_at).toBeDefined();

      // const secretNote = await secretNoteService.findOne(response.body.id);

      // expect(secretNote).toBeDefined();
      // expect(secretNote.note).not.toEqual(createSecretNoteDto.note);
    });
    it('should return 400 when note field is empty with message', async () => {
      const response = await request(app.getHttpServer())
        .post('/secretnotes')
        .send({
          note: '',
        })
        .expect(400);

      expect(response.body.message[0]).toEqual('note should not be empty');
    });
    it('should return 400 when request body is empty', async () => {
      await request(app.getHttpServer())
        .post('/secretnotes')
        .send()
        .expect(400);
    });
  });
  describe('(GET): /secretnotes', () => {
    it('should return an array of secrets with decrypted note when encrypted flag is not provided or false', async () => {
      // await secretNoteService.create({ note: 'This is a test note 1' });
      // await secretNoteService.create({ note: 'This is a test note 2' });
      const response = await request(app.getHttpServer())
        .get('/secretnotes')
        .expect(200);

      expect(response.body.length).toBeGreaterThan(1);
      expect(response.body[0].note).toBeDefined();
      expect(response.body[0].privateKey).toBeDefined();
      expect(response.body[0].created_at).toBeDefined();
      expect(response.body[0].updated_at).toBeDefined();
    });
  });
  describe('(GET): /secretnotes/:id', () => {
    it('should return the decrypted secret note with the specified ID', async () => {
      const secretNoteData = {
        note: 'This is a test note',
      };
      // const secretNote = await secretNoteService.create(secretNoteData);
      const secretNote = await request(app.getHttpServer())
        .post('/secretnotes')
        .send(secretNoteData)
        .expect(201);

      const response = await request(app.getHttpServer())
        .get(`/secretnotes/${secretNote.body.id}`)
        .expect(200);

      expect(response.body.id).not.toBeInstanceOf(Number);
      expect(response.body.note).toEqual(secretNoteData.note);
      expect(response.body.created_at).toBeDefined();
      expect(response.body.updated_at).toBeDefined();
    });

    it('should return the encrypted secret note with the specified ID when requested', async () => {
      const secretNoteData = {
        note: 'This is a test note',
      };
      // const secretNote = await secretNoteService.create(secretNoteData);
      const secretNote = await request(app.getHttpServer())
        .post('/secretnotes')
        .send(secretNoteData)
        .expect(201);

      const response = await request(app.getHttpServer())
        .get(`/secretnotes/${secretNote.body.id}?encrypted=true`)
        .expect(200);

      expect(response.body.id).toEqual(secretNote.body.id);
      expect(response.body.note).not.toEqual(secretNoteData.note);
      expect(response.body.created_at).toBeDefined();
      expect(response.body.updated_at).toBeDefined();
    });

    it('should return a 404 error when the specified secret note ID does not exist', async () => {
      const fakeId = 'fakeId';
      const response = await request(app.getHttpServer())
        .get(`/secretnotes/${fakeId}`)
        .expect(404);

      expect(response.body.message).toEqual(
        `Secret note with id ${fakeId} not found`,
      );
    });
  });
  describe('(PATCH): /secretnotes/:id', () => {
    it('should update a secret and return decrypted note when encrypted flag is not provided or false', async () => {
      const updateDto = {
        note: 'This is an updated test note',
      };

      const secretNote = await request(app.getHttpServer())
        .post('/secretnotes')
        .send(updateDto)
        .expect(201);

      const response = await request(app.getHttpServer())
        .patch(`/secretnotes/${secretNote.body.id}`)
        .send(updateDto)
        .expect(200);

      expect(response.body.note).toEqual(updateDto.note);
      expect(response.body.created_at).toBeDefined();
      expect(response.body.updated_at).toBeDefined();
    });

    it('should update a secret and return encrypted note when encrypted flag is set to true', async () => {
      const updateDto = {
        note: 'This is an updated test note',
      };

      const secretNote = await request(app.getHttpServer())
        .post('/secretnotes')
        .send(updateDto)
        .expect(201);

      const response = await request(app.getHttpServer())
        .patch(`/secretnotes/${secretNote.body.id}`)
        .send(updateDto)
        .query({ encrypted: true })
        .expect(200);

      expect(response.body.note).not.toEqual(updateDto.note);
      expect(response.body.created_at).toBeDefined();
      expect(response.body.updated_at).toBeDefined();
    });

    it('should return 404 when trying to update a non-existent secret', async () => {
      const updateDto = {
        note: 'This is an updated test note',
      };
      const response = await request(app.getHttpServer())
        .patch('/secretnotes/999')
        .send(updateDto)
        .expect(404);

      expect(response.body.message).toEqual(
        'Secret note with id 999 not found',
      );
    });
  });
  describe('(DELETE): /secretnotes/:id', () => {
    it('should delete the secret note and return 204 status code', async () => {
      const { body: createdNote } = await request(app.getHttpServer())
        .post('/secretnotes')
        .send({
          note: 'This is a test secret',
        })
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/secretnotes/${createdNote.id}`)
        .expect(200);

      await request(app.getHttpServer())
        .get(`/secretnotes/${createdNote.id}`)
        .expect(404);
    });

    it('should return 404 status code if the secret note is not found', async () => {
      const nonExistentId = 'non-existent-id';

      await request(app.getHttpServer())
        .delete(`/secrets/${nonExistentId}`)
        .expect(404);
    });
  });
});
