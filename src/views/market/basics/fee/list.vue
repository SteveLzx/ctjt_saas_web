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
    <!-- 新增，编辑-弹窗 -->
    <el-drawer
      :visible="showDetail"
      :withHeader="false"
      :show-close="false"
      :size="'80%'"
      :direction="'rtl'">
      <el-container style="height: 100%">
        <el-main>
          <CtjtCard :prop-data="{ title: '新增/编辑基础费用' }">
            <template #content>
              <el-form ref="basicsFeeForm" :model="formData" :rules="formRules" label-width="130px">
                <el-row :gutter="4">
                  <el-col :span="12">
                    <el-form-item label="费用编码：" class="ctjt_form_item_class" prop="code">
                      <el-input class="w_200" v-model="formData.code" placeholder="请输入" maxlength="20" show-word-limit :disabled="isEdit"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="费用名称" class="ctjt_form_item_class" prop="name">
                      <el-input class="w_200" v-model="formData.name" placeholder="请输入" maxlength="20" show-word-limit :disabled="isEdit"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="4">
                  <el-col :span="12">
                    <el-form-item label="金额" class="ctjt_form_item_class" prop="amount">
                      <el-input class="w_200" v-model="formData.amount" placeholder="请输入" :disabled="isEdit">
                        <template slot="append">元</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="适用车型" class="ctjt_form_item_class" prop="carModel">
                      <el-select class="w_200" v-model="formData.carModel" placeholder="请选择" clearable multiple :disabled="isEdit">
                        <el-option v-for="(item, index) in motorcycleTypeList" :key="index" :label="item.label" :value="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="4">
                  <el-col :span="12">
                    <el-form-item label="核销方式" class="ctjt_form_item_class" prop="verificationType">
                      <el-select class="w_200" v-model="formData.verificationType" placeholder="请选择" :disabled="isEdit">
                        <el-option v-for="(item, index) in writeOffList" :key="index" :label="item.label" :value="item.id"> </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="状态" class="ctjt_form_item_class" prop="status">
                      <el-select class="w_200" v-model="formData.status" placeholder="请选择" :disabled="isEdit">
                        <el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </template>
          </CtjtCard>
        </el-main>
        <el-footer>
          <el-row type="flex" justify="center">
            <el-button type="info" @click="balaceCancel">取消</el-button>
            <el-button v-if="!isEdit" type="primary" style="margin-left: 32px;" :loading='submitLoading' @click="balaceSubmit">保存</el-button>
          </el-row>
        </el-footer>
      </el-container>
    </el-drawer>
  </div>
</template>
<script lang="ts">
import { Action, State } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import {
  SearchTable, CtjtTable, CtjtPagination, CtjtCard
} from '@/components';
import { ParamsType, TableOptionsValue, VueComponentParent } from '@/type';
import { MARKET_CLASS_FEE_STATUS, MARKET_WRITE_OFF_TYPE, MARKET_MOTORCYCLE_TYPE } from '@/enums';
import { REG_PRICE } from '@/assets/js/common';
import { drawSearchForm } from '@/assets/js/search_table';
import ctjtPaginationMixins from '@/mixins/pagination';

@Component({
  components: {
    SearchTable, CtjtTable, CtjtPagination, CtjtCard
  }
})
export default class MarketBasicsFeeList extends mixins(ctjtPaginationMixins) {
  @Action('base/queryGroupMechanismData') private queryGroupMechanismData!: (data: any) => any;

  @Action('goods/queryFeeList') private queryFeeList!: (data: any) => ParamsType;

  @Action('goods/postFee') private postFee!: (data: any) => ParamsType;

  @Action('goods/putFee') private putFee!: (data: any) => ParamsType;

  @State(state => state.base.userInfo) userInfo: any;

  private statusList = MARKET_CLASS_FEE_STATUS;

  private writeOffList = MARKET_WRITE_OFF_TYPE;

  private motorcycleTypeList = MARKET_MOTORCYCLE_TYPE;

  /** 表单搜索 开始 */
  private searchForm = {
    inputList: [
      {
        label: '费用编码',
        key: 'code',
        type: 'text',
        value: '',
        width: 160,
        clearable: true,
        placeholder: '请输入费用编码',
      },
      {
        label: '费用名称',
        key: 'name',
        type: 'text',
        value: '',
        width: 160,
        clearable: true,
        placeholder: '请输入费用名称',
      }
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

  // 点击搜索回调方法
  public searchTableCallBack(key: string) {
    if (key === 'search') {
      this.paginationData.current = 1;
      this.queryList();
    }
  }

  /** 表单搜索 结束 */

  /** 列表配置 开始 */
  private tableData: ParamsType = {
    _this: {},
    loading: false,
    selection: true,
    index: true,
    options: [
      {
        id: 4,
        label: '新增',
        path: 'btn_add'
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
        label: '启用',
        type: 'warning',
        icon: '&#xe615;',
        path: 'btn_enable'
      },
      {
        id: 3,
        label: '停用',
        type: 'warning',
        icon: '&#xe617;',
        path: 'btn_disable'
      },
    ],
    labels: [
      {
        key: 'code',
        label: '费用编码',
        minWidth: 140,
        render(h: any, params: any) {
          const { code } = params.row;
          return h('el-link', {
            props: {
              type: 'primary',
              underline: false
            },
            on: {
              click: () => {
                params._self.tableData._this.jumpDetail(params.row, '1');
              }
            }
          },
          code);
        }
      },
      {
        key: 'name',
        label: '费用名称',
      },
      {
        key: 'carModel',
        label: '适用车型',
        render(h: any, params: any) {
          const { carModel } = params.row;
          if (!carModel) {
            return h('span', '不限');
          }
          const _list = JSON.parse(carModel);
          const _arr: string[] = [];
          _list.forEach((item: any) => _arr.push(item.label));
          return h('span', _arr.join('，'));
        },
      },
      {
        key: 'amount',
        label: '金额(元)',
      },
      {
        key: 'verificationType',
        label: '核销方式',
        render(h: any, params: any) {
          const { verificationType } = params.row;
          const _list = MARKET_WRITE_OFF_TYPE;
          const _arr = _list.filter((item: any) => item.id === verificationType);
          if (_arr.length > 0) {
            return h('span', _arr[0].label);
          }
          return h('span', '-');
        },
      },
      {
        key: 'status',
        label: '状态',
        render(h: any, params: any) {
          const { status } = params.row;
          const _list = MARKET_CLASS_FEE_STATUS;
          const _arr = _list.filter((item: any) => item.id === status);
          if (_arr.length > 0) {
            return h('span', _arr[0].label);
          }
          return h('span', '-');
        },
      },
    ],
    list: [],
    selectionList: [], // 勾选的项
  }

  // 列表操作回调
  private tableOptionCallback(val: TableOptionsValue) {
    const { id } = val;
    if (id === 4) {
      this.showDetail = true;
      return;
    }
    // 子项选中列表，必须是单选
    const { selectionList } = this.tableData;
    const _len = selectionList.length;
    if (_len > 1) this.$message.warning('只能单选一项进行操作！');
    if (_len === 0) this.$message.warning('请先勾选一项，再进行操作！');
    if (_len === 1) {
      if (id === 1) {
        // 编辑
        this.jumpDetail(selectionList[0], '');
      }
      if (id === 2 || id === 3) {
        this.upDataStatusFunc(selectionList[0], id);
      }
    }
  }

  // 列表选中每一列切换回调
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  // 列表单项点击
  private jumpDetail(val: ParamsType, type: string) {
    this.isEdit = type === '1';
    // 深拷贝一份数据
    this._setFormDataFunc(val);
    this.showDetail = true;
  }

  // 上下架商品
  private upDataStatusFunc(val: ParamsType, type: number) {
    const { status } = val;
    if ((status === 1 && type === 2) || (status !== 1 && type === 3)) {
      this.$message.warning(`${type === 2 ? '当前状态已经是启用' : '当前状态已经是停用'}`);
      return;
    }
    this.$confirm(`${status === 1 ? '状态修改为停用' : '状态修改为启用'}, 是否继续?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      const sendData = JSON.parse(JSON.stringify(val));
      sendData.status = sendData.status === 1 ? 0 : 1;
      await this.putFee(sendData);
      this.$message.success('修改成功！');
      await this.queryList();
    });
  }
  /** 列表配置 结束 */

  /** 列表分页 开始 */

  public tableSizeChange(val: number) {
    this.paginationData.pageSize = val;
    this.paginationData.current = 1;
    this.queryList();
  }

  public tableCurrentChange(val: number) {
    this.paginationData.current = val;
    this.queryList();
  }

  /** 列表分页 结束 */

  /** 新增 编辑 弹窗 开始 */
  private showDetail = false; // 展示弹窗

  private isEdit = false; // 可编辑

  private submitLoading = false; // 提交loading

  // 重置表单
  private _resetFormFunc() {
    this.formData = {
      amount: '',
      carModel: [],
      code: '',
      drivingSchoolId: '',
      id: null,
      name: '',
      status: null,
      verificationType: null,
    };
  }

  // 配置表单
  private formData: ParamsType = {
    amount: '', // 金额
    carModel: [], // 适用车型 [{id:1,label：C2}],不限为空
    code: '', // 费用编码
    drivingSchoolId: '', // 驾校id
    id: null, // id
    name: '', // 费用名称
    status: null, // 状态：1：启用 0：停用
    verificationType: null, // 核销方式 1：手工核销 2：自动核销
  }

  // 表单校验规则
  private formRules = {
    code: [{ required: true, message: '请输入费用编码', trigger: ['change', 'blur'] }],
    name: [{ required: true, message: '请输入费用名称', trigger: ['change', 'blur'] }],
    amount: [
      { required: true, message: '请输入金额', trigger: ['change', 'blur'] },
      { pattern: REG_PRICE, message: '范围1-999999,可保留两位小数' }
    ],
    status: [{ required: true, message: '请选择状态', trigger: 'change' }],
    verificationType: [{ required: true, message: '请选择核销方式', trigger: 'change' }],
    carModel: [{ required: true, message: '请选择适用车型', trigger: 'change' }]
  }

  // 请求回来处理数据
  _setFormDataFunc(val: ParamsType) {
    // 深拷贝一份
    const _data = JSON.parse(JSON.stringify(val));
    Object.keys(this.formData).forEach(key => {
      if (key === 'carModel') {
        if (!_data[key]) {
          this.formData[key] = [];
        } else {
          const _list = JSON.parse(_data[key]);
          const _arr: any[] = [];
          _list.forEach((item: any) => _arr.push(item.id));
          this.formData[key] = _arr;
        }
      } else {
        this.formData[key] = _data[key];
      }
    });
  }

  // 提交表单前处理数据
  _specialHandleFormData() {
    // 深拷贝一份数据
    const sendData = JSON.parse(JSON.stringify(this.formData));
    const { carModel } = sendData;
    const _carModel: any = [];
    this.motorcycleTypeList.forEach(item => {
      const { id, label } = item;
      if (carModel.includes(id)) {
        _carModel.push({ id, label });
      }
    });
    sendData.carModel = JSON.stringify(_carModel);
    return sendData;
  }

  // 取消提交
  private balaceCancel() {
    this.showDetail = false; // 收起弹窗
    this.submitLoading = false; // 重置提交
    this.isEdit = false;
    this._resetFormFunc();
    (this.$refs.basicsFeeForm as VueComponentParent).resetFields(); // 重置表单
  }

  // 确认提交
  private balaceSubmit() {
    (this.$refs.basicsFeeForm as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        this.submitLoading = true;
        const { drivingSchoolId } = this.userInfo;
        const sendData = this._specialHandleFormData();
        if (sendData.id) {
          this.putFee(sendData).then(() => {
            this.queryList();
            this.$message.success('修改成功');
            this.balaceCancel();
          }).finally(() => {
            this.submitLoading = false;
          });
        } else {
          delete sendData.id; // 新增删除id
          sendData.drivingSchoolId = drivingSchoolId;
          this.postFee(sendData).then(() => {
            this.queryList();
            this.$message.success('新增成功');
            this.balaceCancel();
          }).finally(() => {
            this.submitLoading = false;
          });
        }
      }
    });
  }
  /** 新增 编辑 弹窗 结束 */

  /** 请求处理 */
  async queryList() {
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const sendData = {
      ..._data,
    };
    const body = await this.queryFeeList(sendData);
    const {
      data, current, total
    } = body;
    this.tableData.list = data;
    this.paginationData.current = current;
    this.paginationData.total = total;
    this.tableData.loading = false;
  }

  /** 生命周期函数 */
  async mounted() {
    this.tableData._this = this;
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
