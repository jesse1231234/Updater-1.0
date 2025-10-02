import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class CanvasService {
constructor(private http: HttpService) {}


private authHeaders() { return { Authorization: `Bearer ${process.env.CANVAS_ADMIN_TOKEN}` }; }


async getModulesBySIS(sis: string) {
const url = `/api/v1/courses/sis_course_id:${encodeURIComponent(sis)}/modules`;
// include[]=items, content_details, and paginate as needed
const res = await firstValueFrom(this.http.get(url, { headers: this.authHeaders(), params: { per_page: 100, 'include[]': ['items','content_details'] }}));
return res.data;
}


async getPage(courseId: number, urlOrId: string) { return firstValueFrom(this.http.get(`/api/v1/courses/${courseId}/pages/${urlOrId}`, { headers: this.authHeaders() })); }
async updatePage(courseId: number, urlOrId: string, bodyHtml: string) {
const data = new URLSearchParams();
data.set('wiki_page[body]', bodyHtml);
return firstValueFrom(this.http.put(`/api/v1/courses/${courseId}/pages/${urlOrId}`, data, { headers: this.authHeaders() }));
}
// TODO: add assignments (description) + discussions (message) get/update
}
