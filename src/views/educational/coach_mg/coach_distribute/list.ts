import Component, { mixins } from 'vue-class-component';
import { Action, State } from 'vuex-class';
import { ParamsType } from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import { timestampSizeCompare, FILTER_EXCEL_TYPE } from '@/assets/js/common';
import { setTableLabels, marginTableLabels, getTemplateDownloadProps } from '@/views/educational/_common/common';
import {
  SearchTable, CtjtTable, CtjtPagination, CtjtSetField, CtjtAutoUpload
} from '@/components';
import download from '@/assets/js/download';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtSetField,
    CtjtAutoUpload
  }
})
export default class EducationalCoachMgCoachDistribute extends mixins(ctjtPaginationMixins, ctjttablefieldMixins) {
  @Action('base/queryGroupMechanismData') private queryGroupMechanismData!: (data: any) => any;

  @Action('assignment/queryAllotCoachesList') private queryAllotCoachesList!: (data: any) => any;

  @Action('assignment/importExcelAllotCoaches') private importExcelAllotCoaches!: (data: any) => any;

  @State(state => state.base.userInfo) userInfo!: ParamsType;

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
    datePickerList: [
      {
        label: '申请日期',
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
      }
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
      if (key === 'reset') {
        this.initTime();
      }
      this.paginationData.current = 1;
      this.queryList();
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
        id: 2,
        label: '下载导入模板',
        path: 'btn_export'
      },
      {
        id: 1,
        label: '新增分配教练',
        path: 'btn_xzfpjl'
      }
    ],
    labels: [],
    list: [],
    selectionList: []
  }

  // 导入API路径
  private uploadPath = '/assignment/v1/allotCoaches/importExcel';

  // 导入文件上传配置
  private uploadConfig = {
    multiple: false,
    accept: '',
    limit: 1,
    disabled: false,
    tips: '',
    business: '',
    fileAccept: FILTER_EXCEL_TYPE // 限制上传文件格式
  };

  // 数据上传回调
  uploadCallback(val: any) {
    const { body = [] } = val;
    const len = body.length;
    if (len > 0) {
      this.dialogVisible = true;
      this.errorList = body;
    } else {
      this.$message.success('导入成功');
    }
    this.queryList();
  }

  private dialogVisible = false;

  private errorList = [];

  private tableOptionCallback(val: any) {
    const { id } = val;
    if (id === 1) this.jumpDetail();
    if (id === 2) {
      download(getTemplateDownloadProps('人工分配教练模板'));
    }
  }

  // 列表选中每一列切换回调
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  // 跳转详情
  private jumpDetail(id?: string) {
    this.$router.push({ path: '/educational/coach_mg/coach_distribute/detail', query: { id } });
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
    const _data = drawSearchForm(this.searchForm, this.paginationData);
    const { beginDate, endDate } = _data;
    // 判断时间
    if (beginDate && endDate && timestampSizeCompare(beginDate, endDate)) {
      this.$message.warning('开始时间不能大于结束时间');
      return;
    }
    const sendData = {
      ..._data
    };
    try {
      this.tableData.loading = true;
      const body = await this.queryAllotCoachesList(sendData);
      const {
        current, total, data
      } = body;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
      this.tableData.loading = false;
    } catch (e) {
      this.tableData.loading = false;
    }
  }

  private async queryRegionList(id: string) {
    const data = await this.queryGroupMechanismData({ pid: id });
    this.searchForm.selectList[0].options = data;
  }

  private initTime() {
    // 获取当前时间，
    const nowTime = new Date();
    const _ym = this.$dayjs(nowTime).format('YYYY-MM');
    const _d = this.$dayjs(nowTime).format('DD');
    this.searchForm.datePickerList[0].value = `${_ym}-01`;
    this.searchForm.datePickerList[1].value = `${_ym}-${_d}`;
  }

  private async initSearch() {
    this.initTime();
    this.queryList();

    const { drivingSchoolId } = this.userInfo;
    this.queryRegionList(drivingSchoolId);
  }

  async mounted() {
    this.tableData._this = this;
    this.tableLabelType = 'COACH_MG_COACH_DISTRIBUTE_LABEL';
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
