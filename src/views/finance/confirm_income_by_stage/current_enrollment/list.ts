import { Component, Vue } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import dayjs from 'dayjs';
import { ParamsType } from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';

@Component
export default class FinanceCurrentEnrollment extends Vue {
  @Action('finance/queryCurrentEnrollmentList') private queryCurrentEnrollmentList!: (data: any) => ParamsType;

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
    options: [],
    labels: [
      {
        key: 'count',
        label: '招生人数',
        minWidth: 100,
        render(h: any, params: any) {
          const { count } = params.row;
          return h('el-link', {
            props: {
              type: 'primary',
              underline: false
            },
            on: {
              click: () => {
                params._self.tableData._this.jumpDetail();
              }
            }
          }, count);
        }
      },
      {
        key: 'salePriceSum',
        label: '应收培训费',
        minWidth: 120,
        isPrice: true
      },
      {
        key: 'registerPriceSum',
        label: '代缴注册费',
        minWidth: 120,
        isPrice: true
      },
      {
        key: 'amountSum',
        label: '实收金额',
        minWidth: 120,
        isPrice: true
      },
      {
        key: 'balanceSum',
        label: '待收金额',
        minWidth: 120,
        isPrice: true
      },
      {
        key: 'admissionIncomeSum',
        label: '本期招生确认收入',
        minWidth: 130,
        isPrice: true
      },
    ],
    list: [],
    selectionList: [],
  };

  /** 跳转详情界面 */
  jumpDetail() {
    const { currentDate } = this;
    this.$router.push({
      path: '/finance/confirm_income_by_stage/current_enrollment/detail',
      query: { obj: encodeURIComponent(JSON.stringify({ years: currentDate })) }
    });
  }

  async queryList() {
    const { searchForm } = this;
    const sendData = drawSearchForm(searchForm);
    try {
      const body = await this.queryCurrentEnrollmentList(sendData);
      this.tableData.list = [];
      if (body) this.tableData.list.push(body);
      this.currentDate = sendData.years;
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = true;
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
