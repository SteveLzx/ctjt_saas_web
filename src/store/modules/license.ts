import axios from '@/assets/js/request';

const BASE_URL = '/license/v1/'; // 牌证微服务公共路径

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

const deleteBaseAxiosFunc = (url: string, data?: any) => new Promise((resolve, reject) => {
  axios.delete(`${BASE_URL}${url}`, { data }).then((res: any) => {
    resolve(res);
  }).catch((err) => {
    reject(err);
  });
});

const actions = {
  /**
   * @description 根据关键字模糊搜索学员
   */
  async queryStudentByKeyword({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('order/fuzzyUsers', data);
  },
  /**
   * @description 无纸化采集-分页
   */
  async paperList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('paper/page', data);
  },
  /**
   * @description 无纸化采集-导出
   */
  async paperExport({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('paper/export', data, { hasUseCode: true, responseType: 'arraybuffer' });
  },
  /**
   * @description 场点交表-分页
   */
  async queryFieldPointList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('fieldPoint/page', data);
  },
  /**
   * @description 场点交表-导出
   */
  async fieldPointExport({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('fieldPoint/export', data, { hasUseCode: true, responseType: 'arraybuffer' });
  },
  /**
   * @description 牌证收表-分页
   */
  async queryRecoveryTableList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('recoveryTable/page', data);
  },
  /**
   * @description 牌证收表-导出
   */
  async recoveryTableExport({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('recoveryTable/export', data, { hasUseCode: true, responseType: 'arraybuffer' });
  },
  /**
   * @description 车管所送审-分页
   */
  async queryDmvList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('dmv/page', data);
  },
  /**
   * @description 车管所送审-导出
   */
  async dmvExport({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('dmv/export', data, { hasUseCode: true, responseType: 'arraybuffer' });
  },
  /**
   * @description 考场受理-分页
   */
  async queryExamAcceptList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('examAccept/page', data);
  },
  /**
   * @description 考场受理-导出
   */
  async examAcceptExport({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('examAccept/export', data, { hasUseCode: true, responseType: 'arraybuffer' });
  },
  /**
   * @description 上课情况-分页
   */
  async queryAttendClassList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('attendClass/page', data);
  },
  /**
   * @description 上课情况-导出
   */
  async attendClassExport({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('attendClass/export', data, { hasUseCode: true, responseType: 'arraybuffer' });
  },
  /**
   * @description 学科培训-分页
   */
  async querySubjectTrainsList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('subjectTrains/page', data);
  },
  /**
   * @description 考试批复-分页
   */
  async queryReplyPage({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('reply/queryReplyPage', data);
  },
  /**
   * @description 考试批复-导出
   */
  async queryReplyExport({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('reply/export', data, { hasUseCode: true, responseType: 'arraybuffer' });
  },
  /**
  /**
   * @description 考试交费-分页
   */
  async queryCostPageList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('cost/queryCostPage', data);
  },
  /**
   * @description 考试交费-导出
   */
  async costPageExport({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('cost/export', data, { hasUseCode: true, responseType: 'arraybuffer' });
  },
  /**
   * @description 考试结果-分页
   */
  async queryResultPage({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('result/queryResultPage', data);
  },
  /**
   * @description 考试结果-导出
   */
  async queryResultExport({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('result/export', data, { hasUseCode: true, responseType: 'arraybuffer' });
  },
  /** 考试结果-考试结果变更分页列表 */
  async postqueryResultChangePage({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('resultChange/queryPage', data);
  },
  /**
   * @description 根据证件号获取学员基础信息,考试结果变更使用接口
   */
  async queryWorkflowByIdNo({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('common/queryByIdNo', data);
  },
  /** 考试结果-通过证件号和科目获取学员变更记录 */
  async queryResultChangeRecord({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('resultChange/queryDetail', data);
  },
  /** 考试结果-新增考试结果变更 */
  async postcreateResultChange({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('resultChange/createResultChange', data);
  },
  /** 考试结果-考试结果变更查询详情 */
  async queryResultChangeDetail({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('resultChange/queryDetailBySeq', data);
  },
  /**
   * @description 成绩单 列表
   */
  async queryReportCardList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('report/queryPage', data);
  },
  /** 成绩单-导出 */
  async exportReportCard({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('report/export', data, {
      hasUseCode: true, responseType: 'arraybuffer'
    });
  },
  /**
   * @description 成绩单 接收成绩单、删除
   */
  async reportCardOperate({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('report/modifyReport', data);
  },
  /**
     * @description 从斑斑获取成绩列表
     */
  async queryExamList({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('report/examList', data);
  },
  /**
   * @description 牌证节点公共删除接口
   */
  async deleteFlowData({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('common/deleteFlowData', data);
  },
  /**
   * @description 牌证节点公共编辑接口
   */
  async modifyFlowData({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('common/modifyFlowData', data, { hasUseCode: true });
  },

  /**
   * @description 批次号管理列表-分页
   */
  async queryBatchNoList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('batchNoManage/queryBatchNoListPage', data);
  },
  /**
   * @description 批次号详情-分页
   */
  async queryBatchNoMsg({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('batchNoManage/queryBatchNoMsg', data);
  },
  /** 批次号详情-考试交费-导出 */
  async exportBatchNoManageCost({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('batchNoManage/exportCostList', data, {
      hasUseCode: true, responseType: 'arraybuffer'
    });
  },
  /**
   * @description 补交资料 列表
   */
  async queryMaterialsList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('materials', data);
  },
  /**
   * @description 补交资料 更新资料名称和备注
   */
  async putMaterialsDetail({ commit }: { commit: any }, data: any) {
    return putBaseAxiosFunc('materials', data);
  },
  /**
   * @description 补交资料 删除资料
   */
  async deleteMaterialsDetail({ commit }: { commit: any }, data: any) {
    const { type, batchNo = '', idNos } = data;
    return deleteBaseAxiosFunc(`materials?type=${type}&batchNo=${batchNo}&idNos=${idNos.join(',')}`);
  },
  /**
   * @description 补交资料 通过批次号删除匹配资料
   */
  async deleteMaterialsBatchNo({ commit }: { commit: any }, data: any) {
    const { batchNos } = data;
    return deleteBaseAxiosFunc(`materials/batchNo?batchNos=${batchNos.join(',')}`);
  },
  /**
   * @description 补交资料 查看批次号档案详情
   */
  async queryMaterialsDetails({ commit }: { commit: any }, data: any) {
    const { batchNo = '' } = data;
    return getBaseAxiosFunc(`materials/details?batchNo=${batchNo}`);
  },
  /**
   * @description 补交资料 处理资料（交、收、退）
   */
  async queryMaterialsDispose({ commit }: { commit: any }, data: any) {
    const { type, sendData } = data;
    return postBaseAxiosFunc(`materials/dispose?type=${type}`, sendData);
  },
  /**
   * @description 补交资料 根据证件号码模糊搜索学员信息
   */
  async queryMaterialsFuzzyUsers({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('materials/fuzzyUsers', data);
  },
  /**
   * @description 补交资料 根据批次号获取学员列表
   */
  async queryMaterialsUsers({ commit }: { commit: any }, data: any) {
    const { batchNos } = data;
    return getBaseAxiosFunc(`materials/users?batchNos=${batchNos.join(',')}`);
  },
  /**
   * @description 档案归档 列表
   */
  async queryFilesList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('files/page', data);
  },
  /**
   * @description 档案归档 列表 导出
   */
  async queryFilesListExport({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('files/page', data, { hasUseCode: true, responseType: 'arraybuffer' });
  },
  /**
   * @description 档案归档 列表 修改
   */
  async editFilesList({ commit }: { commit: any }, data: any) {
    return putBaseAxiosFunc('files', data);
  },
  /**
   * @description 档案归档 批次号档案详情列表
   */
  async queryFilesDetails({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('files/details', data);
  },
  /**
   * @description 档案归档 处理档案（交、收、退、补录）
   */
  async postFilesDispose({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('files/quickFiles', data);
  },
  /**
   * @description 档案归档 删除已交档案
   */
  async deleteFilesDispose({ commit }: { commit: any }, data: any) {
    const { idNos, type, batchNo = '' } = data;
    return deleteBaseAxiosFunc(`files?idNos=${idNos}&type=${type}&batchNo=${batchNo}`);
  },
  /**
   * @description 档案归档 批次号获取学员列表
   */
  async queryFilesUsers({ commit }: { commit: any }, data: any) {
    const { batchNos, type } = data;
    return getBaseAxiosFunc(`files/users?batchNos=${batchNos.join(',')}&type=${type}`);
  },
  /**
   * @description 档案归档 模糊搜索证件信息
   */
  async queryFilesFuzzyUsers({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('files/fuzzyUsers', data);
  },
  /**
   * @description 资金监管存入分页列表
   */
  async querySupervises({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('supervises', data);
  },
  /**
   * @description 资金监管存入导出银行存入表
   */
  async postSupervisesExportExcel({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('supervises/exportExcel', data, { hasUseCode: true, responseType: 'arraybuffer' });
  },
  /**
   * @description 资金监管存入 录入转账码
   */
  async postSupervisesTransferCode({ commit }: { commit: any }, data: any) {
    return putBaseAxiosFunc('supervises/transferCode', data);
  },
  /**
   * @description 资金监管存入 删除转账码
   */
  async delSupervisesTransferCode({ commit }: { commit: any }, data: any) {
    return deleteBaseAxiosFunc('supervises/transferCode', data);
  },
  // 学员综合档案--start
  /**
   * @description 学员综合档案-分页列表
   */
  async queryRecordList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('record/queryPage', data);
  },
  /** 学员综合档案-导出 */
  async exportRecord({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('record/export', data, {
      hasUseCode: true, responseType: 'arraybuffer'
    });
  },
  /**
   * @description 学员综合档案-新增服务跟踪记录
   */
  async createTracking({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('tracking/createTracking', data);
  },
  /**
   * @description 学员综合档案-修改学习证有效期
   */
  async modifyPeriodStudyDate({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('tracking/modifyPeriodStudyDate', data);
  },
  /**
   * @description 学员综合档案-转入历史
   */
  async turnHistory({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('history/turnHistory', data);
  },
  /**
   * @description 学员综合档案-恢复历史
   */
  async restoreTurnHistory({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('history/restoreTurnHistory', data);
  },
  /**
   * @description 学员综合档案-修改学车进度
   */
  async modifyStudentRecord({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('result/sendStudentRecord', data);
  },
  /**
   * @description 学员综合档案-办证记录
   */
  async queryCertificateRecordList({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('record/queryRecord', data);
  },
  /**
   * @description 学员综合档案-考试记录
   */
  async queryExamRecordList({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('record/queryExamRecord', data);
  },

  /**
   * @description 学员综合档案-财务记录
   */
  async queryFinanceRecordList({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('record/queryFinance', data);
  },
  /**
   * @description 学员综合档案-操作日志
   */
  async queryChangeLogRecordList({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('record/queryChange', data);
  },
  /**
   * @description 学员综合档案-服务跟踪记录
   */
  async queryTrackingList({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('tracking/queryTracking', data);
  },
  /**
   * @description 学员综合档案-转入/恢复历史记录
   */
  async queryTurnHistoryRecord({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('record/queryTurnHistoryRecord', data);
  },
  // 学员综合档案--end
  /**
   * @description 监管学时 分页列表
   */
  async querySupervisePeriodList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('SupervisePeriod/querySupervisePeriodList', data);
  },
  /**
   * @description 监管学时 学时更新
   */
  async postPeriodUpdate({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('SupervisePeriod/periodUpdate', data);
  },
  /**
   * @description 记录Excel导出
   */
  async saveOpLog({ commit }: { commit: any }, data: any) {
    const { num, type } = data;
    return postBaseAxiosFunc(`OperationLog/saveOpLog?num=${num}&type=${type}`);
  },
  /**
   * @description 批次号详情-记录excel导出
   */
  async saveBatchOpLog({ commit }: { commit: any }, data: any) {
    const {
      batchNo = '', node, num, type
    } = data;
    return postBaseAxiosFunc(`OperationLog/saveBatchOpLog?batchNo=${batchNo}&node=${node}&num=${num}&type=${type}`);
  },
  /**
   * @description 查看操作日志
   */
  async queryOpLogPageByType({ commit }: { commit: any }, data: any) {
    const { type } = data;
    return postBaseAxiosFunc(`OperationLog/queryOpLogPageByType?type=${type}`, data);
  },
  /**
   * @description 模糊查询待分配教练的学员数据
   */
  async queryAllotCoachesFuzzyUsers({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('studentCoaches/fuzzyUsers', data);
  },
  /**
   * @description 支出复核-分页列表
   */
  async queryReviewList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('review/queryReviewPage', data);
  },
  /**
     * @description 支出复核-统计
     */
  async queryReviewCount({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('review/queryReviewCount', data);
  },
  /**
     * @description 支出复核-复核通过
     */
  async queryModifyReview({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('review/modifyReview', data);
  },
  /**
     * @description 支出复核-导出
     */
  async queryExportReview({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('review/export', data, { hasUseCode: true, responseType: 'arraybuffer' });
  },
  /**
   * @description 转出学员-查询分页
   */
  async queryForwardList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('forward/page', data);
  },
  /**
   * @description 转出学员-取消转出
   */
  async queryForwardCancel({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('forward/cancel', data);
  },
  /**
   * @description 根据教练ID查询负荷学员列表数据
   */
  async queryLoadStudentList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('order/queryLoadStudentPageByCoachId', data);
  },
  /**
   * @description 根据证件号获取学员基础信息,教务带教变更使用接口
   */
  async queryOrderStudentByIdNo({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('order/getStudentByIdNo', data);
  },
  /**
   * @description 学科培训分页列表
   */
  async querySubjectTrains({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('subjectTrains', data);
  },
  /**
   * @description 学科培训-导出
   */
  async subjectTrainsExport({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('subjectTrains/export', data, { hasUseCode: true, responseType: 'arraybuffer' });
  },
  /**
   * @description 学科培训 实操学时更新
   */
  async putSubjectTrainsPeriod({ commit }: { commit: any }, data: any) {
    return putBaseAxiosFunc('subjectTrains/period', data);
  },
  /**
   * @description 学科培训 模拟成绩
   */
  async putSubjectsSimulationExam({ commit }: { commit: any }, data: any) {
    return putBaseAxiosFunc('subjectTrains/simulationExam', data);
  },
  /**
   * @description 学科培训 从斑斑驾校获取成绩
   */
  async queryScoresFromBanban({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('subjectTrains/simulationExam/sync', data);
  },
  /**
   * @description 根据证件号获取学员详情
   */
  async queryOrderTeachStudentByIdNo({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('order/getTeachStudentByIdNo', data);
  },
  /**
   * @description 导出教练的负荷学员
   */
  async exportLoadStudentList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('order/exportLoadStudentList', data, { hasUseCode: true, responseType: 'arraybuffer' });
  },
  /**
   * @description 模糊搜索学员
   */
  async queryRecordingDataByIdNo({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('common/queryRecordingDataByIdNo', data);
  },
  /**
   * @description 转历史审批列表
   */
  async queryTurnHistoryList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('toHistoryApprove/getTurnHistoryList', data);
  },
  /**
   * @description 转历史审批列表-导出
   */
  async exportTurnHistoryList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('toHistoryApprove/exportTurnHistory', data, { hasUseCode: true, responseType: 'arraybuffer' });
  },
  /**
   * @description 转历史审批列表统计
   */
  async queryTurnHistoryListCount({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('toHistoryApprove/getTurnHistoryListCount', data);
  },
  /**
   * @description 转历史--新增审批
   */
  async queryAddTurnHistory({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('toHistoryApprove/addTurnHistory', data);
  },
  /**
   * @description 转历史--通过审批单
   */
  async queryPassApprove({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('toHistoryApprove/passApprove', data);
  },
  /**
   * @description 转历史--撤销审批单
   */
  async queryUndoApprove({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('toHistoryApprove/undoApprove', data);
  },
  /**
   * @description 转历史--驳回审批单
   */
  async queryNoPassApprove({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('toHistoryApprove/noPassApprove', data);
  },
  /**
   * @description 转历史--获取驳回的节点
   */
  async queryToHistoryApproveRejectNodes({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('toHistoryApprove/rejectNodes', data);
  },
  /**
   * @description 转历史--审批详情
   */
  async queryTurnHistoryDetail({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('toHistoryApprove/getTurnHistoryDetail', data);
  },
};

export default {
  namespaced: true,
  actions
};
