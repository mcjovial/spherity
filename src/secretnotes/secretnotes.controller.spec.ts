import { Test, TestingModule } from '@nestjs/testing';
import { SecretnotesController } from './secretnotes.controller';
import { SecretnotesService } from './secretnotes.service';

describe('SecretnotesController', () => {
  let controller: SecretnotesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SecretnotesController],
      providers: [SecretnotesService],
    }).compile();

    controller = module.get<SecretnotesController>(SecretnotesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
