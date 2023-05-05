import { http } from '@/utils/http/axios';
import { Result } from '@/utils/http/types';
import { RequestEnum } from '@/enums/httpEnum';

export function getCustomersQuantityRules() {
  return http.request<Result>({
    url: '/rule/limit/get',
    method: RequestEnum.GET,
  });
}

export function setCustomersQuantityRules(data) {
  return http.request<Result>({
    url: '/rule/limit/save',
    method: RequestEnum.POST,
    data,
  });
}

export function getFallingRules() {
  return http.request<Result>({
    url: '/rule/daysLimit/get',
    method: RequestEnum.GET,
  });
}

export function setFallingRules(data) {
  return http.request<Result>({
    url: '/rule/daysLimit/save',
    method: RequestEnum.POST,
    data,
  });
}

export function getCustomerRules() {
  return http.request<Result>({
    url: '/rule/phoneView/get',
    method: RequestEnum.GET,
  });
}

export function setCustomerRules(params) {
  return http.request<Result>({
    url: '/rule/phoneView/turnSwitch',
    method: RequestEnum.GET,
    params,
  });
}
