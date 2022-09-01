import { RouteConfig } from 'vue-router';
import { constantRoutes } from '@/router/index';
import { RoutesState } from '../obj_type';

const stateData = {
  routes: [],
  addRoutesFlag: false,
  currentParentRoute: {}
};
const mutations = {
  UPDATE_ROUTES: (state: RoutesState, viewList: Array<RouteConfig>): void => {
    state.routes = viewList;
  },
  CLEAE_ROUTES: (state: RoutesState): void => {
    state.routes = constantRoutes;
  },
  UPDATE_ADD_ROUTES: (state: RoutesState, flag: boolean): void => {
    state.addRoutesFlag = flag;
  },
  UPDATE_CURRENT_ROUTE: (state: RoutesState, route: RouteConfig): void => {
    state.currentParentRoute = route;
  }
};

export default {
  namespaced: true,
  state: stateData,
  mutations
};
