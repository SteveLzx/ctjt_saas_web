<template>
  <div class="page">
    <SearchTable :prop-data.sync="searchForm" @select-change="searchSelectChange"></SearchTable>
    <CtjtTable
      :tableData="tableData"
      @selection-change="handleSelectionChange"
      @option-call="tableOptionCallback"></CtjtTable>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change='tableCurrentChange'
    ></CtjtPagination>

    <el-drawer
      :visible.sync="drawer"
      size="80%">
      <CtjtCard :prop-data="{ title: `${formData.id ? '编辑' : '新增'}停车点` }">
        <template slot='content'>
          <el-form :model="formData" :rules="formRules" ref="formDrawerRef" label-width="100px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="停车点名称" prop="parkingName">
                  <el-input class="w_300" placeholder="请输入" v-model.trim="formData.parkingName" maxlength="30" show-word-limit></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属片区" prop="regionName">
                  <el-select
                    class="w_300"
                    v-model="formData.regionName"
                    @change="regionChange"
                    placeholder="请选择">
                    <el-option
                      v-for="item in regionOpts"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="缴费模式" prop="chargePattern">
                  <el-select
                    class="w_300"
                    v-model="formData.chargePattern"
                    placeholder="请选择">
                    <el-option
                      v-for="item in chargePatternOpts"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="停车费(元)" prop="parkingCost">
                  <el-input class="w_300" placeholder="请输入" v-model="formData.parkingCost"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="保安" prop="security">
                  <el-select
                    class="w_300"
                    v-model="formData.security"
                    placeholder="请选择">
                    <el-option
                      v-for="item in securityOpts"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="停车模式" prop="parkingPattern">
                  <el-select
                    class="w_300"
                    v-model="formData.parkingPattern"
                    placeholder="请选择">
                    <el-option
                      v-for="item in parkingPatternOpts"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="备注" prop="remake">
                  <el-input class="w_600" type="textarea" placeholder="请输入" v-model.trim="formData.remake" maxlength="100" show-word-limit></el-input>
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
  </div>
</template>
<script lang='ts'>
import { State, Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import {
  SearchTable, CtjtTable, CtjtPagination, CtjtCard
} from '@/components';
import { ParamsType, VueComponentParent } from '@/type';
import { REG_PRICE_OR_ZONE, deepClone } from '@/assets/js/common';
import { drawSearchForm } from '@/assets/js/search_table';
import ctjtPaginationMixins from '@/mixins/pagination';

// 缴费模式
const chargePatternOpts = [
  { id: 1, label: '单车' },
  { id: 2, label: '批量' }
];

// 停车模式
const parkingPatternOpts = [
  { id: 1, label: '白天' },
  { id: 2, label: '夜间' }
];

// 保安
const securityOpts = [
  { id: 0, label: '无' },
  { id: 1, label: '有' }
];

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtCard
  }
})
export default class VehicleBasicsetParkingPlaceMg extends mixins(ctjtPaginationMixins) {
  @State(state => state.base.userInfo) userInfo!: ParamsType;

  @Action('base/queryGroupMechanismData') private queryGroupMechanismData!: (data: any) => any;

  @Action('car/queryParkingManagerList') private queryParkingManagerList!: (data: any) => any;

  @Action('car/saveOrUpdateParkingManager') private saveOrUpdateParkingManager!: (data: any) => any;

  @Action('car/deleteByIdParkingManager') private deleteByIdParkingManager!: (data: any) => any;

  // 缴费模式
  chargePatternOpts = chargePatternOpts

  // 停车模式
  parkingPatternOpts = parkingPatternOpts

  // 保安
  securityOpts = securityOpts

  // 片区
  regionOpts = []

  regionChange(value: any) {
    const list: any[] = this.regionOpts.filter((item: any) => item.name === value);
    this.formData.regionId = list[0].id;
  }

  searchForm = {
    inputList: [
      {
        label: '停车点名称',
        key: 'parkingName',
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
    _this: {},
    loading: true,
    index: true,
    selection: true,
    selectionList: [],
    labels: [
      {
        key: 'regionName',
        label: '片区',
        minWidth: 200,
        showOverflowTooltip: true
      },
      {
        key: 'parkingName',
        label: '停车点名称',
        minWidth: 200,
        showOverflowTooltip: true
      },
      {
        key: 'parkingPattern',
        label: '停车模式',
        render(h: any, params: any) {
          const { parkingPattern } = params.row;
          const _list = parkingPatternOpts.filter((item: any) => item.id === parkingPattern);
          return h('span', _list[0] ? _list[0].label : '');
        }
      },
      {
        key: 'chargePattern',
        label: '收费模式',
        render(h: any, params: any) {
          const { chargePattern } = params.row;
          const _list = chargePatternOpts.filter((item: any) => item.id === chargePattern);
          return h('span', _list[0] ? _list[0].label : '');
        }
      },
      {
        key: 'parkingCost',
        label: '停车费(元)',
      },
      {
        key: '',
        label: '车辆数',
      },
      {
        key: 'createdName',
        label: '添加人',
      },
      {
        key: 'createdTime',
        label: '添加时间',
        minWidth: 160,
      }
    ],
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
    list: []
  }

  handleSelectionChange(val: any[]) {
    this.tableData.selectionList = val;
  }

  // 列表操作回调
  private tableOptionCallback(val: any) {
    const { id } = val;
    if (id === 1) {
      // 新增
      this.jumpDetail();
      return;
    }
    const { selectionList } = this.tableData;
    const _len = selectionList.length;
    if (_len === 0) {
      this.$message.warning('请先勾选一项，再进行操作！');
      return;
    }
    if (id === 2) {
      if (_len > 1) {
        this.$message.warning('只能单选一项进行操作！');
        return;
      }
      // 编辑
      const { 0: item } = selectionList;
      Object.keys(this.formData).forEach(key => {
        this.formData[key] = item[key];
      });
      this.jumpDetail();
    }
    if (id === 3) {
      // 删除
      this.deleteParkingFunc(selectionList);
    }
  }

  // 编辑
  async jumpDetail() {
    // 先请求当前用户驾校下的片区
    const { drivingSchoolId } = this.userInfo;
    const data = await this.queryGroupMechanismData({ pid: drivingSchoolId });
    this.regionOpts = data;
    this.drawer = true;
    this.$nextTick(() => {
      (this.$refs.formDrawerRef as VueComponentParent).clearValidate();
    });
  }

  // 删除
  deleteParkingFunc(list: any[]) {
    this.$confirm('是否删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      const sendData: string[] = [];
      list.forEach((item: any) => {
        sendData.push(item.id);
      });
      await this.deleteByIdParkingManager(sendData);
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
      const body = await this.queryParkingManagerList(sendData);
      const {
        data, current, total
      } = body;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = false;
    }
  }

  // 新增弹窗
  private drawer = false;

  private btnLoading = false;

  close() {
    this.formData = deepClone((this as any)._data._formData);
    this.drawer = false;
  }

  btnSubmit() {
    (this.$refs.formDrawerRef as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        this.saveOrUpdateFunc();
      }
    });
  }

  private _formData = {
    chargePattern: null,
    id: null,
    parkingCost: null,
    parkingName: '',
    parkingPattern: null,
    regionId: null,
    regionName: '',
    remake: '',
    security: 0
  };

  private formData = deepClone(this._formData);

  private formRules: ParamsType = {
    parkingName: [
      { required: true, message: '必填项', trigger: ['change', 'blur'] }
    ],
    regionName: [
      { required: true, message: '必选项', trigger: ['change', 'blur'] }
    ],
    chargePattern: [
      { required: true, message: '必选项', trigger: ['change', 'blur'] }
    ],
    parkingCost: [
      { required: true, message: '必填项', trigger: ['change', 'blur'] },
      { pattern: REG_PRICE_OR_ZONE, message: '范围0-999999,可保留两位小数' }
    ],
    security: [
      { required: true, message: '必选项', trigger: ['change', 'blur'] }
    ],
    parkingPattern: [
      { required: true, message: '必选项', trigger: ['change', 'blur'] }
    ],
  }

  // 新增、修改
  saveOrUpdateFunc() {
    const { formData } = this;
    const { id } = formData;
    const sendData = { ...formData };
    if (!id) delete sendData.id;
    this.saveOrUpdateParkingManager(sendData).then(() => {
      this.$message.success(`${id > 0 ? '修改' : '新增'}成功`);
      this.queryList();
      this.close();
    }).finally(() => {
      this.btnLoading = false;
    });
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
</style>
