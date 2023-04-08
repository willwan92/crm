import { http } from '@/utils/http/axios';
import { Result } from '@/utils/http/types';
import { RequestEnum } from '@/enums/httpEnum';
import { PageRes } from '@/api/models/basic';
import { QueryConsumerReq, QueryConsumerRes } from '@/api/models/consumer';

export function getList(params: QueryConsumerReq) {
  return http.request<Result<PageRes<QueryConsumerRes>>>({
    url: '/customer/list',
    method: RequestEnum.GET,
    params,
  });
}

export function add(data) {
  return http.request<Result>({
    url: '/customer/add',
    method: RequestEnum.POST,
    data,
  });
}
