import { http } from '@/utils/http/axios';
import { Result } from '@/utils/http/types';
import { RequestEnum } from '@/enums/httpEnum';

export function getResourceList(params) {
  return http.request<Result>({
    url: '/resource/list',
    method: RequestEnum.GET,
    params,
  });
}

export function addResource(data) {
  return http.request<Result>({
    url: '/resource/add',
    method: RequestEnum.POST,
    data,
  });
}

export function deleteResource(resourceId: string) {
  return http.request<Result>({
    url: `/resource/delete?resourceId=${resourceId}`,
    method: RequestEnum.POST,
  });
}
