import { RouteConfig, RouteRecord } from 'vue-router';
import { VuexState } from './obj_type';

const getters = {
  visitedViews: (state: VuexState): RouteRecord[] | undefined => state.tagsView.visitedViews,
  cachedViews: (state: VuexState): string[] | undefined => state.tagsView.cachedViews,
  routes: (state: VuexState): RouteConfig[] | undefined => state.routes.routes,
};
export default getters;
