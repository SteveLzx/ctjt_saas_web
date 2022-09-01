import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

export const constantRoutes: Array<RouteConfig> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/layout/Login.vue'),
    meta: {
      title: '登录',
      menuHide: true
    }
  },
];

export default new VueRouter({
  mode: 'history',
  routes: constantRoutes
});
