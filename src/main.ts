import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeWinston, Logger } from './common/logging/Logger';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { ApplicationLogger } from './common/logging/ApplicationLogger';
import { AllExceptionsFilter } from './common/filters/all-exceptions-filter';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import 'dotenv/config';

initializeWinston();
const logger = new Logger('Application');

  // Set up Swagger
  const config = new DocumentBuilder()
    .setTitle('Price API')
    .setDescription('API documentation for the Price service')
    .setVersion('1.0')
    .addTag('Prices')
    .build();
bootstrap().catch((e: Error) => logger.error(e));

async function bootstrap(): Promise<void> {
  logger.info('****** Starting API ******');

  const app = await NestFactory.create(AppModule, {
    logger: new ApplicationLogger(),
  });
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger UI will be

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.use(cookieParser());

  await app.listen(process.env.PORT);

  logger.info(`App running at ${process.env.PORT}`);
}
