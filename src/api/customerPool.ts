import { http } from '@/utils/http/axios';
import { Result } from '@/utils/http/types';
import { RequestEnum } from '@/enums/httpEnum';
import { PageRes } from '@/api/models/basic';

export function getpublicPoolCustomers(params) {
  return http.request<Result<PageRes>>({
    url: '/customer/pool/publicList',
    method: RequestEnum.GET,
    params,
  });
}

export function getPrivatePoolCustomers(params) {
  return http.request<Result<PageRes>>({
    url: '/customer/pool/privateList',
    method: RequestEnum.GET,
    params,
  });
}
