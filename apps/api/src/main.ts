// apps/api/src/main.ts
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['log','error','warn'] });
  app.enableCors({ origin: '*' });
  const port = Number(process.env.NEST_PORT ?? process.env.API_PORT ?? 4000);
  await app.listen(port, '0.0.0.0');   // important for containers
  console.log(`API listening on :${port}`);
}
bootstrap();
