// 设置
import BasicLayout from '@/layout/Index.vue';

export default {
  path: '/settings',
  name: 'settings',
  redirect: '/settings/role',
  component: BasicLayout,
  meta: {
    title: '设置'
  },
  children: [
    {
      path: 'user',
      name: 'SettingsUserList',
      meta: {
        title: '用户管理',
        icon: '&#xe67e;',
        notKeepAlive: true
      },
      component: () => import('../views/settings/user/list.vue'),
    },
    {
      path: 'role',
      name: 'SettingsRole',
      meta: {
        title: '角色管理',
        icon: '&#xe67c;',
        notKeepAlive: true
      },
      component: () => import('../views/settings/role/list.vue'),
    },
    {
      path: 'role/detail',
      name: 'SettingsRoleDetail',
      meta: {
        title: '角色详情',
        menuHide: true,
        notKeepAlive: true
      },
      component: () => import('../views/settings/role/detail.vue'),
    },
    {
      path: 'resource',
      name: 'SettingsResource',
      meta: {
        title: '资源管理',
        icon: '&#xe687;',
        notKeepAlive: true
      },
      component: () => import('../views/settings/resource/index.vue'),
    },
  ]
};
