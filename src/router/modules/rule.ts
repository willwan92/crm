import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { SettingOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

/**
 * @param name 路由名称, 必须设置,且不能重名
 * @param meta 路由元信息（路由附带扩展信息）
 * @param redirect 重定向地址, 访问这个路由时,自定进行重定向
 * @param meta.disabled 禁用整个菜单
 * @param meta.title 菜单名称
 * @param meta.icon 菜单图标
 * @param meta.permissions 有权限的角色
 * @param meta.keepAlive 缓存该路由
 * @param meta.sort 排序越小越排前
 * */
const routes: Array<RouteRecordRaw> = [
  {
    path: '/rule',
    name: 'rule',
    component: Layout,
    meta: {
      sort: 7,
      permissions: ['CENTER_VICE_GENERAL_MANAGER', 'VICE_PRESIDENT', 'ADMIN'],
      activeMenu: 'rule_index',
      icon: renderIcon(SettingOutlined),
    },
    children: [
      {
        path: 'index',
        name: 'rule_index',
        meta: {
          title: '规则设置',
          permissions: ['CENTER_VICE_GENERAL_MANAGER', 'VICE_PRESIDENT', 'ADMIN'],
          activeMenu: 'rule_index',
        },
        component: () => import('@/views/rule/index.vue'),
      },
    ],
  },
];

export default routes;
