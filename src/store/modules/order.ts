import axios from '@/assets/js/request';

const BASE_URL = '/order/v1/'; // 订单微服务公共路径

const postBaseAxiosFunc = (url: string, data?: any, options?: any) => new Promise((resolve, reject) => {
  axios.post(`${BASE_URL}${url}`, data, options).then((res: any) => {
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

const deleteBaseAxiosFunc = (url: string, data?: any) => new Promise((resolve, reject) => {
  axios.delete(`${BASE_URL}${url}`, { data }).then((res: any) => {
    resolve(res);
  }).catch((err) => {
    reject(err);
  });
});

const actions = {
  /**
   * @description 查询订单列表
   */
  async queryOrderList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('order/getOrderPage', data);
  },
  /**
   * @description 查询订单列表-导出
   */
  async queryExportOrderList({ commit }: { commit: any }, data: any) {
    return axios.post(`${BASE_URL}order/getOrderPage`, data, { hasUseCode: true, responseType: 'arraybuffer' } as any);
  },
  /**
   * @description 添加或修改订单
   */
  async saveOrUpdate({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('order/saveOrUpdate', data);
  },
  /**
   * @description 查询订单详情
   */
  async queryOrder({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('order/getOrder', data);
  },
  /**
   * @description 订单支付尾款
   */
  async payBalance({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('order/payBalance', data);
  },
  /**
   * @description 统计订单数量和金额
   */
  async queryOrderTotalAmount({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('order/getOrderTotalAmount', data);
  },
  /**
   * @description 查询订单修改日志列表
   */
  async queryOrderLogList({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('order/getOrderLogPage', data);
  },
  /**
   * @description 散学订单列表-导出
   */
  async queryExpostScatteredList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scattered/queryScatteredListPage', data, { hasUseCode: true, responseType: 'arraybuffer' } as any);
  },
  /**
   * @description 新增散学订单
   */
  async addScatteredOrder({ commit }: { commit: any }, data: any) {
    return putBaseAxiosFunc('scattered/addScatteredOrder', data);
  },
  /**
   * @description 查询散学订单
   */
  async queryScatteredById({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('scattered/queryScatteredById', data);
  },
  /**
   * @description 修改散学订单
   */
  async updateScatteredOrder({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scattered/updateScatteredOrder', data);
  },
  /**
   * @description 老系统 班别下拉信息
   */
  async queryScatteredClassesBaseList({ commit }: { commit: any }) {
    return getBaseAxiosFunc('scattered/queryScatteredClassesBase');
  },
  /**
   * @description 老系统 所有场点列表
   */
  async queryScatteredPlaceBaseList({ commit }: { commit: any }) {
    return getBaseAxiosFunc('scattered/queryScatteredPlaceBase');
  },
  /**
   * @description 老系统 所有驾校对应价格
   */
  async queryScatteredPriceBaseOpts({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('scattered/queryScatteredPriceBase', data);
  },
  /**
   * @description 其他订单列表 查询
   */
  async queryExtOrderList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('orderExt/queryExtOrderListPage', data);
  },
  /**
   * @description 其他订单列表-导出
   */
  async queryExportExtOrderList({ commit }: { commit: any }, data: any) {
    return axios.post(`${BASE_URL}orderExt/queryExtOrderListPage`, data, { hasUseCode: true, responseType: 'arraybuffer' } as any);
  },
  /**
   * @description 其他订单列表 新增
   */
  async addExtOrder({ commit }: { commit: any }, data: any) {
    return putBaseAxiosFunc('orderExt/addExtOrder', data);
  },
  /**
   * @description 其他订单列表 修改
   */
  async updateExtOrder({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('orderExt/updateExtOrder', data);
  },
  /**
   * @description 其他订单列表 查询
   */
  async queryOrderExtById({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('orderExt/queryOrderExtById', data);
  },
  /**
   * @description 其他订单列表 通过身份证查询订学员信息
   */
  async queryStudentInfoByIdNo({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('orderExt/queryStudentInfoByIdNo', data);
  },
  /**
   * @description 退费列表
   * @returns { Array } 返回列表
   */
  async queryRefundList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('refund/list', data);
  },
  /**
   * @description 退费详情
   */
  async queryRefundDetail({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('refund/getRefundById', data);
  },
  /**
   * @description 撤销审核
   */
  async backOutApproveRefund({ commit }: { commit: any }, data: any) {
    const { id } = data;
    return postBaseAxiosFunc(`refund/backOutApprove?id=${id}`);
  },
  /**
   * @description 审核不通过
   */
  async noPassApproveRefund({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('refund/noPassApprove', data);
  },
  /**
   * @description 审核通过
   */
  async passApproveRefund({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('refund/passApprove', data);
  },
  /**
   * @description 财务付款接口
   */
  async paymentRefund({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('refund/payment', data);
  },
  /**
   * @description 打印学员退费付款明细
   */
  async refundPaymentLogs({ commit }: { commit: any }, data: any) {
    const { idList } = data;
    return postBaseAxiosFunc('refund/refundPayment', idList);
  },
  /**
   * @description 申请退费
   */
  async putInsertRefund({ commit }: { commit: any }, data: any) {
    return putBaseAxiosFunc('refund/insertRefund', data);
  },
  /**
   * @description 财务修改财务审核金额
   */
  async updateFinanceFee({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('refund/updateFinanceFee', data);
  },
  /**
   * @description 通过证件号获取退费基础信息
   */
  async queryRefundInfoByIdNo({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('refund/getRefundInfoByIdNo', data);
  },
  /**
   * @description 查询转车型（班别）审批管理列表
   */
  async queryApprovesList({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('approves', data);
  },
  /**
   * @description 查询转车型（班别）详情
   */
  async queryApprovesDetail({ commit }: { commit: any }, data: any) {
    const { id } = data;
    return getBaseAxiosFunc(`approves/${id}`, data);
  },
  /**
   * @description 审核不通过
   */
  async putNoPassApproves({ commit }: { commit: any }, data: any) {
    const { id } = data;
    return putBaseAxiosFunc(`approves/${id}/noPass`, data);
  },
  /**
   * @description 审核通过
   */
  async putPassApproves({ commit }: { commit: any }, data: any) {
    const { id, } = data;
    return putBaseAxiosFunc(`approves/${id}/pass`, data);
  },
  /**
   * @description 审核撤销
   */
  async putUndoApproves({ commit }: { commit: any }, data: any) {
    const { id, } = data;
    return putBaseAxiosFunc(`approves/${id}/undo`, data);
  },
  /**
   * @description 订单作废
   */
  async orderCancellation({ commit }: { commit: any }, data: any) {
    const { id } = data;
    return postBaseAxiosFunc(`order/orderCancellation?id=${id}`);
  },
  /**
   * @description 根据请求条件获取考试费/补考费/缺考费详情
   */
  async getExamFeeByOrderId({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('examFees', data);
  },
  // 牌证四期-转门店
  /**
   * @description 转门店列表
   */
  async queryChangeStoreApproveList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('approveChangeStore/getChangeStoreApproveList', data);
  },
  /**
   * @description 转门店列表统计
   */
  async queryChangeStoreApproveCount({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('approveChangeStore/getChangeStoreApproveCount', data);
  },
  /**
   * @description 转门店详情
   */
  async queryChangeStoreApproveDetail({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('approveChangeStore/getChangeStoreApproveDetail', data);
  },
  /**
   * @description 转门店-根据证件号|姓名查询学员信息
   */
  async queryOrderInfoByNameOrIdNo({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('approveChangeStore/getOrderInfoByNameOrIdNo', data);
  },
  /**
   * @description 转门店-新增
   */
  async addApproveChangeStore({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('approveChangeStore/addApproveChangeStore', data);
  },
  /**
   * @description 转门店-撤回
   */
  async cancelApproveChangeStore({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('approveChangeStore/undoApprove', data);
  },
  /**
   * @description 转门店-通过
   */
  async passApproveChangeStore({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('approveChangeStore/passApprove', data);
  },
  /**
   * @description 转门店-驳回
   */
  async rejectApproveChangeStore({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('approveChangeStore/noPassApprove', data);
  },
  // 牌证四期-转门店 end
  // 牌证四期-转历史

  // 牌证四期-转历史 end

  /**
   * @description 订单转牌证
   */
  async orderFlowPush({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('flow/push', data);
  },
  /**
   * @description 其他订单删除
   */
  async deleteOrderExt({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('orderExt/delete', data);
  },
  /**
   * @description 分页查询散学订单列表
   */
  async queryScatteredOrderList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scattered/queryScatteredListPage', data);
  },
  /**
   * @description 查询散学订单列表总条数和总实收款
   */
  async queryTotalAndSumAmount({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scattered/queryTotalAndSumAmount', data);
  },
  /**
   * @description 新增散学订单
   */
  async addOrUpdateScatteredOrder({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scattered/addOrUpdateOrder', data);
  },
  /**
   * @description 散学订单根据关键字查询订单信息
   */
  async queryScatteredOrderInfo({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scattered/queryOrderInfo', data);
  },
  /**
   * @description 散学订单查询渠道列表
   */
  async queryChannelList({ commit }: { commit: any }) {
    return getBaseAxiosFunc('scattered/queryChannelList');
  },
  /**
   * @description 初学转陪驾列表查询
   */
  async getBeginnerList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scatteredBeginner/getBeginnerList', data);
  },
  /**
   * @description 转散学审核
   */
  async reviewBeginner({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scatteredBeginner/review', data);
  },
  /**
   * @description 转散学审核
   */
  async editRemark({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scatteredBeginner/editRemark', data);
  },
  /**
   * @description 初学转陪驾列表-导出
   */
  async exportBeginnerList({ commit }: { commit: any }, data: any) {
    return axios.post(`${BASE_URL}scatteredBeginner/exportBeginnerList`, data, { hasUseCode: true, responseType: 'arraybuffer' } as any);
  },
  /**
   * @description 散学退费列表查询
   */
  async getScatteredRefundList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scatteredRefund/getScatteredRefundList', data);
  },
  /**
   * @description 通过证件号或姓名查询退费信息
   */
  async getRefundInfoByIdNo({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('scatteredRefund/getRefundInfoByIdNo', data);
  },
  /**
   * @description 通过证件号或姓名查询退费信息
   */
  async addScatteredRefundApprove({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scatteredRefund/addScatteredRefundApprove', data);
  },
  /**
   * @description 散学退费详情
   */
  async getScatteredRefundDetail({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scatteredRefund/getScatteredRefundDetail', data);
  },
  /**
   * @description 散学退费详情-审核通过
   */
  async passApprove({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scatteredRefund/passApprove', data);
  },
  /**
   * @description 散学退费详情-审核驳回
   */
  async noPassApprove({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scatteredRefund/noPassApprove', data);
  },
  /**
   * @description 散学退费详情-审核撤销
   */
  async undoApprove({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scatteredRefund/undoApprove', data);
  },
  /**
   * @description 散学退费详情-审核撤销
   */
  async getScatteredRefundCount({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scatteredRefund/getScatteredRefundCount', data);
  },
  /**
   * @description 散学退费列表-打印学员退费付款明细
   */
  async refundScatteredPayment({ commit }: { commit: any }, data: any) {
    const { idList } = data;
    return postBaseAxiosFunc('scatteredRefund/refundPayment', idList);
  },
  /**
   * @description 散学退费列表-付款
   */
  async scatteredPayment({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('/scatteredRefund/payment', data);
  },
  /**
   * @description 散学车辆品牌列表
   */
  async queryScatteredBrandList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scatteredBrand/getBrandList', data);
  },
  /**
   * @description 新增散学车辆品牌管理
   */
  async addScatteredBrand({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scatteredBrand/addScatteredBrand', data);
  },
  /**
   * @description 散学车辆品牌管理修改状态
   */
  async queryScatteredBrandChangeStatus({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scatteredBrand/changeStatus', data);
  },
  /**
   * @description 散学车辆品牌列表下拉
   */
  async queryScatteredBrandOpts({ commit }: { commit: any }) {
    return postBaseAxiosFunc('scatteredBrand/getBrandListForAdd');
  },
  /**
   * @description 散学转车型
   */
  async queryScatteredChangeCarModel({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scattered/changeCarModel', data);
  },
  /**
   * @description 散学分配教练
   */
  async queryScatteredBatchAllotCoach({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scattered/batchAllotCoach', data);
  },
  /**
   * @description 散学批量转入历史
   */
  async queryScatteredBatchRollInHistory({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scattered/batchRollInHistory', data);
  },
  /**
   * @description 散学批量转出历史
   */
  async queryScatteredBatchRollOutHistory({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scattered/batchRollOutHistory', data);
  },
  /**
   * @description 散学删除
   */
  async deleteScatteredOrder({ commit }: { commit: any }, data: any) {
    const { id } = data;
    return deleteBaseAxiosFunc(`scattered/order?id=${id}`);
  },
  /**
   * @description 散学订单根据关键字查询订单列表
   */
  async queryScatteredOrderByKeyword({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scattered/queryListByKeyword', data);
  },
  /**
   * @description 散学订单 模糊查询学员姓名列表
   */
  async queryFuzzySearchStudentNameList({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('scattered/fuzzySearchStudentNameList', data);
  },
  /**
   * @description 根据id获取驳回的节点
   */
  async queryRefundRejectNodesById({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('scatteredRefund/getRejectNodeById', data);
  },
  /**
   * @description 修改散学退费信息
   */
  async updateSanXueScatteredOrder({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scatteredRefund/updateRefund', data);
  },
  /**
   * @description 删除散学退费信息
   */
  async deleteSanXueScatteredOrder({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scatteredRefund/deleteRefund', data);
  },
  /**
   * @description 检查散学订单是否有退费
   */
  async queryScatteredCheckOrderIsRefund({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scatteredRefund/checkOrderIsRefund', data);
  },
  /**
   * @description 学时解冻
   */
  async queryScatteredPeriodUnfreeze({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scattered/periodUnfreeze', data);
  },
  /**
   * @description 通过身份证查询订学员信息
   */
  async queryOrderFuzzyUsers({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('order/fuzzyUsers', data);
  },
  /**
   * @description 获取支付收据列表（变更班别和变更车型使用)
   */
  async queryOrderPaysList({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('orderPays/list', data);
  },
  /**
   * @description 添加转车型审批单
   */
  async addApprovesChangeCarModel({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('approves/changeCarModel', data);
  },
  /**
   * @description 添加转班别审批单
   */
  async addApprovesChangeClasses({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('approves/changeClasses', data);
  },
  /**
   * @description 添加转校审批单
   */
  async addApprovesChangeSchool({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('approves/changeSchool', data);
  },
  /**
   * @description 修改审批单的变更信息（针对变更班别和变更车型）
   */
  async editApproves({ commit }: { commit: any }, data: any) {
    const { id } = data;
    return putBaseAxiosFunc(`approves/${id}`, data);
  },
  /**
   * @description 删除审批单
   */
  async deleteApproves({ commit }: { commit: any }, data: any) {
    return deleteBaseAxiosFunc(`approves?ids=${data.join(',')}`);
  },
  /**
   * @description 根据id查询可驳回列表
   */
  async querygetRejectNodeById({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('refund/getRejectNodeById', data);
  },
  /**
   * @description 驳回后修改退费信息
   */
  async editInsertRefund({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('refund/updateRefund', data);
  },
  /**
   * @description 根据id获取驳回的节点
   */
  async queryRejectNodes({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('approves/rejectNodes', data);
  },
  /**
   * @description 散学订单审批统计
   */
  async queryScatteredCountApproves({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('approves/countApproves', data);
  },
  /**
   * @description 获取广仁散学班别
   */
  async queryScatteredFindAllClass({ commit }: { commit: any }) {
    return getBaseAxiosFunc('scattered/class/findAll');
  },
  /**
   * @description 查询延期学车分页列表
   */
  async queryPostponeList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('postpone/queryPostponeList', data);
  },
  /**
   * @description 删除延期学车
   */
  async deletePostponeByIds({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('postpone/deletePostponeByIds', data);
  },
  /**
   * @description 通过id查询延期学车订单数据
   */
  async queryPostponeOrderById({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('postpone/getPostponeById', data);
  },
  /**
   * @description 通过身份证-姓名模糊查询延期学车订单数据
   */
  async queryPostponeOrderByIdNo({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('postpone/queryPostponeOrderByIdNo', data);
  },
  /**
   * @description 通过id查询延期学车驳回节点数据
   */
  async queryRejectNodeById({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('postpone/getRejectNodeById', data);
  },
  /**
   * @description 通过orderId查询延期学车收据编号和费用
   */
  async queryPayInfoByOrderId({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('postpone/getPayInfoByOrderId', data);
  },
  /**
   * @description 添加延期学车审批单
   */
  async addDelayedLearning({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('postpone/addPostpone', data);
  },
  /**
   * @description 修改延期学车
   */
  async updateDelayedLearningById({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('postpone/updatePostponeById', data);
  },
  /**
   * @description 延期学车审批通过
   */
  async passApproveDelayedLearning({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('postpone/passApprove', data);
  },
  /**
   * @description 延期学车审批不通过/驳回
   */
  async noPassApproveDelayedLearning({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('postpone/noPassApprove', data);
  },
  /**
   * @description 延期学车撤销
   */
  async backOutApproveDelayedLearning({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('postpone/backOutApprove', data);
  },
  /**
   * @description 根据订单id获取学员订单支付信息
   */
  async queryScatteredPayInfoByOrderId({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('scattered/queryPayInfoByOrderId', data);
  },
  /**
   * @description 关系户审核
   */
  async queryOrdercreditApproval({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('order/creditApproval', data);
  },
  /**
   * @description 初学转陪驾详情
   */
  async queryBeginnerDetail({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scatteredBeginner/getBeginnerDetail', data);
  },
  /**
   * @description 驳回后重新编辑
   */
  async updateScatteredBeginnerApprove({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scatteredBeginner/updateApprove', data);
  },
  /**
   * @description 查询订单修改记录
   */
  async queryOrderChangeLogs({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc(`orderLogs?orderId=${data}`);
  },
};
export default {
  namespaced: true,
  actions
};
