import axios from '@/assets/js/request';
import { UserStateType, AnyObject } from '../obj_type';

const BASE_URL = '/user/v1/'; // 用户公共路径

const postBaseAxiosFunc = (url: string, data?: any) => new Promise((resolve, reject) => {
  axios.post(`${BASE_URL}${url}`, data).then((res: any) => {
    resolve(res);
  }).catch((err) => {
    reject(err);
  });
});

const getBaseAxiosFunc = (url: string, data?: any) => new Promise((resolve, reject) => {
  axios.get(`${BASE_URL}${url}`, { params: { ...data } }).then((res: any) => {
    resolve(res);
  }).catch((err) => {
    reject(err);
  });
});

const putBaseAxiosFunc = (url: string, data?: any) => new Promise((resolve, reject) => {
  axios.put(`${BASE_URL}${url}`, data).then((res: any) => {
    resolve(res);
  }).catch((err) => {
    reject(err);
  });
});

const stateData = {
  userInfo: {}
};
const mutations = {
  UPDATE_USERINFO: (state: UserStateType, userInfo: AnyObject): void => {
    state.userInfo = userInfo;
  },
  CLEAE_USERINFO: (state: UserStateType): void => {
    state.userInfo = {};
  },
};

const actions = {
  /**
   * @description 根据片区、姓名、手机号码查询教练信息（分页）
   */
  async queryUserCoachList({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('coach/list', data);
  },
  /**
   * @description 客服-分页查询
   */
  async queryCustomerList({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('customer/queryCustomer', data);
  },
  /**
   * @description 客服-客服信息详情查询
   */
  async queryUserCustomerDetail({ commit }: { commit: any }, data?: any) {
    return getBaseAxiosFunc('customer/queryUserCustomerDetail', data);
  },
  /**
   * @description 根据客服查询当前驾校下所有的教练
   */
  async queryCoachDetailByCustomer({ commit }: { commit: any }, data?: any) {
    return getBaseAxiosFunc('coach/queryCoachDetailByCustomer', data);
  },
  /**
   * @description 根据当前用查询该驾校下教练和客服
   */
  async queryReferrerInfo({ commit }: { commit: any }, data?: any) {
    return getBaseAxiosFunc('info/queryReferrerInfo', data);
  },
  /**
   * @description 密码登录
   */
  async postPwLogin({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('user/pwLogin', data);
  },
  /**
   * @description 密码登录
   */
  async updatePassword({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('user/updatePassword', data);
  },
  /**
   * @description 验证码登录
   */
  async postCptchaLogin({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('user/cptchaLogin', data);
  },
  /**
   * @description 查询系统用户
   */
  async findUserGroupRoleInfo({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('auth/findUserGroupRoleInfo', data);
  },
  /**
   * @description 查询散学详情跟踪人
   */
  async queryGroupUserList({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('group/queryUserList', data);
  },
  /**
   * @description 查询当前驾校下面所有片区门店
   */
  async queryGroupList({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('group/queryGroupBySchoolId', data);
  },
  /**
   * @description 查询当前驾校所有用户
   */
  async queryCompanyUsers({ commit }: { commit: any }) {
    return getBaseAxiosFunc('group/queryCompanyUsers');
  },
  /**
   * @description 获取小程序二维码
   */
  async queryWeChatQRCode({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('wechat/queryWeChatQRCode', data);
  }
};
export default {
  namespaced: true,
  state: stateData,
  mutations,
  actions
};
