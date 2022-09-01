import { State, Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import FileSaver from 'file-saver';
import {
  SearchTable, CtjtTable, CtjtPagination, CtjtCard, CtjtUploadOSS
} from '@/components';
import { ORDER_PAY_TYPE, THIRD_CHANNELS_OPTS } from '@/enums';
import {
  deepClone,
  spliceHoursAndMinutesAndSeconds,
  timestampSizeCompare,
  jsAddFunc,
  formatPrice,
  OSS_BASEURL
} from '@/assets/js/common';
import { ParamsType, VueComponentParent } from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import { deleteSingleAliyuncs } from '@/assets/js/upload_oss';
import { getSchoolImageProps } from '@/views/finance/_common/common';
import ctjtPaginationMixins from '@/mixins/pagination';
import { CtjtFinancePrint } from '@/views/finance/_components';
import {
  listSearchForm, listSearchFormHuizhou, listTableData, studyCarLogsTableData, listChangeCarModelFormData,
  listChangeCarModelFormRules, carModelOpts
} from './index';

interface ElementDOMS extends Element {
  offsetHeight: number;
}

const name = '散学订单';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtCard,
    CtjtFinancePrint,
    CtjtUploadOSS
  }
})
export default class MarketSanXueOrderMgList extends mixins(ctjtPaginationMixins) {
  @State(state => state.base.userInfo) private userInfo: any;

  @Action('base/queryGroupMechanismData') private queryGroupMechanismData!: (data: any) => any;

  @Action('order/queryScatteredOrderList') private queryScatteredOrderList!: (data: any) => any;

  @Action('order/queryTotalAndSumAmount') private queryTotalAndSumAmount!: (data: any) => any;

  @Action('order/queryExpostScatteredList') private queryExpostScatteredList!: (data: any) => any;

  @Action('finance/queryAllBankAccountList') private queryAllBankAccountList!: () => any;

  @Action('finance/queryAllPosTerminalNoList') private queryAllPosTerminalNoList!: (data: any) => any;

  @Action('goods/queryClassesInfoList') private queryClassesInfoList!: (data: any) => any;

  @Action('order/queryChannelList') private queryChannelList!: () => any;

  @Action('assignment/queryScatteredCoach') private queryScatteredCoach!: () => any;

  @Action('order/queryScatteredBrandOpts') private queryScatteredBrandOpts!: () => any;

  @Action('order/queryScatteredChangeCarModel') private queryScatteredChangeCarModel!: (data: any) => any;

  @Action('assignment/querySchedulingAppointListByOrderId') private querySchedulingAppointListByOrderId!: (data: any) => any;

  @Action('order/queryScatteredBatchAllotCoach') private queryScatteredBatchAllotCoach!: (data: any) => any;

  @Action('order/queryScatteredBatchRollInHistory') private queryScatteredBatchRollInHistory!: (data: any) => any;

  @Action('order/queryScatteredBatchRollOutHistory') private queryScatteredBatchRollOutHistory!: (data: any) => any;

  @Action('order/deleteScatteredOrder') private deleteScatteredOrder!: (data: any) => any;

  @Action('order/queryScatteredPeriodUnfreeze') private queryScatteredPeriodUnfreeze!: (data: any) => any;

  @Action('sale/queryMarketListDropDownBoxList') private queryMarketListDropDownBoxList!: (data: any) => any;

  @Action('order/queryScatteredFindAllClass') private queryScatteredFindAllClass!: () => any;

  @Action('order/queryScatteredCheckOrderIsRefund') private queryScatteredCheckOrderIsRefund!: (data: any) => any;

  @Action('finance/queryprintReceiptInfo') private queryprintReceiptInfo!: (data: any) => ParamsType;

  @Action('order/queryScatteredPayInfoByOrderId') private queryScatteredPayInfoByOrderId!: (data: any) => any;

  ossBaseUrl = OSS_BASEURL;

  // 支付方式
  private payTypeOpts = ORDER_PAY_TYPE;

  // 列表搜索配置
  searchForm: any = {};

  // 列表搜索 操作按钮回调
  public searchTableCallBack(key: string) {
    if (key === 'search' || key === 'reset') {
      if (key === 'reset') {
        this.searchForm.selectInputList[0].select.value = 1;
        this.searchForm.selectInputList[0].input.value = null;
        this.searchForm.selectList[1].value = '';
        this.searchForm.selectList[1].options = [];
      }
      this.paginationData.current = 1;
      this.queryList();
    }
  }

  formatPrice(val: number |string) {
    return formatPrice(val);
  }

  // 表格
  tableData = deepClone(listTableData);

  // 列表操作回调
  async tableOptionCallback(val: any) {
    const { id } = val;
    if (id === 1) {
      this.jumpDetail();
      return;
    }
    if (id === 12) {
      this.exportData();
      return;
    }
    // 一下数据必须勾选一项
    const { selectionList } = this.tableData;
    const _len = selectionList.length;
    if (_len === 0) {
      this.$message.warning('请先勾选1条数据');
      return;
    }
    // 单项操作id项
    const oneDataIdArr = [2, 3, 4, 5, 6, 11, 13];
    if (oneDataIdArr.includes(id)) {
      if (_len > 1) {
        this.$message.warning('请先勾选1条数据');
        return;
      }
      const { 0: data } = selectionList;
      const {
        id: orderId, payStatus, studentStatus, seq, name: studentName
      } = data;
      if (id === 2) {
        // 学员加钟
        this.jumpDetail(orderId, '2');
      }
      if (id === 3) {
        // 编辑
        const { drivingSchoolId } = this.userInfo;
        if (drivingSchoolId === '370' || drivingSchoolId === '3748') {
          if (payStatus === 2) {
            this.$message.warning('已收款审核，不能编辑该条数据！');
            return;
          }
          this.jumpDetail(orderId, '3');
        }

        if (drivingSchoolId === '3374') {
          if (studentStatus !== 3) {
            this.queryScatteredCheckOrderIsRefund([{ orderId, seq, studentName }]).then((res: any) => {
              if (res === undefined) {
                this.jumpDetail(orderId, '3');
              } else {
                this.$message.warning('该订单存在退费，请先撤回或不通过退费单，再修改！');
              }
            });
          } else {
            this.$message.warning('该订单学员状态为历史，不可修改！');
          }
        }
      }
      if (id === 4) {
        // 收款审核
        if (payStatus === 2) {
          this.$message.warning('只有未收款且待结转的数据才可进行收款审核！');
          return;
        }
        this.jumpDetail(orderId, '4');
      }
      if (id === 5) {
        // 转车型
        const { learnDrivingStatus } = data;
        if (learnDrivingStatus === 0) {
          this.$message.warning('已冻结数据不可转车型，请重新选择！');
          return;
        }
        this.queryCarBrand();
        // 支付相关
        this.queryAllBankAccountList().then((res: any) => {
          this.allBankAccountOpts = res;
        });
        this.queryAllPosTerminalNoList({ type: 2 }).then((res: any) => {
          this.allPosTerminalNoOpts = res;
        });
        const { changeCarModelFormData } = this;
        const keys = ['id', 'name', 'idNo', 'sumPeriod', 'surplusPeriod', 'carBrand', 'carModel'];
        Object.keys(changeCarModelFormData).forEach(key => {
          if (keys.includes(key)) {
            if (key === 'carModel') {
              changeCarModelFormData.oldCarModel = data[key];
            } else if (key === 'carBrand') {
              changeCarModelFormData.oldCarBrand = data[key];
            } else {
              changeCarModelFormData[key] = data[key];
            }
          }
        });
        this.drawerCarType = true;
      }
      if (id === 6) {
        // 学车记录
        this.studyCarLogsOrderId = orderId;
        this.studyCarLogsTableSizeChange(10);
      }
      if (id === 11) {
        // 删除
        if (payStatus === 2) {
          this.$message.warning('未收款且无任何约车记录的散学订单才能删除，请重新选择！');
          return;
        }
        this.$confirm('确定将学员删除?', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(async () => {
          await this.deleteScatteredOrder({ id: orderId });
          this.$message.success('删除成功');
          this.queryList();
        });
      }
      if (id === 13) {
        this.queryScatteredPayInfoByOrderId({ id: orderId }).then((res: any) => {
          // 打印收据
          this.receiptOpts = res || [];
          const { 0: payData } = res;
          if (res.length > 1) {
            this.receiptType = payData.id;
            this.showReceipt = true;
          } else {
            // 直接弹出打印框
            this.queryReceiptData(payData?.id);
            this.printShow = true;
          }
        });
      }
    }
    // 批量操作id项
    if (id === 7) {
      // 分配教练
      const list = selectionList.filter((a: any) => a.studentStatus === 3);
      if (list.length > 0) {
        this.$message.warning('历史学员不可分配，请重新选择！');
        return;
      }
      this.dialogVisibleAssignCoach = true;
    }
    if (id === 8) {
      // 进历史
      const list = selectionList.filter((a: any) => a.studentStatus !== 2);
      if (list.length > 0) {
        this.$message.warning('只有毕业数据才可转历史，请重新选择数据！');
        return;
      }
      this.$confirm('确定将学员转入历史库?', '进历史', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const ids: string[] = [];
        selectionList.forEach((item: any) => {
          ids.push(item.id);
        });
        await this.queryScatteredBatchRollInHistory({ ids });
        this.$message.success('转入历史库成功');
        this.queryList();
      });
    }
    if (id === 9) {
      // 学时解冻
      const list = selectionList.filter((a: any) => a.learnDrivingStatus !== 0 && a.studentTypeOpts !== 1);
      if (list.length > 0) {
        this.$message.warning('只有学时已冻结的在学学员才可解冻学时，请重新选择数据！');
        return;
      }
      const ids: string[] = [];
      selectionList.forEach((item: any) => {
        ids.push(item.id);
      });
      this.formUnfreeze.ids = ids;
      this.dialogVisibleUnfreeze = true;
    }
    if (id === 10) {
      // 转出历史
      this.$confirm('确定将学员转出历史库?', '转出历史', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const ids: string[] = [];
        selectionList.forEach((item: any) => {
          ids.push(item.id);
        });
        await this.queryScatteredBatchRollOutHistory({ ids });
        this.$message.success('转出历史库成功');
        this.queryList();
      });
    }
  }

  // 列表选中每一列切换回调
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  // 导出表格配置
  private downTableData: ParamsType = {
    labels: [],
    list: [],
    name,
  };

  // 学时解冻
  dialogVisibleUnfreeze = false;

  handleCloseUnfreeze() {
    this.dialogVisibleUnfreeze = false;
    this.formUnfreeze = {
      unfreezeAccessory: [],
      unfreezeRemark: '',
      ids: []
    };
  }

  async submitUnfreeze() {
    await this.queryScatteredPeriodUnfreeze(this.formUnfreeze);
    this.$message.success('解冻学时成功');
    this.queryList();
    this.handleCloseUnfreeze();
  }

  formUnfreeze: ParamsType = {
    unfreezeAccessory: [],
    unfreezeRemark: '',
    ids: []
  }

  // 附件相关
  uploadConfig = {
    multiple: false,
    limit: 5,
    business: 'market/scattered',
    fileList: []
  }

  unfreezeUploadFunc(val: string) {
    (this.$refs.photoUrl as VueComponentParent).clearValidate();
    this.formUnfreeze.unfreezeAccessory.push(val);
  }

  async deleteUnfreeze(index: number) {
    const link = this.formUnfreeze.unfreezeAccessory[index];
    await deleteSingleAliyuncs(link);
    this.formUnfreeze.unfreezeAccessory.splice(index, 1);
  }

  @Watch('formUnfreeze.unfreezeAccessory', { deep: true })
  watchCancelAccessory(newVal: string[]) {
    const list: any = newVal.map(item => {
      const data = { url: item };
      return data;
    });
    this.uploadConfig.fileList = list;
  }

  /** 导出 */
  async exportData() {
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const { startDate, endDate } = _data;
    const sendData: any = { ..._data, isExport: 1 };
    if (startDate) {
      sendData.startDate = spliceHoursAndMinutesAndSeconds(1, startDate);
    }
    if (endDate) {
      sendData.endDate = spliceHoursAndMinutesAndSeconds(2, endDate);
    }
    const body = await this.queryExpostScatteredList(sendData);
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel'
    });
    FileSaver.saveAs(blob, `${name}${this.$dayjs(new Date()).format('YYYYMMDD')}`);
  }

  // 打印收据
  showReceipt = false;

  receiptOpts = [];

  receiptType = '';

  handleReceiptClose() {
    this.receiptType = '';
    this.receiptOpts = [];
    this.showReceipt = false;
  }

  handleReceiptSubmit() {
    const payId = this.receiptType;
    this.queryReceiptData(payId);
    this.handleReceiptClose();
    this.printShow = true;
  }

  printShow = false;

  // 打印列表配置
  printTableData: ParamsType = {
    title: '业务受理回执单',
    data: {},
  };

  // 查询收据详情
  async queryReceiptData(payId: string) {
    const sendData = {
      orderType: 2,
      payId
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

  // 跳转详情页面
  jumpDetail(id?: string, type?: string) {
    this.$router.push({ path: '/market/sxpj/order/detail', query: { id, type } });
  }

  // 搜索下拉框筛选
  private _setFormSelectFunc(type: string, data: any) {
    if (data && data.length > 0) {
      const _data = deepClone(data);
      _data.forEach((item: any) => {
        const _item = item;
        _item.label = _item.name;
      });
      const { drivingSchoolId } = this.userInfo;
      if (type === 'region') {
        this.searchForm.selectList[0].options = _data;
        // 默认选择第一个片区
        if (drivingSchoolId === '370') {
          this.searchForm.selectList[0].value = _data[0].id;
          this.selectFunc('store', _data[0].id);
        }
      }
      if (type === 'store') {
        this.searchForm.selectList[1].options = _data;
      }
    }
  }

  // 搜索筛选框选择回调
  searchSelectChange(val: ParamsType) {
    const { value, key } = val;
    if (key === 'regionId') {
      this.searchForm.selectList[1].options = [];
      this.searchForm.selectList[1].value = '';
      if (value) {
        this.selectFunc('store', value);
      }
    }
  }

  // 下拉框请求参数处理
  async selectFunc(type: string, id: string) {
    const data = await this.queryGroupMechanismData({ pid: id });
    this._setFormSelectFunc(type, data);
  }

  totalAndSumAmount: ParamsType = {}

  get totalAndSumAmountHtml() {
    const {
      total = 0, sumAmount = 0, sumScatteredPeriod = 0, sumPresentPeriod = 0, sumSurplusPeriod = 0, sumPeriod = 0
    } = this.totalAndSumAmount;
    return `汇总： 共${formatPrice(total)}个订单，总实收金额：${formatPrice(sumAmount)}元，
    总散学学时${formatPrice(sumScatteredPeriod)}，总赠送学时${formatPrice(sumPresentPeriod)}，
    总剩余学时${formatPrice(sumSurplusPeriod)}，总学时合计${formatPrice(sumPeriod)}`;
  }

  // 请求订单列表
  async queryList() {
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const { startDate, endDate } = _data;
    // 判断时间
    if (startDate && endDate && timestampSizeCompare(startDate, endDate)) {
      this.$message.warning('开始时间不能大于结束时间');
      return;
    }
    const sendData: any = { ..._data };
    if (startDate) {
      sendData.startDate = spliceHoursAndMinutesAndSeconds(1, startDate);
    }
    if (endDate) {
      sendData.endDate = spliceHoursAndMinutesAndSeconds(2, endDate);
    }
    this.tableData.loading = true;
    this.queryScatteredOrderList(sendData).then((res: any) => {
      const {
        data, current, total
      } = res;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
    }).finally(() => {
      this.tableData.loading = false;
    });
    this.queryTotalAndSumAmount(sendData).then((res: any) => {
      this.totalAndSumAmount = res;
    });
  }

  // 转车型b=================================================================
  drawerCarType = false

  changeCarModelFormData = listChangeCarModelFormData

  changeCarModelFormRules = listChangeCarModelFormRules

  carModelOpts = carModelOpts

  carBrandOpts = []

  @Watch('changeCarModelFormData.amount', { deep: true })
  wacthAmount(newVal: any) {
    this.changeCarModelFormData.payInfoList[0].amount = newVal;
  }

  async queryCarBrand() {
    const body = await this.queryScatteredBrandOpts();
    this.carBrandOpts = body;
  }

  // 转车型弹窗关闭前
  handleCloseChangeCarType() {
    this.$confirm('弹窗关闭数据不会保留，确定关闭?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      this.cancelChangeCarType();
    });
  }

  cancelChangeCarType() {
    (this.$refs.changeCarModelFormRef as VueComponentParent).resetFields();
    this.changeCarModelFormData.payInfoList = [this.changeCarModelFormData.payInfoList[0]];
    this.drawerCarType = false;
  }

  submitLoading = false;

  handleSubmitChangeCarType() {
    (this.$refs.changeCarModelFormRef as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        const { changeCarModelFormData } = this;
        const sendData = { ...changeCarModelFormData };
        // 判断
        const {
          surplusPeriod, period, payInfoList, amount: allAmount
        } = sendData;
        if (period > surplusPeriod) {
          this.$message.warning('请输入正确学时，剩余学时≥学时＞0');
          return;
        }
        // 支付列表处理
        let _orderPayListAmount = 0; // 总收款金额
        payInfoList.forEach((item: any) => {
          const { payTime, id, amount } = item;
          const _item = item;
          if (!id) delete _item.id;
          _item.payTime = payTime ? this.$dayjs(payTime).format('YYYY-MM-DD HH:mm:ss') : '';
          _orderPayListAmount = jsAddFunc(_orderPayListAmount, amount);
        });
        if (Number(allAmount) !== _orderPayListAmount) {
          this.$message.warning('收款金额不等于补费金额，请检查是否输入有误');
          return;
        }
        this.submitLoading = true;
        this.queryScatteredChangeCarModel(sendData).then(() => {
          this.$message.success('操作成功');
          this.queryList();
          this.cancelChangeCarType();
        }).finally(() => {
          this.submitLoading = false;
        });
      } else {
        this.$message.warning('您的信息填写有误，请仔细检查并修改！');
      }
    });
  }

  // 支付方式切换
  payTypeChange(val: number) {
    this.changeCarModelFormData.payInfoList.forEach((item: any, index: number) => {
      if (index === val) {
        const _item = item;
        _item.payContent = _item.payType === 6 ? '上缴现金' : '';
        _item.outTradeNo = '';
        _item.transactionId = '';
        _item.remark = '';
      }
    });
  }

  // 新增一条支付记录
  addOrderPayVos() {
    const { payInfoList } = this.changeCarModelFormData;
    const len = payInfoList.length;
    if (len > 2) {
      this.$message.warning('支付记录不能超过3条');
    } else {
      const obj = {
        amount: '',
        id: '',
        payContent: '',
        payTime: this.$dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        payType: 1,
        outTradeNo: '',
        transactionId: '',
        remark: '',
      };
      payInfoList.push(obj);
    }
  }

  // 删除当前支付记录
  deleteOrderPayVos(index: number) {
    const { payInfoList } = this.changeCarModelFormData;
    payInfoList.splice(index, 1);
  }

  // 收款账号
  allBankAccountOpts = [];

  // pos终端号
  allPosTerminalNoOpts = [];

  // 第三方渠道名称
  thirdChannelsOpts = THIRD_CHANNELS_OPTS;
  // 转车型end=================================================================

  // 学车记录b=================================================================
  studyCarLogsOrderId = null;

  drawerStudyCarLogs = false;

  @Watch('drawerStudyCarLogs')
  watchDrawerStudyCarLogs(v: boolean) {
    if (!v) this.studyCarLogsPaginationData = deepClone(this.studyCarLogsPaginationDataDeep);
  }

  studyCarLogsTable = studyCarLogsTableData;

  studyCarLogsPaginationDataDeep = {
    pageSize: 10,
    current: 1,
    total: 0,
    sortByAppointDate: 0
  }

  studyCarLogsPaginationData = deepClone(this.studyCarLogsPaginationDataDeep);

  // 列表排序回调
  studyCarLogsTableSortChange(data: any) {
    const { prop, order } = data;
    const returnStatusFunc = (res: any) => {
      if (res === 'ascending') return 1;
      if (res === 'descending') return 2;
      return 0;
    };
    switch (prop) {
      case 'appointDate':
        this.studyCarLogsPaginationData.sortByAppointDate = returnStatusFunc(order);
        break;
      default:
        break;
    }
    this.queryStudyCarLogsList();
  }

  // 列表分页
  public studyCarLogsTableSizeChange(val: number) {
    this.studyCarLogsPaginationData.pageSize = val;
    this.studyCarLogsPaginationData.current = 1;
    this.queryStudyCarLogsList();
  }

  public studyCarLogsTableCurrentChange(val: number) {
    this.studyCarLogsPaginationData.current = val;
    this.queryStudyCarLogsList();
  }

  async queryStudyCarLogsList() {
    this.drawerStudyCarLogs = true;
    const { studyCarLogsOrderId, studyCarLogsPaginationData } = this;
    const { pageSize, current: gcurrent, sortByAppointDate } = studyCarLogsPaginationData;
    const body = await this.querySchedulingAppointListByOrderId({
      orderId: studyCarLogsOrderId, pageSize, current: gcurrent, sortByAppointDate
    });
    const {
      data, current, total
    } = body;
    this.studyCarLogsTable.list = data;
    this.studyCarLogsPaginationData.current = current;
    this.studyCarLogsPaginationData.total = total;
  }

  // 学车记录end=================================================================

  // 分配教练b===================================================================
  dialogVisibleAssignCoach = false;

  assignCoachOpts = []; // 分配教练列表

  handleChangeCoach(value: string) {
    const list: any[] = this.assignCoachOpts.filter((item: any) => item.id === value);
    this.assignCoachFormData.coachName = list[0] ? list[0].name : '';
  }

  assignCoachFormData: any = {
    coachId: '',
    coachName: '',
  }

  assignCoachFormRules: any = {
    coachId: { required: true, message: '请选择教练', trigger: 'blur' }
  }

  handleCloseAssignCoach() {
    (this.$refs.assignCoachFormRef as VueComponentParent).resetFields();
    this.dialogVisibleAssignCoach = false;
  }

  handleSubmitAssignCoach() {
    (this.$refs.assignCoachFormRef as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        const { assignCoachFormData, tableData } = this;
        const { selectionList } = tableData;
        const ids: string[] = [];
        selectionList.forEach((item: any) => {
          ids.push(item.id);
        });
        const sendData = {
          ...assignCoachFormData,
          ids,
        };
        this.queryScatteredBatchAllotCoach(sendData).then(() => {
          this.$message.success('分配成功');
          this.queryList();
          this.handleCloseAssignCoach();
        }).finally(() => {
          this.submitLoading = false;
        });
      }
    });
  }

  // 分配教练end=================================================================

  // 生命周期函数=================================================================
  async init() {
    // 处理配置项
    const { drivingSchoolId, storeId } = this.userInfo;
    switch (drivingSchoolId) {
      case '370':
        this.searchForm = deepClone(listSearchForm);
        break;
      default:
        this.searchForm = deepClone(listSearchFormHuizhou);
        break;
    }
    // 查询片区门店
    this.selectFunc('region', drivingSchoolId);
    // 学车教练
    this.queryScatteredCoach().then((res: any) => {
      this.searchForm.selectList[2].options = res;
      this.assignCoachOpts = res;
    });
    // 班别
    if (drivingSchoolId === '370') {
      this.queryScatteredFindAllClass().then((res: any) => {
        this.searchForm.selectList[4].options = res;
      });
    } else {
      this.queryClassesInfoList({ type: 2 }).then((res: any) => {
        this.searchForm.selectList[4].options = res;
      });
    }
    // 业务来源
    if (drivingSchoolId === '3374') {
      this.queryMarketListDropDownBoxList({ drivingSchoolId, status: null }).then((res: any) => {
        const deepBody = deepClone(res);
        const list: any[] = [];
        Object.keys(deepBody).forEach((key: string) => {
          list.push({ name: key });
        });
        this.searchForm.selectList[5].options = list;
      });
    } else {
      this.queryChannelList().then((res: any) => {
        this.searchForm.selectList[5].options = res;
      });
    }

    this.searchForm.selectList[1].value = storeId !== '0' ? storeId : null;

    const permObj = await this.$getPerm(this, this.tableData.options, this.searchForm.buttonList);
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
  }

  async mounted() {
    this.tableData._this = this;
    this.init();
  }

  activated() {
    this.queryList();
    // 可见区域高度
    this.$nextTick(() => {
      const _dom = document.querySelector('#container_body');
      if (_dom) {
        const _mh = (_dom as ElementDOMS).offsetHeight;
        (this.$refs.pageRef as VueComponentParent).style.height = `${_mh}px`;
        const _tbsetionH = (this.$refs.table_section as VueComponentParent).offsetHeight;
        this.tableData.height = _tbsetionH - 100;
      }
    });
  }
}
