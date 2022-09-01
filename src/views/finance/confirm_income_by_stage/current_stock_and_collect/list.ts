import Component, { mixins } from 'vue-class-component';
import { Action, State } from 'vuex-class';
import dayjs from 'dayjs';
import FileSaver from 'file-saver';
import { ParamsType, TableOptionsValue } from '@/type';
import { TRAINING_STAGE } from '@/enums';
import { getCurrentMonthDate, timestampSizeCompare } from '@/assets/js/common';
import { drawSearchForm } from '@/assets/js/search_table';
import { API_FINANCE_V1_REPERTORY_QUERY } from '@/api';
import ctjtPaginationMixins from '@/mixins/pagination';

const name = '本期库存及预收';
@Component
export default class FinanceCurrentStockAndCollect extends mixins(ctjtPaginationMixins) {
  @State(state => state.base.userInfo) userInfo: any;

  @Action('base/queryGroupMechanismData') public queryGroupMechanismData!: (data: any) => any;

  @Action('finance/queryCurrentStockCollectList') private queryCurrentStockCollectList!: (data: any) => ParamsType;

  private beginDate = getCurrentMonthDate(1);

  private endDate = getCurrentMonthDate(0);

  // 列表搜索项配置
  private searchForm: ParamsType = {
    datePickerList: [
      {
        label: '报名日期',
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
    inputList: [],
    selectList: [
      {
        label: '片区',
        key: 'regionId',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 150,
        options: [],
      },
      {
        label: '阶段',
        key: 'step',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 150,
        options: TRAINING_STAGE,
      }
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
      }
    ]
  }

  /**
    * @description 列表搜索 操作按钮回调
  */
  searchTableCallBack(key: string) {
    if (key === 'search') {
      this.queryList();
    }
    if (key === 'reset') {
      const { datePickerList } = this.searchForm;
      datePickerList[0].value = this.beginDate;
      datePickerList[1].value = this.endDate;
      this.queryList();
    }
  }

  /** 获取片区 */
  async queryRegion(val: any) {
    const data = await this.queryGroupMechanismData({ pid: val });
    this.setFormSelectFunc(data);
  }

  /** 为片区下拉框绑定options */
  setFormSelectFunc(data: any) {
    if (data && data.length > 0) {
      const _data = JSON.parse(JSON.stringify(data));
      _data.forEach((item: any) => {
        const _item = item;
        _item.label = _item.name;
      });
      this.searchForm.selectList[0].options = _data;
    }
  }

  private tableData: ParamsType = {
    _this: {},
    loading: false,
    selection: false,
    index: true,
    options: [
      {
        id: 1,
        label: '导出',
        path: 'btn_export'
      },
    ],
    labels: [
      {
        key: 'studyStage',
        label: '阶段',
      },
      {
        key: 'regionName',
        label: '片区',
      },

      {
        key: 'repertoryNum',
        label: '库存人数',
      },
      {
        key: 'trainingExpenseTotal',
        label: '培训费',
        isPrice: true
      },
      {
        key: 'trainingExpense',
        label: '培训费(不含服务费)',
        minWidth: 140,
        isPrice: true
      },
      {
        key: 'admissionsIncome',
        label: '招生收入',
        isPrice: true
      },
      {
        key: 'subjectOneIncome',
        label: '科目一毕业收入',
        minWidth: 120,
        isPrice: true
      },
      {
        key: 'subjectTowIncome',
        label: '科目二毕业收入',
        minWidth: 120,
        isPrice: true
      },
      {
        key: 'subjectThreeIncome',
        label: '科目三毕业收入',
        minWidth: 120,
        isPrice: true
      },
      {
        key: 'waitCarryOver',
        label: '未结转培训费',
        minWidth: 110,
        isPrice: true
      },
    ],
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
    if (id === 1) {
      // 导出
      this._exportData();
    }
  }

  /** 导出所有数据 */
  private async _exportData() {
    const { searchForm } = this;
    const _data = drawSearchForm(searchForm);
    const sendData = { isExport: 1, ..._data };
    const body = await this.$http.post(API_FINANCE_V1_REPERTORY_QUERY, sendData, {
      hasUseCode: true, responseType: 'arraybuffer'
    });
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel'
    });
    FileSaver.saveAs(blob, `${name}${dayjs(new Date()).format('YYYYMMDD')}`);
  }

  async queryList() {
    const { searchForm } = this;
    const sendData = drawSearchForm(searchForm);
    const { beginDate, endDate } = sendData;
    // 判断时间
    if (beginDate && endDate && timestampSizeCompare(beginDate, endDate)) {
      this.$message.warning('开始时间不能大于结束时间');
      return;
    }
    try {
      const body = await this.queryCurrentStockCollectList(sendData);
      const { data } = body;
      this.tableData.list = data;
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = true;
    }
  }

  async mounted() {
    this.tableData._this = this;

    const { drivingSchoolId } = this.userInfo;
    this.queryRegion(drivingSchoolId);
    this.queryList();
  }

  async created() {
    const permObj = await this.$getPerm(this, this.tableData.options, this.searchForm.buttonList);
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
  }
}
