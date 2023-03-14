import { Module } from '@nestjs/common';
import { SecretnotesService } from './secretnotes.service';
import { SecretnotesController } from './secretnotes.controller';

@Module({
  controllers: [SecretnotesController],
  providers: [SecretnotesService],
})
export class SecretnotesModule {}
