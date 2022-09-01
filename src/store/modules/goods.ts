import axios from '@/assets/js/request';

const BASE_URL = '/goods/v1/'; // 商品微服务公共路径

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
   * @description 查询商品列表
   */
  async queryProductList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('queryProductPage', data);
  },
  /**
   * @description 添加商品
   */
  async addProduct({ commit }: { commit: any }, data: any) {
    return putBaseAxiosFunc('addProduct', data);
  },
  /**
   * @description 修改商品
   */
  async updateProduct({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('updateProduct', data);
  },
  /**
   * @description 查询商品
   */
  async getProduct({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('getProduct', data);
  },
  /**
   * @description 修改商品状态
   */
  async updateProductStatusById({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('updateProductStatusById', data);
  },
  /**
   * @description 班别 查询
   */
  async queryClasses({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('classes', data);
  },
  /**
   * @description 班别 新增
   */
  async postClasses({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('classes', data);
  },
  /**
   * @description 班别 修改
   */
  async putClasses({ commit }: { commit: any }, data: any) {
    return putBaseAxiosFunc('classes', data);
  },
  /**
   * @description 查询全部班别-车型列表
   */
  async queryClassesList({ commit }: { commit: any }) {
    return getBaseAxiosFunc('classes/list');
  },
  /**
   * @description 查询全部班别名称去重
   */
  async queryClassesInfoList({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('classes/infos', data);
  },
  /**
   * @description 查询其他商品列表
   */
  async queryProductExtList({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('productExt', data);
  },
  /**
   * @description 保存其他商品
   */
  async savaProductExtList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('productExt', data);
  },
  /**
   * @description 修改其他商品
   */
  async putProductExtList({ commit }: { commit: any }, data: any) {
    return putBaseAxiosFunc('productExt', data);
  },
  /**
   * @description 基础费用 查询
   */
  async queryFeeList({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('fee', data);
  },
  /**
   * @description 基础费用 新增
   */
  async postFee({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('fee', data);
  },
  /**
   * @description 基础费用 修改
   */
  async putFee({ commit }: { commit: any }, data: any) {
    return putBaseAxiosFunc('fee', data);
  },
  /**
   * @description 考试费用 查询
   */
  async queryExamFeeList({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('examFee', data);
  },
  /**
   * @description 考试费用 新增
   */
  async postExamFee({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('examFee', data);
  },
  /**
   * @description 考试费用 修改
   */
  async putExamFee({ commit }: { commit: any }, data: any) {
    return putBaseAxiosFunc('examFee', data);
  },
  /**
   * @description 根据请求条件获取考试费/补考费/缺考费详情 查询
   */
  async queryExamFeeConditions({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('examFee/conditions', data);
  },
};

export default {
  namespaced: true,
  actions
};
