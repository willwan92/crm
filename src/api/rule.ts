import { http } from '@/utils/http/axios';
import { Result } from '@/utils/http/types';
import { RequestEnum } from '@/enums/httpEnum';

export function getCustomersQuantityRules(params) {
  return http.request<Result>({
    url: '/rule/limit/get',
    method: RequestEnum.GET,
    params,
  });
}

export function setCustomersQuantityRules(data) {
  return http.request<Result>({
    url: '/rule/limit/save',
    method: RequestEnum.POST,
    data,
  });
}
