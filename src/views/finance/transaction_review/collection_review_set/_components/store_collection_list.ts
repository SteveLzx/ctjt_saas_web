import Component, { mixins } from 'vue-class-component';
import { State, Action } from 'vuex-class';
import { ParamsType, TableOptionsValue } from '@/type';
import {
  formatPrice, deepClone, isCustomNumber, jsAddFunc, timestampSizeCompare
} from '@/assets/js/common';
import { drawSearchForm } from '@/assets/js/search_table';
import { ORDER_PAY_TYPE, THIRD_CHANNELS_OPTS } from '@/enums';
import { STORE_COLLECTION_LIST_LABEL } from '@/views/finance/_common/tablelabel';
import ctjtAreaStoreSeachTableMixins from '@/mixins/areaStoreSeachTable';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';

const tableOptionList = [
  {
    id: 1,
    label: '导出',
    path: 'btn_expor_store'
  }
];
const name = '门店收入统计';
@Component
export default class StoreCollection extends mixins(ctjtPaginationMixins, ctjttablefieldMixins, ctjtAreaStoreSeachTableMixins) {
  @Action('finance/queryAllPosTerminalNoList') private queryAllPosTerminalNoList!: (data: any) => ParamsType;

  @Action('finance/queryStoreIncomeList') private queryStoreIncomeList!: (data: any) => ParamsType;

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
              label: '收款日期',
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
        width: 120,
        options: ORDER_PAY_TYPE.filter(a => a.id !== 4),
      },
      {
        label: '终端号',
        key: 'payContent',
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
    ],
    inputList: [],
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
    if (key === 'payType') {
      this.searchForm.selectList[3].options = [];
      this.searchForm.selectList[3].value = '';
      if (value) {
        this.queryTerminalNoList(value);
      }
    }
  }

  /**
    * @description 列表搜索 操作按钮回调
  */
  searchTableCallBack(key: string) {
    if (key === 'search') {
      this.queryList();
    }
    if (key === 'reset') {
      this.searchSelectChange({ key: 'regionId', value: null });
      this.searchSelectChange({ key: 'payType', value: null });
      this.queryList();
    }
  }

  // 导出表格配置
  private downTableData: ParamsType = {
    labels: [],
    list: [],
    name
  }

  // 表格配置
  private tableData: ParamsType = {
    _this: {},
    loading: false,
    selection: false,
    index: true,
    options: tableOptionList,
    labels: STORE_COLLECTION_LIST_LABEL,
    list: [],
    selectionList: [],
    showSummary: true,
    summariesMethod: (param: any) => {
      const mainList = [4];
      const { columns, data } = param;
      const sums: any = [];
      columns.forEach((column: any, index: number) => {
        if (index === 0) {
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
    const { selectionList, labels, list } = this.tableData;
    const idList: Array<number> = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      idList.push(_item.id);
    });
    const _len = selectionList.length;
    if (id === 1) {
      // 导出
      this.downTableData.list = deepClone(list);
      this.downTableData.labels = deepClone(labels);
    }
  }

  /** 获取终端号 */
  /** 获取终端号 */
  private async queryTerminalNoList(type: any) {
    const { selectList } = this.searchForm;
    if (type === 1) {
      selectList[3].options = THIRD_CHANNELS_OPTS;
    } else if (type === 6) {
      selectList[3].options = [{
        id: 1,
        label: '上缴现金'
      }];
    } else {
      const data = await this.queryAllPosTerminalNoList({ type });
      selectList[3].options = data;
    }
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
      const body = await this.queryStoreIncomeList(sendData);
      this.tableData.list = body;
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
    this.initSearch();
    this.queryList();
    const permObj = await this.$getPerm(this, this.tableData.options, this.searchForm.buttonList);
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
  }
}
