<template>
  <div class="page">
    <SearchTable :prop-data="searchForm"></SearchTable>
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
<script lang='ts'>
import { State, Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import { SearchTable, CtjtTable, CtjtPagination } from '@/components';
import { spliceHoursAndMinutesAndSeconds, timestampSizeCompare } from '@/assets/js/common';
import { ParamsType, TableOptionsValue } from '@/type';
import {
  MARKET_BOOLEAN, MARKET_STATUS
} from '@/enums';
import { drawSearchForm } from '@/assets/js/search_table';
import ctjtPaginationMixins from '@/mixins/pagination';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination
  }
})
export default class MarketGoodsList extends mixins(ctjtPaginationMixins) {
  @State(state => state.base.dictAllData) dictAllData!: Map<string, { id: number, label: string }[]>;

  @Action('base/addDictAllData') private addDictAllData!: (names: string[]) => void;

  @Action('base/queryGroupMechanismData') private queryGroupMechanismData!: (data: any) => any;

  @Action('goods/queryProductList') private queryProductList!: (data: any) => ParamsType;

  @Action('goods/updateProductStatusById') private updateProductStatusById!: (data: any) => ParamsType;

  /** 列表 开始 */
  private searchForm = {
    inputList: [
      {
        label: '搜索',
        key: 'seqOrClassName',
        type: 'text',
        value: '',
        width: 280,
        clearable: true,
        placeholder: '请输入商品编号，班别名称',
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
        label: '状态',
        key: 'status',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: MARKET_STATUS
      },
      {
        label: '培训车型',
        key: 'carModel',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: [
          {
            id: 'C1',
            label: 'C1'
          },
          {
            id: 'C2',
            label: 'C2'
          },
          {
            id: 'C5',
            label: 'C5'
          },
          {
            id: 'D',
            label: 'D'
          },
          {
            id: 'E',
            label: 'E'
          }
        ]
      },
      {
        label: '是否高端班',
        key: 'isHighEndClass',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: MARKET_BOOLEAN
      },
    ],
    datePickerList: [
      {
        label: '创建时间',
        key: 'startTime',
        value: '',
        placeholder: '开始时间',
        type: 'date',
        width: 140,
      },
      {
        label: '-',
        key: 'endTime',
        value: '',
        placeholder: '结束时间',
        type: 'date',
        width: 140,
      },
    ],
    buttonList: [
      {
        label: '查询',
        key: 'search',
        type: 'primary',
        plain: false,
        path: 'btn_search'
      }
    ]
  }

  // 表格搜索按钮回调函数
  public searchTableCallBack(key: string) {
    if (key === 'search') {
      this.paginationData.current = 1;
      this.queryList();
    }
  }

  // 表格
  private tableData: ParamsType = {
    _this: {},
    loading: true,
    selection: true,
    index: true,
    options: [
      {
        id: 4,
        label: '新增商品',
        key: 'add',
        type: '',
        path: 'btn_edit',
      },
      {
        id: 1,
        label: '编辑',
        type: 'primary',
        icon: '&#xe60f;',
        path: 'btn_edit'
      },
      {
        id: 2,
        label: '上架',
        type: 'warning',
        icon: '&#xe616;',
        path: 'btn_upper'
      },
      {
        id: 3,
        label: '下架',
        type: 'warning',
        icon: '&#xe618;',
        path: 'btn_lower'
      }
    ],
    labels: [
      {
        key: 'seq',
        label: '商品编码',
        width: 200,
        render(h: any, params: any) {
          const { seq, id } = params.row;
          return h('el-link', {
            props: {
              type: 'primary',
              underline: false
            },
            on: {
              click: () => {
                params._self.tableData._this.jumpDetail(id, '1');
              }
            }
          },
          seq);
        }
      },
      {
        key: 'name',
        label: '商品名称',
      },
      {
        key: 'carModel',
        label: '培训车型',
      },
      {
        key: 'className',
        label: '班别名称',
      },
      {
        key: 'originalPrice',
        label: '原价(元)',
        render(h: any, params: any) {
          const { originalPrice } = params.row;
          const _originalPrice = JSON.parse(originalPrice);
          const _textArr: string[] = [];
          Object.keys(_originalPrice).forEach((item: string) => {
            _textArr.push(`${item}:${_originalPrice[item]}`);
          });
          return h('div', _textArr.join('，'));
        }
      },
      {
        key: 'salesPrice',
        label: '销售价(元)',
        render(h: any, params: any) {
          const { salesPrice } = params.row;
          const _salesPrice = JSON.parse(salesPrice);
          const _textArr: string[] = [];
          Object.keys(_salesPrice).forEach((item: string) => {
            _textArr.push(`${item}:${_salesPrice[item]}`);
          });
          return h('div', _textArr.join('，'));
        }
      },
      {
        key: 'isHighEndClass',
        label: '是否高端班',
        render(h: any, params: any) {
          const { isHighEndClass } = params.row;
          return h('div', `${isHighEndClass === 1 ? '是' : '否'}`);
        }
      },
      {
        key: 'createdTime',
        label: '创建时间',
      },
      {
        key: 'status',
        label: '状态',
        render(h: any, params: any) {
          const { status } = params.row;
          const _list = MARKET_STATUS;
          const _textArr = _list.filter(item => item.id === status);
          return h('div', `${_textArr[0].label}`);
        }
      }
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
    const { id } = val;
    if (id === 4) {
      this.jumpDetail('');
      return;
    }
    // 子项选中列表，必须是单选
    const { selectionList } = this.tableData;
    const _len = selectionList.length;
    if (_len > 1) this.$message.warning('只能单选一项进行操作！');
    if (_len === 0) this.$message.warning('请先勾选一项，再进行操作！');
    if (_len === 1) {
      const { id: spaceId } = selectionList[0];
      if (id === 1) {
        // 编辑
        this.jumpDetail(spaceId);
      }
      if (id === 2 || id === 3) {
        // 上架
        // 下架
        this.upDataStatusFunc(selectionList[0], id);
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
    this.$router.push({ path: '/market/goods/detail', query: { id: val, edit: isEdit } });
  }

  /** 搜索下拉框筛选 */
  private _setFormSelectFunc(type: string, data: any) {
    if (data && data.length > 0) {
      const _data = JSON.parse(JSON.stringify(data));
      _data.forEach((item: any) => {
        const _item = item;
        _item.label = _item.name;
      });
      if (type === 'driverSchool') {
        this.searchForm.selectList[0].options = _data;
      }
    }
  }

  /**
   * 下拉框请求参数处理
  */
  private async selectFunc(type: string, id: string) {
    const data = await this.queryGroupMechanismData({ pid: id });
    this._setFormSelectFunc(type, data);
  }

  /** 业务处理 结束 */

  /** 请求处理 */

  /**
   * 查询商品列表
  */
  async queryList() {
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const { startTime, endTime } = _data;
    // 判断时间
    if (startTime && endTime && timestampSizeCompare(startTime, endTime)) {
      this.$message.warning('开始时间不能大于结束时间');
      return;
    }
    const sendData = {
      ..._data,
      startTime: startTime ? spliceHoursAndMinutesAndSeconds(1, startTime) : '',
      endTime: endTime ? spliceHoursAndMinutesAndSeconds(2, endTime) : '',
    };
    const body = await this.queryProductList(sendData);
    const {
      data, current, total
    } = body;
    this.tableData.list = data;
    this.paginationData.current = current;
    this.paginationData.total = total;
    this.tableData.loading = false;
  }

  /**
   * 上下架商品
   */
  async upDataStatusFunc(val: ParamsType, type: number) {
    const { id, status, revision } = val;
    // 相同状态判断
    if ((status === 1 && type === 2) || (status !== 1 && type === 3)) {
      if (status === 2) {
        this.$message.warning('当前商品状态为待上架，无法下架');
        return;
      }
      this.$message.warning(`${type === 2 ? '当前状态已经是上架' : '当前状态已经是下架'}`);
      return;
    }
    this.$confirm(`${status === 1 ? '状态修改为下架' : '状态修改为上架'}, 是否继续?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      const sendData = {
        id,
        status: status === 1 ? 0 : 1,
        revision
      };
      await this.updateProductStatusById(sendData);
      this.$message.success('修改成功！');
      await this.queryList();
    });
  }

  /** 生命周期钩子函数 */
  async mounted() {
    this.tableData._this = this;
    await this.selectFunc('driverSchool', '0');
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
