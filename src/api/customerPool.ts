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

export function applyPublicCustomers(data) {
  return http.request<Result<PageRes>>({
    url: '/audit/pool/fish/out',
    method: RequestEnum.POST,
    data,
  });
}

export function moveIntoMyCustomers(data) {
  return http.request<Result<PageRes>>({
    url: '/customer/pool/convert/to/customer',
    method: RequestEnum.POST,
    data,
  });
}

export function throwBackPublicCustomers(data) {
  return http.request<Result<PageRes>>({
    url: '/customer/pool/throwback',
    method: RequestEnum.POST,
    data,
  });
}

/**
 * 申请公海池客户审批人选项
 */
export function getAuditAccountList(projectId: string) {
  return http.request<Result>({
    url: '/audit/audit/pool/account/list',
    method: RequestEnum.GET,
    params: {
      projectId,
    },
  });
}
