import { Module } from '@nestjs/common';
import { WorkerProcessor } from './worker.processor';
@Module({ providers: [WorkerProcessor] })
export class WorkerModule {}
