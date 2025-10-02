import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
const app = await NestFactory.create(AppModule, { logger: ['log','error','warn'] });
const port = process.env.API_PORT || 4000;
app.enableCors({ origin: '*' });
await app.listen(port as number);
console.log(`API listening on :${port}`);
}
bootstrap();
