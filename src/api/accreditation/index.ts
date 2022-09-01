// 无纸化采集导入办证数据
const API_WORKFLOW_V1_PAPER_READEXCEL = '/workflow/v1/paper/readExcel';
// 无纸化采集-补录
const API_WORKFLOW_V1_PAPER_BATCHCOLLECT = '/workflow/v1/paper/batchCollect';
// 无纸化采集-变更
const API_WORKFLOW_V1_PAPER_PAPERLESSCHANGE = '/workflow/v1/messagesChange/paperlessChange';
// 无纸化采集-快速录入
const API_WORKFLOW_V1_PAPER_QUICKCOLLECT = '/workflow/v1/paper/quickCollect';
// 考试交费导入办证数据
const API_WORKFLOW_V1_COST_READEXCEL = '/workflow/v1/cost/readExcel';
// 考试交费-补录
const API_WORKFLOW_V1_COST_BATCHCOST = '/workflow/v1/cost/batchCost';
// 考试交费-变更
const API_WORKFLOW_V1_COST_COSTCHANGE = '/workflow/v1/messagesChange/costChange';
// 考试交费-快速录入
const API_WORKFLOW_V1_COST_QUICKCOST = '/workflow/v1/cost/quickCost';
// 考试批复导入办证数据
const API_WORKFLOW_V1_REPLY_READEXCEL = '/workflow/v1/reply/readExcel';
// 考试批复-补录
const API_WORKFLOW_V1_REPLY_BATCHREPLY = '/workflow/v1/reply/batchReply';
// 考试批复-变更
const API_WORKFLOW_V1_REPLY_EXAMREPLYCHANGE = '/workflow/v1/messagesChange/examReplyChange';
// 考试批复-快速录入
const API_WORKFLOW_V1_REPLY_QUICKREPLY = '/workflow/v1/reply/quickReply';
// 考试结果导入办证数据
const API_WORKFLOW_V1_RESULT_READEXCEL = '/workflow/v1/result/readExcel';
// 考试结果-补录
const API_WORKFLOW_V1_RESULT_BATCHRESULT = '/workflow/v1/result/batchResult';
// 考试结果-快速录入
const API_WORKFLOW_V1_RESULT_QUICKRESULT = '/workflow/v1/result/quickResult';
// 考试结果-导出
const API_WORKFLOW_V1_RESULT_EXPORT = '/workflow/v1/result/export';
// 考试结果变更-导出
const API_WORKFLOW_V1_RESULTCHANGERECORD_EXPORT = '/workflow/v1/resultChangeRecord/export';
// 考试报考导入办证数据
const API_WORKFLOW_V1_APPLYEXAM_READEXCEL = '/workflow/v1/examRegistration/readExcel';
// 学科培训导入办证数据
const API_WORKFLOW_V1_SUBJECTTRAINS_IMPORTEXCEL = '/workflow/v1/subjectTrains/importExcel';
// 资金监管存入导入办证数据
const API_WORKFLOW_V1_SUPERVISES_IMPORTEXCEL = '/workflow/v1/supervises/importExcel';
// 资金监管存入 获取模糊搜索证件信息
const API_WORKFLOW_V1_SUPERVISES_FUZZYUSERS_GET = '/workflow/v1/supervises/fuzzyUsers';
// 资金监管存入 补录资金监管数据
const API_WORKFLOW_V1_SUPERVISES_REPLENISH_POST = '/workflow/v1/supervises/replenish';
// 监管学时 导入办证数据
const API_WORKFLOW_V1_SUPERVISEPERIOD_READEXCEL = '/workflow/v1/SupervisePeriod/readExcel';
// 考场受理 导入表格
const API_WORKFLOW_V1_EXAMACCEPT_READEXCEL = '/workflow/v1/examAccept/readExcel';
// 考场受理-补录
const API_WORKFLOW_V1_EXAMACCEPT_BATCHACCEPT = '/workflow/v1/examAccept/batchAccept';
// 考场受理-快速录入
const API_WORKFLOW_V1_EXAMACCEPT_QUICKACCEPT = '/workflow/v1/examAccept/quickAccept';
// 统一通过身份证号查询信息接口-变更
const API_WORKFLOW_V1_QUERYDATA_QUERYDATABYIDNO_GET = '/workflow/v1/common/queryDataByIdNo';
// 统一身份证查询信信息接口-补录
const API_WORKFLOW_V1_QUERYDATA_QUERYRECORDINGDATABYIDNO_GET = '/workflow/v1/common/queryRecordingDataByIdNo';
// 撤销办证-通过身份证查询信息
const API_WORKFLOW_V1_QUERYDATA_QUERYBYIDNO_GET = '/workflow/v1/common/queryByIdNo';
// 成绩单-导入表格
const API_WORKFLOW_V1_REPORT_READEXCEL = '/workflow/v1/report/readExcel';
// 转出学员-快速录入
const API_WORKFLOW_V1_FORWARD_QUICKFORWARD = '/workflow/v1/forward/quickForward';
// 转出学员-补录
const API_WORKFLOW_V1_FORWARD_BATCHFORWARD = '/workflow/v1/forward/batchForward';

// 惠州深港新增节点
// 场点交表-导入
const API_WORKFLOW_V1_FIELDPOINT_READEXCEL = '/workflow/v1/fieldPoint/readExcel';
// 场点交表-补录
const API_WORKFLOW_V1_FIELDPOINT_BATCHDELIVER = '/workflow/v1/fieldPoint/batchDeliver';
// 场点交表-变更
const API_WORKFLOW_V1_MESSAGESCHANGE_FIELDPOINTCHANGE = '/workflow/v1/messagesChange/fieldPointChange';
// 场点交表-快速录入
const API_WORKFLOW_V1_FIELDPOINT_QUICKDELIVER = '/workflow/v1/fieldPoint/quickDeliver';
// 牌证收表-导入
const API_WORKFLOW_V1_RECOVERYTABLE_READEXCEL = '/workflow/v1/recoveryTable/readExcel';
// 牌证收表-补录
const API_WORKFLOW_V1_RECOVERYTABLE_BATCHRECOVERY = '/workflow/v1/recoveryTable/batchRecovery';
// 牌证收表-变更
const API_WORKFLOW_V1_MESSAGESCHANGE_RECOVERYTABLECHANGE = '/workflow/v1/messagesChange/recoveryTableChange';
// 牌证收表-快速录入
const API_WORKFLOW_V1_RECOVERYTABLE_QUICKRECOVERY = '/workflow/v1/recoveryTable/quickRecovery';
// 车管所送审-导入
const API_WORKFLOW_V1_DMV_READEXCEL = '/workflow/v1/dmv/readExcel';
// 车管所送审-补录
const API_WORKFLOW_V1_DMV_BATCHINSPECTION = '/workflow/v1/dmv/batchInspection';
// 车管所送审-变更
const API_WORKFLOW_V1_MESSAGESCHANGE_INSPECTIONCHANGE = '/workflow/v1/messagesChange/inspectionChange';
// 车管所送审-快速录入
const API_WORKFLOW_V1_DMV_QUICKINSPECTION = '/workflow/v1/dmv/quickInspection';
// 上课情况-导入
const API_WORKFLOW_V1_ATTENDCLASS_READEXCEL = '/workflow/v1/attendClass/readExcel';
// 上课情况-补录
const API_WORKFLOW_V1_ATTENDCLASS_BATCHATTENDCLASS = '/workflow/v1/attendClass/batchAttendClass';
// 上课情况-快速录入
const API_WORKFLOW_V1_ATTENDCLASS_QUICKATTENDCLASS = '/workflow/v1/attendClass/quickAttendClass ';
// 成绩单-快速录入
const API_WORKFLOW_V1_REPORT_QUICKREPORT = '/workflow/v1/report/quickReport';

export {
  API_WORKFLOW_V1_PAPER_READEXCEL,
  API_WORKFLOW_V1_PAPER_BATCHCOLLECT,
  API_WORKFLOW_V1_PAPER_PAPERLESSCHANGE,
  API_WORKFLOW_V1_PAPER_QUICKCOLLECT,
  API_WORKFLOW_V1_REPLY_READEXCEL,
  API_WORKFLOW_V1_REPLY_BATCHREPLY,
  API_WORKFLOW_V1_REPLY_EXAMREPLYCHANGE,
  API_WORKFLOW_V1_REPLY_QUICKREPLY,
  API_WORKFLOW_V1_COST_READEXCEL,
  API_WORKFLOW_V1_COST_BATCHCOST,
  API_WORKFLOW_V1_COST_COSTCHANGE,
  API_WORKFLOW_V1_COST_QUICKCOST,
  API_WORKFLOW_V1_RESULT_READEXCEL,
  API_WORKFLOW_V1_RESULT_BATCHRESULT,
  API_WORKFLOW_V1_RESULT_QUICKRESULT,
  API_WORKFLOW_V1_RESULT_EXPORT,
  API_WORKFLOW_V1_RESULTCHANGERECORD_EXPORT,
  API_WORKFLOW_V1_APPLYEXAM_READEXCEL,
  API_WORKFLOW_V1_SUBJECTTRAINS_IMPORTEXCEL,
  API_WORKFLOW_V1_SUPERVISES_IMPORTEXCEL,
  API_WORKFLOW_V1_EXAMACCEPT_BATCHACCEPT,
  API_WORKFLOW_V1_EXAMACCEPT_QUICKACCEPT,
  API_WORKFLOW_V1_SUPERVISEPERIOD_READEXCEL,
  API_WORKFLOW_V1_EXAMACCEPT_READEXCEL,
  API_WORKFLOW_V1_SUPERVISES_FUZZYUSERS_GET,
  API_WORKFLOW_V1_SUPERVISES_REPLENISH_POST,
  API_WORKFLOW_V1_QUERYDATA_QUERYDATABYIDNO_GET,
  API_WORKFLOW_V1_QUERYDATA_QUERYRECORDINGDATABYIDNO_GET,
  API_WORKFLOW_V1_QUERYDATA_QUERYBYIDNO_GET,
  API_WORKFLOW_V1_FIELDPOINT_READEXCEL,
  API_WORKFLOW_V1_FIELDPOINT_BATCHDELIVER,
  API_WORKFLOW_V1_MESSAGESCHANGE_FIELDPOINTCHANGE,
  API_WORKFLOW_V1_FIELDPOINT_QUICKDELIVER,
  API_WORKFLOW_V1_RECOVERYTABLE_READEXCEL,
  API_WORKFLOW_V1_RECOVERYTABLE_BATCHRECOVERY,
  API_WORKFLOW_V1_MESSAGESCHANGE_RECOVERYTABLECHANGE,
  API_WORKFLOW_V1_RECOVERYTABLE_QUICKRECOVERY,
  API_WORKFLOW_V1_DMV_READEXCEL,
  API_WORKFLOW_V1_DMV_BATCHINSPECTION,
  API_WORKFLOW_V1_MESSAGESCHANGE_INSPECTIONCHANGE,
  API_WORKFLOW_V1_DMV_QUICKINSPECTION,
  API_WORKFLOW_V1_ATTENDCLASS_READEXCEL,
  API_WORKFLOW_V1_ATTENDCLASS_BATCHATTENDCLASS,
  API_WORKFLOW_V1_ATTENDCLASS_QUICKATTENDCLASS,
  API_WORKFLOW_V1_REPORT_READEXCEL,
  API_WORKFLOW_V1_REPORT_QUICKREPORT,
  API_WORKFLOW_V1_FORWARD_QUICKFORWARD,
  API_WORKFLOW_V1_FORWARD_BATCHFORWARD
};
