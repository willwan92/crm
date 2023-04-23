import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { PersonalInjuryOutlined } from '@vicons/material';
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
    path: '/privatePool',
    name: 'privatePool',
    component: Layout,
    meta: {
      sort: 6,
      isRoot: true,
      permissions: ['400', '300'],
      activeMenu: 'privatePool_index',
      icon: renderIcon(PersonalInjuryOutlined),
    },
    children: [
      {
        path: 'index',
        name: 'privatePool_index',
        meta: {
          title: '个人公海池',
          permissions: ['400', '300'],
          activeMenu: 'privatePool_index',
        },
        component: () => import('@/views/privatePool/index.vue'),
      },
    ],
  },
];

export default routes;
