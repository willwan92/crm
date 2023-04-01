import { http } from '@/utils/http/axios';
import { Result } from '@/utils/http/types';
import { RequestEnum } from '@/enums/httpEnum';
import { QueryRolwRes } from '@/api/models/role';

export function getRoleList() {
  return http.request<Result<QueryRolwRes>>(
    {
      url: '/role/options',
      method: RequestEnum.GET,
    }
  );
}

