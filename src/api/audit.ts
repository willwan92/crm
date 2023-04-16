import { http } from '@/utils/http/axios';
import { Result } from '@/utils/http/types';
import { RequestEnum } from '@/enums/httpEnum';
import { PageRes } from '@/api/models/basic';

/**
 * 升降级申请记录
 * @param params 
 * @returns 
 */
export function getApplyList(params) {
  return http.request<Result<PageRes>>({
    url: '/audit/apply/list',
    method: RequestEnum.GET,
    params: params,
  });
}

/**
 * 待审批记录
 * @param customerId 
 * @param projectId 
 * @returns 
 */
export function getAuditList(customerId: string, projectId: string) {
  return http.request<Result>({
    url: '/audit/audit/list',
    method: RequestEnum.GET,
    params: {
      customerId,
      projectId,
    },
  });
}

/**
 * 审批人选项
 * @param customerId 
 * @param projectId 
 * @returns 
 */
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


export function downgrade(data) {
  return http.request<Result>({
    url: '/audit/downgrade',
    method: RequestEnum.POST,
    data,
  });
}


export function pass(data) {
  return http.request<Result>({
    url: '/audit/audit/pass',
    method: RequestEnum.POST,
    data,
  });
}


export function reject(data) {
  return http.request<Result>({
    url: '/audit/audit/reject',
    method: RequestEnum.POST,
    data,
  });
}
