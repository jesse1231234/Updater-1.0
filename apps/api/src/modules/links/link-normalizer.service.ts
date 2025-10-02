import { load } from 'cheerio';


export function normalizeLinks(html: string, ctx: { courseId: number; baseHost: string }) {
const $ = load(html);
$("a[href^='/courses/']").each((_, el) => {
const href = $(el).attr('href')!;
const m = href.match(/^\/courses\/(\d+)\/(pages|assignments|discussion_topics)\/(.+)$/);
if (m && Number(m[1]) === ctx.courseId) $(el).attr('href', `../${m[2]}/${m[3]}`);
});
$("a[href*='/files/']").each((_, el) => {
const href = $(el).attr('href')!;
const fm = href.match(/\/courses\/(\d+)\/files\/(\d+)/);
if (fm) {
const fid = fm[2];
$(el).addClass('instructure_file_link');
$(el).attr('data-api-endpoint', `/api/v1/courses/${ctx.courseId}/files/${fid}`);
$(el).attr('data-api-returntype', 'File');
}
});
$("iframe[src^='/courses/']").each((_, el) => {
const src = $(el).attr('src')!;
$(el).replaceWith(`<p><em>Embedded Canvas content replaced.</em> <a href="${src}">Open resource</a></p>`);
});
return $.html();
}
