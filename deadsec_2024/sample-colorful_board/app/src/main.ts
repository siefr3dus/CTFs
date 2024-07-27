import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { setupSwagger } from './common/modules';
import { join } from 'path';
import cookieParser from 'cookie-parser';

import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { NotFoundFilter, UnauthorizedFilter } from './common/filters';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  app.use(helmet({ contentSecurityPolicy: false }));

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new NotFoundFilter());
  app.useGlobalFilters(new UnauthorizedFilter());

  app.use(cookieParser());
  app.useStaticAssets(join(__dirname, 'common', 'public'));
  app.setBaseViewsDir(join(__dirname, 'common', 'views'));
  app.setViewEngine('hbs');

  await setupSwagger(app);

  const port = parseInt(process.env.WEB_PORT) || 1337;
  await app.listen(port);
}
bootstrap();
