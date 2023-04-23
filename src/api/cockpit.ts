import { http } from '@/utils/http/axios';
import { Result } from '@/utils/http/types';
import { RequestEnum } from '@/enums/httpEnum';
import { PageRes } from '@/api/models/basic';

export function getRankingList(params) {
  return http.request<Result<PageRes>>({
    url: '/statistics/ranking/list',
    method: RequestEnum.GET,
    params,
  });
}

export function getCustomerList(params) {
  return http.request<Result<PageRes>>({
    url: '/statistics/index/list',
    method: RequestEnum.GET,
    params,
  });
}
