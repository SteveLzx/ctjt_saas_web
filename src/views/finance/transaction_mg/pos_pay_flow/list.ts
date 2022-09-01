import Component, { mixins } from 'vue-class-component';
import { Action } from 'vuex-class';
import FileSaver from 'file-saver';
import dayjs from 'dayjs';
import { Watch } from 'vue-property-decorator';
import { ParamsType, TableOptionsValue } from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import {
  formatPrice, timestampSizeCompare, FILTER_EXCEL_TYPE, isCustomNumber, jsAddFunc, matchNumberList, drivingSchool
} from '@/assets/js/common';
import { TRANSACTION_TYPE, POS_DATA_TYPE, GUANGREN_POS_DATA_TYPE } from '@/enums';
import {
  API_FINANCE_V1_POSRECORD_EXPORTPOSRECORDEXCEL,
  API_FINANCE_V1_POSRECORD_IMPORTPOSRECORDEXCEL,
  API_FINANCE_V1_POSRECORD_IMPORTPOSRECORDEXCEL_GUANGREN,
} from '@/api';
import download from '@/assets/js/download';
import { setTableLabels, marginTableLabels, getTemplateDownloadProps } from '@/views/finance/_common/common';
import financeOperationLogMixins from '@/views/finance/_mixins/operationLog';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';
import ctjtAreaStoreSeachTableMixins from '@/mixins/areaStoreSeachTable';

const name = 'pos刷卡流水';
const tableOptionList = [
  {
    id: 1,
    label: '导入数据',
    type: 'success',
    path: 'btn_drsj'
  },
  {
    id: 2,
    label: '删除',
    type: 'danger',
    path: 'btn_del'
  },
  {
    id: 3,
    label: '下载导入模板',
    type: 'primary',
    path: 'btn_xzdrmb'
  },
  {
    id: 4,
    label: '导出',
    path: 'btn_export'
  },
];

@Component
export default class FinancePosPayFlow extends mixins(ctjtPaginationMixins, ctjttablefieldMixins, ctjtAreaStoreSeachTableMixins, financeOperationLogMixins) {
  @Action('finance/queryAllPosCompanyList') private queryAllPosCompanyList!: (data: any) => ParamsType;

  @Action('finance/queryPosPayFlowList') private queryPosPayFlowList!: (data: any) => ParamsType;

  @Action('finance/posRecordDelete') private posRecordDelete!: (data: any) => ParamsType;

  private beginDate = new Date();

  private endDate = new Date();

  // 列表搜索项配置
  private localSearchForm: ParamsType = {
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
        label: 'pos公司',
        key: 'posCompany',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 130,
        options: [],
      },
      {
        label: '交易状态',
        key: 'status',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 130,
        options: TRANSACTION_TYPE,
      },
    ],
    inputList: [
      {
        label: 'pos机终端号',
        key: 'posTerminalNo',
        type: 'text',
        value: '',
        width: 200,
        placeholder: '',
        clearable: true,
      },
    ],
    buttonList: [
      {
        label: '操作日志',
        key: 'log',
        type: '',
        plain: false,
        path: 'btn_log'
      },
    ]
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

  /** 获取pos公司 */
  private async queryposCompanyList() {
    const sendData = {};
    const body = await this.queryAllPosCompanyList(sendData);
    const { selectList } = this.searchForm;
    if (Array.isArray(selectList)) {
      selectList.forEach((item: any) => {
        const _item = item;
        if (_item.key === 'posCompany') {
          _item.options = body;
        }
      });
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
    if (key === 'log') {
      this.queryOperationLogPage(name);
      this.logshow = true;
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
    showSummary: true,
    summariesMethod: (param: any) => {
      const mainList = [6, 7, 8];
      const { columns, data } = param;
      const sums: any = [];
      columns.forEach((column: any, index: number) => {
        if (index === 1) {
          sums[index] = '总计';
          return;
        }
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
                return jsAddFunc(prev, curr);
              }
              return prev;
            }, 0);
            sums[index] = formatPrice(sums[index]);
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
    const { selectionList } = this.tableData;
    const idList: Array<number> = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      idList.push(_item.id);
    });
    const _len = selectionList.length;
    const hasApproval = selectionList.filter((a: any) => a.status === TRANSACTION_TYPE[1].id).length > 0; // 存在已结转数据
    if (id === 1) {
      // 导入数据
      const { drivingSchoolId } = this.userInfo;
      // todo 后面每个驾校可能都需要各自处理自己的模板，要换判断条件
      this.posDataTypeList = drivingSchool(drivingSchoolId) === 'huizhou' ? POS_DATA_TYPE : GUANGREN_POS_DATA_TYPE; // 广仁用自己的模板
      this.posDataType = this.posDataTypeList[0].id;
      this.dialogName = 'import';
    }
    if (id === 2) {
      // 删除
      // 数据是否已结转,提示"已结转数据不可删除，请重新选择"
      if (_len >= 1) {
        if (hasApproval) this.$message.warning('已结转数据不可删除，请重新选择!');
        else this._deleteFun(selectionList);
      } else {
        this.$message.warning('请先勾选数据!');
      }
    }
    if (id === 3) {
      // 数据模板下载
      download(getTemplateDownloadProps(name));
    }
    if (id === 4) {
      // 导出
      this._exportData(selectionList);
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

  /** 字段设置保存回调 */
  submitField(val: any) {
    this.dialogName = '';
    this.currentLabelKeyList = val;
    this.initSetTableLabel();
  }

  /** 导出 */
  private async _exportData(selectionList: any) {
    const {
      searchForm, paginationData,
    } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const idList: any = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      idList.push(_item.id);
    });
    // 处理数据
    const sendData = { ..._data, idList };
    const body = await this.$http.post(API_FINANCE_V1_POSRECORD_EXPORTPOSRECORDEXCEL, sendData, {
      hasUseCode: true, responseType: 'arraybuffer'
    });
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel'
    });
    FileSaver.saveAs(blob, `${name}${dayjs(new Date()).format('YYYYMMDD')}`);
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

  /** @description 删除 */
  private _deleteFun(selectionList: any) {
    const idList: any = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      idList.push(_item.id);
    });
    const sendData = { idList };
    this.$confirm('确定删除？', '删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      this.posRecordDelete(sendData).then(() => {
        this.querFirstPageList();
        this.$message.success('删除成功');
      });
    }).catch(() => {
      this.$message.info('已取消删除');
    });
  }

  // pos数据类型list
  private posDataTypeList = POS_DATA_TYPE;

  // 选择的pos数据类型
  private posDataType = 0;

  // 导入发票API路径
  private uploadPath = '';

  /** 关闭pos数据类型选择弹出框 */
  cancelDialog() {
    this.posDataType = 0;
    this.dialogName = '';
  }

  @Watch('posDataType', { deep: true, immediate: true })
  private posDataTypeChange(val: number) {
    const guangrenPath = `${API_FINANCE_V1_POSRECORD_IMPORTPOSRECORDEXCEL_GUANGREN}?type=${val}`;
    const huizhouPath = `${API_FINANCE_V1_POSRECORD_IMPORTPOSRECORDEXCEL}?type=${val}`;
    const { drivingSchoolId } = this.userInfo;
    this.uploadPath = drivingSchool(drivingSchoolId) === 'huizhou' ? huizhouPath : guangrenPath;
  }

  // 导入发票文件上传配置
  private uploadConfig = {
    multiple: false,
    accept: '',
    limit: 1,
    disabled: false,
    tips: '',
    business: '',
    fileAccept: FILTER_EXCEL_TYPE, // 限制上传文件格式
  };

  // 返回的导入结果
  resultData: any = {};

  /** 数据上传回调 */
  uploadCallback(val: any) {
    this.cancelDialog();
    this.dialogName = 'importResult';
    const { description = '', failLogDtoList } = val.body;
    const _totalMoneyText: any = description ? description.substring(description.lastIndexOf(',') + 1) : '';
    const list: any = matchNumberList(description);
    this.resultData = {
      ...val,
      importSuccess: (list && list[0]) || 0,
      importSuccessTotalMoney: _totalMoneyText || '',
      imporError: (failLogDtoList && failLogDtoList.length) || 0,
      failLogDtoList
    };
    this.querFirstPageList();
  }

  /** 跳转详情界面 */
  jumpDetail(val: any) {
    const { beginDate, endDate } = this;
    this.$router.push({
      path: '/finance/transaction_mg/pos_pay_flow/detail',
      query: { obj: encodeURIComponent(JSON.stringify({ ...val, beginDate, endDate })) }
    });
  }

  querFirstPageList() {
    this.paginationData.current = 1; // 查询时设置成第一页
    this.queryList();
  }

  async queryList() {
    const {
      searchForm, paginationData,
    } = this;
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
      const body = await this.queryPosPayFlowList(sendData);
      const { data, current, total } = body;
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
    // 以下接口依赖于驾校id
    const { drivingSchoolId } = this.userInfo;
    this.queryRegionList(drivingSchoolId);
    this.initSearch();
    this.queryList();
    this.queryposCompanyList();
    this.tableLabelType = 'POS_PAY_FLOW_LIST_LABEL';
    this.initSetTableLabel();
    const permObj = await this.$getPerm(this, this.tableData.options, this.searchForm.buttonList);
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
    this.perm = permObj.perm;
  }
}
