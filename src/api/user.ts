import { http } from '@/utils/http/axios';
import { Result } from '@/utils/http/types';
import { RequestEnum } from '@/enums/httpEnum';
import { PageRes } from '@/api/models/basic';
import { QueryUserReq, UpdateUserStatusReq } from '@/api/models/user';

export function getUserDetail(id) {
  return http.request({
    url: `/account/detail/${id}`,
    method: 'get',
  });
}

export function getUserList(params: QueryUserReq) {
  return http.request<Result<PageRes>>({
    url: '/account/list',
    method: RequestEnum.GET,
    params,
  });
}

export function saveUser(data) {
  return http.request<Result>({
    url: '/account/saveAccountAndAuthorization',
    method: RequestEnum.POST,
    data,
  });
}

export function modifyPwd(data) {
  return http.request<Result>({
    url: '/account/resetPwd',
    method: RequestEnum.POST,
    data,
  });
}

export function deleteUser(userId: string) {
  return http.request<Result>({
    url: '/account/delete',
    method: RequestEnum.GET,
    params: {
      userId,
    },
  });
}

export function updateUserStatus(params: UpdateUserStatusReq) {
  return http.request<Result>({
    url: '/account/slap',
    method: RequestEnum.GET,
    params,
  });
}
