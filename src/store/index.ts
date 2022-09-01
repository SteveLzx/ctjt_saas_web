import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import tagsView from './modules/tags_view';
import routes from './modules/routes';
import base from './modules/base';
import user from './modules/user';
import assignment from './modules/assignment';
import goods from './modules/goods';
import workbench from './modules/workbench';
import workflow from './modules/workflow';
import car from './modules/car';
import finance from './modules/finance';
import space from './modules/space';
import order from './modules/order';
import sale from './modules/sale';
import auth from './modules/auth';
import license from './modules/license';

Vue.use(Vuex);

export default new Vuex.Store({
  getters,
  modules: {
    tagsView,
    routes,
    base,
    user,
    assignment,
    goods,
    workbench,
    workflow,
    car,
    finance,
    space,
    order,
    sale,
    auth,
    license,
  },
});
