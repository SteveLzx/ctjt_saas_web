import { Action, State } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import { ParamsType, VueComponentParent } from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import { jsAddFunc, timestampSizeCompare } from '@/assets/js/common';
import { setTableLabels, marginTableLabels } from '@/views/market/_common/common';
import { INVOICING_TYPE, REFUND_TYPE } from '@/enums';
import { auditStatusOpts } from '@/views/market/_enums';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';
import {
  SearchTable, CtjtTable, CtjtPagination, CtjtSetField
} from '@/components';
import RefundPrint from './_components/print.vue';

@Component({
  components: {
    SearchTable, CtjtTable, CtjtPagination, CtjtSetField, RefundPrint
  }
})
export default class MarketOrderApprovalRefund extends mixins(ctjtPaginationMixins, ctjttablefieldMixins) {
  @State(state => state.base.userInfo) private userInfo: any;

  @Action('base/queryGroupMechanismData') private queryGroupMechanismData!: (data: any) => any;

  @Action('order/queryRefundList') private queryRefundList!: (data: any) => ParamsType;

  @Action('order/paymentRefund') private paymentRefund!: (data: any) => ParamsType;

  @Action('order/refundPaymentLogs') private refundPaymentLogs!: (data: any) => ParamsType;

  private options = [];

  // 打印预览表格
  private printTableData: ParamsType = {
    _this: {},
    index: true,
    labels: [
      {
        key: 'userName',
        label: '学员姓名',
        width: 100,
      },
      {
        key: 'bankNo',
        label: '银行卡号',
        width: 240,
      },
      {
        key: 'bankName',
        label: '开户行',
        width: 240,
      },
      {
        key: 'returnMoney',
        label: '退款金额',
        width: 100,
        isPrice: true
      },
      {
        key: 'storeName',
        label: '代码',
        width: 120,
      },
      {
        key: 'createdName',
        label: '申请客服',
        width: 160,
      }
    ],
    list: [],
    regionName: '',
    showSummary: true,
    summariesMethod: (param: any) => {
      let _sum = 0;
      param.data.forEach((item: any) => {
        const { returnMoney } = item;
        if (returnMoney) {
          _sum = jsAddFunc(_sum, returnMoney);
        }
      });
      return ['合计', '', '', '', _sum];
    }
  }

  // 弹窗名称
  private dialogName = '';

  /** 字段设置保存回调 */
  submitField(val: any) {
    // 保存设置的字段到缓存
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

  // 列表搜索项配置
  private searchForm: ParamsType = {
    inputList: [
      {
        label: '关键词',
        key: 'keyword',
        type: 'text',
        value: '',
        width: 280,
        placeholder: '请输入学员姓名、证件号码、手机号',
        clearable: true,
      },
    ],
    datePickerList: [
      {
        label: '申请时间',
        key: 'beginDate',
        value: '',
        placeholder: '开始时间',
        type: 'date',
        width: 140,
      },
      {
        label: '-',
        key: 'endDate',
        value: '',
        placeholder: '结束时间',
        type: 'date',
        width: 140,
      },
    ],
    selectList: [
      {
        label: '片区',
        key: 'regionId',
        value: '',
        width: 160,
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: [],
        customOptions: {
          value: 'id',
          label: 'name'
        }
      },
      {
        label: '门店',
        key: 'storeId',
        value: '',
        width: 160,
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: [],
        customOptions: {
          value: 'id',
          label: 'name'
        }
      },
      {
        label: '退费类型',
        key: 'refundType',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 160,
        options: REFUND_TYPE
      },
      {
        label: '审核状态',
        key: 'auditStatus',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 160,
        options: auditStatusOpts
      },
      {
        label: '票据类型',
        key: 'invoiceType',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 160,
        options: INVOICING_TYPE
      },
    ],
    checkedList: [
      {
        key: 'isMe',
        value: true,
        label: '只看我审批',
      },
    ],
    buttonList: [
      {
        label: '查询',
        key: 'search',
        type: 'primary',
        plain: false,
        path: 'btn_search'
      },
      {
        label: '重置',
        key: 'reset',
        plain: false
      },
    ]
  }

  // 列表搜索 操作按钮回调
  private searchTableCallBack(key: string) {
    if (key === 'search' || key === 'reset') {
      this.paginationData.current = 1;
      if (key === 'reset') {
        this.searchForm.datePickerList[0].value = '';
        this.searchForm.selectList[1].options = [];
      }
      this.queryList();
    }
  }

  /** 搜索筛选框选择回调 */
  private async searchSelectChange(val: ParamsType) {
    const { value, key } = val;
    if (key === 'regionId') {
      this.searchForm.selectList[1].options = [];
      this.searchForm.selectList[1].value = '';
      if (value) {
        const data = await this.queryGroupMechanismData({ pid: value });
        this.searchForm.selectList[1].options = data;
      }
    }
  }

  // 列表配置
  private tableData: ParamsType = {
    _this: {},
    loading: false,
    selection: true,
    index: true,
    options: [
      {
        id: 1,
        label: '新增申请',
        path: 'btn_add'
      },
      {
        id: 2,
        label: '付款',
        path: 'btn_pay'
      },
      {
        id: 4,
        label: '打印退费单',
        path: 'btn_dytfd'
      }
    ],
    labels: [],
    list: [],
    selectionList: []
  }

  private refundPrintShow = false;

  private tableOptionCallback(val: any) {
    const { id } = val;
    if (id === 1) {
      this.jumpDetail();
      return;
    }
    const { selectionList } = this.tableData;
    const _len = selectionList.length;
    if (_len >= 1) {
      if (id === 2) {
        // 退费单中有换人学车状态的不能退款
        // const _noRefundTypeList = selectionList.filter((item: any) => item.refundType === 7);
        // if (_noRefundTypeList.length > 0) {
        //   this.$message.warning('退费类型为“换人学车”的订单不能付款！');
        //   return;
        // }

        // 同片区，同票据类型，状态为已完成，才可以付款
        const _templateObj = {
          regionName: '',
          invoiceType: null,
          auditStatus: null,
        };
        const _noInvoiceList = selectionList.filter((item: any) => item.invoiceType === undefined);
        if (_noInvoiceList.length > 0) {
          this.$message.warning('请完善选中数据的票据类型！');
          return;
        }
        let _flag = false;
        selectionList.forEach((item: any, index: number) => {
          const { regionName, invoiceType, auditStatus } = item;
          if (auditStatus !== 1) {
            _flag = true;
            return;
          }
          if (index === 0) {
            // 判断是否状态
            _templateObj.regionName = regionName;
            _templateObj.invoiceType = invoiceType;
            _templateObj.auditStatus = auditStatus;
          }
          if (index > 0) {
            if (_templateObj.regionName !== regionName || _templateObj.invoiceType !== invoiceType) {
              _flag = true;
            }
          }
        });
        if (_flag) {
          this.$message.warning('请勾选同片区且同票据类型且审核状态为已完成的数据！');
          return;
        }
        this.dialogName = 'fukuan';
        // 赋值给表单id数组项
        const seqIdList: string[] = [];
        selectionList.forEach((item: any) => {
          const { id: seqId, invoiceType } = item;
          seqIdList.push(seqId);
          this.formFukuanData.invoiceType = invoiceType;
        });
        this.formFukuanData.ids = seqIdList;
      }
      // if (id === 3) {
      //   this.dialogName = 'billtype';
      // }
      if (id === 4) {
        this.refundPrintFunc(selectionList);
      }
    } else {
      this.$message.warning('请勾选要操作的数据！');
    }
  }

  // 付款
  private btnLoading = false;

  private handleCloseFukuan() {
    (this.$refs.formFukuanRef as VueComponentParent).clearValidate();
    this.formFukuanData = {
      ids: [],
      invoiceType: '',
      paymentDate: '',
      num: ''
    };
    this.dialogName = '';
  }

  private handleSubmitFukuan() {
    (this.$refs.formFukuanRef as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        const {
          ids, invoiceType, paymentDate, num
        } = this.formFukuanData;
        const sendData = {
          ids, invoiceType, num, paymentDate: paymentDate ? this.$dayjs(paymentDate).format('YYYY-MM-DD HH:mm:ss') : ''
        };
        this.btnLoading = true;
        this.paymentRefund(sendData).then(() => {
          this.$message.success('付款成功！');
          this.queryList();
          this.handleCloseFukuan();
        }).finally(() => {
          this.btnLoading = false;
        });
      } else {
        this.$message.warning('按错误提示修改！');
      }
    });
  }

  private formFukuanData: ParamsType = {
    ids: [],
    invoiceType: '',
    paymentDate: '',
    num: ''
  }

  private formFukuanRules = {
    paymentDate: [
      { required: true, message: '请选择付款时间', trigger: ['change', 'blur'] }
    ]
  }

  // 打印退费单
  private refundPrintFunc(val: ParamsType) {
    // 判断片区相同才可以打印
    const _flagList = val.filter((item: any) => item.regionName !== val[0].regionName);
    if (_flagList.length > 0) {
      this.$message.warning('不允许选择不同片区的数据！');
      return;
    }
    const _noStatusList = val.filter((item: any) => item.auditStatus === 1 || item.auditStatus === 4);
    if (_noStatusList.length !== val.length) {
      this.$message.warning('选择已完成或已付款的数据！');
      return;
    }
    this.refundPrintShow = true;
    const idList: string[] = [];
    val.forEach((item: any) => {
      const { id, regionName } = item;
      idList.push(id);
      this.printTableData.regionName = regionName;
    });
    this.refundPaymentLogs({ idList }).then((res: any) => {
      this.printTableData.list = res;
      // 长度不够 补{}
      const _len = this.printTableData.list.length;
      const _defList = [];
      for (let i = 0; i < (10 - _len); i += 1) {
        _defList.push({});
      }
      this.printTableData.list = [...this.printTableData.list, ..._defList];
    });
  }

  // 修改票据类型
  private handleCloseBilltype() {
    this.dialogName = '';
  }

  private formBilltypeRef: ParamsType = {

  }

  // 列表选中每一列切换回调
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  // 跳转详情
  private jumpDetail(id?: string, isEdit?: string) {
    this.$router.push({ path: '/market/order_approval/refund/detail', query: { id, isEdit } });
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

  private async queryList() {
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const { beginDate, endDate } = _data;
    // 判断时间
    if (beginDate && endDate && timestampSizeCompare(beginDate, endDate)) {
      this.$message.warning('开始时间不能大于结束时间');
      return;
    }
    const sendData = {
      ..._data
    };
    const body = await this.queryRefundList(sendData);
    const {
      data, current, total
    } = body;
    this.tableData.list = data;
    this.paginationData.current = current;
    this.paginationData.total = total;
  }

  private async initSearch() {
    const { drivingSchoolId } = this.userInfo;
    const data = await this.queryGroupMechanismData({ pid: drivingSchoolId });
    this.searchForm.selectList[0].options = data;
  }

  async mounted() {
    this.tableData._this = this;
    this.tableLabelType = 'MARKET_ORDER_APPROVAL_REFUND_LIST_LABEL';
    // this.queryList();
    this.initSetTableLabel();
    this.initSearch();
  }

  async activated() {
    this.queryList();
  }

  perm = {};

  async created() {
    const permObj = await (this as any).$getPerm(this, this.tableData.options, this.searchForm.buttonList);
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
    this.perm = permObj.perm;
  }
}
