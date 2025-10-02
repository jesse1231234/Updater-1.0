export const cfg = {
canvas: {
baseUrl: process.env.CANVAS_BASE_URL!,
token: process.env.CANVAS_ADMIN_TOKEN!,
},
openai: {
apiKey: process.env.OPENAI_API_KEY!,
model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
},
queue: { concurrency: Number(process.env.QUEUE_CONCURRENCY || 5) },
};
