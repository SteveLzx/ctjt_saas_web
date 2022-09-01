import axios from '@/assets/js/request';

const BASE_URL = '/car/v1/'; // 车务微服务公共路径

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
   * @description 通过证件号获取车辆信息
   */
  async queryCarInfoByIdNo({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('getCarInfoByIdNo', data);
  },
  /**
   * @description 查询车辆品牌
   */
  async queryAllCarBrand({ commit }: { commit: any }) {
    return getBaseAxiosFunc('sysCodeList/queryAllCarBrand');
  },
  /**
   * @description 查询车辆使用性质
   */
  async queryAllUseProperties({ commit }: { commit: any }) {
    return getBaseAxiosFunc('sysCodeList/queryAllUseProperties');
  },
  /**
   * @description 查询使用机构下拉框
   */
  async queryOrganizationTree({ commit }: { commit: any }) {
    return getBaseAxiosFunc('sysCodeList/queryOrganizationTree');
  },
  /**
   * @description 根据参数查询车辆列表数据
   */
  async queryCarList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('queryCarListPage', data);
  },
  /**
   * @description 车辆停用
   */
  async deleteCarBaseInfo({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('deleteCarBaseInfo', data);
  },
  /**
   * @description 查询详情中所有select 下拉框-基本信息数据
   */
  async queryBaseInformation({ commit }: { commit: any }) {
    return getBaseAxiosFunc('sysCodeList/queryBaseInformation');
  },
  /**
   * @description 查询详情中所有select 下拉框 -使用信息和登记信息数据
   */
  async queryUseRegisterInformation({ commit }: { commit: any }) {
    return getBaseAxiosFunc('sysCodeList/queryUseRegisterInformation');
  },
  /**
   * @description 根据carId获取车辆详情信息
   */
  async getCarBaseInfoDetail({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('getCarBaseInfoDetail', data);
  },
  /**
   * @description 根据名字获取使用人模糊查询
   */
  async findUserInfo({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('sysCodeList/findUser', data);
  },
  /**
   * @description 新增和修改车辆信息
   */
  async saveOrUpdateOneCar({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('saveOrUpdateOneCar', data);
  },
  /**
   * @description 所属权/使用机构设置查询
   */
  async queryOrganizationList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('sysCodeList/queryOrganization', data);
  },
  /**
   * @description 登记机关查询
   */
  async queryRegistrationAuthorityList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('sysCodeList/queryRegistrationAuthority', data);
  },
  /**
   * @description 查询车辆使用性质列表
   */
  async queryCarUsePropertiesList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('sysCodeList/queryCarUseProperties', data);
  },
  /**
   * @description 查询使用性质车辆详情
   */
  async queryCarUsePropertiesDetail({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('sysCodeList/queryCarUseProperties', data);
  },
  /**
   * @description 查询车辆品牌设置列表
   */
  async queryCarBrandManageList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('sysCodeList/queryCarBrandManage', data);
  },
  /**
   * @description 根据品牌id查询车辆列表
   */
  async queryCarBrandInfoList({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('sysCodeList/queryCarBrandInfo', data);
  },
  /**
   * @description 查询车身颜色列表
   */
  async queryCarColorList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('sysCodeList/queryCarColor', data);
  },
  /**
   * @description 保险信息管理查询
   */
  async queryInsuranceInfoList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('sysCodeList/queryInsuranceInfo', data);
  },
  /**
   * @description 停车点管理查询
   */
  async queryParkingManagerList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('parkingManager/queryList', data);
  },
  /**
   * @description 新增或者修改停车点
   */
  async saveOrUpdateParkingManager({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('parkingManager/saveOrUpdate', data);
  },
  /**
   * @description 根据ID删除当前停车点
   */
  async deleteByIdParkingManager({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc(`parkingManager/deleteById?ids=${data.join(',')}`);
  },
  /**
   * @description 油卡列表查询
   */
  async queryOilCardList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('oilCard/queryOilCardList', data);
  },
  /**
   * @description 根据油卡油卡卡号获取对应的车辆
   */
  async queryOilCardCarList({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('oilCard/findOilCardCar', data);
  },
  /**
   * @description 根据片区id获取主卡号信息
   */
  async queryMainCardListByAreaId({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('oilCard/getMainCardListByAreaId', data);
  },
  /**
   * @description 新增或者修改油卡
   */
  async saveOrUpdateOilCard({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('oilCard/saveOrUpdateOilCard', data);
  },
  /**
   * @description 删除油卡信息
   */
  async deleteCards({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('oilCard/delCards', data);
  },
  /**
   * @description 年审记录列表查询
   */
  async queryAnnualVerificationList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('annualVerification/queryList', data);
  },
  /**
   * @description 新增或者修改年审记录
   */
  async saveOrUpdateVerificationList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('annualVerification/saveOrUpdate', data);
  },
  /**
   * @description 根据id删除年审数据
   */
  async deleteByIdVerificationList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc(`annualVerification/deleteById?ids=${data.join(',')}`);
  },
  /**
   * @description 业务预警列表数据查询
   */
  async queryEarlyWarningList({ commit }: { commit: any }) {
    return getBaseAxiosFunc('earlyWarning/queryList');
  },
  /**
   * @description 新增或修改业务预警数据
   */
  async saveOrUpdateEarlyWarning({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('earlyWarning/saveOrUpdateEarlyWarning', data);
  },
  /**
   * @description 查询车辆调动列表
   */
  async queryTransferApplyList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('transferApply/queryList', data);
  },
  /**
   * @description 根据id获取车辆调动详情
   */
  async queryTransferApplyById({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('transferApply/getTransferApplyById', data);
  },
  /**
   * @description 新增车辆调动申请
   */
  async saveTransferApply({ commit }: { commit: any }, data: any) {
    return putBaseAxiosFunc('transferApply/addTransferApply', data);
  },
  /**
   * @description 撤销审核
   */
  async backOutApproveTransferApply({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc(`transferApply/backOutApprove?id=${data.id}`);
  },
  /**
   * @description 审核不通过
   */
  async noPassApproveTransferApply({ commit }: { commit: any }, data: any) {
    const { id, verifyOpinion } = data;
    return postBaseAxiosFunc(`transferApply/noPassApprove?id=${id}&verifyOpinion=${verifyOpinion}`);
  },
  /**
   * @description 审核通过(最后一个节点审核人需要填写交车情况以及领用日期)
   */
  async passApproveTransferApply({ commit }: { commit: any }, data: any) {
    const {
      id, verifyOpinion, claimingDate, transferSituation
    } = data;
    return postBaseAxiosFunc(`transferApply/passApprove?id=${id}&verifyOpinion=${verifyOpinion}&claimingDate=${claimingDate}&transferSituation=${transferSituation}`);
  },
  /**
   * @description 查询车辆停车点变更申请列表
   */
  async queryParkingApplyList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('parkingApply/queryList', data);
  },
  /**
   * @description 根据id获取停车点详情
   */
  async queryParkingApplyById({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('parkingApply/getParkingApply', data);
  },
  /**
   * @description 新增车辆停车点变更申请
   */
  async saveParkingApply({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('parkingApply/addParkingApply', data);
  },
  /**
   * @description 撤销审核
   */
  async backOutApproveParkingApply({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc(`parkingApply/backOutApprove?id=${data.id}`);
  },
  /**
   * @description 审核不通过
   */
  async noPassApproveParkingApply({ commit }: { commit: any }, data: any) {
    const { id, verifyOpinion } = data;
    return postBaseAxiosFunc(`parkingApply/noPassApprove?id=${id}&verifyOpinion=${verifyOpinion}`);
  },
  /**
   * @description 审核通过
   */
  async passApproveParkingApply({ commit }: { commit: any }, data: any) {
    const { id, verifyOpinion } = data;
    return postBaseAxiosFunc(`parkingApply/passApprove?id=${id}&verifyOpinion=${verifyOpinion}`);
  },
  /**
   * @description 根据车牌号查询详情
   */
  async queryfindByPlateNumber({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('sysCodeList/findByPlateNumber', data);
  },
  /**
   * @description 获取停车点下拉列表
   */
  async queryParkingPullList({ commit }: { commit: any }) {
    return getBaseAxiosFunc('parkingManager/queryParkingPullList');
  },
  /**
   * @description 查询领用人列表 支持模糊
   */
  async queryFindRecipientByName({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('sysCodeList/findRecipientByName', data);
  },
  /**
   * @description 查询加油记录管理列表
   */
  async queryRefuelRecordList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('refuelRecord/queryList', data);
  },
  /**
   * @description 录入加油小票
   */
  async saveOrUpdateRefuelRecord({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('refuelRecord/saveOrUpdateRefuelRecord', data);
  },
  /**
   * @description 逻辑删支持批量
   */
  async deleteRefuelRecordByIds({ commit }: { commit: any }, data: any) {
    const { ids } = data;
    return postBaseAxiosFunc(`refuelRecord/deleteByIds?ids=${ids.join(',')}`, data);
  },
  /**
   * @description 导出车辆列表
   */
  async exportCarList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('exportCarList', data, {
      hasUseCode: true, responseType: 'arraybuffer'
    });
  },
  /**
   * @description 导出年审记录列表
   */
  async exportAnnualVerificationList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('annualVerification/exportList', data, {
      hasUseCode: true, responseType: 'arraybuffer'
    });
  },
  /**
   * @description 导出加油记录列表
   */
  async exportRefuelRecordList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('refuelRecord/exportList', data, {
      hasUseCode: true, responseType: 'arraybuffer'
    });
  },
  /**
   * @description 通过id修改车辆情况
   */
  async updateCarConditionById({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('transferApply/updateCarConditionById', data);
  },
};
export default {
  namespaced: true,
  actions
};
