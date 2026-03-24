import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import type { NextFunction, Request, Response } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use((req: Request, _res: Response, next: NextFunction) => {
    const aliases: Array<[string, string]> = [
      ['status[]', 'status'],
      ['economicGroup[]', 'economicGroup'],
    ];

    for (const [alias, target] of aliases) {
      const aliasValue = req.query[alias];

      if (aliasValue === undefined) {
        continue;
      }

      if (req.query[target] === undefined) {
        req.query[target] = aliasValue;
      } else if (Array.isArray(req.query[target])) {
        req.query[target] = [...req.query[target], ...(Array.isArray(aliasValue) ? aliasValue : [aliasValue])];
      } else {
        req.query[target] = [req.query[target], ...(Array.isArray(aliasValue) ? aliasValue : [aliasValue])];
      }

      delete req.query[alias];
    }

    next();
  });

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Enable CORS
  app.enableCors();

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Matrix Reports API')
    .setDescription('API for managing energy reports with pagination and filters')
    .setVersion('1.0')
    .addTag('Billing', 'Billing endpoints')
    .addTag('health', 'Health check endpoints')
    .addTag('reports', 'Reports management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 8080;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
