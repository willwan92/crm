import { http } from '@/utils/http/axios';
import { RequestEnum } from '@/enums/httpEnum';

/**
 * @description: 用户登录
 */
export function login(data) {
  return http.request({
    url: '/sys/login',
    method: RequestEnum.POST,
    data,
  });
}

/**
 * @description: 退出登录
 */
export function logout() {
  return http.request({
    url: '/sys/logout',
    method: RequestEnum.POST,
  });
}
