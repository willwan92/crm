import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { SpaceDashboardOutlined } from '@vicons/material';
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
    path: '/cockpit',
    name: 'cockpit',
    component: Layout,
    meta: {
      sort: -1,
      isRoot: true,
      permissions: ['500', '200', '100'],
      activeMenu: 'cockpit_index',
      icon: renderIcon(SpaceDashboardOutlined),
    },
    children: [
      {
        path: 'index',
        name: 'cockpit_index',
        meta: {
          title: '驾驶舱',
          permissions: ['500', '200', '100'],
          activeMenu: 'cockpit_index',
        },
        component: () => import('@/views/cockpit/index.vue'),
      },
    ],
  },
];

export default routes;
