/**
 * @author zy
 * @description 财务管理-支出复核-查询条件相同，做此混合
 */
import { Vue, Component } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import { ParamsType } from '@/type';
import { SUBJECT, REVIEW_STATUS, IN_LIBRARY_STATUS } from '@/enums';

@Component
export default class financePayReviewSeachTableMixins extends Vue {
  @Action('base/queryGroupMechanismData') public queryGroupMechanismData!: (data: any) => any;

  @State(state => state.base.userInfo) userInfo: any;

  private beginDate = new Date();

  private endDate = new Date();

  // 列表搜索配置对象
  public searchForm: ParamsType = {
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
              label: '交费日期',
            },
            {
              id: 2,
              label: '复核日期',
            }
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
    cascaderList: [
      {
        label: '在库状态',
        key: 'studentStatus',
        value: [IN_LIBRARY_STATUS[0].id, IN_LIBRARY_STATUS[1].id],
        placeholder: '请选择',
        clearable: true,
        width: 180,
        options: IN_LIBRARY_STATUS,
        optionProps: {
          emitPath: false, // 只展示最后一级
          multiple: true, // 可多选
          collapseTags: true,
          value: 'id',
          label: 'label',
          children: 'children',
        },
      },
    ],
    selectList: [
      {
        label: '片区门店',
        key: 'regionId',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 100,
        options: [],
      },
      {
        label: '',
        key: 'storeId',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 100,
        options: [],
      },
      {
        label: '科目',
        key: 'step',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 100,
        options: SUBJECT,
        display: '',
      },
      {
        label: '复核状态',
        key: 'reviewStatus',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 100,
        options: REVIEW_STATUS,
      },
    ],
    inputList: [
      {
        label: '缴费流水号',
        key: 'payNumber',
        type: 'text',
        value: '',
        width: 160,
        placeholder: '请输入缴费流水号',
        clearable: true,
      },
      {
        label: '批次号',
        key: 'batchNos',
        type: 'text',
        value: '',
        width: 300,
        placeholder: '多个批次号之间请英文用分号[;]分隔',
        clearable: true,
      },
      {
        label: '关键字',
        key: 'keyword',
        type: 'text',
        value: '',
        width: 220,
        placeholder: '请输入学员姓名、证件号码',
        clearable: true,
      },
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
      },
    ]
  };

  /**
   * @param {string} type 判断是门店还是片区类型
   * @param {any} data 接口返回的数据
   * @description 片区，门店列表数据设置函数
   */
  private _setFormSelectFunc(type: string, data: any) {
    if (data && data.length > 0) {
      const _data = JSON.parse(JSON.stringify(data));
      _data.forEach((item: any) => {
        const _item = item;
        _item.label = _item.name;
      });
      if (type === 'region') {
        this.searchForm.selectList[0].options = _data;
      }
      if (type === 'store') {
        this.searchForm.selectList[1].options = _data;
      }
    }
  }

  /**
   * @param {string} val 需要传入驾校id
   * @description 请求驾校下的片区
   */
  async queryRegionList(val: string) {
    const data = await this.queryGroupMechanismData({ pid: val });
    this._setFormSelectFunc('region', data);
  }

  /**
   * @param {string} val 需要传入片区id
   * @description 请求片区下的门店
   */
  async queryStoreList(val: string) {
    const data = await this.queryGroupMechanismData({ pid: val });
    this._setFormSelectFunc('store', data);
  }

  /**
   * @param {string} val 需要传入驾校id
   * @description 请求驾校下片区的所有场地
   */
  async queryFieldList(val: string) {
    const sendData = {};
    const body = await this.$http.get('', {
      params: {
        ...sendData
      }
    });
  }

  /**
   * @param {string} type 判断是门店还是片区类型
   * @param {any} data 接口返回的数据
   * @description 片区，门店列表数据
   */
  setFormSelectFunc(data: any) {
    if (data && data.length > 0) {
      const _data = JSON.parse(JSON.stringify(data));
      _data.forEach((item: any) => {
        const _item = item;
        _item.label = _item.name;
      });
      return _data;
    }
    return [];
  }
}
