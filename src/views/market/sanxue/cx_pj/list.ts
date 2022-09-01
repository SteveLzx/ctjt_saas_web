import { Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import FileSaver from 'file-saver';
import {
  SearchTable, CtjtTable, CtjtPagination, CtjtCard
} from '@/components';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjtAreaStoreSeachTableMixins from '@/mixins/areaStoreSeachTable';
import { ParamsType, TableOptionsValue } from '@/type';
import { timestampSizeCompare } from '@/assets/js/common';
import { drawSearchForm } from '@/assets/js/search_table';

const expName = '初学转陪驾';

const yearTime = 365 * 24 * 60 * 60 * 1000;

const newTime = new Date().getTime();

const statusOpts = [
  { id: 1, label: '未审核' },
  { id: 0, label: '审核中' }
];

const graduationStatusOpts = [
  { id: 0, label: '未超1年' },
  { id: 1, label: '已超1年' }
];

const tableLabels = [{
  key: 'seq',
  label: '招生订单号',
  showOverflowTooltip: true,
},
{
  key: 'regionName',
  label: '片区',
  showOverflowTooltip: true,
},
{
  key: 'storeName',
  label: '门店',
  showOverflowTooltip: true,
},
{
  key: 'userName',
  label: '学员姓名',
  showOverflowTooltip: true,
},
{
  key: 'idNo',
  label: '证件号码',
  showOverflowTooltip: true,
},
{
  key: 'mobile',
  label: '联系电话',
  showOverflowTooltip: true,
},
{
  key: 'classesName',
  label: '班别',
  showOverflowTooltip: true,
},
{
  key: 'registerTime',
  label: '报名日期',
  showOverflowTooltip: true,
},
{
  key: 'graduationTime',
  label: '毕业日期',
  showOverflowTooltip: true,
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
}, {
  key: 'activityName',
  label: '优惠活动',
  showOverflowTooltip: true,
}, {
  key: 'auditStatus',
  label: '审核状态',
  render(h: any, params: any) {
    const { auditStatus } = params.row;
    const list = statusOpts.filter((item: any) => item.id === auditStatus);
    return h('el-link', {
      props: {
        type: 'primary',
        underline: false
      },
      on: {
        click: () => {
          params._self.tableData._this.jumpDetail(params.row);
        }
      }
    },
    list[0]?.label || '未审核');
  }
}, {
  key: 'verifyNode',
  label: '审批环节',
}, {
  key: 'verifyUser',
  label: '审核人',
}, {
  key: 'applyName',
  label: '申请人',
}, {
  key: 'applyTime',
  label: '申请时间',
}
];

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtCard
  }
})
export default class MarketSanXueCxToPjMg extends mixins(ctjtPaginationMixins, ctjtAreaStoreSeachTableMixins) {
  @Action('order/getBeginnerList') private getBeginnerList!: (data: any) => any;

  @Action('order/reviewBeginner') private reviewBeginner!: (data: any) => any;

  @Action('order/editRemark') private editRemark!: (data: any) => any;

  @Action('order/exportBeginnerList') private exportBeginnerList!: (data: any) => any;

  // 列表搜索项配置
  private localSearchForm: ParamsType = {
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
              label: '报名日期',
            },
            {
              id: 2,
              label: '毕业日期',
            },
            {
              id: 3,
              label: '申请日期',
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
        width: 100,
        value: '',
        placeholder: '请选择',
        clearable: true,
        options: statusOpts
      },
      {
        label: '毕业时长',
        key: 'graduationStatus',
        width: 100,
        value: '',
        placeholder: '请选择',
        clearable: true,
        options: graduationStatusOpts
      }
    ],
    inputList: [
      {
        label: '关键字',
        key: 'keyword',
        type: 'text',
        value: '',
        width: 350,
        placeholder: '请输入学员姓名、证件号码、联系电话、订单号',
        clearable: true,
      },
    ],
    buttonList: []
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
  }

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
    this.searchSelectChange({ key: 'regionId', value: null });
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
        label: '转陪驾申请',
        type: 'primary',
        path: 'btn_approve',
      },
      {
        id: 2,
        label: '编辑备注',
        type: 'primary',
        path: 'btn_remark',
      },
      {
        id: 3,
        label: '导出',
        path: 'btn_export',
      },
    ],
    labels: tableLabels,
    list: [],
    selectionList: [],
    setCellClassName: (val: any) => {
      const { graduationTime } = val.row;
      const flag = graduationTime ? (newTime - new Date(graduationTime).getTime()) > yearTime : false;
      return flag ? 'td_text_red' : '';
    }
  };

  /** 导出 */
  async _exportData() {
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    // 处理数据
    const sendData = { ..._data, isExport: 1 };
    const body = await this.exportBeginnerList(sendData);
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel'
    });
    FileSaver.saveAs(blob, `${expName}${this.$dayjs(new Date()).format('YYYYMMDD')}`);
  }

  /** 列表操作回调 */
  tableOptionCallback(val: TableOptionsValue) {
    const { selectionList } = this.tableData;
    const _len = selectionList.length;
    const { id } = val;
    // 导出
    if (id === 3) {
    // 导出
      this._exportData();
      return;
    }
    if (_len === 1) {
      if (id === 1) {
        // 转陪驾审核
        this.jumpDetail(selectionList[0]);
      }
      if (id === 2) {
        // 编辑备注
        this.editRemarkFun(selectionList[0]);
      }
    } else {
      this.$message.warning('请先勾选一项，再进行操作！');
    }
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

  // 列表单项点击
  jumpDetail(val: ParamsType) {
    const { graduationTime, auditStatus } = val;

    const flag = graduationTime ? (newTime - new Date(graduationTime).getTime()) < yearTime : false;
    if ((flag && auditStatus === 99) || auditStatus === 0) {
      const keyList = [
        'id', 'seq', 'idNo', 'userName', 'classesName', 'activityName', 'approveId',
        'storeName', 'registerTime', 'graduationTime', 'remark', 'presentPeriod'
      ];
      let obj = {};
      Object.keys(val).forEach(key => {
        if (keyList.includes(key)) {
          obj = { ...obj, [key]: val[key] };
        }
      });
      const params = encodeURIComponent(JSON.stringify(obj));
      const path = val.auditStatus === 0 ? 'edit' : 'add';
      this.$router.push({ path: `/market/sxpj/cx_pj/${path}`, query: { data: params } });
    } else {
      this.$message.warning('只有毕业未超过1年，并且审核状态为未审核的学员数据可进行转陪驾申请，请重新选择！');
    }
  }

  /** 编辑备注 */
  private editRemarkFun(item: any) {
    const defaultRemark = item.remark;
    this.$prompt('备注', '编辑备注', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /[^ \x22]+/,
      inputValue: defaultRemark,
      inputValidator: (val) => {
        if (val === null) {
          return true;
        }
        return !(val.length < 1 || val.length > 200);
      },
      inputErrorMessage: '限200字以内,不能全输入空格',
      inputPlaceholder: '限200字以内',
      inputType: 'textarea'
    }).then((val: any) => {
      const sendData = {
        id: item.id,
        remark: val.value.trim()
      };
      this.editRemark(sendData).then((res: any) => {
        this.$message.success('编辑成功');
        this.querFirstPageList();
      });
    }).catch((error: any) => {
      this.$message.info('已取消编辑');
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
      const body = await this.getBeginnerList(sendData);
      const { data = [], current, total } = body;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = true;
    }
  }

  perm = {};

  async mounted() {
    this.tableData._this = this;
    const { drivingSchoolId } = this.userInfo;
    this.queryRegionList(drivingSchoolId);
    this.initSearch();
    const permObj = await this.$getPerm(
      this,
      this.tableData.options,
      this.searchForm.buttonList
    );
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
    this.perm = permObj.perm;
  }

  activated() {
    this.queryList();
  }
}
