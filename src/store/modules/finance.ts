import axios from '@/assets/js/request';

const BASE_URL = '/finance/v1/'; // 财务微服务公共路径

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
   * @description 查询所有启用的终端号-门店
   */
  async queryAllPosTerminalNoForOrderList({ commit }: { commit: any }, data?: any) {
    return postBaseAxiosFunc('pos/getAllPosTerminalNoForOrder', data);
  },
  /**
   * @description 查询所有的收款账号
   */
  async queryAllBankAccountList({ commit }: { commit: any }) {
    return getBaseAxiosFunc('bank/getAllBankAccount');
  },
  /**
   * @description 获取所有pos账号
  */
  async queryAllPosAccountList({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('posAccount/getAllPosAccountList', data);
  },
  /**
   * @description 查询所有启用的终端号
   */
  async queryAllPosTerminalNoList({ commit }: { commit: any }, data?: any) {
    return getBaseAxiosFunc('pos/getAllPosTerminalNo', data);
  },
  /**
   * @description 查询所有pos公司
   */
  async queryAllPosCompanyList({ commit }: { commit: any }, data?: any) {
    return postBaseAxiosFunc('pos/getAllPosCompanyDto', data);
  },

  /**
   * @description 获取商品销售统计列表数据
  */
  async queryGoodsSaleList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('statistical/queryClassesSaleStatistical', data);
  },
  /**
   * @description 获取支付渠道收入统计列表数据
  */
  async queryPayChannelList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('statistical/queryPayChannelStatistical', data);
  },
  /**
   * @description 获取门店收入统计列表数据
  */
  async queryStoreIncomeList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('statistical/queryStoreStatistical', data);
  },
  /**
   * @description 获取收款复核
  */
  async queryColectionList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('statistical/collectPage', data);
  },
  /**
   * @description 获取收款复核导出列表数据
  */
  async queryColectionExport({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('statistical/collectPage', data, { hasUseCode: true, responseType: 'arraybuffer' });
  },
  /**
   * @description 获取收款复核统计数据
  */
  async queryCollectCount({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('statistical/collectCount', data);
  },
  /**
   * @description 收款复核数据结转
  */
  async collectDataCarryOver({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('statistical/carryOver', data);
  },
  /**
   * @description 获取招生收款明细
  */
  async queryColectionDetailList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('statistical/recruitPage', data);
  },
  /**
   * @description 获取招生收款明细导出
  */
  async queryColectionDetailExport({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('statistical/recruitPage', data, { hasUseCode: true, responseType: 'arraybuffer' });
  },
  /**
   * @description 获取招生收款明细统计
  */
  async queryColectionDetailCount({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('statistical/recruitCount', data);
  },
  /**
   * @description 获取pos招生流水明细
  */
  async queryPosFlowDetailList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('statistical/posPage', data);
  },
  /**
   * @description 获取pos招生流水明细导出
  */
  async queryPosFlowDetailListExport({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('statistical/posPage', data, {
      hasUseCode: true, responseType: 'arraybuffer'
    });
  },
  /**
   * @description 获取银行转账招生流水明细
  */
  async queryBankFlowDetailList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('statistical/bankPage', data);
  },
  /**
   * @description 获取银行转账招生流水明细导出
  */
  async queryBankFlowDetailListExport({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('statistical/bankPage', data, {
      hasUseCode: true, responseType: 'arraybuffer'
    });
  },
  /**
   * @description 获取第三方招生流水明细
  */
  async queryThirdFlowDetailList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('statistical/thirdPage', data);
  },
  /**
   * @description 获取第三方招生流水明细导出
  */
  async queryThirdFlowDetailListExport({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('statistical/thirdPage', data, {
      hasUseCode: true, responseType: 'arraybuffer'
    });
  },
  /**
   * @description 获取上缴现金招生流水明细
  */
  async queryCashFlowDetailList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('statistical/cashPage', data);
  },
  /**
   * @description 获取上缴现金招生流水明细导出
  */
  async queryCashFlowDetailListExport({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('statistical/cashPage', data, {
      hasUseCode: true, responseType: 'arraybuffer'
    });
  },
  /**
   * @description 招生流水明细标记代收、取消标记
  */
  async flowDetailMark({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('statistical/make', data);
  },

  /**
   * @description pos查询实际应收金额，招生结转金额，未结转金额明细
  */
  async queryAllOrderDetailList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('statistical/queryAllOrderPage', data);
  },
  /**
   * @description pos查询实际应收金额，招生结转金额，未结转金额明细-统计
  */
  async queryAllOrderTotal({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('statistical/queryAllOrderTotal', data);
  },
  /**
   * @description pos查询实际应收金额，招生结转金额，未结转金额明细-导出
  */
  async queryAllOrderDetailListExport({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('statistical/queryAllOrderPage', data, {
      hasUseCode: true, responseType: 'arraybuffer'
    });
  },

  /**
   * @description 获取资金监管复核列表
  */
  async querySupervisePageList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('supervise/queryPage', data);
  },
  /**
   * @description 获取资金监管复核统计
  */
  async querySuperviseCount({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('supervise/countData', data);
  },
  /**
   * @description 资金监管复核删除
  */
  async superviseDelete({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('supervise/deleteDate', data);
  },
  /**
   * @description 资金监管复核作废
  */
  async superviseCancellation({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('supervise/cancellation', data);
  },
  /**
   * @description 获取其他费用列表
  */
  async queryOtherFeePageList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('expenses/queryPage', data);
  },
  /**
   * @description 获取其他费用统计
  */
  async queryOtherFeeCount({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('expenses/countData', data);
  },
  /**
   * @description 其他费用删除
  */
  async otherFeeDelete({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('expenses/deleteData', data);
  },
  /**
   * @description 获取其他费用详情列表
  */
  async queryOtherFeeDetailList({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('expenses/detail/queryDetails', data);
  },
  /**
   * @description 其他费用详情删除
  */
  async otherFeeDetailDelete({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('expenses/detail/deleteData', data);
  },
  /**
   * @description 其他费用详情审核通过
  */
  async otherFeeDetailModifyStatus({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('expenses/detail/modifyStatus', data);
  },
  /**
   * @description 获取收据变更列表
  */
  async queryApprovalPageList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('approval/getApprovalPage', data);
  },
  /**
   * @description 收据变更审核
  */
  async receiptApprove({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('approval/approve', data);
  },
  /**
   * @description 收据变更撤回
  */
  async receiptModifyStatus({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('approval/modifyStatus', data);
  },
  /**
   * @description 获取收据变更详情
  */
  async queryReceiptDetail({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('approval/getApprovalReceiptDetail', data);
  },
  /**
   * @description 获取学员退费列表
  */
  async queryRefundPageList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('refundRecord/getRefundCountList', data);
  },
  /**
   * @description 获取学员退费详情列表
  */
  async queryRefundDetailList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('refundRecord/getRefundDetailList', data);
  },
  /**
   * @description 学员退费详情统计
  */
  async queryRefundDetailCount({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('refundRecord/getRefundDetailCount', data);
  },
  /**
   * @description 获取收款账号分页列表
  */
  async queryBankAccountPageList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('bank/getBankPage', data);
  },
  /**
   * @description 收款账号编辑|新增
  */
  async bankAccountModify({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('bank/saveOrUpdate', data);
  },
  /**
   * @description 收款账号删除
  */
  async bankAccountDelete({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('bank/batchDeleteBankAccount', data);
  },
  /**
   * @description 收款账号启用|停用
  */
  async bankAccountChangeStatus({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('bank/batchChangeBankStatus', data);
  },
  /**
   * @description 获取pos账号分页列表
  */
  async queryPosAccountPageList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('posAccount/getPosAccountPage', data);
  },
  /**
   * @description pos账号新增|编辑
  */
  async posAccountModify({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('posAccount/saveOrUpdate', data);
  },
  /**
   * @description pos账号删除
  */
  async posAccountDelete({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('posAccount/batchDeletePosAccount', data);
  },
  /**
   * @description pos账号启用|停用
  */
  async posAccountChangeStatus({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('posAccount/batchChangePosStatus', data);
  },
  /**
   * @description 获取pos终端号号分页列表
  */
  async queryPosTerminalNumberPageList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('pos/getPosTerminalNoPage', data);
  },
  /**
   * @description pos终端号新增|编辑
  */
  async posTerminalNumberModify({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('pos/saveOrUpdate', data);
  },
  /**
   * @description pos终端号删除
  */
  async posTerminalNumberDelete({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('pos/batchDeletePosAccount', data);
  },
  /**
   * @description pos终端号启用|停用
  */
  async posTerminalNumberChangeStatus({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('pos/batchChangePosStatus', data);
  },
  /**
   * @description 获取本期招生统计
  */
  async queryCurrentEnrollmentList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('stageIncomeCount/admissions/count', data);
  },
  /**
   * @description 获取本期招生详情
  */
  async queryCurrentEnrollmentDetail({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('stageIncomeCount/admissions/detail', data);
  },
  /**
   * @description 获取本期毕业统计
  */
  async queryCurrentGraduateList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('graduate/getGraduateListCount', data);
  },
  /**
   * @description 本期毕业确认收入
  */
  async confirmIncomCurrentGraduate({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('graduate/confirmedIncome', data);
  },
  /**
   * @description 获取本期毕业详情
  */
  async queryCurrentGraduateDetail({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('graduate/getGraduateDetail', data);
  },
  /**
   * @description 获取本期毕业统计-固化
  */
  async queryCurrentGraduateFixedList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('graduate/getGraduateCuringCount', data);
  },
  /**
   * @description 获取本期毕业详情-固化
  */
  async queryCurrentGraduateFixedDetail({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('graduate/getGraduateCuringDetail', data);
  },
  /**
   * @description 获取毕业修正统计
  */
  async queryGraduationCorrectionList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('graduationCorrection/getGraduationCorrectionCount', data);
  },
  /**
   * @description 毕业修正确认收入
  */
  async confirmIncomGraduationCorrection({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('graduationCorrection/confirmedIncome', data);
  },
  /**
   * @description 获取毕业修正详情
  */
  async queryGraduationCorrectionDetail({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('graduationCorrection/getGraduationCorrectionDetail', data);
  },

  /**
   * @description 获取毕业修正统计-固化
  */
  async queryGraduationCorrectionFixedList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('graduationCorrection/getGraduationCorrectionCuringCount', data);
  },

  /**
   * @description 获取毕业修正详情-固化
  */
  async queryGraduationCorrectionFixedDetail({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('graduationCorrection/getGraduationCorrectionCuringDetail', data);
  },

  /**
   * @description 获取库存及预收
  */
  async queryCurrentStockCollectList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('repertory/query', data);
  },
  /**
   * @description 获取本期退费列表-云驾培
  */
  async queryCurrentRefundList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('stageIncomeCount/refund/list', data);
  },
  /**
   * @description 获取本期退费导出-云驾培
  */
  async queryCurrentRefundListExport({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('stageIncomeCount/refund/list', data, {
      hasUseCode: true, responseType: 'arraybuffer'
    });
  },
  /**
   * @description 获取惠州本期退费列表
  */
  async queryHuiZhouCurrentRefundList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('stageIncomeCount/huiZhou/refund/list', data);
  },
  /**
   * @description 获取系统交易流水分页列表
  */
  async querySystemTransactionRecordList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('transactionRecord/getTransactionRecordPage', data);
  },
  /**
   * @description 获取系统交易流水统计
  */
  async querySystemTransactionRecordCount({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('transactionRecord/getTotalAmount', data);
  },
  /**
   * @description 修改发票信息
  */
  async modifyInvoiceInformation({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('transactionRecord/modifyInvoiceInformation', data);
  },
  /**
   * @description 修改已开票信息
  */
  async modifyUsedInvoiceInformation({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('transactionRecord/modifyUsedInvoiceInformation', data);
  },
  /**
   * @description 获取系统交易流水打印发票数据
  */
  async queryprintReceiptInfo({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('transactionRecord/printReceipt', data);
  },
  /**
   * @description 修改收据
  */
  async modifyReceipt({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('transactionRecord/modifyReceipt', data);
  },
  /**
   * @description 现金复核
  */
  async addCashPaymentRecord({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('cashPayment/addCashPaymentRecord', data);
  },
  /**
   * @description 获取系统交易流水详情
  */
  async querySystemTransactionRecordDetail({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('transactionRecord/getTransactionRecordDetail', data);
  },
  /**
   * @description 获取代收交易流水分页列表
  */
  async queryCollectionFlowList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('substituteRecord/getSubstituteRecordPage', data);
  },
  /**
   * @description 获取代收交易流水统计
  */
  async queryCollectionFlowCount({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('substituteRecord/getTotalAmount', data);
  },
  /**
   * @description 获取代收交易流水打印发票数据
  */
  async queryCollectionFlowPrintReceiptInfo({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('substituteRecord/PrintSubstituteReceipt', data);
  },
  /**
   * @description 获取代收交易流水详情
  */
  async queryCollectionFlowDetail({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('substituteRecord/getSubstituteRecordDetail', data);
  },
  /**
   * @description 获取pos交易流水分页列表
  */
  async queryPosPayFlowList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('posRecord/getPosRecordPage', data);
  },
  /**
   * @description pos交易流水删除
  */
  async posRecordDelete({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('posRecord/batchDeletePosRecord', data);
  },
  /**
   * @description 获取pos交易流水详情
  */
  async queryPosPayFlowDetail({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('posRecord/getPosRecordDetail', data);
  },
  /**
   * @description 获取银行转账流水分页列表
  */
  async queryBankTransferList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('bankTransferAccount/getBankTransferPage', data);
  },
  /**
   * @description 银行转账流水删除
  */
  async bankTransferDelete({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('bankTransferAccount/batchDelete', data);
  },
  /**
   * @description 获取第三方交易流水分页列表
  */
  async queryThirdTradeList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('thirdTrade/getThirdTradePage', data);
  },
  /**
   * @description 第三方交易流水删除
  */
  async thirdTradeDelete({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('thirdTrade/batchDelete', data);
  },
  /**
   * @description 其他收入确认列表
   */
  async queryOtherIncomeListCount({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('otherIncome/getOtherIncomeListCount', data);
  },
  /**
   * @description 其他收入详情
  */
  async queryOtherIncomeListDetail({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('otherIncome/getOtherIncomeListDetail', data);
  },
  /**
   * @description 导出其他收入记录
  */
  async exportOtherIncomeList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('otherIncome/exportOtherIncomeList', data, {
      hasUseCode: true, responseType: 'arraybuffer'
    });
  },
  /**
   * @description 其他收入确认
  */
  async confirmedOtherIncome({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('otherIncome/confirmedOtherIncome', data);
  },
  /**
   * @description 其他收入列表统计(固化)
   */
  async queryOtherIncomeCuringCount({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('otherIncome/getOtherIncomeCuringCount', data);
  },
  /**
   * @description 其他收入明细(固化)
   */
  async queryOtherIncomeCuringDetail({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('otherIncome/getOtherIncomeCuringDetail', data);
  },
  /**
   * @description 导出其他收入(固化)
   */
  async exportOtherIncomeCuringList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('otherIncome/exportOtherIncomeCuringList', data, {
      hasUseCode: true, responseType: 'arraybuffer'
    });
  },
  /**
   * @description 查看操作日志
   */
  async queryOpLogPageByType({ commit }: { commit: any }, data: any) {
    const { type } = data;
    return postBaseAxiosFunc(`operationLog/queryOpLogPageByType?type=${type}`, data);
  },
  /**
   * @description 代收散学分页
   */
  async queryCollectScatteredPage({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('statistical/collectScatteredPage', data);
  },
  /**
   * @description 代收散学统计
   */
  async queryCollectScatteredCount({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('statistical/collectScatteredCount', data);
  },
  /**
   * @description 导出代收散学
   */
  async exportCollectScatteredPaget({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('statistical/collectScatteredPage', data, {
      hasUseCode: true, responseType: 'arraybuffer'
    });
  },
  /**
   * @description 获取散学收款明细
  */
  async querySanXueDetailList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('statistical/scatteredPage', data);
  },
  /**
   * @description 获取散学收款明细导出
  */
  async querySanXueDetailExport({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('statistical/scatteredPage', data, { hasUseCode: true, responseType: 'arraybuffer' });
  },
  /**
   * @description 获取散学收款明细统计
  */
  async querySanXueDetailCount({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('statistical/scatteredCount', data);
  },

  /**
   * @description 查询散学退费统计列表
  */
  async querySanXueRefundCountList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scatteredRefund/getScatteredRefundCountList', data);
  },
  /**
   * @description 查询散学退费详情统计
  */
  async querySanXueRefundDetailCount({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scatteredRefund/getRefundDetailCount', data);
  },
  /**
   * @description 查询散学退费统计列表
  */
  async querySanXueRefundDetailList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scatteredRefund/getScatteredRefundDetailList', data);
  },
  /**
   * @description 散学收款复核数据结转
  */
  async collectScatteredCarryOver({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('statistical/collectScatteredCarryOver', data);
  },
  /**
   * @description 通过orderNo获取订单记录
  */
  async queryTransactionListByOrderNo({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('statistical/transactionList', data);
  },
  /**
   * 获取第三方未匹配列表
   */
  async queryThirdUnMatchList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('statistical/queryThirdUnMatchList', data);
  },
  /**
   * 第三方未匹配-确认核对
   */
  async updateReceiptTime({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('statistical/updateReceiptTime', data);
  },

};

export default {
  namespaced: true,
  actions
};
