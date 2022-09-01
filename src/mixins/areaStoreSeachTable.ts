/**
 * @author zy
 * @description 统计分析-门店片区查询条件很多界面都有，做此混合
 */
import { Vue, Component } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import { ParamsType } from '@/type';

@Component
export default class ctjtAreaStoreSeachTableMixins extends Vue {
  @Action('base/queryGroupMechanismData') public queryGroupMechanismData!: (data: any) => any;

  @Action('license/queryStudentByKeyword') public queryStudentByKeyword!: (data: any) => ParamsType;

  @State(state => state.base.userInfo) userInfo: any;

  // 列表搜索配置对象
  public searchForm: ParamsType = {
    selectTimeList: [],
    datePickerList: [],
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
    ],
    inputList: [],
    checkedList: [],
    autocompleteList: [],
    cascaderList: [],
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
    ],
  };

  /**
   * @param {string} type 判断是门店还是片区类型
   * @param {any} data 接口返回的数据
   * @description 片区，门店列表数据设置函数
   */
  private _setFormSelectFunc(type: string, data: any) {
    if (data && data.length > 0) {
      const _data: any = JSON.parse(JSON.stringify(data));
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
