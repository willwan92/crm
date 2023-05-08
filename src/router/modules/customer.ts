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
    path: '/customer',
    name: 'Customer',
    redirect: '/customer/index',
    component: Layout,
    meta: {
      sort: 3,
      title: '我的客户',
      permissions: [
        'COMMISSIONER',
        'MANAGER',
        'CHIEF_INSPECTOR',
        'CENTER_VICE_GENERAL_MANAGER',
        'VICE_PRESIDENT',
        'ADMIN',
      ],
      icon: renderIcon(BusinessCenterOutlined),
    },
    children: [
      {
        path: 'index',
        name: 'customer_index',
        meta: {
          title: '我的客户',
        },
        component: () => import('@/views/customer/index.vue'),
      },
      {
        path: 'customer_detail/:id?',
        name: 'customer_detail',
        meta: {
          title: '客户详情',
          hidden: true,
        },
        component: () => import('@/views/customer/detail.vue'),
      },
    ],
  },
];

export default routes;
