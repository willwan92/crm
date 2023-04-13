import { http } from '@/utils/http/axios';
import { Result } from '@/utils/http/types';
import { RequestEnum } from '@/enums/httpEnum';
import { PageRes } from '@/api/models/basic';
// import { QueryConsumerReq, QueryConsumerRes } from '@/api/models/consumer';

export function getList(params) {
  return http.request<Result<PageRes>>({
    url: '/cooperate/cooperate/list',
    method: RequestEnum.POST,
    params,
  });
}

export function getProjectAccountList(projectId: string) {
  return http.request<Result>({
    url: '/cooperate/cooperate/account/list',
    method: RequestEnum.GET,
    params: {
      projectId,
    },
  });
}

export function cooperate(data) {
  return http.request<Result>({
    url: '/cooperate/cooperate',
    method: RequestEnum.POST,
    data,
  });
}
