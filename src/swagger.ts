import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { ConfigService } from '@nestjs/config';

export function setupSwagger(app: INestApplication, configService: ConfigService): void {
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API Description')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(`http://localhost:${configService
      .get<number>('PORT') ?? 3000}`)
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use(
    '/docs',
    apiReference({
      theme: 'default',
      content: document,
    }),
  );
}
