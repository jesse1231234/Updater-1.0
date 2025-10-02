import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CanvasService } from './canvas.service';


@Module({ imports: [HttpModule], providers: [CanvasService], exports: [CanvasService] })
export class CanvasModule {}
