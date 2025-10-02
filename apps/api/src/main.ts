import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['log','error','warn'] });

  app.enableCors({ origin: '*' });

  const port =
    Number(process.env.NEST_PORT ?? process.env.API_PORT ?? 4000);

  // IMPORTANT in containers:
  await app.listen(port, '0.0.0.0');

  console.log(`API listening on :${port}`);
}
bootstrap();
