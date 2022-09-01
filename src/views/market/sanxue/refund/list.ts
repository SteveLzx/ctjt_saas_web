import { State, Action } from 'vuex-class';
import { Watch } from 'vue-property-decorator';
import Component, { mixins } from 'vue-class-component';
import dayjs from 'dayjs';
import {
  SearchTable, CtjtTable, CtjtStatistics, CtjtPagination, CtjtCard, CtjtSelect
} from '@/components';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjtAreaStoreSeachTableMixins from '@/mixins/areaStoreSeachTable';
import { drawSearchForm } from '@/assets/js/search_table';
import {
  jsAddFunc, jsReduceFunc, REG_TWO_FLOAT_NUMBER, Sum, timestampSizeCompare, REG_ZERO_INTEGER
} from '@/assets/js/common';
import {
  ParamsType, StaticDataType, TableOptionsValue, VueComponentParent
} from '@/type';
import { auditStatusOpts } from '@/views/market/_enums';
import { INVOICING_TYPE } from '@/enums';
import RefundPrint from './_components/print.vue';

const tableLabels = [{
  key: 'applyNo',
  label: '申请单号',
  showOverflowTooltip: true,
  render(h: any, params: any) {
    const { applyNo, approveId } = params.row;
    return h('el-link', {
      props: {
        type: 'primary',
        underline: false
      },
      on: {
        click: () => {
          console.log(3333, params.row);

          params._self.tableData._this.jumpOrderDetail(approveId);
        }
      }
    },
    applyNo);
  }
},
{
  key: 'userName',
  label: '姓名',
  showOverflowTooltip: true,
},
{
  key: 'idNo',
  label: '证件号码',
  showOverflowTooltip: true,
},
{
  key: 'mobile',
  label: '手机号',
  showOverflowTooltip: true,
},
{
  key: 'refundableFee',
  label: '退费金额',
  isPrice: true,
  showOverflowTooltip: true,
},
{
  key: 'reason',
  label: '退费原因',
  showOverflowTooltip: true,
  render(h: any, params: any) {
    const { reason } = params.row;
    return h('el-popover', {
      props: {
        placement: 'top-start',
        width: '300',
        trigger: 'hover',
        content: reason,
      },
      scopedSlots: {
        reference: () => h('p', reason),
      },
    });
  }
},
{
  key: 'remark',
  label: '备注',
  showOverflowTooltip: true,
  render(h: any, params: any) {
    const { remark } = params.row;
    return h('el-popover', {
      props: {
        placement: 'top-start',
        width: '300',
        trigger: 'hover',
        content: remark,
      },
      scopedSlots: {
        reference: () => h('p', remark),
      },
    });
  }
},
{
  key: 'paymentDate',
  label: '付款日期',
  showOverflowTooltip: true,
},
{
  key: 'createdTime',
  label: '申请时间',
  showOverflowTooltip: true,
},
{
  key: 'auditStatus',
  label: '审核状态',
  showOverflowTooltip: true,
  render(h: any, params: any) {
    const { auditStatus } = params.row;
    if (auditStatus === undefined) return h('div', '');
    const _list = auditStatusOpts.filter(item => item.id === auditStatus);
    return h('span', _list && _list.length > 0 ? _list[0].label : '');
  },
},
{
  key: 'verifyNode',
  label: '审批环节',
  showOverflowTooltip: true,
},
{
  key: 'verifyUser',
  label: '审核人',
  showOverflowTooltip: true,
},
{
  key: 'updatedTime',
  label: '审核时间',
  showOverflowTooltip: true,
},
{
  key: 'duration',
  label: '耗时（h）',
  showOverflowTooltip: true,
},
];

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtStatistics,
    CtjtPagination,
    CtjtCard,
    CtjtSelect,
    RefundPrint
  }
})
export default class MarketSanXueRefundMg extends mixins(ctjtPaginationMixins) {
  @Action('order/refundScatteredPayment') private refundScatteredPayment!: (data: any) => ParamsType;

  @Action('order/getScatteredRefundList') private getScatteredRefundList!: (
    data: any
  ) => any;

  @Action('order/getRefundInfoByIdNo') private getRefundInfoByIdNo!: (
    data: any
  ) => any;

  @Action('order/addScatteredRefundApprove') private addScatteredRefundApprove!: (
    data: any
  ) => any;

  @Action('order/getScatteredRefundCount') private getScatteredRefundCount!: (
    data: any
  ) => any;

  @Action('order/scatteredPayment') private scatteredPayment!: (
    data: any
  ) => any;

  @Action('order/deleteSanXueScatteredOrder') private deleteSanXueScatteredOrder!: (
    data: any
  ) => any;

  /**
   * @description 跳转到散学退费详情
   */
  private jumpOrderDetail(val: string): void {
    this.$router.push({ path: '/market/sxpj/detail', query: { id: val } });
  }

  // 列表搜索项配置
  private searchForm: ParamsType = {
    selectTimeList: [
      {
        label: '',
        clearable: true,
        select: {
          key: 'dateType',
          placeholder: '',
          value: 1,
          width: 110,
          options: [
            {
              id: 1,
              label: '申请日期',
            },
            {
              id: 2,
              label: '审核日期',
            },
          ],
        }
      },
    ],
    datePickerList: [
      {
        label: '',
        key: 'beginDate',
        value: '',
        type: 'date',
        placeholder: '开始时间',
        width: 140,
      },
      {
        label: '-',
        key: 'endDate',
        value: '',
        type: 'date',
        placeholder: '结束时间',
        width: 140,
      }
    ],
    selectList: [
      {
        label: '审核状态',
        key: 'auditStatus',
        width: 130,
        value: '',
        placeholder: '请选择',
        clearable: true,
        options: auditStatusOpts.filter((item: any) => item.id !== 2)
      },
    ],
    inputList: [
      {
        label: '散学单号',
        key: 'orderSeq',
        type: 'text',
        value: '',
        width: 200,
        placeholder: '',
        clearable: true,
      },
      {
        label: '申请单号',
        key: 'seq',
        type: 'text',
        value: '',
        width: 200,
        placeholder: '',
        clearable: true,
      },
      {
        label: '关键字',
        key: 'keyword',
        type: 'text',
        value: '',
        width: 300,
        placeholder: '请输入学员姓名、证件号、手机号',
        clearable: true,
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
        type: '',
        plain: false,
        path: 'btn_search'
      },
    ]
  }

  /**
   * @description 初始化列表搜索项
   */
  // private initSearch() {
  // 合并混入的公共搜索项，和本地的搜索项
  // const { searchForm, localSearchForm } = this;
  // Object.keys(searchForm).forEach((key) => {
  //   const _list = localSearchForm[key];
  //   if (Array.isArray(_list)) {
  //     // 去除门店字段
  //     if (key === 'selectList') {
  //       searchForm[key] = [...localSearchForm[key]];
  //     } else {
  //       searchForm[key] = [...searchForm[key], ...localSearchForm[key]];
  //     }
  //   }
  // });
  // searchForm = [...localSearchForm];
  // console.log(222, searchForm);
  // }

  // /**
  //    * @param { ParamsType } val 搜索项 下拉选中返回当前对象
  //    * @description 搜索组件 下拉项选中回调函数
  //    */
  // private searchSelectChange(val: ParamsType) {
  //   const { value, key } = val;
  //   if (key === 'regionId') {
  //     this.searchForm.selectList[1].options = [];
  //     this.searchForm.selectList[1].value = '';
  //     if (value) {
  //       // 请求该片区下的门店列表
  //       this.queryStoreList(value);
  //     }
  //   }
  // }

  /** 列表搜索 操作按钮回调 */
  public searchTableCallBack(key: string) {
    if (key === 'search') {
      this.querFirstPageList();
    }
    if (key === 'reset') {
      this._resetSearchFunc();
    }
  }

  /** 重置列表搜索回调 */
  private _resetSearchFunc() {
    // this.searchSelectChange({ key: 'regionId', value: null });
    this.queryList();
  }

  private tableData: ParamsType = {
    _this: {},
    loading: true,
    selection: true,
    index: true,
    options: [
      {
        id: 1,
        label: '新增',
        type: 'primary',
        path: 'btn_add',
      },
      {
        id: 2,
        label: '付款',
        type: 'warning',
        path: 'btn_pay',
      },
      {
        id: 4,
        label: '删除',
        type: 'danger',
        path: 'btn_delete',
      },
      {
        id: 3,
        label: '打印退费单',
        path: 'btn_print',
      },
    ],
    labels: tableLabels,
    list: [],
    selectionList: [],
  };

  /** 列表操作回调 */
  private tableOptionCallback(val: TableOptionsValue) {
    const { selectionList, labels } = this.tableData;
    const _len = selectionList.length;
    const { id } = val;
    if (id === 1) {
      // 新增
      this.drawerShow = true;
      return;
    }

    if (_len >= 1) {
      if (id === 2 && _len === 1) {
        // 转陪驾审核
        const { auditStatus, approveId } = selectionList[0];
        if (auditStatus !== 1) {
          this.$message.warning('请勾选【已完成】的退费单！');
          return;
        }
        this.jumpDetail(selectionList[0]);
        this.formPayData.approveId = approveId;
      } else if (id === 2) {
        this.$message.warning('请先勾选一项，再进行操作！');
      }
      if (id === 4 && _len === 1) {
        const { auditStatus, approveId } = selectionList[0];
        if (auditStatus !== 3) {
          this.$message.warning('请勾选【已撤销】的退费单！');
          return;
        }
        this.deleteOrder(selectionList[0]);
      } else if (id === 4) {
        this.$message.warning('请先勾选一项，再进行操作！');
      }
      if (id === 3) {
        // 打印退费单
        this.refundPrintFunc(selectionList);
      }
    } else {
      this.$message.warning('请先勾选一项，再进行操作！');
    }
  }

  // 列表单项点击
  private jumpDetail(val: ParamsType) {
    // 深拷贝一份数据
    const _data = JSON.parse(JSON.stringify(val));
    Object.keys(this.formData).forEach(key => {
      this.formData[key] = _data[key];
    });
    this.dialogShow = true;
  }

  // 列表分页
  public tableSizeChange(val: number) {
    this.paginationData.pageSize = val;
    this.querFirstPageList();
  }

  public tableCurrentChange(val: number) {
    this.paginationData.current = val;
    this.queryList();
  }

  // 列表选中每一列切换回调
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

 // 数据统计
 private statisticsData: ParamsType = {
   0: {
     label: '审核中',
     value: 0,
   },
   1: {
     label: '已完成',
     value: 0,
   },
   3: {
     label: '已撤回',
     value: 0,
   },
   4: {
     label: '已付款',
     value: 0,
   },
 };

  // 抽屉弹窗
  private drawerShow = false;

  // 新增抽屉弹窗表单
  private formData: ParamsType = {
    idNo: '',
    userName: '',
    userInfo: { idNo: '', userName: '' },
    mobile: '',
    storeName: '',
    totalHours: null, // 总学时合计
    totalLeftHours: null, // 总剩余学时
    totalOrderMoney: null, // 总订单金额
    totalRealMoney: null, //  总实收金额
    learnedPeriod: null, // 已学学时
    learnedPeriodFee: null, // 已学学时费
    deductTrainFee: null, // 应扣服务费
    deductTotalFee: 0, // 应扣金额合计
    refundableFee: 0, // 应退费用
    reason: '', // 退费原因
    remark: '', // 备注
    accountName: '', // 账户名
    cardNo: '', // 银行卡号
    bankMainName: '', // 银行名称
    bankName: '', // 支行名称
  }

  private formDataRules = {
    userName: [
      { required: true, message: '请输入证件号码搜索学员', trigger: 'blur' }
    ],
    'userInfo.userName': [
      { required: true, message: '未找到学员', trigger: 'blur' }
    ],
    mobile: [
      { required: true, message: '未找到联系电话', trigger: ['change', 'blur'] }
    ],
    storeName: [
      { required: true, message: '未找到门店', trigger: ['change', 'blur'] }
    ],
    totalHours: [
      { required: true, message: '未正确计算总学时合计', trigger: 'blur' }
    ],
    totalLeftHours: [
      { required: true, message: '未正确计算总剩余学时', trigger: 'blur' }
    ],
    totalOrderMoney: [
      { required: true, message: '未正确计算总订单金额', trigger: 'blur' }
    ],
    totalRealMoney: [
      { required: true, message: '未正确计算总实收金额', trigger: 'blur' }
    ],
    learnedPeriod: [
      { required: true, message: '请输入已学学时', trigger: ['change', 'blur'] },
      { pattern: REG_ZERO_INTEGER, message: '请输入正确的格式, >=0正整数' },
      {
        validator: (rule: any, value: any, callback: any) => {
          if (Number(value) > Number(this.formData.totalHours)) {
            callback(new Error('已学学时不能超过总学时'));
          }
          callback();
        },
      }
    ],
    learnedPeriodFee: [
      { required: true, message: '请输入已学学时费', trigger: ['change', 'blur'] },
      { pattern: REG_TWO_FLOAT_NUMBER, message: '请输入最多保留两位小数的数值' },

    ],
    deductTrainFee: [
      { required: true, message: '请输入应扣服务费', trigger: ['change', 'blur'] },
      { pattern: REG_TWO_FLOAT_NUMBER, message: '请输入最多保留两位小数的数值' },
    ],
    deductTotalFee: [
      { required: true, message: '未正确计算应扣金额合计', trigger: ['change', 'blur'] }
    ],
    refundableFee: [
      { required: true, message: '未正确计算应退费用', trigger: ['change', 'blur'] },
      {
        validator: (rule: any, value: any, callback: any) => {
          if (Number(value) <= 0) {
            callback(new Error('应退费用金额应＞0'));
          }
          callback();
        },
      }
    ],
    reason: [
      { required: true, message: '请输入退费原因', trigger: ['change', 'blur'] }
    ],
    accountName: [
      { required: true, message: '请输入账户名', trigger: ['change', 'blur'] }
    ],
    cardNo: [
      { required: true, message: '请输入银行卡号', trigger: ['change', 'blur'] }
    ],
    bankMainName: [
      { required: true, message: '请输入银行名称', trigger: ['change', 'blur'] }
    ],
    bankName: [
      { required: true, message: '请输入支行名称', trigger: ['change', 'blur'] }
    ],
  }

  @Watch('formData.cardNo', { deep: true, immediate: true })
  private watchBankNoFunc(newVal: any) {
    if (newVal && newVal.length > 4) {
      let _idcard = '';
      _idcard = newVal.replace(/\s/g, '').replace(/[^\d]/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
      this.formData.cardNo = _idcard;
    }
  }

  private submitLoading = false;

  // 新增变更数据表格抽屉列表配置
  private formTableData: ParamsType = {
    _this: {},
    selection: true,
    index: false,
    options: [],
    height: 200,
    labels: [
      {
        key: 'storeName',
        label: '门店',
        minWidth: 100,
      },
      {
        key: 'seq',
        label: '订单号',
        minWidth: 120,
      },
      {
        key: 'registerTime',
        label: '报名日期',
        minWidth: 100,
        render(h: any, params: any) {
          const { registerTime } = params.row;
          if (registerTime === undefined) return h('div', '');
          return h('div', dayjs(registerTime).format('YYYY-MM-DD'));
        }
      },
      {
        key: 'examClasses',
        label: '班别',
        minWidth: 100,
      },
      {
        key: 'carModel',
        label: '车型',
        minWidth: 80,
      },
      {
        key: 'period',
        label: '散学学时',
        minWidth: 100,
      },
      {
        key: 'presentPeriod',
        label: '赠送学时',
        minWidth: 100,
      },
      {
        key: '',
        label: '总学时',
        minWidth: 100,
        render(h: any, params: any) {
          const { period, presentPeriod } = params.row;
          return h('div', Number(period) + Number(presentPeriod));
        }
      },
      {
        key: '',
        label: '剩余学时',
        minWidth: 100,
        render(h: any, params: any) {
          const { period, presentPeriod, usedPeriod } = params.row;
          return h('div', Number(period) + Number(presentPeriod) - Number(usedPeriod));
        }
      },
      {
        key: 'salePrice',
        label: '订单金额',
        minWidth: 100,
      },
      {
        key: 'amount',
        label: '实收金额',
        minWidth: 100,
      },
    ],
    list: [],
    selectionList: [],
  };

  // 抽屉表格选中切换
  private formTableSelectionChange(val: []) {
    this.formTableData.selectionList = val;
    // 处理根据勾选数据计算表单部分字段的逻辑
    if (val && val.length) {
      const totalHoursArr = val.map((a: any) => Number(a.period) + Number(a.presentPeriod));
      const totalHours = Sum(totalHoursArr);

      const totalLeftHoursArr = val.map((a: any) => Number(a.period) + Number(a.presentPeriod) - Number(a.usedPeriod));
      const totalLeftHours = Sum(totalLeftHoursArr);

      const totalOrderMoneyArr = val.map((a: any) => a.salePrice);
      const totalOrderMoney = Sum(totalOrderMoneyArr);

      const totalRealMoneyArr = val.map((a: any) => a.amount);
      const totalRealMoney = Sum(totalRealMoneyArr);
      this.formData.totalHours = totalHours; // 总学时合计
      this.formData.totalLeftHours = totalLeftHours; // 总剩余学时
      this.formData.totalOrderMoney = totalOrderMoney; // 总订单金额
      this.formData.totalRealMoney = totalRealMoney; //  总实收金额
    } else {
      this.formData.totalHours = null; // 总学时合计
      this.formData.totalLeftHours = null; // 总剩余学时
      this.formData.totalOrderMoney = null; // 总订单金额
      this.formData.totalRealMoney = null; //  总实收金额
    }
  }

  // 计算应扣金额合计
  get countTotalKouMoney() {
    const { learnedPeriodFee, deductTrainFee } = this.formData;
    console.log(learnedPeriodFee, deductTrainFee, jsAddFunc(learnedPeriodFee, deductTrainFee));
    return jsAddFunc(learnedPeriodFee, deductTrainFee) || 0;
  }

  @Watch('countTotalKouMoney')
  gotTotalKouMoney(val: any) {
    this.formData.deductTotalFee = val;
  }

  // 计算应退费用
  get countRefundMoney() {
    const { totalRealMoney, deductTotalFee } = this.formData;
    return jsReduceFunc(totalRealMoney, deductTotalFee) || 0;
  }

  @Watch('countRefundMoney')
  goRefundMoney(val: any) {
    this.formData.refundableFee = val;
  }

  // 身份证搜索下拉配置项
  private idNoOption:any = {
    options: [],
    loading: false,
  };

  /**
   * @description 根据证件模糊搜索，查询可退费学员订单信息
   */
  private async queryIdNoSearch(val: any) {
    this.idNoOption.loading = true;
    if (val.length >= 2) {
      const sendData = { keyword: val };
      const body: any = await this.getRefundInfoByIdNo(sendData);
      this.idNoOption.options = body;
      this.idNoOption.loading = false;
    }
  }

  /**
  * @description 搜索下拉框回调函数
  */
  async formDataSelectCallback(val: any) {
    const { options } = this.idNoOption;
    this.formData.idNo = val;
    const userInfo: any = options.filter((a: any) => a.idNo === val);
    this.formData.userInfo = userInfo?.[0];
    this.formData.userName = userInfo?.[0].userName;
    this.formData.mobile = userInfo?.[0].mobile;
    this.formData.storeName = userInfo?.[0].storeName;
    this.formTableData.list = userInfo?.[0].scatteredOrder;
    // this.queryResultChangeRecord({ idNo: val }).then((res: any) => {
    //   const list = [].concat(res);
    //   this.formData.oldResult = res?.result;
    // }).catch((res: any) => {
    //   this.formTableData.list = [];
    // }).finally(() => {
    //   this.idNoOption.options = [];
    // });
  }

  /** 新增 */
  private submitAddFun() {
    (this.$refs.addForm as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        this.submitLoading = true;
        const sendData = {
          ...this.formData,
          regionId: this.formData.userInfo?.regionId,
          regionName: this.formData.userInfo?.regionName,
          storeId: this.formData.userInfo?.storeId,
          orderIdList: this.formTableData.selectionList.map((a: any) => a.id)
        };
        this.addScatteredRefundApprove(sendData).then((res: any) => {
          this.$message.success('新增成功');
          this.queryList();
        })
          .finally(() => {
            this.submitLoading = false;
            this.closeDrawer();
          });
      } else {
        this.$message.warning('您的信息填写有误，请仔细检查并修改！');
      }
    });
  }

  /**
* @description 关闭抽屉，清空数据
*/
  closeDrawer() {
    this.drawerShow = false;
    (this.$refs.addForm as VueComponentParent).resetFields();
    this.formTableData.list = [];
    this.formData.userInfo = { idNo: '', userName: '' };
    this.idNoOption.options = [];
  }

  private dialogShow = false;

  private formPayData: ParamsType = {
    approveId: '',
    invoiceType: '', // 票据类型
    paymentDate: null, // 付款时间
    num: '', // 单号
  }

  private formPayRules = {
    invoiceType: [
      { required: true, message: '请选择票据类型', trigger: ['change', 'blur'] }
    ],
    paymentDate: [
      { required: true, message: '请选择付款时间', trigger: ['change', 'blur'] }
    ]
  }

  // 票据类型
  private invoiceTypeList = INVOICING_TYPE;

  /** 付款 */
  private submitPayFun() {
    (this.$refs.payForm as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        this.submitLoading = true;
        const sendData = {
          ...this.formPayData,
          paymentDate: dayjs(this.formPayData.paymentDate).format('YYYY-MM-DD HH:mm:ss')
        };
        this.scatteredPayment(sendData).then((res: any) => {
          this.$message.success('付款成功');
          this.queryList();
          this.handlePayClose();
        })
          .finally(() => {
            this.submitLoading = false;
            this.dialogShow = false;
          });
      } else {
        this.$message.warning('您的信息填写有误，请仔细检查并修改！');
      }
    });
  }

  /** 关闭付款弹出框 */
  private handlePayClose() {
    this.dialogShow = false;
    (this.$refs.payForm as VueComponentParent).resetFields();
  }

  // 打印退费单预览
  private refundPrintShow = false;

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
        minWidth: 240,
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

  private async deleteOrder(val: ParamsType) {
    console.log(val);
    await this.deleteSanXueScatteredOrder({
      id: val.approveId
    });
    this.$message.success('删除成功');
    this.paginationData.current = 1;
    this.queryList();
  }

  /** 打印退费单 */
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
      const { approveId } = item;
      idList.push(approveId);
      // this.printTableData.regionName = regionName;
    });
    this.refundScatteredPayment({ idList }).then((res: any) => {
      this.printTableData.list = res;
      // 长度不够 补{}
      const _len = this.printTableData.list.length;
      const _defList = [];
      for (let i = 0; i < (10 - _len); i += 1) {
        _defList.push({});
      }
      console.log(_defList);
      this.printTableData.list = [...this.printTableData.list, ..._defList];
    });
  }

  querFirstPageList() {
    this.paginationData.current = 1;
    this.queryList();
  }

  async queryList() {
    const { searchForm, paginationData } = this;
    const sendData = drawSearchForm(searchForm, paginationData);
    const { beginDate, endDate } = sendData;
    // 判断时间
    if (beginDate && endDate && timestampSizeCompare(beginDate, endDate)) {
      this.$message.warning('开始时间不能大于结束时间');
      return;
    }
    try {
      const body = await this.getScatteredRefundList(sendData);
      const { data = [], current, total } = body;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
      this.queryCount();
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = true;
    }
  }

  async queryCount() {
    const { searchForm, paginationData } = this;
    const sendData = drawSearchForm(searchForm, paginationData);
    const body = await this.getScatteredRefundCount(sendData);
    if (body && body.length > 0) {
      body.forEach((item: any) => {
        const { auditStatus, num } = item;
        if (this.statisticsData[auditStatus]) {
          this.statisticsData[auditStatus].value = num;
        }
      });
    }
  }

  perm = {};

  async mounted() {
    this.tableData._this = this;
    // const { drivingSchoolId } = this.userInfo;
    // this.queryRegionList(drivingSchoolId);
    this.queryList();
    // this.initSearch();
    const permObj = await this.$getPerm(
      this,
      this.tableData.options,
      this.searchForm.buttonList
    );
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
    this.perm = permObj.perm;
  }
}
