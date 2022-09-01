<template>
  <div class="page">
    <SearchTable :prop-data="searchForm" @select-change="searchSelectChange"></SearchTable>
    <CtjtTable
      :tableData="tableData"
      @option-call="tableOptionCallback"
      @selection-change="tableSelectionChange"
    ></CtjtTable>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change='tableCurrentChange'
    ></CtjtPagination>
  </div>
</template>

<script lang="ts">
import { State, Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import { SearchTable, CtjtTable, CtjtPagination } from '@/components';
import { EDUCATIONAL_STATUS } from '@/enums';
import { ParamsType, TableOptionsValue } from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import ctjtPaginationMixins from '@/mixins/pagination';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination
  }
})
export default class EducationalFieldList extends mixins(ctjtPaginationMixins) {
  @State(state => state.base.dictAllData) dictAllData!: Map<string, { id: number, label: string }[]>;

  @Action('base/addDictAllData') private addDictAllData!: (names: string[]) => void;

  @Action('base/queryGroupMechanismData') private queryGroupMechanismData!: (data: any) => any;

  @Action('space/queryTrainingPlaceList') private queryTrainingPlaceList!: (data: any) => ParamsType;

  /** 列表 开始 */
  private searchForm = {
    inputList: [
      {
        label: '搜索',
        key: 'placeNameOrRegionNameOrGroupLeaderName',
        type: 'text',
        value: '',
        width: 300,
        clearable: true,
        placeholder: '请输入场地名称、片区经理、分管组长姓名',
      }
    ],
    selectList: [
      {
        label: '驾校',
        key: 'drivingSchoolId',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: []
      },
      {
        label: '片区',
        key: 'regionId',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: []
      },
      {
        label: '门店',
        key: 'storeId',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: []
      },
      {
        label: '是否智能带教',
        key: 'siteType',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 100,
        options: [{
          label: '是',
          id: 1
        }, {
          label: '否',
          id: 0
        }]
      },
      {
        label: '状态',
        key: 'status',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 100,
        options: EDUCATIONAL_STATUS
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
        label: '新增训练场',
        key: 'add',
        type: '',
        plain: false,
        path: 'btn_xzcd'
      },
    ]
  }

  // 列表搜索 操作按钮回调
  public searchTableCallBack(key: string) {
    if (key === 'search') {
      this.paginationData.current = 1;
      this.queryList();
    }
    if (key === 'add') {
      this.jumpDetail('');
    }
  }

  // 列表配置
  private tableData: ParamsType = {
    _this: {},
    loading: true,
    selection: true,
    index: true,
    options: [
      {
        id: 1,
        label: '编辑',
        type: 'primary',
        icon: '&#xe60f;',
        path: 'btn_edit'
      }
    ],
    labels: [
      {
        key: 'name',
        label: '训练场名称',
        width: 100,
        render(h: any, params: any) {
          const { name, id } = params.row;
          return h('el-popover', {
            props: {
              placement: 'top-start',
              width: '200',
              trigger: 'hover',
              content: name,
            },
            scopedSlots: {
              reference: () => h('el-link', {
                props: {
                  type: 'primary',
                  underline: false
                },
                style: {
                  'word-break': 'break-all'
                },
                on: {
                  click: () => {
                    params._self.tableData._this.jumpDetail(id, '1');
                  }
                }
              }, name)
            }
          });
        }
      },
      {
        key: 'carNumber',
        label: '智能教练车辆数量',
        width: 135,
      },
      {
        key: 'drivingSchoolName',
        label: '所属驾校',
      },
      {
        key: 'address',
        label: '详细地址',
        render(h: any, params: any) {
          const {
            address, provinceName, cityName, areaName
          } = params.row;
          const _text = `${provinceName}${cityName}${areaName}${address}`;
          return h('el-popover', {
            props: {
              placement: 'top-start',
              width: '300',
              trigger: 'hover',
              content: _text,
            },
            scopedSlots: {
              reference: () => h('p', _text),
            },
          });
        }
      },
      {
        key: 'regionName',
        label: '所属片区',
      },
      {
        key: 'area',
        label: '场地面积',
      },
      {
        key: 'putOnRecordsStatus',
        label: '备案状态',
        render(h: any, params: any) {
          const { putOnRecordsStatus } = params.row;
          return h('div', `${putOnRecordsStatus === 1 ? '是' : '否'}`);
        }
      },
      {
        key: 'leaseDate',
        label: '合同签署日期',
        width: 110
      },
      {
        key: 'expiryDate',
        label: '到期日期',
      },
      {
        key: 'status',
        label: '使用状态 ',
        render(h: any, params: any) {
          const { status } = params.row;
          return h('div', `${status === 1 ? '使用中' : '停用'}`);
        }
      },
      {
        key: 'backGarageNumber',
        label: '倒车入库',
      },
      {
        key: 'parallelParkNumber',
        label: '侧方位停车',
        width: 100
      },
      {
        key: 'curveNumber',
        label: '曲线行驶',
      },
      {
        key: 'slopeNumber',
        label: '坡道定点域停车',
        width: 120
      },
      {
        key: 'quarterTurningNumber',
        label: '直角转弯',
      },
      {
        key: 'intelligentPileNumber',
        label: '智能带教桩位数',
        width: 120
      },
      {
        key: 'pileTotal',
        label: '总教桩位数',
        width: 100
      },
    ],
    list: [],
    selectionList: [], // 选中的子项数组
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

  // 列表操作回调
  private tableOptionCallback(val: TableOptionsValue) {
    // 子项选中列表，必须是单选
    const { selectionList } = this.tableData;
    const _len = selectionList.length;
    if (_len > 1) this.$message.warning('只能单选一项进行操作！');
    if (_len === 0) this.$message.warning('请先勾选一项，再进行操作！');
    if (_len === 1) {
      const { id } = val;
      const spaceId: string = selectionList[0].id;
      if (id === 1) {
        // 编辑
        this.jumpDetail(spaceId);
      }
    }
  }

  // 列表选中每一列切换回调
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }
  /** 列表 结束 */

  /** 业务处理 开始 */
  private jumpDetail(val: string, isEdit?: string): void {
    this.$router.push({ path: '/educational/basic_set/field_mg/detail', query: { id: val, edit: isEdit } });
  }

  /** 搜索下拉框筛选 */
  private _setFormSelectFunc(type: string, data: any) {
    if (data && data.length > 0) {
      const _data = JSON.parse(JSON.stringify(data));
      _data.forEach((item: any) => {
        const _item = item;
        _item.label = _item.name;
      });
      if (type === 'drivingSchoolId') {
        this.searchForm.selectList[0].options = _data;
      }
      if (type === 'regionId') {
        this.searchForm.selectList[1].options = _data;
      }
      if (type === 'storeName') {
        this.searchForm.selectList[2].options = _data;
      }
    }
  }

  /** 搜索筛选框选择回调 */
  searchSelectChange(val: ParamsType) {
    const { value, key } = val;
    if (key === 'drivingSchoolId') {
      this.searchForm.selectList[1].options = [];
      this.searchForm.selectList[1].value = '';
      this.searchForm.selectList[2].options = [];
      this.searchForm.selectList[2].value = '';
      if (value) {
        this.selectFunc('regionId', value);
      }
    }
    if (key === 'regionId') {
      this.searchForm.selectList[2].options = [];
      this.searchForm.selectList[2].value = '';
      if (value) {
        this.selectFunc('storeName', value);
      }
    }
  }

  /** 业务处理 结束 */

  /** 请求处理 */

  /**
   * 下拉框请求参数处理
  */
  private async selectFunc(type: string, id: string) {
    const data = await this.queryGroupMechanismData({ pid: id });
    this._setFormSelectFunc(type, data);
  }

  /**
   * 请求场地列表
   */
  async queryList() {
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const sendData = {
      ..._data,
    };
    const body = await this.queryTrainingPlaceList(sendData);
    const {
      data, current, total
    } = body;
    this.tableData.list = data;
    this.paginationData.current = current;
    this.paginationData.total = total;
    this.tableData.loading = false;
  }

  async mounted() {
    this.tableData._this = this;
    // 先默认请求驾校
    await this.selectFunc('drivingSchoolId', '0');
    await this.queryList();
  }

  perm = {};

  async created() {
    const permObj = await this.$getPerm(this, this.tableData.options, this.searchForm.buttonList);
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
    this.perm = permObj.perm;
  }
}

</script>

<style lang="scss" scoped>

</style>
