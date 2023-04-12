import { http } from '@/utils/http/axios';
import { Result } from '@/utils/http/types';
import { RequestEnum } from '@/enums/httpEnum';
import { QueryRoleRes } from '@/api/models/role';

export function getRoleList() {
  return http.request<Result<QueryRoleRes>>({
    url: '/role/options',
    method: RequestEnum.GET,
  });
}

export function getPositionList() {
  return http.request<Result>({
    url: '/role/position/options',
    method: RequestEnum.GET,
  });
}
