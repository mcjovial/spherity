import { Module } from '@nestjs/common';
import { SecretnotesService } from './secretnotes.service';
import { SecretnotesController } from './secretnotes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecretNote } from './entities/secretnotes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SecretNote])],
  controllers: [SecretnotesController],
  providers: [SecretnotesService],
})
export class SecretnotesModule {}
