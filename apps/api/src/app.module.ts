import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { CanvasModule } from './modules/canvas/canvas.module';
import { LlmModule } from './modules/llm/llm.module';
import { RunsModule } from './modules/runs/runs.module';
import { WorkerModule } from './modules/worker/worker.module';


@Module({
imports: [
ConfigModule.forRoot({ isGlobal: true }),
HttpModule.register({ baseURL: process.env.CANVAS_BASE_URL }),
CanvasModule,
LlmModule,
RunsModule,
WorkerModule,
],
})
export class AppModule {}
