import { Action, State } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import { ParamsType } from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import { timestampSizeCompare } from '@/assets/js/common';
import { setTableLabels, marginTableLabels } from '@/views/educational/_common/common';
import { approveStatusOpts } from '@/views/educational/_enums';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';
import {
  SearchTable, CtjtTable, CtjtPagination, CtjtSetField
} from '@/components';

@Component({
  components: {
    SearchTable, CtjtTable, CtjtPagination, CtjtSetField
  }
})
export default class EducationalCoachMgCoachModify extends mixins(ctjtPaginationMixins, ctjttablefieldMixins) {
  @State(state => state.base.userInfo) private userInfo: any;

  @Action('base/queryGroupMechanismData') private queryGroupMechanismData!: (data: any) => any;

  @Action('assignment/queryCoachChangeList') private queryCoachChangeList!: (data: any) => ParamsType;

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
        label: '教练姓名',
        key: 'userName',
        type: 'text',
        value: '',
        width: 160,
        placeholder: '请输入教练姓名',
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
        width: 140,
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
        label: '审核状态',
        key: 'status',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 140,
        options: approveStatusOpts
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
    ]
  }

  // 列表搜索 操作按钮回调
  private searchTableCallBack(key: string) {
    if (key === 'search' || key === 'reset') {
      this.paginationData.current = 1;
      this.queryList();
    }
  }

  // 列表配置
  private tableData: ParamsType = {
    _this: {},
    loading: false,
    index: true,
    labels: [],
    list: [],
    selectionList: []
  }

  private tableOptionCallback(val: any) {
    const { id } = val;
    this.jumpDetail();
  }

  // 列表选中每一列切换回调
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  // 跳转详情
  private jumpDetail(id?: string) {
    this.$router.push({ path: '/educational/coach_mg/coach_modify/detail', query: { id } });
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
      ..._data,
      flowType: 2
    };
    const body = await this.queryCoachChangeList(sendData);
    const {
      data, current, total
    } = body;
    this.tableData.list = data;
    this.paginationData.current = current;
    this.paginationData.total = total;
  }

  private async initSearch() {
    // 新增的时候根据当前用户，获取驾校

    const { drivingSchoolId } = this.userInfo;
    const data = await this.queryGroupMechanismData({ pid: drivingSchoolId });
    this.searchForm.selectList[0].options = data;
  }

  async mounted() {
    this.tableData._this = this;
    this.tableLabelType = 'COACH_MG_COACH_MODIFY_LABEL';
    this.queryList();
    this.initSetTableLabel();
    this.initSearch();
  }

  perm = {};

  async created() {
    const permObj = await (this as any).$getPerm(this, this.tableData.options, this.searchForm.buttonList);
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
    this.perm = permObj.perm;
  }
}
