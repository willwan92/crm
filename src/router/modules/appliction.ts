import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { FileTextOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/application',
    name: 'application',
    component: Layout,
    meta: {
      sort: 5,
      isRoot: true,
      permissions: [
        'COMMISSIONER',
        'MANAGER',
        'CHIEF_INSPECTOR',
        'CENTER_VICE_GENERAL_MANAGER',
        'VICE_PRESIDENT',
        'ADMIN',
      ],
      activeMenu: 'application_index',
      icon: renderIcon(FileTextOutlined),
    },
    children: [
      {
        path: 'index',
        name: `application_index`,
        meta: {
          title: '申请记录',
          permissions: [
            'COMMISSIONER',
            'MANAGER',
            'CHIEF_INSPECTOR',
            'CENTER_VICE_GENERAL_MANAGER',
            'VICE_PRESIDENT',
            'ADMIN',
          ],
          activeMenu: 'application_index',
        },
        component: () => import('@/views/application/index.vue'),
      },
    ],
  },
];

export default routes;
