import axios from '@/assets/js/request';

const BASE_URL = '/user/v1/'; // 权限微服务公共路径

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

const actions = {
  /**
   * @description 查询权限列表
   */
  async queryCarInfoByIdNo({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('auth/authTree', { ...data, companyId: localStorage.getItem('user_companyId') || '' });
  },
  /**
   * @description 查询用户角色
   */
  async findRoleList({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('auth/findRoleList', data);
  },
  /**
   * @description 查询所属机构
   */
  async companyList({ commit }: { commit: any }) {
    return getBaseAxiosFunc('group/companyList');
  },
  /**
   * @description 获取角色下面的权限
   */
  async findRoleAuthTree({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('auth/findRoleAuthTree', data);
  },
  /**
   * @description 更新角色下面的权限
   */
  async updateRoleAuth({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('auth/updateRoleAuth', data);
  },
  /**
   * @description 创建或修改权限资源
   */
  async createAndUpdatePermission({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('auth/createAndUpdatePermission ', data);
  },
  /**
   * @description 删除权限资源
   */
  async batchDeletePermission({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('auth/batchDeletePermission ', data);
  }
};

export default {
  namespaced: true,
  actions
};
