import Component, { mixins } from 'vue-class-component';
import {
  SearchTable, CtjtTable, CtjtPagination, CtjtCard, CtjtSetField
} from '@/components';
import { ParamsType } from '@/type';
import { setTableLabels, marginTableLabels } from '@/views/educational/_common/common';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtCard,
    CtjtSetField
  }
})
export default class EducationalTeachMgStudentLearnStopApply extends mixins(ctjtPaginationMixins, ctjttablefieldMixins) {
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

  // 列表搜索项
  private searchForm: ParamsType = {
    datePickerList: [
      {
        label: '申请时间',
        keyArr: ['beginDate', 'endDate'],
        formatType: 'YYYY-MM-DD',
        value: '',
        placeholder: '请选择',
        type: 'daterange',
        rangeSeparator: '-',
      },
    ],
    inputList: [
      {
        label: '关键词',
        key: '',
        type: 'text',
        value: '',
        width: 300,
        clearable: true,
        placeholder: '请输入证件号码、学员姓名、手机号码',
      }
    ],
    selectList: [
      {
        label: '片区',
        key: 'regionId',
        value: '',
        width: 200,
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: []
      },
      {
        label: '门店',
        key: '',
        value: '',
        width: 200,
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: []
      },
      {
        label: '审核状态',
        key: '',
        value: '',
        width: 200,
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: []
      }
    ],
    buttonList: [
      {
        label: '查询',
        key: 'search',
        type: 'primary',
        plain: false
      },
      {
        label: '重置',
        key: 'reset',
        plain: false
      },
    ]
  }

  /**
   * @description 列表搜索项下拉回调函数
   */
  private searchSelectChange(val: ParamsType) {
    const { value, key } = val;
    if (key === 'drivingSchoolId') {
      this.searchForm.selectList[1].options = [];
      if (value) {
        //
      }
    }
  }

  // 分页列表配置
  private tableData: ParamsType = {
    _this: {},
    loading: false,
    selection: true,
    index: true,
    options: [
      {
        id: 1,
        label: '新增暂停学车申请'
      },
      {
        id: 2,
        label: '审核通过',
        type: 'success'
      },
      {
        id: 3,
        label: '审核不通过',
        type: 'danger'
      },
      {
        id: 4,
        label: '撤回',
        type: 'warning'
      }
    ],
    labels: [],
    list: [],
    selectionList: []
  }

  /**
   * @description 分页组件每页请求数量切换
   */
  private tableSizeChange(val: number) {
    this.paginationData.pageSize = val;
    this.paginationData.current = 1;
    this.queryList();
  }

  /**
   * @description 分页组件页数切换
   */
  private tableCurrentChange(val: number) {
    this.paginationData.current = val;
    this.queryList();
  }

  async queryList() {
    this.tableData.loading = false;
  }

  // 抽屉-
  private drawerDetail = true;

  private formData: ParamsType = {

  }

  private detailTableData: ParamsType = {
    _this: {},
    loading: false,
    labels: [
      {
        key: '',
        label: '审批环节'
      },
      {
        key: '',
        label: '审核人'
      },
      {
        key: '',
        label: '审核操作'
      },
      {
        key: '',
        label: '审核意见'
      },
      {
        key: '',
        label: '审核时间'
      },
    ],
    list: [],
  }

  // 生命周期
  async mounted() {
    this.tableData._this = this;
    this.tableLabelType = 'TEACH_MG_STUDENT_LEARN_APPLY_STOP_LABEL';
    this.initSetTableLabel();
    // 先默认请求驾校
    await this.queryList();
  }
}
