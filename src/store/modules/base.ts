import axios from '@/assets/js/request';
import { setDictMapData } from '@/assets/js/common';
import { BaseStateData, DictItemData, AnyObject } from '../obj_type';
// 基础数据
const stateData: BaseStateData = {
  dictAllData: new Map(), // 字典表数据
  userInfo: {}, // 当前登录用户所在驾校信息
  nodePermission: {}, // 页面元素权限
};

const mutations = {
  ADD_DICT_ALL_DATA: (state: BaseStateData, list: DictItemData[]): void => {
    // 把数组处理成Map对象。
    const dictMapObj = setDictMapData(list);
    // 接口返回的数据处理后合并到state中
    dictMapObj.forEach((value, key) => {
      state.dictAllData.set(key, value);
    });
  },
  ADD_USER_INFO: (state: BaseStateData, params: AnyObject): void => {
    state.userInfo = params;
  },
  ADD_NODE_PERMISSION: (state: BaseStateData, params: AnyObject): void => {
    state.nodePermission = params;
  }
};

const actions = {
  /**
   * 判断需要的下拉框选项，查询到没有的则请求接口添加
   * @param { Array } names 需要查询的字典名称
   * @returns { Array } 查询到数据添加到state里面，异步获取state里面的数据即可
   */
  async addDictAllData({ commit, state }: {
    commit: (type: string, names: string[]) => void,
    state: BaseStateData
  }, names: string[]) {
    return new Promise((resolve) => {
      // 先判断，本地字典数据列表里面是否有需要的全部数据
      const { dictAllData } = state;
      const _lackList: string[] = []; // 缺少的数组
      names.forEach(item => {
        if (!dictAllData.has(item)) {
          _lackList.push(item);
        }
      });
      if (_lackList.length <= 0) {
        resolve('');
        return;
      }
      // 判断如果缺少的数组长度为0，则本地数据已经有了要查询的所有数据，则不请求接口，直接返回
      axios.post('/base/v1/dict/getDict', { names: _lackList }).then((res: any) => {
        commit('ADD_DICT_ALL_DATA', res);
        resolve('');
      });
    });
  },
  /**
   * @description 请求组织机构下拉框数据
   */
  async queryGroupMechanismData({ commit }: { commit: (type: string) => void }, data: any) {
    return new Promise((resolve) => {
      const organizeJson = require('@/assets/json/organize.json');
      const { pathname } = window.location;
      // 如果在json数组里面，isAuth传1,否则传0
      const { pid = '0', isAuth } = data;
      const oIsAuth = organizeJson.includes(pathname) ? 1 : 0;
      const _isAuth = isAuth !== undefined ? isAuth : oIsAuth;
      axios.get(`/user/v1/organize?pid=${pid}&isAuth=${_isAuth}`, { canRepeat: true } as any).then((res: any) => {
        resolve(res);
      });
    });
  },
  /**
   * @description 请求当前登录用户是在那个驾校下面
   */
  async queryUserInfo({ commit, state }: { commit: (type: string, params: AnyObject) => void, state: BaseStateData }) {
    return new Promise((resolve) => {
      const { drivingSchoolId } = state.userInfo;
      if (drivingSchoolId > 0) {
        resolve('');
        return;
      }
      axios.get('/user/v1/info/user').then((res: any) => {
        commit('ADD_USER_INFO', res);
        resolve('');
      });
    });
  }
};

export default {
  namespaced: true,
  state: stateData,
  mutations,
  actions
};
