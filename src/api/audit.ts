import { http } from '@/utils/http/axios';
import { Result } from '@/utils/http/types';
import { RequestEnum } from '@/enums/httpEnum';
import { PageRes } from '@/api/models/basic';
// import { QueryConsumerReq, QueryConsumerRes } from '@/api/models/consumer';

export function getApplyList(params) {
  return http.request<Result<PageRes>>({
    url: '/audit/apply/list',
    method: RequestEnum.GET,
    params: params,
  });
}

export function getAuditAccountList(customerId: string, projectId: string) {
  return http.request<Result>({
    url: '/audit/audit/account/list',
    method: RequestEnum.GET,
    params: {
      customerId,
      projectId,
    },
  });
}

export function upgrade(data) {
  return http.request<Result>({
    url: '/audit/upgrade',
    method: RequestEnum.POST,
    data,
  });
}
