import { http } from '@/utils/http/axios';

/**
 * @description: 用户登录
 */
export function login(params) {
  return http.request(
    {
      url: '/sys/login',
      method: 'post',
      params,
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 退出登录
 */
export function logoutReq(params) {
  return http.request(
    {
      url: '/sys/logout',
      method: 'post',
      params,
    },
    {
      isTransformResponse: false,
    }
  );
}
