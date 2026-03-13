import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import helmet from 'helmet';
import { AllExceptionsFilter } from './common/filters/http-exception/http-exception.filter';
import { PrismaClientExceptionFilter } from './common/filters/prisma-exception/prisma-exception.filter';

const STARTUP_BANNER = `
\x1b[36m
  _   _           _   _____             _ _       
 | \\ | |         | | |_   _|           (_) |      
 |  \\| | ___  ___| |_  | |  __ _ _ __   _| |_ ___ 
 | . \` |/ _ \\/ __| __| | | / _\` | '_ \\ | | __/ _ \\
 | |\\  |  __/\\__ \\ |_ _| || (_| | | | || | ||  __/
 \\_| \\_/\\___||___/\\__\\___/ \\__, |_| |_||_|\\__\\___|
                            __/ |                 
                           |___/                  

 :: NestJS Template by tulioanesio::        (v1.0.0)
\x1b[36m
`;

async function bootstrap() {
  console.log(STARTUP_BANNER);

  const app = await NestFactory.create(AppModule);
  const defaultVersion = '1';

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'",
            'https://cdn.jsdelivr.net',
          ],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            'https://fonts.googleapis.com',
          ],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          imgSrc: ["'self'", 'data:', 'https://cdn.jsdelivr.net'],
        },
      },
    }),
  );
  app.enableCors({
    origin: ['http://localhost:3000' /*'https://frontendurl.com'*/],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new PrismaClientExceptionFilter(httpAdapter),
  );

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableShutdownHooks();

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API Description')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(`http://localhost:${process.env.PORT ?? 3000}`)
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use(
    '/docs',
    apiReference({
      theme: 'default',
      content: document,
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/api/v${defaultVersion}`,
  );
  Logger.log(`📖 Documentation is available at: http://localhost:${port}/docs`);
  Logger.log(
    `📍 Health check is available at: http://localhost:${port}/v${defaultVersion}/health`,
  );
}
bootstrap();
