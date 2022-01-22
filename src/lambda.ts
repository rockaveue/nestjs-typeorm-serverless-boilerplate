import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Server } from 'http';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as awsServerlessExpress from 'aws-serverless-express';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';

let cachedServer: Server;

const bootstrapServer = async (): Promise<Server> => {
  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);
  const app = await NestFactory.create(AppModule, adapter);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.init();
  return awsServerlessExpress.createServer(expressApp);
};

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent & { source?: string },
  context,
) => {
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!');
    return 'Lambda is warm!';
  }
  if (!cachedServer) {
    cachedServer = await bootstrapServer();
  }
  return awsServerlessExpress.proxy(cachedServer, event, context, 'PROMISE')
    .promise;
};
