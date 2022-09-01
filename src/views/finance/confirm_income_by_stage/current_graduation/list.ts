import { Component, Vue } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import dayjs from 'dayjs';
import { ParamsType, TableOptionsValue } from '@/type';
import { jsAddFunc, isCustomNumber } from '@/assets/js/common';
import { drawSearchForm } from '@/assets/js/search_table';
import { SUBJECT } from '@/enums';

@Component
export default class FinanceCurrentGraduation extends Vue {
  @Action('finance/queryCurrentGraduateList') private queryCurrentGraduateList!: (data: any) => ParamsType;

  @Action('finance/confirmIncomCurrentGraduate') private confirmIncomCurrentGraduate!: (data: any) => ParamsType;

  private currentDate = dayjs(new Date()).format('YYYY-MM');

  // 列表搜索项配置
  private searchForm: ParamsType = {
    datePickerList: [
      {
        key: 'years',
        label: '日期',
        formatType: 'YYYY-MM',
        value: this.currentDate,
        placeholder: '请选择',
        type: 'month',
        clearable: false,
        width: 120,
      },
    ],
    inputList: [],
    selectList: [],
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
      datePickerList[0].value = dayjs(new Date()).format('YYYY-MM');
      this.queryList();
    }
  }

  // 表格配置
  private tableData: ParamsType = {
    _this: {},
    loading: false,
    selection: false,
    index: false,
    options: [
      {
        id: 1,
        label: '确认收入',
        type: 'primary',
        path: 'btn_qrsr'
      },
    ],
    labels: [
      {
        key: 'step',
        label: '考试阶段',
        minWidth: 100,
        render(h: any, params: any) {
          const { step } = params.row;
          if (step === undefined) return h('div', '');
          if (step === 0) return h('div', '总计');
          const list = SUBJECT.filter(item => item.id === step);
          return h('div', list ? list[0].label : '');
        }
      },
      {
        key: 'count',
        label: '人数',
        minWidth: 120,
        render(h: any, params: any) {
          const { step, count } = params.row;
          return h('el-link', {
            props: {
              type: 'primary',
              underline: false
            },
            on: {
              click: () => {
                params._self.tableData._this.jumpDetail(step);
              }
            }
          }, count);
        }
      },
      {
        key: 'countSalePrice',
        label: '培训费',
        minWidth: 120,
        isPrice: true
      },
      {
        key: 'countSalePriceNotRegistration',
        label: '培训费（不含报名费）',
        minWidth: 130,
        isPrice: true
      },
      {
        key: 'confirmationRatio',
        label: '确认比例',
      },
      {
        key: 'graduateIncomeAmount',
        label: '本期毕业确认收入',
        minWidth: 130,
        isPrice: true
      },
    ],
    list: [],
    selectionList: [],
    showSummary: false,
    summariesMethod: (param: any) => {
      const mainList = [1, 2, 3, 4, 5];
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
    if (id === 1) {
      // 确认收入
      this.confirm();
    }
  }

  private submitLoading = false;

  /** 确认收入 */
  private confirm() {
    const { searchForm } = this;
    const sendData = drawSearchForm(searchForm);
    this.confirmIncomCurrentGraduate(sendData).then(() => {
      this.$message.success('确认成功');
    }).finally(() => {
      //
    });
  }

  /** 跳转详情界面 */
  jumpDetail(step: number) {
    const { currentDate } = this;
    this.$router.push({
      path: '/finance/confirm_income_by_stage/current_graduation/detail',
      query: { obj: encodeURIComponent(JSON.stringify({ years: currentDate, step })) }
    });
  }

  async queryList() {
    const { searchForm } = this;
    const sendData = drawSearchForm(searchForm);
    try {
      const body = await this.queryCurrentGraduateList(sendData);
      this.tableData.list = body;
      this.currentDate = sendData.years;
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = false;
    }
  }

  mounted() {
    this.tableData._this = this;
    this.queryList();
  }

  async created() {
    const permObj = await this.$getPerm(this, this.tableData.options, this.searchForm.buttonList);
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
  }
}
