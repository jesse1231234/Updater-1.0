export type CreateRunDto = {
sisCourseId: string;
prompt: string;
filters?: { moduleIds?: number[]; itemTypes?: ('page'|'assignment'|'discussion')[] };
dpMode?: boolean; // default true
portability?: boolean; // default true
destSisCourseId?: string; // optional
budgetCapUsd?: number; // default 5
};
