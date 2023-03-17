import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { mainConfig } from 'main.config';
import { AppModule } from './app.module';
import { EntityNotFoundExceptionFilter } from './common/filters/entity-not-found-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  mainConfig(app);
  const configService = app.get(ConfigService);
  app.useGlobalFilters(new EntityNotFoundExceptionFilter());
  await app.listen(configService.get('PORT'), () =>
    console.log(`App started** on port: ${configService.get('PORT')}`),
  );
}
bootstrap();
