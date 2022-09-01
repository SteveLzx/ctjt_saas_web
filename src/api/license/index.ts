// 无纸化采集-导入
const API_LICENSE_V1_PAPER_READEXCEL = '/license/v1/paper/readExcel';
// 无纸化采集-补录
const API_LICENSE_V1_PAPER_BATCHCOLLECT = '/license/v1/paper/batchCollect';
// 无纸化采集-快速录入
const API_LICENSE_V1_PAPER_QUICKCOLLECT = '/license/v1/paper/quickCollect';
// 场点交表-导入
const API_LICENSE_V1_FIELDPOINT_READEXCEL = '/license/v1/fieldPoint/readExcel';
// 场点交表-补录
const API_LICENSE_V1_FIELDPOINT_BATCHDELIVER = '/license/v1/fieldPoint/batchDeliver';
// 场点交表-快速录入
const API_LICENSE_V1_FIELDPOINT_QUICKDELIVER = '/license/v1/fieldPoint/quickDeliver';
// 牌证收表-导入
const API_LICENSE_V1_RECOVERYTABLE_READEXCEL = '/license/v1/recoveryTable/readExcel';
// 牌证收表-补录
const API_LICENSE_V1_RECOVERYTABLE_BATCHRECOVERY = '/license/v1/recoveryTable/batchRecovery';
// 牌证收表-快速录入
const API_LICENSE_V1_RECOVERYTABLE_QUICKRECOVERY = '/license/v1/recoveryTable/quickRecovery';
// 车管所送审-导入
const API_LICENSE_V1_DMV_READEXCEL = '/license/v1/dmv/readExcel';
// 车管所送审-补录
const API_LICENSE_V1_DMV_BATCHINSPECTION = '/license/v1/dmv/batchInspection';
// 车管所送审-快速录入
const API_LICENSE_V1_DMV_QUICKINSPECTION = '/license/v1/dmv/quickInspection';
// 上课情况-导入
const API_LICENSE_V1_ATTENDCLASS_READEXCEL = '/license/v1/attendClass/readExcel';
// 上课情况-补录
const API_LICENSE_V1_ATTENDCLASS_BATCHATTENDCLASS = '/license/v1/attendClass/batchAttendClass';
// 上课情况-快速录入
const API_LICENSE_V1_ATTENDCLASS_QUICKATTENDCLASS = '/license/v1/attendClass/quickAttendClass ';
// 考场受理-导入
const API_LICENSE_V1_EXAMACCEPT_READEXCEL = '/license/v1/examAccept/readExcel';
// 考场受理-补录
const API_LICENSE_V1_EXAMACCEPT_BATCHACCEPT = '/license/v1/examAccept/batchAccept';
// 考场受理-快速录入
const API_LICENSE_V1_EXAMACCEPT_QUICKACCEPT = '/license/v1/examAccept/quickAccept';
// 学科培训-补录
const API_LICENSE_V1_SUBJECTTRAINS_BATCHSUBJECTTRAINS = '/license/v1/subjectTrains/batchSubjectTrains';
// 学科培训-快速录入
const API_LICENSE_V1_SUBJECTTRAINS_QUICKSUBJECTTRAINS = '/license/v1/subjectTrains/quickSubjectTrains';
// 学科培训-导入
const API_LICENSE_V1_SUBJECTTRAINS_READEXCEL = '/license/v1/subjectTrains/readExcel';
// 考试交费-导入
const API_LICENSE_V1_COST_READEXCEL = '/license/v1/cost/readExcel';
// 考试交费-补录
const API_LICENSE_V1_COST_BATCHCOST = '/license/v1/cost/batchCost';
// 考试交费-快速录入
const API_LICENSE_V1_COST_QUICKCOST = '/license/v1/cost/quickCost';
// 考试批复-导入
const API_LICENSE_V1_REPLY_READEXCEL = '/license/v1/reply/readExcel';
// 考试批复-补录
const API_LICENSE_V1_REPLY_BATCHREPLY = '/license/v1/reply/batchReply';
// 考试批复-快速录入
const API_LICENSE_V1_REPLY_QUICKREPLY = '/license/v1/reply/quickReply';
// 考试结果-导入
const API_LICENSE_V1_RESULT_READEXCEL = '/license/v1/result/readExcel';
// 考试结果-补录
const API_LICENSE_V1_RESULT_BATCHRESULT = '/license/v1/result/batchResult';
// 考试结果-快速录入
const API_LICENSE_V1_RESULT_QUICKRESULT = '/license/v1/result/quickResult';
// 考试结果变更-导出
const API_LICENSE_V1_RESULTCHANGE_EXPORT = '/license/v1/resultChange/export';
// 成绩单-导入表格
const API_LICENSE_V1_REPORT_READEXCEL = '/license/v1/report/readExcel';
// 成绩单-快速录入
const API_LICENSE_V1_REPORT_QUICKREPORT = '/license/v1/report/quickReport';
// 资金监管存入-导入
const API_LICENSE_V1_SUPERVISES_IMPORTEXCEL = '/license/v1/supervises/importExcel';
// 资金监管存-获取模糊搜索证件信息
const API_LICENSE_V1_SUPERVISES_FUZZYUSERS_GET = '/license/v1/supervises/fuzzyUsers';
// 资金监管存入-补录
const API_LICENSE_V1_SUPERVISES_REPLENISH_POST = '/license/v1/supervises/replenish';
// 监管学时-导入
const API_LICENSE_V1_SUPERVISEPERIOD_READEXCEL = '/license/v1/SupervisePeriod/readExcel';
// 撤销办证-通过身份证查询信息
const API_LICENSE_V1_QUERYDATA_QUERYBYIDNO_GET = '/license/v1/common/queryByIdNo';
// 统一身份证查询信信息接口-补录/快速录入
const API_LICENSE_V1_QUERYDATA_QUERYRECORDINGDATABYIDNO_GET = '/license/v1/common/queryRecordingDataByIdNo';
// 转出学员-快速录入
const API_LICENSE_V1_FORWARD_QUICKFORWARD = '/license/v1/forward/quickForward';
// 转出学员-补录
const API_LICENSE_V1_FORWARD_BATCHFORWARD = '/license/v1/forward/batchForward';

export {
  API_LICENSE_V1_PAPER_READEXCEL,
  API_LICENSE_V1_PAPER_BATCHCOLLECT,
  API_LICENSE_V1_PAPER_QUICKCOLLECT,
  API_LICENSE_V1_FIELDPOINT_READEXCEL,
  API_LICENSE_V1_FIELDPOINT_BATCHDELIVER,
  API_LICENSE_V1_FIELDPOINT_QUICKDELIVER,
  API_LICENSE_V1_RECOVERYTABLE_READEXCEL,
  API_LICENSE_V1_RECOVERYTABLE_BATCHRECOVERY,
  API_LICENSE_V1_RECOVERYTABLE_QUICKRECOVERY,
  API_LICENSE_V1_DMV_READEXCEL,
  API_LICENSE_V1_DMV_BATCHINSPECTION,
  API_LICENSE_V1_DMV_QUICKINSPECTION,
  API_LICENSE_V1_ATTENDCLASS_READEXCEL,
  API_LICENSE_V1_ATTENDCLASS_BATCHATTENDCLASS,
  API_LICENSE_V1_ATTENDCLASS_QUICKATTENDCLASS,
  API_LICENSE_V1_EXAMACCEPT_READEXCEL,
  API_LICENSE_V1_EXAMACCEPT_BATCHACCEPT,
  API_LICENSE_V1_EXAMACCEPT_QUICKACCEPT,
  API_LICENSE_V1_SUBJECTTRAINS_BATCHSUBJECTTRAINS,
  API_LICENSE_V1_SUBJECTTRAINS_QUICKSUBJECTTRAINS,
  API_LICENSE_V1_SUBJECTTRAINS_READEXCEL,
  API_LICENSE_V1_COST_READEXCEL,
  API_LICENSE_V1_COST_BATCHCOST,
  API_LICENSE_V1_COST_QUICKCOST,
  API_LICENSE_V1_REPLY_READEXCEL,
  API_LICENSE_V1_REPLY_BATCHREPLY,
  API_LICENSE_V1_REPLY_QUICKREPLY,
  API_LICENSE_V1_RESULT_READEXCEL,
  API_LICENSE_V1_RESULT_BATCHRESULT,
  API_LICENSE_V1_RESULT_QUICKRESULT,
  API_LICENSE_V1_RESULTCHANGE_EXPORT,
  API_LICENSE_V1_REPORT_READEXCEL,
  API_LICENSE_V1_REPORT_QUICKREPORT,
  API_LICENSE_V1_SUPERVISES_IMPORTEXCEL,
  API_LICENSE_V1_SUPERVISES_FUZZYUSERS_GET,
  API_LICENSE_V1_SUPERVISES_REPLENISH_POST,
  API_LICENSE_V1_SUPERVISEPERIOD_READEXCEL,
  API_LICENSE_V1_QUERYDATA_QUERYBYIDNO_GET,
  API_LICENSE_V1_QUERYDATA_QUERYRECORDINGDATABYIDNO_GET,
  API_LICENSE_V1_FORWARD_QUICKFORWARD,
  API_LICENSE_V1_FORWARD_BATCHFORWARD
};
