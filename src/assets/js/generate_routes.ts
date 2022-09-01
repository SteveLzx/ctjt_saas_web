import Vue from 'vue';
import { RouteConfig } from 'vue-router';
import asyncRoutes from '@/router/async_routes';
import { deepClone, compare } from '@/assets/js/common';
import AppMain from '@/layout/AppMain.vue';
import Report from '@/views/report/index.vue';
import BasicLayout from '@/layout/Index.vue';

declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
    roles?: Array<number | string>;
    noControl?: boolean;
    remark?: string;
  }
}

type AnyObject = {
  [key: string]: any
}

function mapData(data: AnyObject, obj: AnyObject) {
  const mapObj = obj;
  data.forEach((item: AnyObject) => {
    // action为1则有权限
    if (item.action === 1) {
      // 保存每个节点的ID
      mapObj[item.path] = {
        id: item.id,
        seq: item.seq
      };
      if (item.children) {
        mapData(item.children, mapObj[item.path]);
      }
    }
  });
}

function filterRoute(routes: Array<RouteConfig>, routeMapObj: AnyObject) {
  const accessedRouters = routes.filter(route => {
    const routeCopy = route;
    // 无需控制的路由则直接返回去
    if ((route as any).noControl) {
      routeCopy.children = route.children || [];
      return true;
    }
    // 有路由权限的添加进来
    const routeFromPerm = routeMapObj[route.path];
    const flag = routeFromPerm !== undefined;
    if (flag) {
      (routeCopy as any).seq = routeFromPerm.seq;
      // 保存每个路由节点的id方便每个页面去请求当前页面的按钮权限
      (routeCopy.meta as any).id = routeFromPerm && routeFromPerm.id;
      if (route.children) {
        routeCopy.children = filterRoute(route.children, routeFromPerm);
      }
      return true;
    }
    return false;
  });
  return accessedRouters;
}

let indexFlag = 1;
// 遍历权限路由动态生成数据报表路由
function recursionReport(authRoutes: any, routeMap: AnyObject, key?: number | undefined) {
  const routeList: RouteConfig[] = [];
  authRoutes.forEach((auth: any, index: number) => {
    if (!routeMap[auth.path] && auth.action === 1) {
      const newRoute: RouteConfig = {
        path: auth.path,
        meta: {
          title: auth.name,
          icon: auth.remark.includes('&#') ? auth.remark : '',
          remark: auth.remark,
          isIframe: true,
          hasOpen: false,
          name: `com${indexFlag += 1}`,
          component: Report
        },
        component: key && (auth.remark.includes('http') || !auth.remark) ? Report : AppMain,
        children: []
      };
      if (auth.children) {
        newRoute.children = [...recursionReport(auth.children, routeMap, 1)];
      }
      routeList.push(newRoute);
    }
  });
  return routeList;
}

// 动态生成统计分析菜单的路由
function generateReportRoute(permissionRoute: RouteConfig[]) {
  // 路由和资源权限分别找出统计分析菜单
  const [statisticsRoute] = asyncRoutes.filter((item: RouteConfig) => item.path === '/statistics');
  const [statisticsAuth] = permissionRoute.filter((item: AnyObject) => item.path === '/statistics' && item.action === 1);
  if (!statisticsRoute || !statisticsRoute.children || !statisticsAuth || !statisticsAuth.children) {
    return;
  }
  // 统计分析菜单已经有的路由找出来就不再重复添加
  const routeMap: any = {};
  statisticsRoute.children.forEach(route => {
    routeMap[route.path] = true;
  });
  // 根据资源权限动态生成统计分析菜单里面没有的路由
  const newRouteList = recursionReport(statisticsAuth.children, routeMap);
  statisticsRoute.children = [...statisticsRoute.children, ...newRouteList];
}

// 动态生成智能教练端的菜单路由
function generateCoachRoute(permissionRoute: RouteConfig[]) {
  const routeAuthList = permissionRoute.filter((item: AnyObject) => item.path.includes('coach_system') && item.action === 1);
  function recursionCoathRoute(children: RouteConfig[]) {
    children.forEach((child: AnyObject) => {
      const copyChild = child;
      copyChild.meta = {
        icon: child.remark,
        title: child.name
      };
      if (child.children) recursionCoathRoute(child.children);
    });
  }
  routeAuthList.forEach((route: AnyObject) => {
    const copyRoute = route;
    copyRoute.component = BasicLayout;
    copyRoute.meta = {
      title: route.name
    };
    if (route.children) recursionCoathRoute(route.children);
  });
  return routeAuthList;
}

export default function filterAsyncRoutes(permissionRoute: RouteConfig[]) {
  const routeMap: AnyObject = {};
  // 将用户所拥有的权限做映射，方便遍历路由
  mapData(permissionRoute, routeMap);

  // 根据权限资源动态生成数据报表路由
  generateReportRoute(permissionRoute);

  // 动态生成智能教练菜单路由
  const coachRoute = generateCoachRoute(permissionRoute);

  // 根据权限资源生成具有权限的路由
  const routes = filterRoute(deepClone(asyncRoutes), routeMap);

  return routes.concat(coachRoute).sort(compare('seq'));
}
