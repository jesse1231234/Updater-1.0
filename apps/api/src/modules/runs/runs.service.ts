import { Injectable } from '@nestjs/common';
import { CreateRunDto } from './dto/create-run.dto';


@Injectable()
export class RunsService {
async create(dto: CreateRunDto) {
// TODO: create Run row, set defaults (dpMode=true, portability=true, budgetCapUsd=5)
return { id: 'run_1', status: 'pending' };
}
async preview(id: string) { return { id, status: 'preview' }; }
async get(id: string) { return { id, status: 'pending', items: [] }; }
async apply(id: string) { return { id, status: 'applying' }; }
async migrate(id: string) { return { id, status: 'migrating' }; }
}
