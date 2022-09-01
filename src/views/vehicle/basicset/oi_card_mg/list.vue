<template>
  <div class="page">
    <SearchTable :prop-data.sync="searchForm" @select-change="searchSelectChange"></SearchTable>
    <div
      class="preview_container"
      id="ctjt_change_info_drawer_preview_container"
    >
      <el-row
        class="options_container"
        id="ctjt_table_options_container"
        v-if="tableData.options && tableData.options.length > 0"
      >
        <el-col :span="24">
          <el-button
            v-for="(item, index) in tableData.options"
            :slot="item.slots"
            :key="index"
            :type="item.type"
            @click="tableOptionCallback(item)"
          >
            {{ item.label }}
          </el-button>
        </el-col>
      </el-row>
      <el-table
        :data="tableData.list"
        row-key="id"
        border
        lazy
        v-loading="tableData.loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        :tree-props="{children: 'children',  hasChildren: 'hasChildren' }"
        :load="loadTree"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          :align="'center'"
          width="50"
        ></el-table-column>
        <el-table-column
          prop=""
          label=""
          :align="'center'"
          width="50"
        ></el-table-column>
        <el-table-column
          prop="index"
          label="序号"
          :align="'center'"
          width="50"
        ></el-table-column>
        <el-table-column
          prop="organName"
          label="片区"
          :align="'center'"
        >
        </el-table-column>
        <el-table-column
          prop="carNumber"
          :align="'center'"
          label="油卡卡号">
        </el-table-column>
        <el-table-column
          prop="totalOilCash"
          :align="'center'"
          label="油耗金额(元)">
          <template slot-scope="scope">
            {{formatPrice(scope.row.totalOilCash)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="oilCardLimit"
          :align="'center'"
          label="油卡额度(元)">
          <template slot-scope="scope">
            {{formatPrice(scope.row.oilCardLimit)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="oilCardLeftLimit"
          :align="'center'"
          label="油卡余额(元)"><template slot-scope="scope">
            {{formatPrice(scope.row.oilCardLeftLimit)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="difference"
          :align="'center'"
          label="差额(元)">
        </el-table-column>
        <el-table-column
          prop="carNum"
          :align="'center'"
          label="车辆数">
          <template slot-scope="props">
            <el-link
              type="primary"
              :underline="false"
              @click="jumpDetail(props.row)"
            >{{ props.row.carNum }}</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change='tableCurrentChange'
    ></CtjtPagination>

    <el-drawer
      :visible.sync="drawer"
      size="80%">
      <CtjtCard :prop-data="{ title: `${ isEdit ? '编辑' : '新增'}油卡` }">
        <template slot='content'>
          <el-form :model="formData" :rules="formRules" ref="formDrawerRef" label-width="100px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="所属片区" prop="organId">
                  <el-select
                    class="w_300"
                    v-model="formData.organId"
                    @change="regionChange"
                    placeholder="请选择">
                    <el-option
                      v-for="item in regionOpts"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="!mainEdit">
                <el-form-item label="所属主卡" prop="mainCard">
                  <el-select v-model="formData.mainCard" placeholder="请选择" @change="handleMainCardChange">
                    <el-option
                      v-for="item in mainCardOpt"
                      :key="item.id"
                      :label="item.maincard"
                      :value="item.maincard">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="油卡卡号" prop="oilCard">
                  <el-input class="w_300" placeholder="请输入" v-model.trim="formData.oilCard" maxlength="19" show-word-limit></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12"  v-if="!mainEdit">
                <el-form-item label="油卡额度" prop="beforehandMoney">
                  <el-input class="w_300" placeholder="请输入" v-model="formData.beforehandMoney" show-word-limit></el-input>元
                </el-form-item>
              </el-col>
            </el-row>
            <el-row  v-if="!mainEdit">
              <el-col :span="12">
                <el-form-item label="车牌号" prop="carNo">
                  <el-input class="w_300" placeholder="请输入" v-model.trim="formData.carNo" maxlength="20" show-word-limit></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" justify="center">
              <el-button @click="close()">取消</el-button>
              <el-button type="primary" :loading="btnLoading" @click="btnSubmit()">保存</el-button>
            </el-row>
          </el-form>
        </template>
      </CtjtCard>
    </el-drawer>

    <!-- 车辆列表展示 -->
    <el-drawer
      :visible.sync="carDrawer"
      title="车辆列表"
      size="80%">
      <CtjtTable :tableData="carTableData"></CtjtTable>
    </el-drawer>
  </div>
</template>
<script lang='ts'>
import { State, Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import {
  SearchTable, CtjtTable, CtjtPagination, CtjtCard
} from '@/components';
import { ParamsType, VueComponentParent } from '@/type';
import { deepClone, formatPrice } from '@/assets/js/common';
import { drawSearchForm } from '@/assets/js/search_table';
import ctjtPaginationMixins from '@/mixins/pagination';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtCard
  }
})
export default class VehicleBasicsetOiCardMg extends mixins(ctjtPaginationMixins) {
  @State(state => state.base.userInfo) userInfo!: ParamsType;

  @Action('base/queryGroupMechanismData') private queryGroupMechanismData!: (data: any) => any;

  @Action('car/queryOilCardList') private queryOilCardList!: (data: any) => any;

  @Action('car/queryOilCardCarList') private queryOilCardCarList!: (data: any) => any;

  @Action('car/queryMainCardListByAreaId') private queryMainCardListByAreaId!: (data: any) => any;

  @Action('car/saveOrUpdateOilCard') private saveOrUpdateOilCard!: (data: any) => any;

  @Action('car/deleteCards') private deleteCards!: (data: any) => any;

  // 片区
  regionOpts = []

  async regionChange(value: any) {
    this.mainCardOpt = await this.queryMainCardListByAreaId({ organId: value });
  }

  // 所属主卡
  mainCardOpt = []

  handleMainCardChange(value: any) {
    const _list: any = this.mainCardOpt.filter((item: any) => item.maincard === value);
    this.formData.mainCardId = _list[0].id;
  }

  formatPrice(price: number | string) {
    return formatPrice(price);
  }

  searchForm = {
    inputList: [
      {
        label: '油卡卡号',
        key: 'oilCardNumber',
        type: 'text',
        value: '',
        width: 200,
        clearable: true,
        placeholder: '请输入',
      }
    ],
    selectList: [
      {
        label: '驾校',
        key: 'drivingSchoolId',
        value: '',
        width: 200,
        placeholder: '请选择',
        clearable: true,
        options: []
      },
      {
        label: '片区',
        key: 'regionId',
        value: '',
        width: 200,
        placeholder: '请选择',
        clearable: true,
        options: []
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
        plain: false,
        path: 'btn_search'
      },
    ]
  }

  handleSelectionChange(val: any[]) {
    this.tableData.selectionList = val;
  }

  mainEdit = false

  async edit(list: any[]) {
    this.isEdit = true;
    const { 0: data } = list;
    const { viceNumber } = data;
    const { drivingSchoolId } = this.userInfo;
    const body = await this.queryGroupMechanismData({ pid: drivingSchoolId });
    this.regionOpts = body;
    this.mainEdit = !viceNumber;
    if (viceNumber) {
      // 编辑的副卡
      const {
        masterId, masterNumber, oilCardLimit, organId
      } = data;
      this.formData.mainCardId = masterId;
      this.formData.mainCard = masterNumber;
      this.formData.beforehandMoney = oilCardLimit;
      this.formData.organId = organId;
      this.formData.oilCard = viceNumber;
      this.formData.oldOilCard = viceNumber;
    } else {
      // 编辑主卡
      const {
        masterId, masterNumber, organId
      } = data;
      this.formData.id = masterId;
      this.formData.organId = organId;
      this.formData.oilCard = masterNumber;
      this.formData.oldOilCard = masterNumber;
    }
    this.drawer = true;
  }

  // 列表搜索 操作按钮回调
  public searchTableCallBack(key: string) {
    if (key === 'search' || key === 'reset') {
      this.paginationData.current = 1;
      this.queryList();
    }
    if (key === 'reset') {
      this.searchForm.selectList[0].value = '';
      this.searchForm.selectList[1].value = '';
      this.searchForm.selectList[1].options = [];
    }
  }

  /** 搜索筛选框选择回调 */
  searchSelectChange(val: ParamsType) {
    const { value, key } = val;
    if (key === 'drivingSchoolId') {
      this.searchForm.selectList[1].options = [];
      this.searchForm.selectList[1].value = '';
      if (value) this.selectFunc('region', value);
    }
  }

  /**
   * 下拉框请求参数处理
  */
  private async selectFunc(type: string, id: string) {
    const data = await this.queryGroupMechanismData({ pid: id });
    this._setFormSelectFunc(type, data);
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
      if (type === 'region') {
        this.searchForm.selectList[1].options = _data;
      }
    }
  }

  // 列表
  private tableData: ParamsType = {
    loading: true,
    list: [],
    selectionList: [],
    options: [
      {
        id: 1,
        label: '新增',
        path: 'btn_add'
      },
      {
        id: 2,
        label: '编辑',
        type: 'primary',
        icon: '&#xe60f;',
        path: 'btn_edit'
      },
      {
        id: 3,
        label: '删除',
        type: 'danger',
        path: 'btn_delete'
      },
    ],
  }

  // 列表操作回调
  private tableOptionCallback(val: any) {
    const { id } = val;
    if (id === 1) {
      // 新增
      this.newAddApply();
      return;
    }
    const { selectionList } = this.tableData;
    const _len = selectionList.length;
    if (_len === 0) this.$message.warning('请先勾选一项，再进行操作！');
    if (_len > 1) this.$message.warning('不能批量操作');
    if (_len === 1) {
      if (id === 2) {
        // 编辑
        this.edit(selectionList);
      }
      if (id === 3) {
        // 删除
        this.deleteParkingFunc(selectionList);
      }
    }
  }

  private isEdit = false;

  async newAddApply() {
    const { drivingSchoolId } = this.userInfo;
    const body = await this.queryGroupMechanismData({ pid: drivingSchoolId });
    this.regionOpts = body;
    this.drawer = true;
    this.isEdit = false;
    this.mainEdit = false;
    this.$nextTick(() => {
      (this.$refs.formDrawerRef as VueComponentParent).clearValidate();
    });
  }

  // 打开车辆列表
  async jumpDetail(val: any) {
    const { viceNumber } = val;
    const body = await this.queryOilCardCarList({ viceCardNumber: viceNumber });
    this.carTableData.list = body;
    this.carDrawer = true;
  }

  // 删除
  deleteParkingFunc(list: any[]) {
    this.$confirm('是否删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      const { masterNumber, viceNumber } = list[0];
      const sendData = {
        number: viceNumber || masterNumber,
        type: viceNumber ? 1 : 0
      };
      await this.deleteCards(sendData);
      this.queryList();
      this.$message.success('删除成功');
    });
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

  /**
   * 请求订单列表
   */

  async queryList() {
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const sendData = { ..._data };
    try {
      const body = await this.queryOilCardList(sendData);
      const {
        data, current, total
      } = body;
      this.tableData.deeoList = data;
      const deepData = deepClone(data);
      const _list: any = [];
      deepData.forEach((item: any, index: number) => {
        const _item = item;
        const { masterId, children, masterNumber } = _item;
        _item.carNumber = masterNumber;
        _item.index = index + 1;
        _item.id = `${masterId}-${index}`;
        if (Array.isArray(children)) {
          _item.hasChildren = true;
          delete _item.children;
        }
        _list.push(_item);
      });
      this.tableData.list = _list;
      this.paginationData.current = current;
      this.paginationData.total = total;
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = false;
    }
  }

  // 数据太大，懒加载
  loadTree(tree: any, treeNode: any, resolve: any) {
    const { deeoList } = this.tableData;
    const { masterNumber } = tree;
    const _list = deeoList.filter((item: any) => item.masterNumber === masterNumber);
    const _data = deepClone(_list[0].children);
    _data.forEach((child: any, _index: number) => {
      const _child = child;
      const { masterId: cmasterId, viceNumber } = _child;
      _child.carNumber = viceNumber;
      _child.id = `${cmasterId}-${viceNumber}`;
    });
    resolve(_data);
  }

  // 新增弹窗
  private drawer = false;

  private btnLoading = false;

  close() {
    Object.keys(this.formData).forEach(key => {
      this.formData[key] = this.deepFormData[key];
    });
    this.drawer = false;
  }

  btnSubmit() {
    (this.$refs.formDrawerRef as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        this.saveOrUpdateFunc();
      }
    });
  }

  deepFormData: ParamsType = {
    beforehandMoney: null,
    carNo: '',
    mainCard: '',
    mainCardId: null,
    oilCard: '',
    oldOilCard: '',
    organId: null
  }

  private formData = deepClone(this.deepFormData)

  private formRules: ParamsType = {
    organId: [
      { required: true, message: '请选择所属片区', trigger: ['change', 'blur'] }
    ],
    mainCard: [
      { required: true, message: '请选择所属主卡', trigger: ['change', 'blur'] }
    ],
    oilCard: [
      { required: true, message: '请输入油卡卡号', trigger: ['blur'] }
    ]
  }

  // 新增、修改
  saveOrUpdateFunc() {
    const { formData } = this;
    const { oldOilCard } = formData;
    const sendData = { ...formData };
    this.btnLoading = true;
    this.saveOrUpdateOilCard(sendData).then(() => {
      this.$message.success(`${oldOilCard > 0 ? '修改' : '新增'}成功`);
      this.close();
      this.queryList();
    }).finally(() => {
      this.btnLoading = false;
    });
  }

  // 车辆弹窗
  private carDrawer = false;

  private carTableData: ParamsType = {
    list: [],
    loading: false,
    index: true,
    labels: [
      {
        key: 'areaName',
        label: '片区',
      },
      {
        key: 'plateNumber',
        label: '车牌号',
      },
      {
        key: 'userName',
        label: '教练',
      },
    ]
  }

  // 生命周期函数
  async mounted() {
    this.selectFunc('driverSchool', '0');
    this.queryList();

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
::v-deep .el-drawer__body {
  padding: 0 20px 20px;
  overflow: auto;
}
.preview_container {
  width: 100%;
  flex: 1;
  overflow: hidden;
  .options_container {
    padding: 14px 18px;
    border: 1px solid $--color-border-split;
    border-bottom: 0;
    background: #f9fafb;
    .iconfont {
      margin-right: 8px;
    }
  }
}
</style>
