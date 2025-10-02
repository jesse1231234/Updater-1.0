import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RunsService } from './runs.service';
import { CreateRunDto } from './dto/create-run.dto';


@Controller('runs')
export class RunsController {
constructor(private runs: RunsService) {}


@Post()
create(@Body() dto: CreateRunDto) { return this.runs.create(dto); }


@Post(':id/preview')
preview(@Param('id') id: string) { return this.runs.preview(id); }


@Get(':id')
get(@Param('id') id: string) { return this.runs.get(id); }


@Post(':id/apply')
apply(@Param('id') id: string) { return this.runs.apply(id); }


@Post(':id/migrate')
migrate(@Param('id') id: string) { return this.runs.migrate(id); }
}
