import { defineStore } from 'pinia';
import { store } from '@/store';
import { ACCESS_TOKEN, CURRENT_USER, IS_LOCKSCREEN } from '@/store/mutation-types';

import { login, logout } from '@/api/auth';
import { getUserDetail, getUserList } from '@/api/user';
import { storage } from '@/utils/Storage';

export interface IUserState {
  token: string;
  username: string;
  permissions: any[];
  info: any;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): IUserState => ({
    token: storage.get(ACCESS_TOKEN, ''),
    username: '',
    permissions: [],
    info: storage.get(CURRENT_USER, {}),
  }),
  getters: {
    getToken(): string {
      return this.token;
    },
    getNickname(): string {
      return this.username;
    },
    getPermissions(): [any][] {
      return this.permissions;
    },
    getUserInfo(): object {
      return this.info;
    },
  },
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    setPermissions(permissions) {
      this.permissions = permissions;
    },
    setUserInfo(info) {
      this.info = info;
      storage.set(CURRENT_USER, info);
    },
    //获取用户列表
    async getUserList() {
      try {
        const response = await getUserList({});
        return Promise.resolve(response);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    // 登录
    async login(userInfo) {
      try {
        const result = await login(userInfo);
        storage.removeCookie('token');
        storage.set(ACCESS_TOKEN, result.token);
        storage.set(IS_LOCKSCREEN, false);
        this.setToken(result.token);
        this.setUserInfo(result.accountInfo);
        this.GetInfo(result.accountInfo.id);
      } catch (e) {
        return Promise.reject(e);
      }
    },

    // 获取用户信息
    GetInfo(id) {
      return new Promise((resolve, reject) => {
        getUserDetail(id)
          .then((res) => {
            this.setUserInfo(res);
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 登出
    async logout() {
      await logout();
      this.setPermissions([]);
      this.setUserInfo({});
      storage.removeCookie('token');
      storage.remove(ACCESS_TOKEN);
      storage.remove(CURRENT_USER);
      return Promise.resolve('');
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWidthOut() {
  return useUserStore(store);
}
