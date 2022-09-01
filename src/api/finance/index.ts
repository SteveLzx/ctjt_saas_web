// 系统交易流水-导出
const API_FINANCE_V1_TRANSACTIONRECORD_EXPORTTRANSACTIONRECORDEXCEL = '/finance/v1/transactionRecord/exportTransactionRecordExcel';
// 系统交易流水-导出打发票
const API_FINANCE_V1_TRANSACTIONRECORD_EXPORTTRANSACTIONTOINVOICE = '/finance/v1/transactionRecord/exportTransactionToInvoice';
// 系统交易流水-导入发票信息
const API_FINANCE_V1_TRANSACTIONRECORD_IMPORTINVOICEINFORMATIONEXCEL = '/finance/v1/transactionRecord/importInvoiceInformationExcel';
// 代收交易流水-导出
const API_FINANCE_V1_SUBSTITUTERECORD_EXPORTSUBSTITUTERECORD = '/finance/v1/substituteRecord/exportSubstituteRecord';
// pos刷卡交易流水-导出
const API_FINANCE_V1_POSRECORD_EXPORTPOSRECORDEXCEL = '/finance/v1/posRecord/exportPosRecordExcel';
// pos刷卡交易流水-导入数据
const API_FINANCE_V1_POSRECORD_IMPORTPOSRECORDEXCEL = '/finance/v1/posRecord/importPosRecordExcel';
// pos刷卡交易流水-导入数据-广仁
const API_FINANCE_V1_POSRECORD_IMPORTPOSRECORDEXCEL_GUANGREN = '/finance/v1/posRecord/importPosRecordExcelSZGR';
// 银行转账交易流水-导出
const API_FINANCE_V1_BANKTRANSFERACCOUNT_EXPORTBANKTRANSFEREXCEL = '/finance/v1/bankTransferAccount/exportBankTransferExcel';
// 银行转账交易流水-导入数据
const API_FINANCE_V1_BANKTRANSFERACCOUNT_IMPORTBANKTRANSFER = '/finance/v1/bankTransferAccount/importBankTransfer';
// 第三方交易流水-导出
const API_FINANCE_V1_THIRDTRADE_EXPORTTHIRDTRADEEXCEL = '/finance/v1/thirdTrade/exportThirdTradeExcel';
// 第三方交易流水-导入数据
const API_FINANCE_V1_THIRDTRADE_IMPORTTHIRDTRADE = '/finance/v1/thirdTrade/importThirdTrade';
// 第三方交易流水-导入数据-广仁
const API_FINANCE_V1_THIRDTRADE_IMPORTTHIRDTRADE_GUANGREN = '/finance/v1/thirdTrade/importThirdTradeSZGR';
// 资金监管复核-导入
const API_FINANCE_V1_SUPERVISE_READEXCEL = '/finance/v1/supervise/readExcel';
// 资金监管存入-导出
const API_FINANCE_V1_SUPERVISE_EXPORT = '/finance/v1/supervise/export';
// 其他费用-导入数据
const API_FINANCE_V1_EXPENSES_READEXCEL = '/finance/v1/expenses/readExcel';
// 其他费用-新增数据
const API_FINANCE_V1_EXPENSES_BATCHCREATEDATA = '/finance/v1/expenses/batchCreateData';
// 其他费用-导出
const API_FINANCE_V1_EXPENSES_EXPORT = '/finance/v1/expenses/export';
// 其他费用详情-导出
const API_FINANCE_V1_EXPENSES_DETAIL_EXPORT = '/finance/v1/expenses/detail/export';
// 收据变更管理-导出
const API_FINANCE_V1_APPROVAL_EXPORTAPPROVALLIST = '/finance/v1/approval/ExportApprovalList';
// 学员退费-导出
const API_FINANCE_V1_REFUNDRECORD_EXPORTREFUNDEXCEL = '/finance/v1/refundRecord/exportRefundExcel';
// 散学退费-导出
const API_FINANCE_V1_SANXUEREFUND_EXPORTREFUNDEXCEL = '/finance/v1/scatteredRefund/exportRefundExcel';
// 分阶段确认收入
// 本期招生明细-导出明细
const API_FINANCE_V1_STAGEINCOMECOUNT_ADMISSIONS_EXPORT = '/finance/v1/stageIncomeCount/admissions/export';
// 本期招生明细-导出汇总
const API_FINANCE_V1_STAGEINCOMECOUNT_ADMISSIONS_EXPORTADMISSIONSCOUNT = '/finance/v1/stageIncomeCount/admissions/exportAdmissionsCount';
// 惠州本期退费-导出
const API_FINANCE_V1_STAGEINCOMECOUNT_HUIZHOU_REFUND_EXPORT = '/finance/v1/stageIncomeCount/huiZhou/refund/export';
// 片区库存以及预收
const API_FINANCE_V1_REPERTORY_QUERY = '/finance/v1/repertory/query';
// 本期毕业-明细-导出
const API_FINANCE_V1_GRADUATE_EXPORTGRADUATEDETAIL = '/finance/v1/graduate/exportGraduateDetail';
// 本期毕业（固化）明细-导出
const API_FINANCE_V1_GRADUATE_EXPORTGRADUATECURINGDETAIL = '/finance/v1/graduate/exportGraduateCuringDetail';
// 毕业修正-明细-导出
const API_FINANCE_V1_GRADUATIONCORRECTION_EXPORTGRADUATEDETAIL = '/finance/v1/graduationCorrection/exportGraduateDetail';
// 毕业修正（固化）-明细-导出
const API_FINANCE_V1_GRADUATIONCORRECTION_EXPORTGRADUATECORRECTIONDETAIL = '/finance/v1/graduationCorrection/exportGraduateCorrectionDetail';
export {
  API_FINANCE_V1_TRANSACTIONRECORD_EXPORTTRANSACTIONRECORDEXCEL,
  API_FINANCE_V1_TRANSACTIONRECORD_EXPORTTRANSACTIONTOINVOICE,
  API_FINANCE_V1_TRANSACTIONRECORD_IMPORTINVOICEINFORMATIONEXCEL,
  API_FINANCE_V1_SUBSTITUTERECORD_EXPORTSUBSTITUTERECORD,
  API_FINANCE_V1_POSRECORD_EXPORTPOSRECORDEXCEL,
  API_FINANCE_V1_POSRECORD_IMPORTPOSRECORDEXCEL,
  API_FINANCE_V1_POSRECORD_IMPORTPOSRECORDEXCEL_GUANGREN,
  API_FINANCE_V1_BANKTRANSFERACCOUNT_EXPORTBANKTRANSFEREXCEL,
  API_FINANCE_V1_BANKTRANSFERACCOUNT_IMPORTBANKTRANSFER,
  API_FINANCE_V1_THIRDTRADE_EXPORTTHIRDTRADEEXCEL,
  API_FINANCE_V1_THIRDTRADE_IMPORTTHIRDTRADE,
  API_FINANCE_V1_THIRDTRADE_IMPORTTHIRDTRADE_GUANGREN,
  API_FINANCE_V1_SUPERVISE_READEXCEL,
  API_FINANCE_V1_SUPERVISE_EXPORT,
  API_FINANCE_V1_EXPENSES_READEXCEL,
  API_FINANCE_V1_EXPENSES_BATCHCREATEDATA,
  API_FINANCE_V1_EXPENSES_EXPORT,
  API_FINANCE_V1_EXPENSES_DETAIL_EXPORT,
  API_FINANCE_V1_APPROVAL_EXPORTAPPROVALLIST,
  API_FINANCE_V1_REFUNDRECORD_EXPORTREFUNDEXCEL,
  API_FINANCE_V1_STAGEINCOMECOUNT_ADMISSIONS_EXPORT,
  API_FINANCE_V1_STAGEINCOMECOUNT_ADMISSIONS_EXPORTADMISSIONSCOUNT,
  API_FINANCE_V1_STAGEINCOMECOUNT_HUIZHOU_REFUND_EXPORT,
  API_FINANCE_V1_REPERTORY_QUERY,
  API_FINANCE_V1_GRADUATE_EXPORTGRADUATEDETAIL,
  API_FINANCE_V1_GRADUATE_EXPORTGRADUATECURINGDETAIL,
  API_FINANCE_V1_GRADUATIONCORRECTION_EXPORTGRADUATEDETAIL,
  API_FINANCE_V1_GRADUATIONCORRECTION_EXPORTGRADUATECORRECTIONDETAIL,
  API_FINANCE_V1_SANXUEREFUND_EXPORTREFUNDEXCEL
};
