/** 1、资金监管存入、监管学时、分配教练不进入批次号管理
 *  2、学科培训只在批次号管理中展示数据，不进行导入和补录以及变更操作
 *  3、考场受理、学科培训、考试结果不进行变更
 */
import {
  API_LICENSE_V1_QUERYDATA_QUERYRECORDINGDATABYIDNO_GET,
  API_LICENSE_V1_PAPER_READEXCEL,
  API_LICENSE_V1_PAPER_BATCHCOLLECT,
  API_LICENSE_V1_PAPER_QUICKCOLLECT,
  API_LICENSE_V1_RESULT_READEXCEL,
  API_LICENSE_V1_RESULT_BATCHRESULT,
  API_LICENSE_V1_RESULT_QUICKRESULT,
  API_LICENSE_V1_COST_READEXCEL,
  API_LICENSE_V1_COST_BATCHCOST,
  API_LICENSE_V1_COST_QUICKCOST,
  API_LICENSE_V1_REPLY_READEXCEL,
  API_LICENSE_V1_REPLY_BATCHREPLY,
  API_LICENSE_V1_REPLY_QUICKREPLY,
  API_LICENSE_V1_EXAMACCEPT_READEXCEL,
  API_LICENSE_V1_EXAMACCEPT_BATCHACCEPT,
  API_LICENSE_V1_EXAMACCEPT_QUICKACCEPT,
  API_LICENSE_V1_SUPERVISES_IMPORTEXCEL,
  API_LICENSE_V1_SUPERVISEPERIOD_READEXCEL,
  API_LICENSE_V1_SUPERVISES_FUZZYUSERS_GET,
  API_LICENSE_V1_SUPERVISES_REPLENISH_POST,
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
  API_LICENSE_V1_REPORT_READEXCEL,
  API_LICENSE_V1_REPORT_QUICKREPORT,
  API_LICENSE_V1_FORWARD_QUICKFORWARD,
  API_LICENSE_V1_FORWARD_BATCHFORWARD,
  API_LICENSE_V1_SUBJECTTRAINS_BATCHSUBJECTTRAINS,
  API_LICENSE_V1_SUBJECTTRAINS_QUICKSUBJECTTRAINS,
  API_LICENSE_V1_SUBJECTTRAINS_READEXCEL,
} from '@/api';

// 办证各节点配置
// label: '无纸化采集', // 办证科目名称
// id: 1, // 办证科目类型id
// code: 'paperless_collect', // 办证科目code
// uploadPath: API_LICENSE_V1_PAPER_READEXCEL, // 导入办证数据api
// supplementPath: '', // 补录数据api
// changeInfoPath: '', // 变更api
// cantSupplement: true,// 是否可补录 true:不可补录，false|undefined：可补录
// cantChangeInfo: true,// 是否可变更 true:不可变更，false|undefined：可变更

const importProps = [
  {
    label: '无纸化采集', // 办证科目名称
    id: 1, // 办证科目类型id
    code: 'paperless_collect', // 办证科目code
    uploadPath: API_LICENSE_V1_PAPER_READEXCEL, // 导入办证数据api
    supplementPath: API_LICENSE_V1_PAPER_BATCHCOLLECT, // 补录数据api
    quickEntryPath: API_LICENSE_V1_PAPER_QUICKCOLLECT, // 快速录入api
    supplementIdNoPath: API_LICENSE_V1_QUERYDATA_QUERYRECORDINGDATABYIDNO_GET, // 根据身份证号搜索-补录/快速录入
    drivingSchoolId: '',
    changeInfoPath: '', // 变更api
    idNoPath: '', // 变更-根据身份证号搜索详情,
  },
  {
    label: '场点交表',
    id: 7,
    code: 'site_delivery_table',
    uploadPath: API_LICENSE_V1_FIELDPOINT_READEXCEL,
    supplementPath: API_LICENSE_V1_FIELDPOINT_BATCHDELIVER,
    quickEntryPath: API_LICENSE_V1_FIELDPOINT_QUICKDELIVER,
    supplementIdNoPath: API_LICENSE_V1_QUERYDATA_QUERYRECORDINGDATABYIDNO_GET,
    drivingSchoolId: '',
    changeInfoPath: '',
    idNoPath: '',
  },
  {
    label: '牌证收表',
    id: 8,
    code: 'license_receipt_form',
    uploadPath: API_LICENSE_V1_RECOVERYTABLE_READEXCEL,
    supplementPath: API_LICENSE_V1_RECOVERYTABLE_BATCHRECOVERY,
    quickEntryPath: API_LICENSE_V1_RECOVERYTABLE_QUICKRECOVERY,
    supplementIdNoPath: API_LICENSE_V1_QUERYDATA_QUERYRECORDINGDATABYIDNO_GET,
    drivingSchoolId: '',
    changeInfoPath: '',
    idNoPath: '',
  },
  {
    label: '车管所送审',
    id: 9,
    code: 'vehicle_approval',
    uploadPath: API_LICENSE_V1_DMV_READEXCEL,
    supplementPath: API_LICENSE_V1_DMV_BATCHINSPECTION,
    quickEntryPath: API_LICENSE_V1_DMV_QUICKINSPECTION,
    supplementIdNoPath: API_LICENSE_V1_QUERYDATA_QUERYRECORDINGDATABYIDNO_GET,
    drivingSchoolId: '',
    changeInfoPath: '',
    idNoPath: '',
  },
  {
    label: '考场受理',
    id: 2,
    code: 'exam_acceptance',
    uploadPath: API_LICENSE_V1_EXAMACCEPT_READEXCEL,
    supplementPath: API_LICENSE_V1_EXAMACCEPT_BATCHACCEPT,
    quickEntryPath: API_LICENSE_V1_EXAMACCEPT_QUICKACCEPT,
    supplementIdNoPath: API_LICENSE_V1_QUERYDATA_QUERYRECORDINGDATABYIDNO_GET,
    cantChangeInfo: true,
    drivingSchoolId: '',
    tabType: 1,
  },
  {
    label: '上课情况',
    id: 10,
    code: 'class_situation',
    uploadPath: API_LICENSE_V1_ATTENDCLASS_READEXCEL,
    supplementPath: API_LICENSE_V1_ATTENDCLASS_BATCHATTENDCLASS,
    quickEntryPath: API_LICENSE_V1_ATTENDCLASS_QUICKATTENDCLASS,
    supplementIdNoPath: API_LICENSE_V1_QUERYDATA_QUERYRECORDINGDATABYIDNO_GET,
    drivingSchoolId: '',
    cantChangeInfo: true,
  },
  {
    label: '成绩单',
    id: 23,
    code: 'report_card',
    uploadPath: API_LICENSE_V1_REPORT_READEXCEL,
    supplementPath: '',
    quickEntryPath: API_LICENSE_V1_REPORT_QUICKREPORT,
    supplementIdNoPath: API_LICENSE_V1_QUERYDATA_QUERYRECORDINGDATABYIDNO_GET,
    drivingSchoolId: '',
  },
  {
    label: '学科培训',
    id: 24,
    code: 'subject_training',
    uploadPath: API_LICENSE_V1_SUBJECTTRAINS_READEXCEL,
    supplementPath: API_LICENSE_V1_SUBJECTTRAINS_BATCHSUBJECTTRAINS,
    quickEntryPath: API_LICENSE_V1_SUBJECTTRAINS_QUICKSUBJECTTRAINS,
    supplementIdNoPath: API_LICENSE_V1_QUERYDATA_QUERYRECORDINGDATABYIDNO_GET,
    drivingSchoolId: '',
  },
  {
    label: '考试批复',
    id: 4,
    code: 'exam_approval',
    uploadPath: API_LICENSE_V1_REPLY_READEXCEL,
    supplementPath: API_LICENSE_V1_REPLY_BATCHREPLY,
    quickEntryPath: API_LICENSE_V1_REPLY_QUICKREPLY,
    supplementIdNoPath: API_LICENSE_V1_QUERYDATA_QUERYRECORDINGDATABYIDNO_GET,
    drivingSchoolId: '',
    changeInfoPath: '',
    idNoPath: '',
  },
  {
    label: '考试交费',
    id: 5,
    code: 'exam_fee',
    uploadPath: API_LICENSE_V1_COST_READEXCEL,
    supplementPath: API_LICENSE_V1_COST_BATCHCOST,
    quickEntryPath: API_LICENSE_V1_COST_QUICKCOST,
    supplementIdNoPath: API_LICENSE_V1_QUERYDATA_QUERYRECORDINGDATABYIDNO_GET,
    drivingSchoolId: '',
    changeInfoPath: '',
    idNoPath: '',
  },
  {
    label: '考试结果',
    id: 6,
    code: 'exam_results',
    uploadPath: API_LICENSE_V1_RESULT_READEXCEL,
    supplementPath: API_LICENSE_V1_RESULT_BATCHRESULT,
    quickEntryPath: API_LICENSE_V1_RESULT_QUICKRESULT,
    supplementIdNoPath: API_LICENSE_V1_QUERYDATA_QUERYRECORDINGDATABYIDNO_GET,
    cantChangeInfo: true,
    drivingSchoolId: '',
  },
  {
    label: '资金监管存入',
    id: 101,
    code: 'capital_supervision',
    uploadPath: API_LICENSE_V1_SUPERVISES_IMPORTEXCEL,
    supplementPath: API_LICENSE_V1_SUPERVISES_REPLENISH_POST,
    supplementIdNoPath: API_LICENSE_V1_SUPERVISES_FUZZYUSERS_GET,
    drivingSchoolId: '',
  },
  {
    label: '监管学时',
    id: 102,
    code: 'supervision_hours',
    uploadPath: API_LICENSE_V1_SUPERVISEPERIOD_READEXCEL,
    supplementPath: '',
    drivingSchoolId: '',
  },
  {
    label: '学员转出',
    id: 111,
    code: 'transfer_out',
    uploadPath: '',
    supplementPath: API_LICENSE_V1_FORWARD_BATCHFORWARD,
    quickEntryPath: API_LICENSE_V1_FORWARD_QUICKFORWARD,
    supplementIdNoPath: API_LICENSE_V1_QUERYDATA_QUERYRECORDINGDATABYIDNO_GET,
    drivingSchoolId: '',
  },
  {
    label: '档案归档/退档',
    id: 112,
    code: 'file_filing',
    uploadPath: '',
    supplementPath: '',
    drivingSchoolId: '',
  },
];

export default importProps;
