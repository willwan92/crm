import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { BusinessCenterOutlined } from '@vicons/material';
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
    path: '/consumer',
    name: 'consumer',
    component: Layout,
    meta: {
      sort: 3,
      isRoot: true,
      activeMenu: 'consumer_index',
      icon: renderIcon(BusinessCenterOutlined),
    },
    children: [
      {
        path: 'index',
        name: `consumer_index`,
        meta: {
          title: '我的客户',
          activeMenu: 'consumer_index',
        },
        component: () => import('@/views/consumer/index.vue'),
      },
    ],
  },
];

export default routes;
