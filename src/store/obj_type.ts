import { RouteRecord, RouteConfig } from 'vue-router';

export type ViewStateData = {
  visitedViews: RouteRecord[],
  cachedViews?: string[],
}

export type AnyObject = {
  [key: string]: any
}

export type ViewRouteRecord = {
  name: string;
  meta: {
    noCache: boolean;
    affix: boolean;
  },
} & RouteRecord

export type RoutesState = {
  routes: Array<RouteConfig>;
  addRoutesFlag: boolean;
  currentParentRoute: RouteConfig;
}

export type VuexState = {
  routes: RoutesState;
  tagsView: ViewStateData;
  base: any
}

export type DictItemData = {
  name: string;
  dictList: { id: number, label: string }[];
}

export type BaseStateData = {
  dictAllData: Map<string, { id: number, label: string }[]>;
  userInfo: AnyObject;
  nodePermission: AnyObject;
}

export type UserStateType = {
  userInfo: AnyObject;
}

export default {};
