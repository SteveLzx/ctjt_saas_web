import axios from '@/assets/js/request';

const BASE_URL = '/sale/v1/'; // 营销微服务公共路径

const postBaseAxiosFunc = (url: string, data?: any, config?: any) => new Promise((resolve, reject) => {
  axios.post(`${BASE_URL}${url}`, data, config).then((res: any) => {
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
   * @description 获知渠道 查询列表
   */
  async querySourceList({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('source/querySourcePage', data);
  },
  /**
   * @description 获知渠道 下拉列表
   */
  async querySourceDropDownBoxList({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('source/querySourceDropDownBox', data);
  },
  /**
   * @description 获知渠道 添加
   */
  async addSource({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('source/createSource', data);
  },
  /**
   * @description 获知渠道 修改
   */
  async modifySource({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('source/modifySource', data);
  },
  /**
   * @description 获知渠道 修改状态
   */
  async updateSourceStatusById({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('source/updateSourceStatusById', data);
  },
  /**
   * @description 营销渠道 查询列表
   */
  async queryMarketList({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('market/queryMarketList', data);
  },
  /**
   * @description 营销渠道 添加
   */
  async addMarket({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('market/createMarket', data);
  },
  /**
   * @description 营销渠道 修改
   */
  async modifyMarket({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('market/modifyMarket', data);
  },
  /**
   * @description 营销渠道 修改状态
   */
  async updateMarketStatusById({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('market/updateMarketStatusById', data);
  },
  /**
   * @description 营销渠道 查询下拉选择框
   */
  async queryMarketListDropDownBoxList({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('market/queryMarketListDropDownBox', data);
  },
  /**
   * @description 营销活动 查询列表
   */
  async queryActivityPageList({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('activity/queryActivityPage', data);
  },
  /**
   * @description 营销活动 查询门店活动 查询下拉选择框
   */
  async queryActivityList({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('activity/queryActivityList', data);
  },
  /**
   * @description 营销活动 查询该驾校下的所有片区门店
   */
  async queryCreateActivityList({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('activity/queryCreateActivity', data);
  },
  /**
   * @description 营销活动 查询活动详情
   */
  async queryModifyActivityList({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('activity/queryModifyActivity', data);
  },
  /**
   * @description 营销活动 添加
   */
  async saveCreateActivity({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('activity/saveCreateActivity', data);
  },
  /**
   * @description 营销活动 修改
   */
  async saveModifyActivity({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('activity/saveModifyActivity', data);
  },
  /**
   * @description 营销活动 查询下拉选择框
   */
  async queryActivityDropDownBoxList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('activity/queryActivityDropDownBox', data);
  },
  /**
   * @description 营销活动 初学赠送陪驾学时-分页查询
   */
  async queryClassHoursList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('classHours/queryClassHoursList', data);
  },
  /**
   * @description 营销活动 初学赠送陪驾学时-添加学时
   */
  async createClassHours({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('classHours/createClassHours', data);
  },
  /**
   * @description 营销活动 初学赠送陪驾学时-停用/启用
   */
  async updateClassHoursStatus({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('classHours/updateStatus', data);
  },
  /**
   * @description 营销活动 初学赠送陪驾学时-删除
   */
  async deleteClassHoursData({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('classHours/deleteData', data);
  },
  /**
  * @description 营销活动 礼品-分页查询
  */
  async queryGiftList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('giftStick/queryList', data);
  },
  /**
  * @description 营销活动 礼品-新增
  */
  async batchAddGift({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('giftStick/batchAdd', data);
  },
  /**
  * @description 营销活动 礼品-编辑
  */
  async updateGift({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('giftStick/update', data);
  },
  /**
  * @description 营销活动 礼品-停用/启用
  */
  async updateGiftStatus({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('giftStick/updateStatus', data);
  },
  /**
  * @description 查询赠送学时下拉框
  */
  async queryClassHoursDropDownBox({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('classHours/queryClassHoursDropDownBox', data);
  },
  /**
  * @description 查询礼品列表下拉框
  */
  async queryGiftStickDropDownBox({ commit }: { commit: any }) {
    return getBaseAxiosFunc('giftStick/list');
  },
  /**
  * @description 添加服务站
  */
  async addServiceStation({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('serviceStation/createServiceStation', data);
  },
  /**
  * @description 编辑服务站
  */
  async modifyServiceStation({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('serviceStation/modifyServiceStation', data);
  },
  /**
  * @description 查询服务站列表下拉框
  */
  async queryServiceStationOpts({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('serviceStation/queryServiceStationList', data);
  },
  /**
  * @description 查询服务站列表列表
  */
  async queryServiceStation({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('serviceStation/queryServiceStationPage', data);
  },
  /**
  * @description 修改服务站状态
  */
  async updateServiceStationStatus({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('serviceStation/updateStatus', data);
  },
  /**
  * @description 查询驾校下片区和门店
  */
  async queryRegionAndStore({ commit }: { commit: any }) {
    return getBaseAxiosFunc('tweet/queryRegionAndStore');
  },
  /**
  * @description 添加推文信息
  */
  async addTweet({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('tweet/addTweet', data);
  },
  /**
  * @description 修改推文信息
  */
  async updateTweet({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('tweet/updateTweet', data);
  },
  /**
  * @description 修改推文状态
  */
  async updateTweetStatus({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('tweet/updateTweetStatus', data);
  },
  /**
  * @description 删除推文信息
  */
  async deleteTweet({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('tweet/deleteTweet', data);
  },
  /**
  * @description 查询推文信息分页
  */
  async queryTweetPage({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('tweet/queryTweetPage', data);
  },
  /**
  * @description 推文id查询详情
  */
  async queryTweetById({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('tweet/queryTweetDetail', data);
  },
  /**
  * @description 查询海报分页
  */
  async queryPosterPage({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('poster/queryPosterList', data, { canRepeat: true });
  },
  /**
  * @description 添加海报信息
  */
  async addPoster({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('poster/savePoster', data);
  },
  /**
  * @description 修改海报信息
  */
  async updatePoster({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('poster/updatePosterById', data);
  },
  /**
  * @description 修改海报状态
  */
  async updatePosterStatus({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('poster/updatePosterStateById', data);
  },
  /**
  * @description 海报id查询详情
  */
  async queryPosterById({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('poster/getPosterById', data);
  },
};

export default {
  namespaced: true,
  actions
};
