import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecretNote } from './entities/secretnotes.entity';
import { SecretNoteController } from './secretnotes.controller';
import { SecretNoteService } from './secretnotes.service';

@Module({
  imports: [TypeOrmModule.forFeature([SecretNote])],
  controllers: [SecretNoteController],
  providers: [SecretNoteService],
})
export class SecretnotesModule {}
