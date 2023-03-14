import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SecretnotesModule } from './secretnotes/secretnotes.module';

@Module({
  imports: [SecretnotesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
