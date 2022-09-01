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
      @on-current-change="tableCurrentChange"
    ></CtjtPagination>
  </div>
</template>

<script lang="ts">
import { Action, State } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import FileSaver from 'file-saver';
import { SearchTable, CtjtTable, CtjtPagination } from '@/components';
import { ParamsType, TableOptionsValue } from '@/type';
import { CAR_YEAR_LIST, CAR_BASTATE, CAR_ISREJECT } from '@/enums';
import { dataExchange } from '@/assets/js/common';
import { drawSearchForm } from '@/assets/js/search_table';
import ctjtPaginationMixins from '@/mixins/pagination';

type selectparamType = {
  label: string;
  id: string;
};

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
  },
})
export default class VehicleInfoMgBasisInfo extends mixins(
  ctjtPaginationMixins
) {
  @State(state => state.base.userInfo) private userInfo: any;

  @Action('car/queryOrganizationTree')
  private queryOrganizationTree!: () => any;

  @Action('car/queryAllUseProperties')
  private queryAllUseProperties!: () => any;

  @Action('car/queryAllCarBrand') private queryAllCarBrand!: () => any;

  @Action('car/queryCarList') private queryCarList!: (data: any) => any;

  @Action('car/deleteCarBaseInfo') private deleteCarBaseInfo!: (
    data: any
  ) => any;

  @Action('car/exportCarList') private exportCarList!: (data: any) => any;

  /** 列表配置 */
  private tableData: ParamsType = {
    _this: {},
    loading: true,
    selection: true,
    index: true,
    options: [
      {
        id: 3,
        label: '新增车辆',
        path: 'btn_xzcl',
      },
      {
        id: 1,
        label: '编辑',
        type: 'primary',
        icon: '&#xe60f;',
        path: 'btn_edit',
      },
      {
        id: 2,
        label: '停用',
        type: 'warning',
        path: 'btn_disable',
      },
      {
        id: 4,
        label: '导出',
        path: 'btn_export'
      },
    ],
    labels: [
      {
        key: 'licensePlate',
        label: '车牌号',
        render(h: any, params: any) {
          const { licensePlate, cbiid } = params.row;
          return h(
            'el-link',
            {
              props: {
                type: 'primary',
                underline: false,
              },
              on: {
                click: () => {
                  params._self.tableData._this.jumpDetail(cbiid);
                },
              },
            },
            licensePlate
          );
        },
      },
      {
        key: 'brandName',
        label: '品牌',
        showOverflowTooltip: true,
      },
      {
        key: 'companyName',
        label: '使用单位',
        showOverflowTooltip: true,
      },
      {
        key: 'organName',
        label: '使用部门',
        showOverflowTooltip: true,
      },
      // {
      //   key: 'teachingGroupManagerName',
      //   label: '教学组长',
      // },
      {
        key: 'useperson',
        label: '使用人',
      },
      // {
      //   key: 'teachingType',
      //   label: '带教类型',
      //   minWidth: 120,
      // },
      // {
      //   key: 'teachingSubject',
      //   label: '带教科目',
      //   minWidth: 100,
      // },
      {
        key: 'useKindName',
        label: '车辆用途',
      },
      {
        key: 'useKindListName',
        label: '使用性质',
        render(h: any, params: any) {
          const { useKindName, useKindListName } = params.row;
          if (useKindListName === null) {
            return h('div', useKindName);
          }
          return h('div', useKindListName);
        },
      },
      {
        key: 'carStyle',
        label: '车型',
      },
      {
        key: 'registerdate',
        label: '登记日期',
      },
      {
        key: 'coty',
        label: '车龄',
      },
      {
        key: 'stateName',
        label: '使用状态',
        showOverflowTooltip: true,
      },
      {
        key: 'fixOrgName',
        label: '所属权',
        showOverflowTooltip: true,
      },
    ],
    list: [],
    selectionList: [],
  };

  /** 列表搜索配置 */
  private searchForm: ParamsType = {
    inputList: [
      {
        label: '关键词',
        key: 'carNumOrUser',
        type: 'text',
        value: '',
        width: 200,
        placeholder: '请输入车牌号、使用人',
        clearable: true,
      },
    ],
    selectList: [
      {
        label: '车龄',
        key: 'coty',
        value: '',
        placeholder: '请选择车龄',
        multiple: false,
        clearable: true,
        width: 120,
        options: [],
      },
      {
        label: '车辆品牌',
        key: 'carBrand',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 140,
        options: [],
      },
      {
        label: '是否备案',
        key: 'bastate',
        value: '',
        placeholder: '不限',
        multiple: false,
        clearable: true,
        width: 100,
        options: [],
      },
      {
        label: '是否报废',
        key: 'isReject',
        value: '',
        placeholder: '不限',
        multiple: false,
        clearable: true,
        width: 100,
        options: [],
      },
      {
        label: '使用性质',
        key: 'usekind',
        value: [],
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 140,
        options: [],
      },
    ],
    cascaderList: [
      // {
      //   label: '使用机构',
      //   key: 'oragn',
      //   value: [],
      //   placeholder: '请选择',
      //   multiple: false,
      //   clearable: true,
      //   width: 140,
      //   options: [],
      //   optionProps: {
      //     checkStrictly: true,
      //     emitPath: true, // true 才能使null和0的id都能选中
      //     value: 'id',
      //     label: 'label',
      //     children: 'children',
      //   },
      // },
      // {
      //   label: '使用性质',
      //   key: 'usageState',
      //   value: [],
      //   placeholder: '请选择',
      //   multiple: false,
      //   clearable: true,
      //   width: 140,
      //   options: [],
      //   optionProps: {
      //     checkStrictly: true,
      //     emitPath: true,
      //     value: 'id',
      //     label: 'label',
      //     children: 'children',
      //   },
      // },
    ],
    buttonList: [
      {
        label: '查询',
        key: 'search',
        type: 'primary',
        plain: false,
        path: 'btn_search',
      },
    ],
  };

  /** 列表搜索 操作按钮回调 */
  public searchTableCallBack(key: string) {
    if (key === 'search') {
      this.paginationData.current = 1; // 每次查询的时候都把当前页设置成第一页
      this.queryList();
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

  // 列表操作回调
  private tableOptionCallback(val: TableOptionsValue) {
    const { id } = val;
    if (id === 3) {
      this.addCarFun();
      return;
    }
    if (id === 4) {
      this.exportList();
      return;
    }
    // 子项选中列表，必须是单选
    const { selectionList } = this.tableData;
    const _len = selectionList.length;
    if (_len === 0) this.$message.warning('请先勾选一项，再进行操作！');
    if (_len > 0) {
      if (id === 2) {
        // 删除
        const idList: any = [];
        const _selectList = selectionList;
        _selectList.forEach((item: any) => {
          const _item = item;
          idList.push({
            cbiid: _item.cbiid,
            getRecordEmpId: _item.getRecordEmpId,
          });
        });
        this.deteleCarConfirm(idList);
      }
    }
    if (_len > 1) {
      // 编辑
      if (id === 1) {
        this.$message.warning('只能单选一项进行操作！');
      }
    } else {
      // 编辑 删除
      const spaceId = selectionList[0].cbiid;
      if (id === 1) {
        // 编辑
        this.jumpDetail(spaceId, 'edit');
      }
    }
  }

  // 删除车辆弹出框确认
  private deteleCarConfirm(idList: Array<number>) {
    this.$confirm('此操作将永久停用该车辆, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        this.deleteCarFun(idList); // 调用删除方法
        this.$message.success('停用成功!');
      })
      .catch(() => {
        this.$message.info('已取消停用');
      });
  }

  // 列表选中每一列切换回调
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }
  /** 列表 结束 */

  /** 业务处理 开始 */
  private jumpDetail(val: string, type?: string): void {
    this.$router.push({
      path: '/vehicle/info_mg/basis_info/detail',
      query: { id: val, types: type },
    });
  }
  /** 业务处理 结束 */

  /** 请求处理 */
  /** 给下拉框设置选项值 */
  setSelectOptions() {
    const { selectList } = this.searchForm;
    selectList.forEach(async (item: any) => {
      const _item = item;
      const { key } = _item;
      let selectListItem: selectparamType[] = [];
      if (key === 'coty') {
        selectListItem = CAR_YEAR_LIST;
      } else if (key === 'bastate') {
        selectListItem = CAR_BASTATE;
      } else if (key === 'isReject') {
        selectListItem = CAR_ISREJECT;
      }
      if (Array.isArray(selectListItem)) {
        _item.options = selectListItem;
      }
    });
  }

  /**
   * 查询数据字典
   * 表单搜索下拉数据
   */

  // 查询所有搜索下拉框数据 并绑定到对应的下拉框option
  querSelect() {
    // this.queryOragnList(); // 使用机构
    this.queryCarBrand(); // 车辆品牌
    this.queryCarUseProList(); // 车辆使用性质
    this.setSelectOptions();
  }

  // 获取使用机构下拉框数据
  async queryOragnList() {
    const body = await this.queryOrganizationTree();
    const oragnCasderList = dataExchange(body, 'organid', 'oragnname');
    const { cascaderList } = this.searchForm;
    cascaderList.forEach(async (item: any) => {
      const _item = item;
      const { key } = _item;
      if (key === 'oragn') {
        if (Array.isArray(oragnCasderList)) {
          const list = JSON.parse(JSON.stringify(oragnCasderList));
          _item.options = list;
        }
      }
    });
  }

  // 获取车辆使用性质
  async queryCarUseProList() {
    const body = await this.queryAllUseProperties();
    const usageStateCasderList = dataExchange(body, 'id', 'name');
    const { selectList } = this.searchForm;
    selectList[4].options = usageStateCasderList;
  }

  // 获取车辆品牌下拉框数据
  async queryCarBrand() {
    const body = await this.queryAllCarBrand();
    const carBrandSelectList = dataExchange(body, 'id', 'name');
    const { selectList } = this.searchForm;
    selectList[1].options = carBrandSelectList;
  }

  async exportList() {
    const { searchForm } = this;
    const _data = drawSearchForm(searchForm);
    const sendData = {
      ..._data
    };
    const body = await this.exportCarList(sendData);
    console.log(body);
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel'
    });
    FileSaver.saveAs(blob, `车量基础信息${this.$dayjs(new Date()).format('YYYYMMDD')}`);
  }

  /**
   * 请求场地列表
   */
  async queryList() {
    this.tableData.loading = true;
    const { searchForm, paginationData } = this;
    const sendData = drawSearchForm(searchForm, paginationData);
    const body = await this.queryCarList(sendData);
    const { data, current, total } = body;
    this.tableData.list = data;
    this.paginationData.current = current;
    this.paginationData.total = total;
    this.tableData.loading = false;
  }

  /* 删除 车辆 */
  async deleteCarFun(idList: Array<number>) {
    await this.deleteCarBaseInfo(idList);
    this.queryList();
  }

  /* 新增车辆 */
  private addCarFun() {
    const addId = '';
    this.jumpDetail(addId, 'add');
  }

  async mounted() {
    const { drivingSchoolId } = this.userInfo;
    if (drivingSchoolId === '370') {
      this.tableData.labels.splice(7, 0, {
        key: 'teachingSubject',
        label: '带教科目',
        minWidth: 100,
      });
    }
    this.tableData._this = this;
    this.querSelect();
    this.queryList();
  }

  async created() {
    const permObj = await this.$getPerm(
      this,
      this.tableData.options,
      this.searchForm.buttonList
    );
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
  }
}
</script>

<style lang="scss" scoped>
</style>
