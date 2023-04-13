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

export function getDetail(customerId: string) {
  return http.request<Result<PageRes<QueryConsumerRes>>>({
    url: `/customer/detail/${customerId}`,
    method: RequestEnum.GET,
  });
}

export function add(data) {
  return http.request<Result>({
    url: '/customer/add',
    method: RequestEnum.POST,
    data,
  });
}

export function del(customerId: string) {
  return http.request<Result>({
    url: '/customer/delete',
    method: RequestEnum.POST,
    data: {
      customerId,
    },
  });
}

export function update(data) {
  return http.request<Result>({
    url: '/customer/update',
    method: RequestEnum.POST,
    data,
  });
}

export function addFollowUpRecord(data) {
  return http.request<Result>({
    url: '/customer/followUpRecord/add',
    method: RequestEnum.POST,
    data,
  });
}

export function updateFollowUpRecord(data) {
  return http.request<Result>({
    url: '/customer/followUpRecord/update',
    method: RequestEnum.POST,
    data,
  });
}
