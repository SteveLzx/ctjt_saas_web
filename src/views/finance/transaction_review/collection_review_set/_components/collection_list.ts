import Component, { mixins } from 'vue-class-component';
import { State, Action } from 'vuex-class';
import FileSaver from 'file-saver';
import {
  ParamsType, TableOptionsValue, VueComponentParent
} from '@/type';
import {
  formatPrice, deepClone, isCustomNumber, drivingSchool, timestampSizeCompare, jsAddFunc
} from '@/assets/js/common';
import { drawSearchForm } from '@/assets/js/search_table';
import { DIFF_LIST, ORDER_PAY_TYPE, THIRD_CHANNELS_OPTS } from '@/enums';
import { setTableLabels, marginTableLabels } from '@/views/finance/_common/common';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';

const name = '收款复核';
@Component
export default class Collection extends mixins(ctjtPaginationMixins, ctjttablefieldMixins) {
  @State(state => state.base.userInfo) userInfo: any;

  @Action('finance/queryAllPosTerminalNoList') private queryAllPosTerminalNoList!: (data: any) => ParamsType;

  @Action('finance/queryColectionList') private queryColectionList!: (data: any) => ParamsType;

  @Action('finance/queryColectionExport') private queryColectionExport!: (data: any) => any;

  @Action('finance/queryCollectCount') private queryCollectCount!: (data: any) => ParamsType;

  @Action('finance/collectDataCarryOver') private collectDataCarryOver!: (data: any) => ParamsType;

  @Action('finance/querySanXueDetailExport') private querySanXueDetailExport!: (data: any) => any;

  @Action('finance/queryColectionDetailExport') private queryColectionDetailExport!: (data: any) => any;

  private beginDate = new Date();

  private endDate = new Date();

  // 列表搜索项配置
  private searchForm: ParamsType = {
    selectTimeList: [
      {
        label: '',
        clearable: true,
        select: {
          key: '',
          placeholder: '',
          value: 1,
          width: 110,
          options: [
            {
              id: 1,
              label: '交易日期',
            },
          ],
        }
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
        label: '终端类型',
        key: 'payType',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 130,
        options: ORDER_PAY_TYPE.filter(a => a.id !== 4),
      },
      {
        label: '终端号',
        key: 'account',
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
        label: '是否有差异',
        key: 'isDiff',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 120,
        options: DIFF_LIST,
      },
    ],
    inputList: [],
    checkedList: [
      {
        value: '',
        key: 'isCollection',
        label: '只看代收流水金额不为0',
      },
    ],
    buttonList: [
      {
        label: '查询',
        key: 'search',
        type: 'primary',
        path: 'btn_search'
      },
      {
        label: '重置',
        key: 'reset',
        path: 'btn_search'
      },
    ],
  }

  /**
  * @description 初始化列表搜索项
  */
  private initSearch() {
    const { searchForm } = this;
    const { drivingSchoolId } = this.userInfo;
    searchForm.checkedList = drivingSchool(drivingSchoolId) === 'shengan' ? [
      {
        value: '',
        key: 'isCollection',
        label: '只看代收流水金额不为0',
      },
    ] : [];
  }

  /**
* @param { ParamsType } val 搜索项 下拉选中返回当前对象
* @description 搜索组件 下拉项选中回调函数
*/
  private searchSelectChange(val: ParamsType) {
    const { value, key } = val;
    if (key === 'payType') {
      this.searchForm.selectList[1].options = [];
      this.searchForm.selectList[1].value = '';
      if (value) {
        this.queryTerminalNoList(value);
      }
    }
  }

  /** 获取终端号 */
  private async queryTerminalNoList(type: any) {
    const { selectList } = this.searchForm;
    if (type === 1) {
      selectList[1].options = THIRD_CHANNELS_OPTS;
    } else if (type === 6) {
      selectList[1].options = [{
        id: 1,
        label: '上缴现金'
      }];
    } else {
      const data = await this.queryAllPosTerminalNoList({ type });
      selectList[1].options = data;
    }
  }

  formatPrice(val: number | string) {
    return formatPrice(val);
  }

  /**
    * @description 列表搜索 操作按钮回调
  */
  searchTableCallBack(key: string) {
    if (key === 'search') {
      this.querFirstPageList();
    }
    if (key === 'reset') {
      this.searchSelectChange({ key: 'payType', value: null });
      this.querFirstPageList();
    }
  }

  // 导出表格配置
  private downTableData: ParamsType = {
    labels: [],
    list: [],
    name,
  };

  // 统计金额
  private totalAmount = 0;

  // 表格配置
  private tableData: ParamsType = {
    _this: {},
    loading: false,
    selection: true,
    index: true,
    options: [
      {
        id: 1,
        label: '数据结转',
        type: 'success',
        path: 'btn_sjjz'
      },
      {
        id: 2,
        label: '强制结转',
        type: 'primary',
        path: 'btn_qzjz'
      },
      // {
      //   id: 3,
      //   label: '陪驾结转',
      //   type: 'danger',
      //   path: 'btn_pjjz'
      // },
      {
        id: 4,
        label: '导出',
        path: 'btn_export'
      },
      {
        id: 5,
        label: '导出散学收款金额明细',
        path: 'btn_sxexport'
      },
      {
        id: 6,
        label: '导出招生收款金额明细',
        path: 'btn_zsexport'
      }
    ],
    labels: [],
    list: [],
    selectionList: [],
    showSummary: true,
    summariesMethod: (param: any) => {
      const { columns, data } = param;
      const sums: any = [];
      columns.forEach((column: any, index: number) => {
        if (index === 1) {
          sums[index] = '总计';
          return;
        }
        const that = this.tableData._this;
        const {
          collectionAmountTotal = 0,
          recruitAmountTotal = 0,
          orderAmountTotal = 0, // 第三位，实际应收金额
          recruitRecordAmountTotal = 0,
          recruitDiffAmountTotal = 0,
          recruitSettleAmountTotal = 0,
          recruitUnSettleAmountTotal = 0, // 未结转金额
          collectionRecordAmountTotal = 0,
          collectionDiffAmountTotal = 0,
          collectionSettleAmountTotal = 0
        } = that.staticData;
        const { drivingSchoolId } = that.userInfo;
        const mainList = drivingSchoolId === '16' ? [4, 5, 6, 7, 8, 9, 10, 11, 12, 13] : [4, 5, 6, 7, 8, 9, 10];
        const values = data.map((item: any) => {
          if (isCustomNumber(item[column.property])) {
            return item[column.property];
          }
          return 0;
        });
        if (values.every((val: any) => isCustomNumber(val))) {
          if (mainList.includes(index)) {
            sums[index] = values.reduce((prev: any, curr: any) => {
              const value = Number(curr);
              if (!Number.isNaN(value)) {
                if (drivingSchoolId === '3374') { // 惠州
                  if (index === 4) return formatPrice(collectionAmountTotal);
                  if (index === 5) return formatPrice(recruitAmountTotal);
                  if (index === 6) return formatPrice(recruitRecordAmountTotal);
                  if (index === 7) return formatPrice(recruitDiffAmountTotal);
                  if (index === 8) return formatPrice(recruitSettleAmountTotal);
                  if (index === 9) return formatPrice(recruitUnSettleAmountTotal);
                } else if (drivingSchoolId === '370') {
                  if (index === 4) return formatPrice(collectionAmountTotal);
                  if (index === 5) return formatPrice(recruitAmountTotal);
                  if (index === 6) return formatPrice(orderAmountTotal);
                  if (index === 7) return formatPrice(recruitRecordAmountTotal);
                  if (index === 8) return formatPrice(recruitDiffAmountTotal);
                  if (index === 9) return formatPrice(recruitSettleAmountTotal);
                  if (index === 10) return formatPrice(recruitUnSettleAmountTotal);
                } else {
                  if (index === 4) return formatPrice(collectionAmountTotal);
                  if (index === 5) return formatPrice(recruitAmountTotal);
                  if (index === 6) return formatPrice(orderAmountTotal);
                  if (index === 7) return formatPrice(recruitRecordAmountTotal);
                  if (index === 8) return formatPrice(recruitDiffAmountTotal);
                  if (index === 9) return formatPrice(recruitSettleAmountTotal);
                  if (index === 10) return formatPrice(recruitUnSettleAmountTotal);
                }
                // if (index === 11) return formatPrice(collectionRecordAmountTotal);
                // if (index === 12) return formatPrice(collectionDiffAmountTotal);
                // return collectionSettleAmountTotal;
              }
              return prev;
            }, 0);
          } else {
            sums[index] = '';
          }
        } else {
          sums[index] = '';
        }
      });

      return sums;
    }
  };

  /**
  * @description 表格操作回调
  */
  private tableOptionCallback(val: TableOptionsValue) {
    const { id } = val;
    const { selectionList, labels } = this.tableData;
    const idList: Array<number> = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      idList.push(_item.id);
    });
    const _len = selectionList.length;
    // 【已结转】(招生结转金额>0)：recruitSettleAmount>0
    // 【招生差异金额】：recruitDiffAmount
    // 【代收收据金额】：collectionAmount，
    // 【代收流水金额】：collectionRecordAmount，
    // 【代收差异金额】：collectionDiffAmount
    // const hasApproval = selectionList.filter((a: any) => a.recruitSettleAmount > 0).length > 0; // 存在已结转数据
    const hasCollFeeDiff = selectionList.filter((a: any) => a.recruitDiffAmount !== 0).length > 0; // 存在差异金额不为0的数据
    const hasCollFeeDiffIsZero = selectionList.filter((a: any) => a.recruitDiffAmount === 0).length > 0; // 存在差异金额为0的数据
    if (id === 1) {
      // 数据结转
      // 数据是否已结转,提示"已结转数据不可结转，请重新选择"
      // 【招生差异金额】是否为0，提示"差异金额不为0，不可结转"
      if (_len >= 1) {
        // if (hasApproval) this.$message.warning('已结转数据不可结转，请重新选择!');
        if (hasCollFeeDiff) this.$message.warning('差异金额不为0，不可结转');
        else {
          this.dialogForm.selectionList = selectionList;
          this.dialogForm.id = id;
          this.dialogForm.dialogVisible = true;
        }
      } else {
        this.$message.warning('请先勾选数据!');
      }
    }
    if (id === 2) {
      // 强制结转
      // 数据是否已结转,提示"已结转数据不可结转，请重新选择"
      // 【招生差异金额】是否为0，招生差异金额===0，不可进行强制结转，提示“招生差异金额为0，不可进行强制结转。”
      if (_len >= 1) {
        // if (hasApproval) this.$message.warning('已结转数据不可结转，请重新选择!');
        if (hasCollFeeDiffIsZero) this.$message.warning('招生差异金额为0，不可进行强制结转');
        else {
          this.dialogForm.selectionList = selectionList;
          this.dialogForm.id = id;
          this.dialogForm.dialogVisible = true;
        }
      } else {
        this.$message.warning('请先勾选数据!');
      }
    }

    if (id === 3) {
      // 陪驾结转
      // 数据是否已结转,提示"已结转数据不可结转，请重新选择"
      // 【代收收据金额】或【代收流水金额】为0，提示"请先标记代收，再进行结转"
      // 【代收收据金额】和【代收流水金额】都不为0，并且【代收差异金额】不为0，提示"代收差异金额不为0，不可结转"
      const isHasOtherPayRecord = selectionList.filter((a: any) => a.collectionAmount === 0 || a.collectionRecordAmount === 0).length > 0; // 存在没标记代收的数据
      const isHasOtherPayFeeDiff = selectionList.filter((a: any) => a.collectionAmount !== 0 && a.collectionRecordAmount !== 0 && a.collectionDiffAmount !== 0).length > 0; // 存在代收差异数据
      if (_len >= 1) {
        // if (hasApproval) this.$message.warning('已结转数据不可结转，请重新选择!');
        if (isHasOtherPayRecord) this.$message.warning('请先标记代收，再进行结转！');
        else if (isHasOtherPayFeeDiff) this.$message.warning('代收差异金额不为0，不可结转！');
        else this._carryForwardFun(selectionList, id);
      } else {
        this.$message.warning('请先勾选数据!');
      }
    }
    if (id === 4) {
      // 导出
      if (_len >= 1) {
        this.downTableData.list = deepClone(selectionList);
        this.downTableData.labels = deepClone(labels);
      } else {
        this._exportData();
      }
    }
    if (id === 5) {
      this._exportSxSumData();
    }
    if (id === 6) {
      this._exportZsSumData();
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

  // 列表选中每一列切换回调
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  /** 导出 */
  private async _exportData() {
    const { searchForm } = this;
    const _data = drawSearchForm(searchForm);
    // 处理数据
    const sendData = { ..._data, isExport: 1 };
    const body = await this.queryColectionExport(sendData);
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel'
    });
    FileSaver.saveAs(blob, `${name}${this.$dayjs(new Date()).format('YYYYMMDD')}`);
  }

  /** 导出散学收款汇总明细 */
  private async _exportSxSumData() {
    const { searchForm } = this;
    const _data = drawSearchForm(searchForm);
    const sendData: any = { ..._data, isExport: 1 };
    delete sendData.isDiff;
    const body = await this.querySanXueDetailExport(sendData);
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel'
    });
    FileSaver.saveAs(blob, `散学收款金额明细汇总${this.$dayjs(new Date()).format('YYYYMMDD')}`);
  }

  /** 导出招生收款汇总明细 */
  private async _exportZsSumData() {
    const { searchForm } = this;
    const _data = drawSearchForm(searchForm);
    const sendData: any = { ..._data, isExport: 1 };
    delete sendData.isDiff;
    const body = await this.queryColectionDetailExport(sendData);
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel'
    });
    FileSaver.saveAs(blob, `招生收款金额明细汇总${this.$dayjs(new Date()).format('YYYYMMDD')}`);
  }

  private dialogName = '';

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

  private dialogForm = {
    dialogVisible: false,
    carryOverDate: this.$dayjs(new Date()).format('YYYY-MM-DD'),
    selectionList: [],
    id: 0,
  }

  private dialogFormRule = {
    carryOverDate: [
      { required: true, message: '必选项', trigger: ['blur'] }
    ]
  }

  resetDialogForm() {
    this.dialogForm = {
      dialogVisible: false,
      carryOverDate: this.$dayjs(new Date()).format('YYYY-MM-DD'),
      selectionList: [],
      id: 0,
    };
    (this.$refs.dialogFormRef as VueComponentParent).resetFields();
  }

  private submitDialog() {
    (this.$refs.dialogFormRef as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        const { selectionList, id } = deepClone(this.dialogForm);
        this._carryForwardFun(selectionList, id);
        this.dialogForm.dialogVisible = false;
      } else {
        this.$message.warning('请填写必填项！');
      }
    });
  }

  /** 数据结转 */
  private _carryForwardFun(selectionList: any, type: number) {
    const { beginDate, endDate } = this;
    const terminalReqs: any = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      const data = {
        account: _item.account,
        payType: _item.payType,
      };
      terminalReqs.push(data);
    });
    const sendData: any = {
      beginDate,
      endDate,
      terminalReqs,
      type: type === 3 ? 2 : 1,
    };
    if (type === 1 || type === 2) {
      const { carryOverDate } = this.dialogForm;
      sendData.carryOverDate = this.$dayjs(carryOverDate).format('YYYY-MM-DD');
    }
    const _msg: ParamsType = {
      1: '数据结转',
      2: '强制结转',
      3: '陪驾结转'
    };
    const msg = _msg[type];
    this.$confirm(`确定${msg}？`, '结转', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      this.collectDataCarryOver(sendData).then(() => {
        this.querFirstPageList();
        this.$message.success(`${msg}成功！`);
        this.resetDialogForm();
      });
    }).catch(() => {
      this.$message.info(`已取消${msg}`);
    });
  }

  /** 跳转详情界面 */
  jumpDetail(val: any, type: any) {
    const { beginDate, endDate } = this;
    const _path: any = {
      1: '/finance/transaction_review/collection_review_set/collection_detail',
      2: '/finance/transaction_review/collection_review_set/flow_detail',
      3: '/finance/transaction_review/collection_review_set/sanxue_detail',
      4: '/finance/transaction_review/collection_review_set/all_order_detail',
      5: '/finance/transaction_review/collection_review_set/all_order_detail',
      6: '/finance/transaction_review/collection_review_set/all_order_detail',
    };
    const path = _path[type];
    let tradingStatus = null;
    if (type === 5) tradingStatus = 2;
    if (type === 6) tradingStatus = 1;
    this.$router.push({
      path,
      query: {
        obj: encodeURIComponent(JSON.stringify({
          ...val, beginDate, endDate, tradingStatus
        }))
      }
    });
  }

  /** 跳转散学收款和招生收款汇总详情 */
  addJumpSumPage() {
    const table: any = document.querySelector('.el-table__footer-wrapper>table');
    const sxEvent = () => {
      const { searchForm, beginDate, endDate } = this;
      const _data = drawSearchForm(searchForm);
      const { account, payType } = _data;
      this.$router.push({
        path: '/finance/transaction_review/collection_review_set/sanxue_detail',
        query: {
          obj: encodeURIComponent(JSON.stringify({
            beginDate, endDate, account, payType, type: 1
          }))
        }
      });
    };
    table.rows[0].cells[4].addEventListener('click', sxEvent);
    // 卸载监听
    this.$on('hook:beforeDestroy', () => {
      if (!table.rows[0].cells[4]) return;
      table.rows[0].cells[4].removeEventListener('click', sxEvent);
    });
    // 招生收款汇总
    const collecEvent = () => {
      const { searchForm, beginDate, endDate } = this;
      const _data = drawSearchForm(searchForm);
      const { account, payType } = _data;
      this.$router.push({
        path: '/finance/transaction_review/collection_review_set/collection_detail',
        query: {
          obj: encodeURIComponent(JSON.stringify({
            beginDate, endDate, account, payType, type: 1
          }))
        }
      });
    };
    table.rows[0].cells[5].addEventListener('click', collecEvent);
    // 卸载监听
    this.$on('hook:beforeDestroy', () => {
      if (!table.rows[0].cells[5]) return;
      table.rows[0].cells[5].removeEventListener('click', collecEvent);
    });

    if (this.isGuangRenSchool()) {
      // 实际应收金额汇总
      const realCollectEvent = () => {
        const { searchForm, beginDate, endDate } = this;
        const _data = drawSearchForm(searchForm);
        const { account, payType } = _data;
        this.$router.push({
          path: '/finance/transaction_review/collection_review_set/all_order_detail',
          query: {
            obj: encodeURIComponent(JSON.stringify({
              payType,
              account,
              beginDate,
              endDate,
              type: 1
            }))
          }
        });
      };
      table.rows[0].cells[6].addEventListener('click', realCollectEvent);
      // 卸载监听
      this.$on('hook:beforeDestroy', () => {
        if (!table.rows[0].cells[6]) return;
        table.rows[0].cells[6].removeEventListener('click', realCollectEvent);
      });

      // 招生结转金额汇总 //todo
      const collectJiezhuanEvent = () => {
        const { searchForm, beginDate, endDate } = this;
        const _data = drawSearchForm(searchForm);
        const { payType, account } = _data;
        this.$router.push({
          path: '/finance/transaction_review/collection_review_set/all_order_detail',
          query: {
            obj: encodeURIComponent(JSON.stringify({
              payType, account, beginDate, endDate, type: 1, tradingStatus: 2
            }))
          }
        });
      };
      table.rows[0].cells[9].addEventListener('click', collectJiezhuanEvent);
      // 卸载监听
      this.$on('hook:beforeDestroy', () => {
        if (!table.rows[0].cells[9]) return;
        table.rows[0].cells[9].removeEventListener('click', collectJiezhuanEvent);
      });

      // 未结转金额汇总 //todo
      const noJiezhuanEvent = () => {
        const { searchForm, beginDate, endDate } = this;
        const _data = drawSearchForm(searchForm);
        const { payType, account } = _data;
        this.$router.push({
          path: '/finance/transaction_review/collection_review_set/all_order_detail',
          query: {
            obj: encodeURIComponent(JSON.stringify({
              payType, account, beginDate, endDate, type: 1, tradingStatus: 1
            }))
          }
        });
      };
      table.rows[0].cells[10].addEventListener('click', noJiezhuanEvent);
      // 卸载监听
      this.$on('hook:beforeDestroy', () => {
        if (!table.rows[0].cells[10]) return;
        table.rows[0].cells[10].removeEventListener('click', noJiezhuanEvent);
      });
    }
  }

  private staticData: any = {
    recruitAmountTotal: 0,
    recruitRecordAmountTotal: 0,
    orderAmountTotal: 0,
    recruitDiffAmountTotal: 0,
    recruitSettleAmountTotal: 0,
    collectionAmountTotal: 0,
    recruitUnSettleAmountTotal: 0,
    collectionRecordAmountTotal: 0,
    collectionDiffAmountTotal: 0,
    collectionSettleAmountTotal: 0,
  };

  async queryStaticData() {
    const { searchForm } = this;
    const _data = drawSearchForm(searchForm);
    const sendData = { ..._data };
    try {
      const body = await this.queryCollectCount(sendData);
      this.staticData = body || {};
      const { collectionAmountTotal, recruitAmountTotal } = this.staticData;
      this.totalAmount = jsAddFunc(collectionAmountTotal, recruitAmountTotal) || 0;
    } catch (error) {
      //
    }
  }

  querFirstPageList() {
    this.paginationData.current = 1; // 查询时设置成第一页
    this.queryList();
  }

  async queryList() {
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const { beginDate, endDate } = _data;
    // 判断时间
    if (beginDate && endDate && timestampSizeCompare(beginDate, endDate)) {
      this.$message.warning('开始时间不能大于结束时间');
      return;
    }
    const sendData = { ..._data };
    this.beginDate = sendData.beginDate;
    this.endDate = sendData.endDate;
    try {
      const body = await this.queryColectionList(sendData);
      const { data = [], current, total } = body;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
      this.queryStaticData();
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = true;
    }
  }

  perm = {};

  isGuangRenSchool() {
    const { drivingSchoolId } = this.userInfo;
    return drivingSchool(drivingSchoolId) === 'guangren';
  }

  async mounted() {
    this.tableData._this = this;
    // 以下接口依赖于驾校id
    const { drivingSchoolId } = this.userInfo;
    this.initSearch();
    this.queryList();
    this.tableLabelType = drivingSchool(drivingSchoolId) === 'guangren' ? 'COLLECTION_REVIEW_SET_LIST_LABEL' : 'HUIZHOU_COLLECTION_REVIEW_SET_LIST_LABEL';
    this.initSetTableLabel();
    const permObj = await this.$getPerm(this, this.tableData.options, this.searchForm.buttonList);
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
    this.perm = permObj.perm;
    this.isGuangRenSchool();
    // 给合计行添加点击事件
    this.addJumpSumPage();
  }
}
