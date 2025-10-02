import { Module } from '@nestjs/common';
import { RunsService } from './runs.service';
import { RunsController } from './runs.controller';
import { CanvasModule } from '../canvas/canvas.module';
import { LlmModule } from '../llm/llm.module';


@Module({ imports: [CanvasModule, LlmModule], controllers: [RunsController], providers: [RunsService] })
export class RunsModule {}
