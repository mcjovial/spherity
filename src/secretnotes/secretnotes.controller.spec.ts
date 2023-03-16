import { Test, TestingModule } from '@nestjs/testing';
import { SecretNoteController } from './secretnotes.controller';
import { SecretNoteService } from './secretnotes.service';

describe('SecretNoteController', () => {
  let controller: SecretNoteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SecretNoteController],
      providers: [SecretNoteService],
    }).compile();

    controller = module.get<SecretNoteController>(SecretNoteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
