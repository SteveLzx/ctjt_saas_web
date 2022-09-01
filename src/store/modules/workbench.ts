import axios from '@/assets/js/request';

// const BASE_URL = '/workbench/v1/'; // 用户公共路径

const actions = {
  /**
   * @description 获取待审批
   * @returns { object } 返回列表
   */
  async queryCoachChangeList({ commit }: { commit: any }, data: any) {
    return new Promise((resolve, reject) => {
      axios.post('/assignment/v1/coachChange/page', data).then((res: any) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  /**
   * @description 根据ID获取变更信息
   * @returns { object } 返回对象
   */
  async queryCoachVerifyCoachChange({ commit }: { commit: any }, data: any) {
    return new Promise((resolve, reject) => {
      axios.get('/assignment/v1/coachChange/getVerifyCoachChange', { params: { ...data } }).then((res: any) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  /**
   * @description 教练信息新增审核操作(是否通过)
   * @returns { object } 返回对象
   */
  async addCoachVerifyOperation({ commit }: { commit: any }, data: any) {
    return new Promise((resolve, reject) => {
      axios.post('/assignment/v1/coachChange/addCoachVerifyOperation', data).then((res: any) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  /**
   * @description 教练信息修改审核操作(是否通过)
   * @returns { object } 返回对象
   */
  async updateCoachVerifyOperation({ commit }: { commit: any }, data: any) {
    return new Promise((resolve, reject) => {
      axios.post('/assignment/v1/coachChange/updateCoachVerifyOperation', data).then((res: any) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      });
    });
  },
};

export default {
  namespaced: true,
  actions
};
