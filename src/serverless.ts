import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Server } from 'http';
import { ExpressAdapter } from '@nestjs/platform-express';
import { createServer, proxy } from 'aws-serverless-express';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';

let cachedServer: Server;

const bootstrapServer = async (): Promise<Server> => {
  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);
  const app = await NestFactory.create(AppModule, adapter);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  console.log('before app init');
  await app.init();
  return createServer(expressApp);
};

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent & { source?: string },
  context,
) => {
  console.log('in handler');
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!');
    return 'Lambda is warm!';
  }
  if (!cachedServer) {
    cachedServer = await bootstrapServer();
  }
  console.log('before promise');
  return proxy(cachedServer, event, context, 'PROMISE').promise;
};
