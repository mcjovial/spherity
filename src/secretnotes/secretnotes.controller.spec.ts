import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { SecretNoteService } from './secretnotes.service';
import { SecretNoteController } from './secretnotes.controller';
import { CreateSecretnoteDto } from './dto/create-secretnote.dto';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SecretNote } from './entities/secretnotes.entity';
import { UpdateSecretNoteDto } from './dto/update-secretnote.dto';

describe('SecretNoteController', () => {
  let app: INestApplication;
  let secretNoteService: SecretNoteService;
  let secretnoteRepository: Repository<SecretNote>;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [SecretNoteController],
      providers: [
        SecretNoteService,
        {
          provide: getRepositoryToken(SecretNote),
          useClass: Repository,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    secretNoteService = moduleRef.get<SecretNoteService>(SecretNoteService);
    secretnoteRepository = moduleRef.get(getRepositoryToken(SecretNote));
  });

  afterEach(async () => {
    // Delete all secret notes from the database after each test
    await secretnoteRepository.delete({});
  });

  afterAll(async () => {
    await app.close();
  });

  describe('create', () => {
    it('should create a new secret note', async () => {
      const createSecretNoteDto: CreateSecretnoteDto = {
        note: 'This is a test note',
      };

      const response = await request(app.getHttpServer())
        .post('/secretnotes')
        .send(createSecretNoteDto)
        .expect(201);

      console.log(response);
      // const secretNote = await secretNoteService.findOne(response.body.id);

      // expect(secretNote).toBeDefined();
      // expect(secretNote.note).not.toEqual(createSecretNoteDto.note);
    });
  });

  // describe('findAll', () => {
  //   it('should return an array of secret notes', async () => {
  //     const secretNote = await secretNoteService.create({
  //       note: 'This is a test note',
  //     });

  //     const response = await request(app.getHttpServer())
  //       .get('/secretnotes')
  //       .expect(200);

  //     expect(response.body).toHaveLength(1);
  //     expect(response.body[0].note).not.toEqual(secretNote.note);
  //   });
  // });

  // describe('findOne', () => {
  //   it('should return a secret note', async () => {
  //     const secretNote = await secretNoteService.create({
  //       note: 'This is a test note',
  //     });

  //     const response = await request(app.getHttpServer())
  //       .get(`/secretnotes/${secretNote.id}`)
  //       .expect(200);

  //     expect(response.body.note).not.toEqual(secretNote.note);
  //   });
  // });

  // describe('updateOne', () => {
  //   it('should update a secret note', async () => {
  //     const createNoteResponse = await request(app.getHttpServer())
  //       .post('/secretnotes')
  //       .send({ note: 'test note' })
  //       .expect(201);
  //     const { id } = createNoteResponse.body;

  //     const updatedNote = { note: 'updated note' };
  //     const updateNoteResponse = await request(app.getHttpServer())
  //       .patch(`/secretnotes/${id}`)
  //       .send(updatedNote)
  //       .expect(200);

  //     expect(updateNoteResponse.body.note).toBe(updatedNote.note);

  //     const getNoteResponse = await request(app.getHttpServer())
  //       .get(`/secretnotes/${id}`)
  //       .expect(200);

  //     expect(getNoteResponse.body.note).toBe(updatedNote.note);
  //   });
  // });

  // describe('DELETE /secretnotes/:id', () => {
  //   it('should delete a secret note', async () => {
  //     const createdNote = await createSecretNote();

  //     const response = await request(app.getHttpServer())
  //       .delete(`/secretnotes/${createdNote.id}`)
  //       .expect(200);

  //     expect(response.body).toEqual({});

  //     const foundNote = await secretNoteService.findOne(createdNote.id);
  //     expect(foundNote).toBeNull();
  //   });

  //   it('should return 404 when deleting a non-existing secret note', async () => {
  //     const response = await request(app.getHttpServer())
  //       .delete('/secretnotes/non-existing-id')
  //       .expect(404);

  //     expect(response.body).toEqual({
  //       statusCode: 404,
  //       message: 'Secret note not found',
  //       error: 'Not Found',
  //     });
  //   });
  // });
});
