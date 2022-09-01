import Component, { mixins } from 'vue-class-component';
import { Action } from 'vuex-class';
import FileSaver from 'file-saver';
import { Watch } from 'vue-property-decorator';
import { ParamsType, TableOptionsValue, VueComponentParent } from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import {
  FILTER_EXCEL_TYPE, REG_PRICE, Sum, timestampSizeCompare, formatPrice
} from '@/assets/js/common';
import {
  ORDER_TYPE,
  INVOICE_TYPE,
  SYS_FLOW_TRANSACTION_TYPE,
  ORDER_PAY_TYPE,
  REVIEW_STATUS,
  THIRD_CHANNELS_OPTS,
  IN_LIBRARY_STATUS,
  ORDER_PAYMENT_TYPE
} from '@/enums';
import {
  API_FINANCE_V1_TRANSACTIONRECORD_EXPORTTRANSACTIONRECORDEXCEL,
  API_FINANCE_V1_TRANSACTIONRECORD_EXPORTTRANSACTIONTOINVOICE,
  API_FINANCE_V1_TRANSACTIONRECORD_IMPORTINVOICEINFORMATIONEXCEL,
} from '@/api';
import download from '@/assets/js/download';
import {
  setTableLabels, marginTableLabels, getTemplateDownloadProps, getSchoolImageProps
} from '@/views/finance/_common/common';
import { feeNameOpts } from '@/views/market/_enums';
import financeOperationLogMixins from '@/views/finance/_mixins/operationLog';
import ctjtAreaStoreSeachTableMixins from '@/mixins/areaStoreSeachTable';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';

const name = '系统交易流水';
const tableOptionList = [
  {
    id: 1,
    label: '打印收据',
    type: 'primary',
    path: 'btn_dysj'
  },
  {
    id: 2,
    label: '导出打发票',
    type: 'warning',
    path: 'btn_dcdfp'
  },
  {
    id: 4,
    label: '下载导入发票模板',
    type: 'primary',
    path: 'btn_xzdrfpmb'
  },
  {
    id: 5,
    label: '修改收据',
    type: 'danger',
    path: 'btn_xgsj'
  },
  {
    id: 6,
    label: '修改已开票信息',
    type: 'primary',
    path: 'btn_xgykpxx'
  },
  {
    id: 7,
    label: '修改发票信息',
    type: 'primary',
    path: 'btn_xgfpxx'
  },
  {
    id: 8,
    label: '导出',
    path: 'btn_export',
  },
  {
    id: 9,
    label: '现金复核',
    type: 'primary',
    path: 'btn_moneyfuhe'
  }
];
@Component
export default class FinanceSystemFlow extends mixins(ctjtPaginationMixins, ctjttablefieldMixins, ctjtAreaStoreSeachTableMixins, financeOperationLogMixins) {
  @Action('finance/queryAllPosTerminalNoList') private queryAllPosTerminalNoList!: (data: any) => ParamsType;

  @Action('finance/querySystemTransactionRecordList') private querySystemTransactionRecordList!: (data: any) => ParamsType;

  @Action('finance/querySystemTransactionRecordCount') private querySystemTransactionRecordCount!: (data: any) => ParamsType;

  @Action('finance/modifyInvoiceInformation') private modifyInvoiceInformation!: (data: any) => ParamsType;

  @Action('finance/modifyUsedInvoiceInformation') private modifyUsedInvoiceInformation!: (data: any) => ParamsType;

  @Action('finance/queryprintReceiptInfo') private queryprintReceiptInfo!: (data: any) => ParamsType;

  @Action('finance/addCashPaymentRecord') private addCashPaymentRecord!: (data: any) => ParamsType;

  private beginDate = new Date();

  private endDate = new Date();

  // 列表搜索项配置
  private localSearchForm: ParamsType = {
    selectTimeList: [
      {
        label: '',
        clearable: true,
        select: {
          key: 'dateType',
          placeholder: '',
          value: 2,
          width: 110,
          options: [
            {
              id: 2,
              label: '交易日期',
            },
            {
              id: 1,
              label: '报名日期',
            },
            {
              id: 3,
              label: '结转日期',
            },
            {
              id: 4,
              label: '现金复核日期',
            },
          ],
        },
      },
    ],
    datePickerList: [
      {
        label: '',
        key: 'beginDate',
        value: this.beginDate,
        type: 'date',
        placeholder: '开始时间',
        width: 140,
      },
      {
        label: '-',
        key: 'endDate',
        value: this.endDate,
        type: 'date',
        placeholder: '结束时间',
        width: 140,
      }
    ],
    selectList: [
      {
        label: '订单类型',
        key: 'orderType',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 120,
        options: ORDER_TYPE,
      },
      {
        label: '发票状态',
        key: 'invoiceStatus',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 120,
        options: INVOICE_TYPE,
      },
      // {
      //   label: '交易状态',
      //   key: 'tradingStatus',
      //   value: '',
      //   placeholder: '请选择',
      //   multiple: false,
      //   clearable: true,
      //   width: 120,
      //   options: SYS_FLOW_TRANSACTION_TYPE,
      // },
      {
        label: '现金复核状态',
        key: 'reviewStatus',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 130,
        options: REVIEW_STATUS,
      },
      {
        label: '终端类型',
        key: 'payType',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 130,
        options: ORDER_PAY_TYPE,
      },
      {
        label: '终端号',
        key: 'payContent',
        value: '',
        placeholder: '请输入终端号',
        multiple: false,
        clearable: true,
        width: 200,
        options: [],
        filterable: true,
        customOptions: {
          value: 'label',
          label: 'label',
        },
      },
      {
        label: '费用科目',
        key: 'feeName',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 160,
        customOptions: {
          value: 'label',
          label: 'label',
        },
        options: feeNameOpts,
      },
      {
        label: '缴费类型',
        key: 'isInstallment',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 100,
        options: ORDER_PAYMENT_TYPE,
      },
    ],
    cascaderList: [
      {
        label: '在库状态',
        key: 'studentStatus',
        value: [IN_LIBRARY_STATUS[0].id, IN_LIBRARY_STATUS[1].id],
        placeholder: '请选择',
        clearable: true,
        width: 180,
        options: IN_LIBRARY_STATUS,
        optionProps: {
          emitPath: false, // 只展示最后一级
          multiple: true, // 可多选
          collapseTags: true,
          value: 'id',
          label: 'label',
          children: 'children',
        },
      },
      {
        label: '交易状态',
        key: 'tradingStatusList',
        value: [SYS_FLOW_TRANSACTION_TYPE[0].id, SYS_FLOW_TRANSACTION_TYPE[1].id],
        placeholder: '请选择',
        clearable: true,
        width: 180,
        options: SYS_FLOW_TRANSACTION_TYPE,
        optionProps: {
          emitPath: false, // 只展示最后一级
          multiple: true, // 可多选
          collapseTags: true,
          value: 'id',
          label: 'label',
          children: 'children',
        },
      },
    ],
    inputList: [
      {
        label: '关键字',
        key: 'keyword',
        type: 'text',
        value: '',
        width: 340,
        placeholder: '请输入学员姓名、证件号码、收据编号、订单号',
        clearable: true,
      },
      {
        label: '批次号',
        key: 'batchNo',
        type: 'text',
        value: '',
        width: 160,
        placeholder: '请输入批次号',
        clearable: true,
      },
    ],
    buttonList: [
      {
        label: '操作日志',
        key: 'log',
        type: '',
        plain: false,
        path: 'btn_log'
      },
    ]
  }

  formatPrice(val: number | string) {
    return formatPrice(val);
  }

  /**
  * @description 初始化列表搜索项
  */
  private initSearch() {
    // 合并混入的公共搜索项，和本地的搜索项
    const { searchForm, localSearchForm } = this;
    Object.keys(searchForm).forEach((key) => {
      const _list = localSearchForm[key];
      if (Array.isArray(_list)) {
        searchForm[key] = [...searchForm[key], ...localSearchForm[key]];
      }
    });
    const { drivingSchoolId } = this.userInfo;
    if (drivingSchoolId === '370') {
      this.searchForm.selectList.push({
        label: '散学业务来源',
        key: 'scatteredChannel',
        value: '',
        placeholder: '请选择',
        clearable: true,
        width: 130,
        options: [{ label: '深港转入' }],
        customOptions: {
          value: 'label',
          label: 'label',
        },
      });
    }
  }

  /**
* @param { ParamsType } val 搜索项 下拉选中返回当前对象
* @description 搜索组件 下拉项选中回调函数
*/
  private searchSelectChange(val: ParamsType) {
    const { value, key } = val;
    if (key === 'regionId') {
      this.searchForm.selectList[1].options = [];
      this.searchForm.selectList[1].value = '';
      if (value) {
        // 请求该片区下的门店列表
        this.queryStoreList(value);
      }
    }
    if (key === 'payType') {
      this.searchForm.selectList[7].options = [];
      this.searchForm.selectList[7].value = '';
      if (value) {
        this.queryTerminalNoList(value);
      }
    }
  }

  /** 获取终端号 */
  private async queryTerminalNoList(type: any) {
    const { selectList } = this.searchForm;
    if (type === 1) {
      selectList[6].options = THIRD_CHANNELS_OPTS;
    } else if (type === 6) {
      selectList[6].options = [{
        id: 1,
        label: '上缴现金'
      }];
    } else {
      const data = await this.queryAllPosTerminalNoList({ type });
      selectList[6].options = data;
    }
  }

  /**
    * @description 列表搜索 操作按钮回调
  */
  searchTableCallBack(key: string) {
    if (key === 'search') {
      this.querFirstPageList();
    }
    if (key === 'reset') {
      this.searchSelectChange({ key: 'regionId', value: null });
      this.searchSelectChange({ key: 'payType', value: null });
      this.querFirstPageList();
    }
    if (key === 'log') {
      this.queryOperationLogPage(name);
      this.logshow = true;
    }
  }

  // 弹出框名
  dialogName = '';

  // 表格配置
  private tableData: ParamsType = {
    _this: {},
    loading: false,
    selection: true,
    index: true,
    options: tableOptionList,
    labels: [],
    list: [],
    selectionList: [],
  };

  /**
  * @description 表格操作回调
  */
  private tableOptionCallback(val: TableOptionsValue) {
    const { id } = val;
    const { selectionList } = this.tableData;
    const idList: Array<number> = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      idList.push(_item.id);
    });
    const _len = selectionList.length;
    const isHasZuofei = selectionList.filter((a: any) => a.tradingStatus === SYS_FLOW_TRANSACTION_TYPE[3].id).length > 0; // 存在已作废数据
    if (id === 1) {
      // 打印收据
      if (_len === 1) {
        if (isHasZuofei) this.$message.warning('已作废数据不可操作，请重新选择!');
        else {
          this.queryReceiptData(selectionList[0]);
          this.printShow = true;
        }
      } else if (_len < 1) {
        this.$message.warning('请先勾选一条数据！');
      } else {
        this.$message.warning('只能单选一项进行操作！');
      }
    }
    if (id === 2) {
      // 导出打发票
      const { searchForm } = this;
      const _data = drawSearchForm(searchForm);
      const _studentStatus = searchForm.cascaderList[0].value;
      const studentStatusList = _studentStatus && _studentStatus.length ? _studentStatus : null;
      const _tradingStatus = searchForm.cascaderList[1].value;
      const tradingStatusList = _tradingStatus && _tradingStatus.length ? _tradingStatus : null;
      const sendData = { ..._data, studentStatusList, tradingStatusList };
      this._exportInvoiceFun(sendData);
      // if (_len >= 1) {
      // const checlAllHasApproval = selectionList.filter((a: any) => a.tradingStatus === SYS_FLOW_TRANSACTION_TYPE[1].id).length === _len; // 所选数据都是已结转
      // const checlAllNoKaipiao = selectionList.filter((a: any) => a.invoiceStatus === INVOICE_TYPE[0].id).length === _len; // 所选数据都是待开票
      // if (!checlAllHasApproval && _len) {
      //   this.$message.warning('已结转数据才可导出打发票，请重新选择!');
      // } else if (!checlAllNoKaipiao && _len) {
      //   this.$message.warning('所选数据中包含已开票数据，不可导出，请重新选择！');
      // } else {
      //   this._exportInvoiceFun(selectionList, sendData);
      // }
      // } else {
      //   this.$message.warning('请先勾选一条数据！');
      // }
    }
    if (id === 4) {
      // 下载导入发票模板
      download(getTemplateDownloadProps(name));
    }
    if (id === 5) {
      // 修改收据
      if (_len === 1) {
        const row = selectionList[0];
        const statusId = SYS_FLOW_TRANSACTION_TYPE.filter(a => a.label === '已结转')[0].id;
        const isJiezhuan = statusId === row.tradingStatus;
        // if (row.orderType === 3) this.$message.warning('其他订单不可修改');
        if (isJiezhuan) this.$message.warning('已结转的交易数据不可修改');
        else if (isHasZuofei) this.$message.warning('已作废数据不可操作，请重新选择!');
        else this.jumpDetail({ orderId: row.orderId, orderType: row.orderType, payId: row.payId }, false);
      } else if (_len < 1) {
        this.$message.warning('请先勾选一条数据！');
      } else {
        this.$message.warning('只能单选一项进行操作！');
      }
    }
    if (id === 6) {
      // 修改已开票信息
      if (_len === 1) {
        if (isHasZuofei) this.$message.warning('已作废数据不可操作，请重新选择!');
        else this.dialogName = '修改已开发票';
      } else if (_len < 1) {
        this.$message.warning('请先勾选一条数据！');
      } else {
        this.$message.warning('只能单选一项进行操作！');
      }
    }
    if (id === 7) {
      // 修改发票信息
      if (_len === 1) {
        if (isHasZuofei) this.$message.warning('已作废数据不可操作，请重新选择!');
        else this.dialogName = '修改发票信息';
      } else if (_len < 1) {
        this.$message.warning('请先勾选一条数据！');
      } else {
        this.$message.warning('只能单选一项进行操作！');
      }
    }
    if (id === 8) {
      // 导出
      this._exportData(selectionList);
    }
    if (id === 9) {
      // 现金复核
      if (_len === 1) {
        const payTypeIsMoney = selectionList.filter((a: any) => a.payType === ORDER_PAY_TYPE[4].id).length === _len; // 终端类型全部为上缴现金
        const allIsNoJiezhuan = selectionList.filter((a: any) => a.tradingStatus === SYS_FLOW_TRANSACTION_TYPE[0].id).length === _len; // 交易状态全部为待结转
        const allIsNoFuhe = selectionList.filter((a: any) => a.reviewStatus === REVIEW_STATUS[0].id).length === _len; // 复核状态全部为待复核
        const { drivingSchoolId } = this.userInfo;
        if (drivingSchoolId === '370') {
          const thirdOrderList = selectionList.filter((a: any) => a.scatteredChannel === '深港转入');
          if (thirdOrderList.length > 0) {
            const messageList: string[] = [];
            thirdOrderList.forEach((item: any) => {
              const { userName, idNo } = item;
              messageList.push(`${userName}-${idNo}`);
            });
            this.$message.warning(`${messageList.join('；')}，是深港转入订单，无需进行现金复核，请重新选择数据！`);
            return;
          }
        } else if (!payTypeIsMoney || !allIsNoJiezhuan || !allIsNoFuhe) {
          this.$message.warning('请勾选1条上缴现金的交易状态为待结转并且现金复核状态为待复核的数据!');
          return;
        }
        // this.moneyFuHe(selectionList);
        this.cashFormData.selectionList = selectionList;
        this.dialogName = '现金复核';
      } else if (_len < 1) {
        this.$message.warning('请勾选1条上缴现金的交易状态为待结转并且现金复核状态为待复核的数据!');
      } else {
        this.$message.warning('只能单选一项进行操作！');
      }
    }
  }

  // 列表分页
  public tableSizeChange(val: number) {
    this.paginationData.pageSize = val;
    this.paginationData.current = 1;
    this.queryList();
  }

  public tableCurrentChange(val: number) {
    this.paginationData.current = val;
    this.queryList();
  }

  private isHasZuofei = false;

  // 列表选中每一列切换回调
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
    const { selectionList } = this.tableData;
    const isHasZuofei = selectionList.filter((a: any) => a.tradingStatus === SYS_FLOW_TRANSACTION_TYPE[3].id).length > 0; // 存在已作废数据
    this.isHasZuofei = isHasZuofei;
  }

  /** 字段设置保存回调 */
  submitField(val: any) {
    this.dialogName = '';
    this.currentLabelKeyList = val;
    this.initSetTableLabel();
  }

  /**
  * @description 表格初始化设置
  */
  private initSetTableLabel() {
    const { tableLabelType } = this;
    const _originalLabelList = marginTableLabels(tableLabelType);
    this.originalLabelList = _originalLabelList;
    // 获取浏览器当前用户缓存的字段设置后，来设置当前列表应该显示那些字段
    const _currentLabelList = setTableLabels(_originalLabelList, tableLabelType);
    this.tableData.labels = _currentLabelList;
    this.currentLabelKeyList = [];
    _currentLabelList.forEach((item: any) => {
      this.currentLabelKeyList.push(item.key);
    });
  }

  /** 导出 */
  private async _exportData(selectionList: any) {
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const _studentStatus = searchForm.cascaderList[0].value;
    const studentStatusList = _studentStatus && _studentStatus.length ? _studentStatus : null;
    const _tradingStatus = searchForm.cascaderList[1].value;
    const tradingStatusList = _tradingStatus && _tradingStatus.length ? _tradingStatus : null;
    const payIdList: any = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      payIdList.push(_item.payId);
    });
    // 处理数据
    const sendData = {
      ..._data, payIdList, studentStatusList, tradingStatusList
    };
    const body = await this.$http.post(API_FINANCE_V1_TRANSACTIONRECORD_EXPORTTRANSACTIONRECORDEXCEL, sendData, {
      hasUseCode: true, responseType: 'arraybuffer'
    });
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel'
    });
    FileSaver.saveAs(blob, `${name}${this.$dayjs(new Date()).format('YYYYMMDD')}`);
  }

  cashFormData: ParamsType = {
    remark: '',
    selectionList: {}
  }

  /** 现金复核 */
  private async moneyFuHe() {
    // 现金复核
    this.submitLoading = true;
    // const amountList: any = [];
    const { remark, selectionList } = this.cashFormData;
    // selectionList.forEach((item: any) => {
    //   const _item = item;
    //   amountList.push(_item.amount);
    // });
    // const totalMoney = amountList.length > 1 ? Sum(amountList) : amountList[0];
    // this.$confirm(`待复核现金总额：${totalMoney}，确定进行复核确认?`, '现金复核', {
    //   confirmButtonText: '确定',
    //   cancelButtonText: '取消',
    //   type: 'warning',
    // }).then(async () => {
    const sendData: any = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      const data: any = {};
      data.payId = _item.payId;
      data.payAmount = _item.amount;
      data.regionId = _item.regionId;
      data.regionName = _item.regionName;
      data.storeId = _item.storeId;
      data.storeName = _item.storeName;
      data.remark = remark;
      sendData.push(data);
    });

    await this.addCashPaymentRecord(sendData).then(() => {
      this.queryList();
      this.$message.success('复核成功！');
    }).finally(() => {
      this.submitLoading = false;
      this.cancelDialog();
    });
    // });
  }

  /** 导出打发票 */
  private async _exportInvoiceFun(searchData: any) {
    const payIdList: any = [];
    // selectionList.forEach((item: any) => {
    //   const _item = item;
    //   payIdList.push(_item.payId);
    // });
    const sendData = { type: 1, ...searchData };
    const countBody = await this.$http.post(API_FINANCE_V1_TRANSACTIONRECORD_EXPORTTRANSACTIONTOINVOICE, sendData, {
      hasUseCode: true
    });
    const { code = null } = countBody;
    if (code === 200) {
      const resData = { payIdList, type: 0, ...searchData };
      const body = await this.$http.post(API_FINANCE_V1_TRANSACTIONRECORD_EXPORTTRANSACTIONTOINVOICE, resData, {
        hasUseCode: true, responseType: 'arraybuffer'
      });
      const blob = new Blob([body], {
        type: 'application/vnd.ms-excel'
      });
      FileSaver.saveAs(blob, `导出打发票${this.$dayjs(new Date()).format('YYYYMMDD')}`);
    }
  }

  // 导入发票API路径
  private uploadPath = API_FINANCE_V1_TRANSACTIONRECORD_IMPORTINVOICEINFORMATIONEXCEL;

  // 导入发票文件上传配置
  private uploadConfig = {
    multiple: false,
    accept: '',
    limit: 1,
    disabled: false,
    tips: '',
    business: '',
    fileAccept: FILTER_EXCEL_TYPE // 限制上传文件格式
  };

  /** 发票上传回调 */
  uploadCallback() {
    this.$message.warning('请到操作日志查看导入结果！');
    this.querFirstPageList();
  }

  // 打印预览弹出框展示
  private printShow = false;

  // 打印列表配置
  private printTableData: ParamsType = {
    title: '业务受理回执单',
    data: {},
  };

  /** 获取打印收据数据 */
  private async queryReceiptData(item: any) {
    const _item = item;
    const sendData = {
      orderType: _item.orderType,
      payId: _item.payId
    };
    try {
      const body = await this.queryprintReceiptInfo(sendData);
      const group = require('@/assets/json/group_info.json');
      const { drivingSchoolId } = body;
      const schoolLogo = getSchoolImageProps(drivingSchoolId)?.url;
      const groupInfo = group.filter((a: any) => a.id === drivingSchoolId)[0];
      this.printTableData.data = { ...body, ...groupInfo, schoolLogo };
    } catch (error) {
      this.printTableData = {};
    }
  }

  /** 跳转详情界面 */
  jumpDetail(val: any, isDetail: any) {
    this.$router.push({
      path: '/finance/transaction_mg/system_flow/detail',
      query: { obj: encodeURIComponent(JSON.stringify({ ...val, isDetail })) }
    });
  }

  private submitLoading = false;

  // 修改已开票信息表单数据
  private invoicingFormData: ParamsType = {
    invoiceUsedAmount: null, // 已开票金额
    invoiceNo: '', // 发票号,多个发票号用,隔开
  }

  // 开票信息表单验证规则
  private invoicingFormRules = {
    invoiceUsedAmount: [
      { required: false, message: '请输入已开发票金额', trigger: 'blur' },
      { pattern: REG_PRICE, message: '范围1-999999,可保留两位小数' }
    ],
    invoiceNo: [
      { required: false, message: '请输入发票号', trigger: 'blur' },
    ],
  };

  /** 提交已开票信息修改 */
  submitInvoicingForm() {
    const { selectionList } = this.tableData;
    const _item = selectionList[0];
    (this.$refs.invoicingForm as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        this.submitLoading = true;
        const sendData = {
          ...this.invoicingFormData,
          invoiceId: _item.invoiceId,
          orderId: _item.orderId,
          payId: _item.payId,
        };
        this.modifyUsedInvoiceInformation(sendData).then(() => {
          this.$message.success('修改已开票信息成功');
          this.queryList();
        })
          .finally(() => {
            this.submitLoading = false;
            this.cancelDialog();
          });
      } else {
        this.$message.warning('您的信息填写有误，请仔细检查并修改！');
      }
    });
  }

  // 修改发票信息表单数据
  private invoiceFormData: ParamsType = {
    type: null, // 发票种类
    invoiceName: '', // 发票名
    mode: null, // 开票方式
    identifyNumber: '', // 纳税人识别号
  }

  // 发票信息表单验证规则
  private invoiceFormRules = {
    type: [
      {
        required: false,
        message: '请选择发票种类',
        trigger: 'change'
      },
    ],
    invoiceName: [
      { required: false, message: '请输入发票名', trigger: 'blur' }
    ],
    mode: [
      {
        required: false,
        message: '请选择开票方式',
        trigger: 'change'
      },
    ],
    identifyNumber: { required: false, message: '请输入纳税人识别号', trigger: 'blur' },
  };

  identifyNumberDisabled = true;

  @Watch('invoiceFormData.mode', { immediate: false, deep: true })
  private modeChange(val: number) {
    (this.$refs.invoiceForm as VueComponentParent).clearValidate();
    this.identifyNumberDisabled = val ? val === this.openTypeList[0].id : true;
    this.invoiceFormRules.identifyNumber.required = !(val ? val === this.openTypeList[0].id : true);
  }

  // 发票种类list
  private invoiceTypeList = [{
    id: 1,
    label: '普票',
  },
  {
    id: 2,
    label: '专票',
  }];

  // 开票方式list
  private openTypeList = [{
    id: 1,
    label: '个人',
  },
  {
    id: 2,
    label: '企业',
  }];

  /** 提交修改发票信息修改 */
  submitInvoiceForm() {
    const { selectionList } = this.tableData;
    const _item = selectionList[0];
    (this.$refs.invoiceForm as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        this.submitLoading = true;
        const sendData = {
          ...this.invoiceFormData,
          invoiceId: _item.invoiceId,
          orderId: _item.orderId,
          payId: _item.payId,
        };
        this.modifyInvoiceInformation(sendData).then((res: any) => {
          this.$message.success('修改发票信息成功');
          this.queryList();
        })
          .finally(() => {
            this.submitLoading = false;
            this.cancelDialog();
          });
      } else {
        this.$message.warning('您的信息填写有误，请仔细检查并修改！');
      }
    });
  }

  /** 关闭单选弹出框 */
  cancelDialog() {
    if (this.dialogName === '修改已开发票') {
      (this.$refs.invoicingForm as VueComponentParent).resetFields();
    }
    if (this.dialogName === '修改发票信息') {
      (this.$refs.invoiceForm as VueComponentParent).resetFields();
    }
    if (this.dialogName === '现金复核') {
      this.cashFormData.remark = '';
      this.cashFormData.selectionList = {};
    }
    this.dialogName = '';
  }

  querFirstPageList() {
    this.paginationData.current = 1; // 查询时设置成第一页
    this.queryList();
  }

  async queryList() {
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const _studentStatus = searchForm.cascaderList[0].value;
    const studentStatusList = _studentStatus && _studentStatus.length ? _studentStatus : null;
    const _tradingStatus = searchForm.cascaderList[1].value;
    const tradingStatusList = _tradingStatus && _tradingStatus.length ? _tradingStatus : null;
    const { beginDate, endDate } = _data;
    // 判断时间
    if (beginDate && endDate && timestampSizeCompare(beginDate, endDate)) {
      this.$message.warning('开始时间不能大于结束时间');
      return;
    }
    const sendData = { ..._data, studentStatusList, tradingStatusList };
    try {
      const body = await this.querySystemTransactionRecordList(sendData);
      const { data = [], current, total } = body;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
      this.tableData.loading = false;
      this.getStaticData();
    } catch (error) {
      this.tableData.loading = true;
    }
  }

  // 表格底部统计数据
  private staticData: any = { totalAmount: 0, totalInvoiceUsedAmount: 0, totalInvoiceAmount: 0 };

  /** 获取表格底部统计数据 */
  async getStaticData() {
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const _studentStatus = searchForm.cascaderList[0].value;
    const studentStatusList = _studentStatus && _studentStatus.length ? _studentStatus : null;
    const _tradingStatus = searchForm.cascaderList[1].value;
    const tradingStatusList = _tradingStatus && _tradingStatus.length ? _tradingStatus : null;
    const sendData = { ..._data, studentStatusList, tradingStatusList };
    try {
      const body = await this.querySystemTransactionRecordCount(sendData);
      this.staticData = body;
    } catch (error) {
      //
    }
  }

  perm = {};

  async mounted() {
    this.tableData._this = this;
    // 以下接口依赖于驾校id
    const { drivingSchoolId } = this.userInfo;
    this.queryRegionList(drivingSchoolId);
    this.initSearch();
    this.queryList();
    this.tableLabelType = 'SYSTEM_FLOW_LIST_LABEL';
    this.initSetTableLabel();
    const permObj = await this.$getPerm(this, this.tableData.options, this.searchForm.buttonList);
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
    this.perm = permObj.perm;
  }
}
