import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import { env } from '@/configs';
import { ResponseInterceptor, GlobalExceptionFilter } from '@/common';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // TODO: Limit it to Esjora servers only
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers',
      'x-request-source',
    ],
    credentials: true,
    maxAge: 86400,
    preflightContinue: false,
    optionsSuccessStatus: 200,
  });

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.use(
    ['/docs'],
    basicAuth({
      challenge: true,
      users: { client: 'heyoo!' },
      unauthorizedResponse: () => {
        return {
          success: false,
          status: 'error',
          message: 'Unauthorized, please login to continue',
        };
      },
    }),
  );

  const swaggerDocsConfig = new DocumentBuilder()
    .setTitle(`${env.APP_NAME} API backend documentation`)
    .setDescription(`${env.APP_DESC}`)
    .setVersion('1.0')
    .addBearerAuth()
    .setExternalDoc('Postman Collection', '/swagger/json')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, swaggerDocsConfig);
  SwaggerModule.setup('docs', app, documentFactory, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      persistAuthorization: true,
    },
    jsonDocumentUrl: 'swagger/json',
    explorer: true,
  });

  const port = env.PORT;
  await app.listen(port);
  const protocol = env.APP_ENV !== 'dev' ? 'https' : 'http';
  console.info(`
    ------
    API server listening on port: ${protocol}://localhost:${port}
    Access documentation: ${protocol}://localhost:${port}/docs
    ------
    `);
}
bootstrap();
