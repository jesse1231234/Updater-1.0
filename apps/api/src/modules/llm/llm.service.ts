import OpenAI from 'openai';
import { Injectable } from '@nestjs/common';


@Injectable()
export class LlmService {
private client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


async rewriteHtml(model: string, prompt: string, html: string) {
const system = 'You are an HTML rewriter for Canvas LMS. Preserve semantics; no <script> or <style>; keep Canvas shortcodes; DesignPLUS allowed (ensure unique IDs). Output only sanitized HTML.';
const resp = await this.client.responses.create({
model: model || process.env.OPENAI_MODEL || 'gpt-4.1-mini',
input: [
{ role: 'system', content: system },
{ role: 'user', content: prompt },
{ role: 'user', content: `INPUT_HTML:\n<<<${html}>>>` },
],
max_output_tokens: 8000,
});
const out = (resp.output?.[0] as any)?.content?.[0]?.text || '';
return out.trim();
}
}
