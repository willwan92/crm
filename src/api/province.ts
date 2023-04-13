import { http } from '@/utils/http/axios';
import { Result } from '@/utils/http/types';
import { RequestEnum } from '@/enums/httpEnum';

export function getProvinceList() {
  return http.request<Result>({
    url: '/area/getProvinceList',
    method: RequestEnum.GET,
  });
}

export function getAreaList(parentAreaCode: string) {
  return http.request<Result>({
    url: '/area/list',
    method: RequestEnum.GET,
    params: {
      parentAreaCode,
    },
  });
}
