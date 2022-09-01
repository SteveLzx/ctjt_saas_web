import axios from '@/assets/js/request';

const BASE_URL = '/workflow/v1/'; // 牌证微服务公共路径

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
   * @description 根据证件号获取学员基础信息,教务带教变更使用接口
   */
  async queryOrderStudentByIdNo({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('order/getStudentByIdNo', data);
  },
  /**
   * @description 根据证件号获取学员基础信息,考试结果变更使用接口
   */
  async queryWorkflowByIdNo({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('common/queryByIdNo', data);
  },
  /**
   * @description 根据证件号获取学员详情
   */
  async queryOrderTeachStudentByIdNo({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('order/getTeachStudentByIdNo', data);
  },
  /**
   * @description 模糊查询待分配教练的学员数据
   */
  async queryAllotCoachesFuzzyUsers({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('allotCoaches/fuzzyUsers', data);
  },
  /**
   * @description 根据教练ID查询负荷学员列表数据
   */
  async queryLoadStudentList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('allotCoaches/queryLoadStudentPageByCoachId', data);
  },

  /**
   * @description 牌证公共删除接口
   */
  async deleteFlowData({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('common/deleteFlowData', data);
  },
  /**
   * @description 无纸化采集分页列表
   */
  async paperList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('paper/page', data);
  },
  /**
   * @description 采集指纹
   */
  async paperCollectList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('paper/collect', data);
  },
  /**
   * @description 考试交费分页列表
   */
  async queryCostPageList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('cost/queryCostPage', data);
  },
  /**
   * @description 考试交费统计
   */
  async countCostData({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('cost/countCostData', data);
  },
  /**
   * @description 代交交费、自交确认
   */
  async postActCost({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('cost/actCost', data);
  },
  /**
   * @description 考试交费取消考试
   */
  async postModifyCostStatus({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('cost/modifyCostStatus', data);
  },
  /**
   * @description 考试批复分页列表
   */
  async queryReplyPage({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('reply/queryReplyPage', data);
  },
  /**
   * @description 考试批复-异常已处理
   */
  async postModifyReplyStatus({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('reply/modifyReplyStatus', data);
  },
  /**
   * @description 考试批复-批复
   */
  async postReply({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('reply/reply', data);
  },
  /**
   * @description 考试结果分页列表
   */
  async queryResultPage({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('result/queryResultPage', data);
  },
  /**
   * @description 考试结果-考试结果
   */
  async postExamResult({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('result/examResult', data);
  },
  /**
   * @description 考试结果-取消考试
   */
  async postModifyCancelStatus({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('result/modifyCancelStatus', data);
  },
  /** 考试结果-考试结果变更分页列表 */
  async postqueryResultChangePage({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('resultChangeRecord/queryPage', data);
  },
  /** 考试结果-通过证件号和科目获取学员变更记录 */
  async getResultChangeRecord({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('resultChangeRecord/queryDetail', data);
  },
  /** 考试结果-新增考试结果变更 */
  async postcreateResultChange({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('resultChangeRecord/createResultChange', data);
  },
  /** 考试结果-考试结果变更查询详情 */
  async getqueryResultChangeDetail({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('resultChangeRecord/queryDetailBySeq', data);
  },
  /**
   * @description 考试报考分页列表
   */
  async queryExamRegistrationList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('examRegistration/queryExamRegistrationList', data);
  },
  /**
   * @description 考试报考-报考
   */
  async postExamRegistration({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('examRegistration/examRegistration', data);
  },
  /**
   * @description 分配教练分页列表
   */
  async queryAllotCoaches({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('allotCoaches', data);
  },
  /**
   * @description 分配教练-分配教练
   */
  async postAllotCoachesCoach({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('allotCoaches/coach', data);
  },
  /**
   * @description 所有的教练列表
   */
  async getAllotCoachesCoaches({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('allotCoaches/coaches', data);
  },
  /**
   * @description 学科培训分页列表
   */
  async querySubjectTrains({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('subjectTrains', data);
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
    return postBaseAxiosFunc('supervises/exportExcel?type=1', data, { hasUseCode: true, responseType: 'arraybuffer' });
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
  /**
   * @description 资金监管存入 查看操作日志
   */
  async getSupervisesOperateLogs({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('supervises/operateLogs', data);
  },
  /**
   * @description 考场受理分页列表
   */
  async queryExamAcceptList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('examAccept/page', data);
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
   * @description 考场受理 受理成功/受理失败
   */
  async postExamAcceptAccept({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('examAccept/accept', data);
  },
  /**
   * @description 办证信息变更 列表
   */
  async queryMsgChangeList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('messagesChange/queryMsgChangeListPage', data);
  },
  /**
   * @description 办证信息变更 详情
   */
  async queryChangeDetailedById({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('messagesChange/getChangeDetailedById', data);
  },
  /**
   * @description 办证信息变更 日志
   */
  async queryMsgChangeLogList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('messagesChange/queryMsgChangeLogPage', data);
  },
  /**
   * @description 办证信息变更 记录Excel导出
   */
  async queryRecordExcelExport({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('messagesChange/recordExcelExport', data);
  },
  /**
   * @description 档案归档 列表
   */
  async queryFilesList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('files', data);
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
    const { type, batchNo = '', list } = data;
    return postBaseAxiosFunc(`files/dispose?type=${type}&batchNo=${batchNo}`, list);
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
   * @description 撤销办证-模糊搜索证件信息
   */
  async queryRevocationDetail({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('revocation/queryDetail', data);
  },
  /**
   * @description 撤销办证-分页
   */
  async queryRevocationApproveList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('revocation/queryApprovePage', data);
  },
  /**
   * @description 撤销办证-新增
   */
  async queryRevocationSave({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('revocation/save', data);
  },
  /**
   * @description 撤销办证-审批
   */
  async queryRevocationApprove({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('revocation/approve', data);
  },
  /**
   * @description 撤销办证-撤回
   */
  async queryApprovalModifyStatus({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('approval/modifyStatus', data);
  },
  /**
   * @description 撤销办证-详情
   */
  async queryApprovalDetail({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('approval/queryDetail', data);
  },
  /**
   * @description 批次号管理-列表
   */
  async queryBatchNoList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('batchNoManage/queryBatchNoListPage', data);
  },
  /**
   * @description 批次号详情-分页
   */
  async queryBatchNoMsg({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('batchNoManage/queryBatchNoMsg', data);
  },
  /**
   * @description 批次号详情-记录excel导出
   */
  async queryBatchOperationLog({ commit }: { commit: any }, data: any) {
    const {
      batchNo = '', node, num, type
    } = data;
    return postBaseAxiosFunc(`OperationLog/saveBatchOpLog?batchNo=${batchNo}&node=${node}&num=${num}&type=${type}`);
  },
  /**
   * @description 记录Excel导出
   */
  async querySaveOpLog({ commit }: { commit: any }, data: any) {
    const { num, type } = data;
    return postBaseAxiosFunc(`OperationLog/saveOpLog?num=${num}&type=${type}`);
  },
  /**
   * @description 操作日志
   */
  async queryOpLogPageByType({ commit }: { commit: any }, data: any) {
    const { type, sendData } = data;
    return postBaseAxiosFunc(`OperationLog/queryOpLogPageByType?type=${type}`, sendData);
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
   * @description 撤销办证-通过身份证查询信息
   */
  async queryByIdNo({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('queryData/queryByIdNo', data);
  },
  /**
   * @description 成绩单 列表
   */
  async queryReportCardList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('report/queryPage', data);
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
  // 惠州深港新增节点 begin
  /**
   * @description 场点交表-分页
   */
  async queryFieldPointList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('fieldPoint/page', data);
  },
  /**
   * @description 场点交表-交表
   */
  async queryFieldPointDeliver({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('fieldPoint/deliver', data);
  },
  /**
   * @description 牌证收表-分页
   */
  async queryRecoveryTableList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('recoveryTable/page', data);
  },
  /**
   * @description 牌证收表-收表
   */
  async queryRecoveryTableRecovery({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('recoveryTable/recovery', data);
  },
  /**
   * @description 车管所送审-分页
   */
  async queryDmvList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('dmv/page', data);
  },
  /**
   * @description 车管所送审-送审
   */
  async queryDmvInspection({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('dmv/inspection', data);
  },
  /**
   * @description 上课情况-分页
   */
  async queryAttendClassList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('attendClass/page', data);
  },
  /**
   * @description 上课情况-已上课
   */
  async queryAttendClassAttendClass({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('attendClass/attendClass', data);
  },

  // 惠州深港新增节点 end
  // 牌证三期-学员综合档案 begin
  /**
   * @description 学员综合档案-分页列表
   */
  async queryRecordList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('record/queryPage', data);
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
   * @description 学员综合档案-详情
   */
  async queryOrderDetail({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('record/queryOrderDetail', data);
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
   * @description 学员综合档案-服务跟踪记录
   */
  async queryTrackingList({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('tracking/queryTracking', data);
  },

  /**
   * @description 学员综合档案-操作日志
   */
  async queryChangeLogRecordList({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('record/queryChange', data);
  },

  // 牌证三期-学员综合档案 end

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
   * @description 导出教练的负荷学员
   */
  async exportLoadStudentList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('allotCoaches/exportLoadStudentList', data, { hasUseCode: true, responseType: 'arraybuffer' });
  },
};

export default {
  namespaced: true,
  actions
};
