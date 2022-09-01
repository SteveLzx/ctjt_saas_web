import { RouteRecord } from 'vue-router';
import { ViewStateData, ViewRouteRecord } from '../obj_type';

export interface RouteRecordAndFullPath extends RouteRecord {
  fullPath: string;
}

const stateData: ViewStateData = {
  visitedViews: [], // 标签组件
  cachedViews: [] // 缓存组件
};

const mutations = {
  ADD_VISITED_VIEW: (state: ViewStateData, view: RouteRecordAndFullPath): void => {
    const list: any[] = state.visitedViews.filter(v => v.path === view.path);
    if (list.length > 0) {
      const { 0: data } = list;
      const { path, fullPath } = data;
      if (path === view.path && fullPath === view.fullPath) return;
      if (path === view.path && fullPath !== view.fullPath) {
        // 替换
        state.visitedViews.forEach((item, index) => {
          if (item.path === view.path) {
            state.visitedViews.splice(index, 1, view);
          }
        });
        return;
      }
    }
    // if (state.visitedViews.some((v: RouteRecord) => v.path === view.path && v.fullPath === view.fullPath)) return;
    state.visitedViews.push({ ...view });
  },

  DEL_VISITED_VIEW: (state: ViewStateData, view: RouteRecord): void => {
    state.visitedViews.forEach((item, index) => {
      if (item.path === view.path) {
        state.visitedViews.splice(index, 1);
      }
    });
  },

  RESET_VISITED_VIEW: (state: ViewStateData): void => {
    state.visitedViews = [];
  }
};

const actions = {
  addVisitedView({ commit }: {commit: (type: string, view: RouteRecord) => void}, view: RouteRecord): void {
    commit('ADD_VISITED_VIEW', view);
  },
  delVisitedView({ commit, state }: {commit: (type: string, view: RouteRecord) => void; state: ViewStateData}, view: RouteRecord): Promise<RouteRecord[]> {
    return new Promise(resolve => {
      commit('DEL_VISITED_VIEW', view);
      resolve([...state.visitedViews]);
    });
  },

  updateVisitedView({ commit }: {commit: (type: string, view: RouteRecord) => void}, view: ViewRouteRecord): void {
    commit('UPDATE_VISITED_VIEW', view);
  }
};

export default {
  namespaced: true,
  state: stateData,
  mutations,
  actions
};
