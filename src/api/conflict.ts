import { http } from '@/utils/http/axios';
import { Result } from '@/utils/http/types';
import { RequestEnum } from '@/enums/httpEnum';
import { PageRes } from '@/api/models/basic';

export function getList(params) {
  return http.request<Result<PageRes>>({
    url: '/conflict/list',
    method: RequestEnum.GET,
    params,
  });
}
