import Component, { mixins } from 'vue-class-component';
import { ParamsType } from '@/type';
import {
  SearchTable, CtjtPagination, CtjtTable
} from '@/components';
import ctjtPaginationMixins from '@/mixins/pagination';

@Component({
  components: {
    SearchTable,
    CtjtPagination,
    CtjtTable
  }
})
export default class educationalTeachMgIndexMgDetail extends mixins(ctjtPaginationMixins) {
  // 列表搜索项
  private searchForm: ParamsType = {
    datePickerList: [
      {
        label: '考核时间',
        keyArr: ['beginDate', 'endDate'],
        formatType: 'YYYY-MM-DD',
        value: '',
        placeholder: '请选择',
        type: 'daterange',
        rangeSeparator: '-',
      },
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
        label: '考核类型',
        key: '',
        value: '',
        width: 200,
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: []
      },
      {
        label: '考核科目',
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
        label: '导入'
      },
      {
        id: 2,
        label: '导出',
      },
      {
        id: 3,
        label: '导入模板下载',
      },
    ],
    labels: [
      {
        key: '',
        label: '考核时间'
      },
      {
        key: '',
        label: '片区'
      },
      {
        key: '',
        label: '考试科目'
      },
      {
        key: '',
        label: '考核类型'
      },
      {
        key: '',
        label: '指标数'
      },
      {
        key: '',
        label: '目标合格率'
      },
      {
        key: '',
        label: '创建人'
      },
      {
        key: '',
        label: '创建时间'
      }
    ],
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
}
