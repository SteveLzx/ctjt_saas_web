import { Action } from 'vuex-class';
import { Watch } from 'vue-property-decorator';
import Component, { mixins } from 'vue-class-component';
import FileSaver from 'file-saver';
import { ParamsType, TableOptionsValue, StaticDataType } from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import { timestampSizeCompare, formatPrice } from '@/assets/js/common';
import { FEE_TAB, IN_LIBRARY_STATUS, REVIEW_STATUS } from '@/enums';
import { setTableLabels, marginTableLabels } from '@/views/finance/_common/common';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';
import financePayReviewSeachTableMixins from '../_mixins/seachTable';

const tableOptionList = [
  {
    id: 1,
    label: '复核通过',
    type: 'success',
    path: 'btn_shtg'
  },
  {
    id: 2,
    label: '反审',
    type: 'warning',
    path: 'btn_fs'
  },
  {
    id: 3,
    label: '导出',
    path: 'btn_export'
  },
];
const selfTableOptionList = [
  {
    id: 3,
    label: '导出',
    path: 'btn_export'
  },
];
const name = '考试费复核';
@Component
export default class FinancepayReviewSetExamFeeReview extends mixins(ctjtPaginationMixins, ctjttablefieldMixins, financePayReviewSeachTableMixins) {
  @Action('license/queryReviewList') private queryReviewList!: (data: any) => any;

  @Action('license/queryReviewCount') private queryReviewCount!: (data: any) => any;

  @Action('license/queryModifyReview') private queryModifyReview!: (data: any) => any;

  @Action('license/queryExportReview') private queryExportReview!: (data: any) => any;

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
      this.querFirstPageList();
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
    const isHistory = selectionList.filter((a: any) => a.studentStatus === IN_LIBRARY_STATUS[2].id).length > 0; // 存在历史学员
    if (id === 1) {
      // 复核通过
      if (_len >= 1) {
        const hasApproval = selectionList.filter((a: any) => a.reviewStatus === REVIEW_STATUS[1].id).length > 0; // 存在已复核数据
        if (this.activeTab === 1) {
          if (hasApproval) {
            this.$message.warning('已复核数据不可复核，请重新选择!');
          } else if (isHistory) {
            this.$message.warning('历史学员不可复核，请重新选择!');
          } else {
            this._reviewFun(selectionList);
          }
        } else this.$message.warning('仅代交需要复核!');
      } else {
        this.$message.warning('请先勾选数据!');
      }
    }
    if (id === 2) {
      // 反审
      const hasNoApproval = selectionList.filter((a: any) => a.reviewStatus === REVIEW_STATUS[0].id).length > 0; // 存在未复核数据
      if (_len >= 1) {
        if (hasNoApproval) this.$message.warning('待复核数据不可反审，请重新选择!');
        else if (isHistory) this.$message.warning('历史学员不可反审，请重新选择!');
        else this._returnFun(selectionList);
      } else {
        this.$message.warning('请先勾选数据!');
      }
    }
    if (id === 3) {
      // 导出
      this._exportData(selectionList);
    }
  }

  /** 导出 */
  private async _exportData(selectionList: any) {
    const { searchForm, activeTab } = this;
    const _data = drawSearchForm(searchForm);
    const { batchNos } = _data;
    const batchNoArr = batchNos ? batchNos.split(';') : null;
    const ids: any = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      ids.push(_item.id);
    });
    // 处理数据
    const _studentStatus = searchForm.cascaderList[0].value;
    const studentStatus = _studentStatus && _studentStatus.length ? _studentStatus : null;
    const sendData = {
      ..._data,
      batchNos: batchNoArr,
      feeSubject: '考试费',
      payType: activeTab,
      ids,
      studentStatus
    };
    const body = await this.queryExportReview(sendData);
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel'
    });
    FileSaver.saveAs(blob, `${name}${this.$dayjs(new Date()).format('YYYYMMDD')}`);
  }

  // 数据统计
  private statisticsData: StaticDataType[] = [
    {
      label: '待复核人数',
      value: 0,
    },
    {
      label: '待复核考试费',
      value: 0,
    },
  ];

  /** 计算表格底部统计数据 */
  async queryStaticData(sendData: any) {
    try {
      const body = await this.queryReviewCount(sendData);
      const { total, feeTotal } = body;
      this.statisticsData[0].value = total || 0;
      this.statisticsData[1].value = formatPrice(feeTotal || 0);
    } catch (error) {
      //
    }
  }

  // tab list
  private tabList = FEE_TAB;

  // 当前tab
  private activeTab = 1;

  /** tab 选中回调 */
  @Watch('activeTab', { immediate: false })
  async checkTab(val: number) {
    if (val === 2) {
      this.tableData.options = selfTableOptionList;
    } else {
      this.tableData.options = tableOptionList;
    }
    const permObj = await this.$getPerm(this, this.tableData.options, this.searchForm.buttonList);
    this.tableData.options = permObj.tablePerm;
    this.querFirstPageList();
    const _typeDta: ParamsType = {
      1: 'EXAM_FEE_REVIEW_OTHER_LIST_LABEL',
      2: 'EXAM_FEE_REVIEW_SELF_LIST_LABEL',
    };
    this.tableLabelType = _typeDta[val];
    this.initSetTableLabel();
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

  /** 字段设置保存回调 */
  submitField(val: any) {
    this.dialogName = '';
    this.currentLabelKeyList = val;
    this.initSetTableLabel();
  }

  /** @description 复核通过 */
  private _reviewFun(selectionList: any) {
    const ids: any = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      ids.push(_item.id);
    });
    const sendData = { ids, type: 1 };
    this.$confirm('确定复核通过？', '复核', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      this.queryModifyReview(sendData).then(() => {
        this.queryList();
        this.$message.success('复核通过成功');
      });
    }).catch(() => {
      this.$message.info('已取消复核通过');
    });
  }

  /** 反审 */
  private _returnFun(selectionList: any) {
    const ids: any = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      ids.push(_item.id);
    });
    const sendData = { ids, type: 0 };
    this.$confirm('反审后，费用的复核状为【待复核】，确定反审？', '反审', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      this.queryModifyReview(sendData).then(() => {
        this.queryList();
        this.$message.success('反审成功');
      });
    }).catch(() => {
      this.$message.info('已取消反审');
    });
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

  querFirstPageList() {
    this.paginationData.current = 1; // 查询时设置成第一页
    this.queryList();
  }

  async queryList() {
    const {
      searchForm, paginationData, activeTab,
    } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const { batchNos, beginDate, endDate } = _data;
    const batchNoArr = batchNos ? batchNos.split(';') : null;
    // 判断时间
    if (beginDate && endDate && timestampSizeCompare(beginDate, endDate)) {
      this.$message.warning('开始时间不能大于结束时间');
      return;
    }
    const _studentStatus = searchForm.cascaderList[0].value;
    const studentStatus = _studentStatus && _studentStatus.length ? _studentStatus : null;
    const sendData = {
      ..._data,
      batchNos: batchNoArr,
      feeSubject: '考试费',
      payType: activeTab,
      studentStatus
    };
    try {
      const body = await this.queryReviewList(sendData);
      const { data = [], current, total } = body;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
      this.queryStaticData(sendData);
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = true;
    }
  }

  async mounted() {
    this.tableData._this = this;
    // 以下接口依赖于驾校id
    const { drivingSchoolId } = this.userInfo;
    this.queryRegionList(drivingSchoolId);
    this.queryList();
    this.tableLabelType = 'EXAM_FEE_REVIEW_OTHER_LIST_LABEL';
    this.initSetTableLabel();
  }

  perm = {};

  async created() {
    const permObj = await this.$getPerm(this, this.tableData.options, this.searchForm.buttonList);
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
    this.perm = permObj.perm;
  }
}
