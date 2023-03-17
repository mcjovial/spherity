import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';
import { x } from 'joi';
import { SecretNoteController } from './secretnotes.controller';
import { SecretNoteService } from './secretnotes.service';

describe('SecretNoteController', () => {
  let controller: SecretNoteController;
  let secretNoteService: SecretNoteService;

  const requestMock = {
    query: {},
  } as unknown as Request;

  const statusResponseMock = {
    send: jest.fn((x) => x),
  };

  const responseMock = {
    status: jest.fn((x) => statusResponseMock),
    send: jest.fn((x) => x),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SecretNoteController],
      providers: [
        {
          provide: SecretNoteService,
          useValue: {
            create: jest.fn((x) => x),
          },
        },
      ],
    }).compile();

    controller = module.get<SecretNoteController>(SecretNoteController);
    secretNoteService = module.get<SecretNoteService>(SecretNoteService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('secretNoteService: should be defined', () => {
    expect(secretNoteService).toBeDefined();
  });

  describe('createSecretNote', () => {
    it('should return an error respose', async () => {
      jest.spyOn(secretNoteService, 'create').mockImplementationOnce(() => {
        throw new BadRequestException();
      });

      try {
        const response = await controller.create({ note: 'new note' });
      } catch (error) {
        expect(error.response.statusCode).toEqual(400);
        expect(error.response.message).toEqual('Bad Request');
      }
    });
  });
});
