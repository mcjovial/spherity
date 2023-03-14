import { Test, TestingModule } from '@nestjs/testing';
import { SecretnotesService } from './secretnotes.service';

describe('SecretnotesService', () => {
  let service: SecretnotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecretnotesService],
    }).compile();

    service = module.get<SecretnotesService>(SecretnotesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
