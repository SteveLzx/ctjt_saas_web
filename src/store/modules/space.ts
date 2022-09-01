import axios from '@/assets/js/request';

const BASE_URL = '/space/'; // 场所微服务公共路径

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
   * @description 获取训练场
   */
  async queryTrainingPlaceByDrivingSchoolIdList({ commit }: { commit: any }) {
    return getBaseAxiosFunc('v1/getTrainingPlaceByDrivingSchoolId');
  },
  /**
   * @description 查询训练场 分页
   */
  async queryTrainingPlace({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('v1/getTrainingPlace', data);
  },
  /**
   * @description 添加训练场地
   */
  async addTrainingPlace({ commit }: { commit: any }, data: any) {
    return putBaseAxiosFunc('v1/addTrainingPlace', data);
  },
  /**
   * @description 修改训练场地
   */
  async updateTrainingPlace({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('v1/updateTrainingPlace', data);
  },
  /**
   * @description 训练场地列表
   */
  async queryTrainingPlaceList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('v1/queryTrainingPlacePage', data);
  },
  /**
   * @description 添加门店
   */
  async addStore({ commit }: { commit: any }, data: any) {
    return putBaseAxiosFunc('store/v1/addStore', data);
  },
  /**
   * @description 修改门店
   */
  async updateStoreById({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('store/v1/updateStoreById', data);
  },
  /**
   * @description 修改门店营业状态
   */
  async updateStoreBusinessStatusById({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('store/v1/updateStoreBusinessStatusById', data);
  },
  /**
   * @description 门店列表
   */
  async queryStorePageList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('store/v1/queryStorePage', data);
  },
  /**
   * @description 根据id查询门店
   */
  async queryStoreById({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('store/v1/getStoreById', data);
  },
};

export default {
  namespaced: true,
  actions
};
