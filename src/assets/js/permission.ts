import VueRouter, { RouteConfig, RouterOptions } from 'vue-router';
import router, { constantRoutes } from '@/router/index';
import store from '@/store/index';
import getPageTitle from './get_page_title';
import { getToken } from './token_cookie';
import filterAsyncRoutes from './generate_routes';

declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
    menuHide?: boolean;
    remark?: string;
  }
}

const whiteList: string[] = ['/login']; // 权限白名单

router.beforeEach(async (to, from, next) => {
  document.title = getPageTitle((to.meta as any).title);
  const userToken = getToken();
  if (userToken) {
    if (!store.state.routes.addRoutesFlag) { // 只添加一次
      // 查询用户权限，id=1为最高层级
      // "type":必传 查询截止类型，1:系统 -> 2:菜单 -> 3:页面 -> 4:按钮
      const permissionRoute = await store.dispatch('auth/queryCarInfoByIdNo', { id: '1', type: 3 });
      const routes: Array<RouteConfig> = filterAsyncRoutes((permissionRoute && (permissionRoute as any).children) || []);
      store.commit('base/ADD_USER_INFO', {}); // 先置空，然后调用获取用户信息函数
      await store.dispatch('base/queryUserInfo');
      // 添加默认路由
      routes.push({
        path: '/:catchAll(.*)',
        redirect: '/workbench/home',
        meta: {
          menuHide: true
        }
      });
      const _routers = new VueRouter({
        routes: constantRoutes
      });
      (router as any).matcher = (_routers as any).matcher;
      router.addRoutes(routes);
      const newRoutes = (((router as VueRouter).options as RouterOptions).routes as Array<RouteConfig>).concat(routes);
      store.commit('routes/UPDATE_ROUTES', newRoutes);
      store.commit('routes/UPDATE_ADD_ROUTES', true);
      const {
        path,
        name = '',
        hash,
        query,
        params
      } = to;
      next({
        path,
        name: name || undefined,
        hash,
        query,
        params,
        replace: true
      });
    }
    if (to.path === '/login') { // 有登录进入默认页面
      next({ path: '/workbench/home' });
      return;
    }
    next();
  } else if (whiteList.includes(to.path)) { // 白名单页面直接跳转
    next();
  } else { // 跳转登录页面
    store.commit('routes/UPDATE_ADD_ROUTES', false);
    next(`/login?redirect=${to.path}`);
  }
});
