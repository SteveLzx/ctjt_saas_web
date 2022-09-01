/**
 * @author zhixiao
 * @description 牌证管理=>学员办证管理=>列表搜索条件大致相同，所以做此mixin。
 */
import { Vue, Component } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import { CARMODEL_LIST, ORDER_LEARN_TYPE } from '@/enums';
import { ParamsType } from '@/type';
import { DELETED_FIXED_LABELS } from '../_common/tablelabel';

@Component
export default class accreditationSeachTableMixins extends Vue {
  @Action('base/queryGroupMechanismData') private queryGroupMechanismData!: (data: any) => any;

  @Action('goods/queryClassesInfoList') private queryClassesInfoList!: (data: any) => ParamsType;

  @Action('license/queryStudentByKeyword') public queryStudentByKeyword!: (data: any) => ParamsType;

  @Action('license/deleteFlowData') public deleteFlowData!: (data: any) => ParamsType;

  @State(state => state.base.userInfo) userInfo: any;

  // 只看已删除数据时还需要展示的数据
  public deletedLabels = DELETED_FIXED_LABELS;

  // 列表搜索配置对象
  public searchForm: ParamsType = {
    selectTimeList: [],
    datePickerList: [],
    cascaderList: [],
    selectList: [
      {
        label: '片区门店',
        key: 'regionId',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 130,
        options: [],
      },
      {
        label: '',
        key: 'storeId',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 130,
        options: [],
      },
      {
        label: '车型',
        key: 'carModel',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 130,
        options: CARMODEL_LIST
      },
      {
        label: '班别',
        key: 'classesName',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 130,
        options: [],
        customOptions: {
          value: 'label',
          label: 'label'
        }
      },
      {
        label: '学车类型',
        key: 'learnType',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 130,
        customOptions: {
          value: 'label',
          label: 'label'
        },
        options: ORDER_LEARN_TYPE,
      },
    ],
    autocompleteList: [
      {
        label: '关键字',
        key: 'keyword',
        value: '',
        placeholder: '请输入学员姓名、手机号、证件号、订单号',
        width: 320,
        maxlength: 60,
        clearable: true,
        options: [],
      },
    ],
    inputList: [
      //  {
      //    label: '关键字',
      //    key: 'keyword',
      //    type: 'text',
      //    value: '',
      //    width: 315,
      //    placeholder: '请输入学员姓名、手机号、证件号、订单号',
      //    clearable: true,
      //  },
    ],
    checkedList: [
      {
        key: 'isArrears',
        value: '',
        label: '只看有欠费',
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
      {
        label: '操作日志',
        key: 'log',
        type: '',
        plain: false,
        path: 'btn_log'
      },
    ]
  };

  /**
  * @description 表单搜索回调函数
  */
  public async autocompleteQuerySearch(
    val: string,
    cb: (result: any) => void
  ) {
    // 调用 callback 返回建议列表的数据
    if (val) {
      const sendData = { keyword: val };
      await this.queryStudentByKeyword(sendData).then((res: any) => {
        cb(res);
      });
    } else {
      cb([]);
    }
  }

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
   * @description 请求驾校下的班别
   */
  async queryClassesList(val: string) {
    const sendData = { type: 1 }; // 1:学车班别;2:散学班别
    const body = await this.queryClassesInfoList(sendData);
    // 深拷贝，处理数据
    const _data = JSON.parse(JSON.stringify(body));
    _data.forEach((item: any) => {
      const _item = item;
      _item.label = _item.name;
    });
    this.searchForm.selectList[3].options = _data;
  }

  /**
   * @param {string} val 需要传入驾校id
   * @description 请求驾校下的所有教练
   */
  async queryCoachList(val: string) {
    const sendData = {};
    const body = await this.$http.get('', {
      params: {
        ...sendData
      }
    });
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
}
