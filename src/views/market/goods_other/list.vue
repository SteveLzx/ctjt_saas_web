<template>
  <div class="page">
    <SearchTable :prop-data="searchForm"></SearchTable>
    <CtjtTable
      :tableData="tableData"
      @option-call="tableOptionCallback"
      @selection-change="tableSelectionChange"
      @sort-change="tableSortChange"
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
          <CtjtCard :prop-data="{ title: '新增/编辑其他商品' }">
            <template #content>
              <el-form ref="goodsOtherForm" :model="formData" :rules="formRules" label-width="130px">
                <el-row :gutter="16">
                  <el-col :span="12">
                    <el-form-item style="width: 100%" label="业务类型" class="ctjt_form_item_class" prop="type">
                      <el-select style="width: 100%" v-model="formData.type" placeholder="请选择" :disabled="isEdit" @change="handleChangeType">
                        <el-option v-for="(item, index) in businessTypeOpts" :key="index" :label="item.label" :value="item.id"> </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item style="width: 100%" label="费用科目" class="ctjt_form_item_class" prop="feeName" v-if="formData.type">
                      <template v-if="formData.type !== 6">
                        <el-select style="width: 100%" v-model="formData.feeName" placeholder="请选择" :disabled="isEdit || (formData.type >= 1 && formData.type <= 4)">
                          <el-option v-for="(item, index) in feeNameOpts" :key="index" :label="item.label" :value="item.label"> </el-option>
                        </el-select>
                      </template>
                      <template v-else>
                        <el-select style="width: 100%" v-model="formData.feeName" placeholder="请选择" :disabled="isEdit">
                          <el-option v-for="(item, index) in platformSubsidyOpts" :key="index" :label="item.label" :value="item.label"> </el-option>
                        </el-select>
                      </template>
                      <span style="color: red;">如需增加【费用科目】，请联系后台管理员</span>
                    </el-form-item>
                    <!-- <el-form-item style="width: 100%" label="商品编码" class="ctjt_form_item_class" prop="code">
                      <el-input v-model="formData.code" placeholder="请输入" maxlength="20" show-word-limit :disabled="isEdit"></el-input>
                    </el-form-item> -->
                  </el-col>
                </el-row>
                <el-row :gutter="16">
                  <el-col :span="12">
                    <template v-if="formData.type === 1">
                      <el-form-item style="width: 100%" label="新车型" class="ctjt_form_item_class" prop="newModel">
                        <el-select style="width: 100%" v-model="formData.newModel" placeholder="请选择" :disabled="isEdit" @change="handleChangeNewModel">
                          <el-option v-for="(item, index) in carModelList" :key="index" :label="item.label" :value="item.label"> </el-option>
                        </el-select>
                      </el-form-item>
                    </template>
                    <template v-if="formData.type === 2">
                      <el-form-item style="width: 100%" label="原班别" class="ctjt_form_item_class" prop="oldModel">
                        <el-select style="width: 100%" v-model="formData.oldModel" placeholder="请选择" :disabled="isEdit" @change="handleChangeNewClassModel">
                          <el-option v-for="(item, index) in classesOpts" :key="index" :label="item.name" :value="item.name"> </el-option>
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item style="width: 100%" label="商品名称" class="ctjt_form_item_class" prop="name">
                      <el-input
                        v-model="formData.name"
                        placeholder="自动生成如：转车型新车型C2"
                        maxlength="20"
                        show-word-limit
                        :disabled="isEdit || formData.type === 1 || formData.type === 2"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="16">
                  <el-col :span="12"  v-if="formData.type === 2">
                    <el-form-item style="width: 100%" label="新班别" class="ctjt_form_item_class" prop="newModel">
                      <el-select style="width: 100%" v-model="formData.newModel" placeholder="请选择" :disabled="isEdit" @change="handleChangeNewClassModel">
                        <el-option v-for="(item, index) in classesOpts" :key="index" :label="item.name" :value="item.name"> </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item style="width: 100%" label="价格" class="ctjt_form_item_class" prop="price">
                      <el-input v-model="formData.price" placeholder="请输入" :disabled="isEdit">
                        <template slot="append">元</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="16">
                  <el-col :span="12">
                    <el-form-item style="width: 100%" label="状态" class="ctjt_form_item_class" prop="status">
                      <el-select style="width: 100%" v-model="formData.status" placeholder="请选择" :disabled="isEdit">
                        <el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :span="12">
                    <el-form-item style="width: 100%" label="核销方式" class="ctjt_form_item_class" prop="verificationMode">
                      <el-select style="width: 100%" v-model="formData.verificationMode" placeholder="请选择" :disabled="isEdit">
                        <el-option v-for="(item, index) in writeOffList" :key="index" :label="item.label" :value="item.id"> </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col> -->
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
import { MARKET_UP_DOWN_STATUS, MARKET_WRITE_OFF_TYPE, MARKET_MOTORCYCLE_TYPE } from '@/enums';
import { deepClone, REG_PRICE_OR_ZONE } from '@/assets/js/common';
import { drawSearchForm } from '@/assets/js/search_table';
import { businessTypeOpts, feeNameOpts, platformSubsidyOpts } from '@/views/market/_enums';
import ctjtPaginationMixins from '@/mixins/pagination';

@Component({
  components: {
    SearchTable, CtjtTable, CtjtPagination, CtjtCard
  }
})
export default class MarketOtherGoodsList extends mixins(ctjtPaginationMixins) {
  @Action('base/queryGroupMechanismData') private queryGroupMechanismData!: (data: any) => any;

  @Action('goods/queryClassesInfoList') private queryClassesInfoList!: (data: any) => ParamsType;

  @Action('goods/queryProductExtList') private queryProductExtList!: (data: any) => ParamsType;

  @Action('goods/savaProductExtList') private savaProductExtList!: (data: any) => ParamsType;

  @Action('goods/putProductExtList') private putProductExtList!: (data: any) => ParamsType;

  @State(state => state.base.userInfo) userInfo: any;

  // 上下架状态
  private statusList = MARKET_UP_DOWN_STATUS;

  // 核销方式
  private writeOffList = MARKET_WRITE_OFF_TYPE;

  private businessTypeOpts = businessTypeOpts;

  private carModelList = MARKET_MOTORCYCLE_TYPE;

  private classesOpts: ParamsType = [];

  // 费用名称
  private feeNameOpts = feeNameOpts;

  private platformSubsidyOpts = platformSubsidyOpts;

  /**
   * @description 业务类型切换
   */
  private handleChangeType(val: number) {
    if (val === 1 || val === 2) {
      this.formData.newModel = '';
      this.formData.oldModel = '';
      this.formData.name = '';
    }

    let _text = '';
    if (val === 1) _text = '转车型费';
    if (val === 2) _text = '转班别费';
    if (val === 3) _text = '过考保障费';
    if (val === 4) _text = '延期学车费';
    this.formData.feeName = _text;
  }

  /**
   * @description 新车型切换
   */
  private handleChangeNewModel(val: string) {
    this.formData.name = `转车型新车型${val}`;
  }

  /**
   * @description 新班别切换
   */
  private handleChangeNewClassModel(val: string) {
    const { newModel, oldModel } = this.formData;
    console.log(newModel, oldModel);
    if (newModel && oldModel) {
      this.formData.name = `转班别${oldModel}-${newModel}`;
    }
  }

  /** 表单搜索 开始 */
  private searchForm = {
    inputList: [
      // {
      //   label: '商品编码',
      //   key: 'code',
      //   type: 'text',
      //   value: '',
      //   width: 160,
      //   clearable: true,
      //   placeholder: '请输入商品编码',
      // },
      {
        label: '商品名称',
        key: 'name',
        type: 'text',
        value: '',
        width: 200,
        clearable: true,
        placeholder: '请输入商品名称',
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
    loading: true,
    selection: true,
    index: true,
    list: [],
    selectionList: [], // 勾选的项
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
        label: '上架',
        type: 'warning',
        icon: '&#xe615;',
        path: 'btn_upper'
      },
      {
        id: 3,
        label: '下架',
        type: 'warning',
        icon: '&#xe617;',
        path: 'btn_lower'
      },
    ],
    labels: [
      // {
      //   key: 'code',
      //   label: '商品编码',
      //   minWidth: 140,
      //   render(h: any, params: any) {
      //     const { code } = params.row;
      //     return h('el-link', {
      //       props: {
      //         type: 'primary',
      //         underline: false
      //       },
      //       on: {
      //         click: () => {
      //           params._self.tableData._this.jumpDetail(params.row, '1');
      //         }
      //       }
      //     },
      //     code);
      //   }
      // },
      {
        key: 'type',
        label: '类型',
        sortable: 'custom',
        render(h: any, params: any) {
          const { type } = params.row;
          const _list = businessTypeOpts;
          const _arr = _list.filter((item: any) => item.id === type);
          if (_arr.length > 0) {
            return h('span', _arr[0].label);
          }
          return h('span', '');
        },
      },
      {
        key: 'name',
        label: '商品名称',
        minWidth: 160,
        sortable: 'custom',
        render(h: any, params: any) {
          const { name } = params.row;
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
          name);
        }
      },
      {
        key: 'price',
        label: '价格(元)',
        sortable: 'custom',
        isPrice: true
      },
      {
        key: 'feeName',
        label: '费用科目',
        sortable: 'custom'
      },
      // {
      //   key: 'verificationMode',
      //   label: '核销方式',
      //   render(h: any, params: any) {
      //     const { verificationMode } = params.row;
      //     const _list = MARKET_WRITE_OFF_TYPE;
      //     const _arr = _list.filter((item: any) => item.id === verificationMode);
      //     if (_arr.length > 0) {
      //       return h('span', _arr[0].label);
      //     }
      //     return h('span', '');
      //   },
      // },
      {
        key: 'status',
        label: '状态',
        sortable: 'custom',
        render(h: any, params: any) {
          const { status } = params.row;
          const _list = MARKET_UP_DOWN_STATUS;
          const _arr = _list.filter((item: any) => item.id === status);
          if (_arr.length > 0) {
            return h('span', _arr[0].label);
          }
          return h('span', '-');
        },
      },
    ]
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

  // 排序参数对象
  sortSearchFormDeep: any = {
    typeSort: 0, // 类型排序
    nameSort: 0, // 商品名称排序
    priceSort: 0, // 价格排序
    feeNameSort: 0, // 费用科目排序
    statusSort: 0, // 状态排序
  }

  sortSearchForm = deepClone(this.sortSearchFormDeep);

  // 列表排序回调
  tableSortChange(data: any) {
    const { prop, order } = data;
    const returnStatusFunc = (res: any) => {
      if (res === 'ascending') return 1;
      if (res === 'descending') return 2;
      return 0;
    };
    this.sortSearchForm = deepClone(this.sortSearchFormDeep);
    switch (prop) {
      case 'price':
        this.sortSearchForm.priceSort = returnStatusFunc(order);
        break;
      case 'name':
        this.sortSearchForm.nameSort = returnStatusFunc(order);
        break;
      case 'type':
        this.sortSearchForm.typeSort = returnStatusFunc(order);
        break;
      case 'feeName':
        this.sortSearchForm.feeNameSort = returnStatusFunc(order);
        break;
      case 'status':
        this.sortSearchForm.statusSort = returnStatusFunc(order);
        break;
      default:
        break;
    }
    this.queryList();
  }

  // 列表单项点击
  private jumpDetail(val: ParamsType, type: string) {
    this.isEdit = type === '1';
    // 深拷贝一份数据
    const _data = JSON.parse(JSON.stringify(val));
    Object.keys(this.formData).forEach(key => {
      this.formData[key] = _data[key];
    });
    this.showDetail = true;
  }

  // 上下架商品
  private upDataStatusFunc(val: ParamsType, type: number) {
    const { status } = val;
    if ((status === 1 && type === 2) || (status !== 1 && type === 3)) {
      this.$message.warning(`${type === 2 ? '当前状态已经是上架' : '当前状态已经是下架'}`);
      return;
    }
    this.$confirm(`${status === 1 ? '状态修改为下架' : '状态修改为上架'}, 是否继续?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      const sendData = JSON.parse(JSON.stringify(val));
      sendData.status = sendData.status === 1 ? 0 : 1;
      await this.putProductExtList(sendData);
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
      code: '',
      id: null,
      name: '',
      price: '',
      status: null,
      verificationMode: null,
      type: null,
      newModel: '',
      oldModel: '',
      feeName: ''
    };
  }

  // 表单配置
  private formData: ParamsType = {
    code: '', // 商品编码
    id: null, // 主键
    name: '', // 商品名称
    price: '', // 商品价格
    status: null, // 状态 0:下架 1:上架
    verificationMode: null, // 核销方式 1:手动核销 2:自动核销
    type: null,
    newModel: '',
    oldModel: '',
    feeName: ''
  }

  // 表单验证
  private formRules = {
    feeName: [{ required: true, message: '请选择费用科目', trigger: ['change', 'blur'] }],
    name: [{ required: true, message: '请输入商品名称', trigger: ['change', 'blur'] }],
    price: [
      { required: true, message: '请输入价格', trigger: ['change', 'blur'] },
      { pattern: REG_PRICE_OR_ZONE, message: '范围0-999999,可保留两位小数' }
    ],
    status: [{ required: true, message: '请选择状态', trigger: ['change', 'blur'] }],
    // verificationMode: [{ required: true, message: '请选择核销方式', trigger: ['change', 'blur'] }],
    type: [{ required: true, message: '请选择业务类型', trigger: ['change', 'blur'] }],
    newModel: [{ required: true, message: '必选项', trigger: ['change', 'blur'] }],
    oldModel: [{ required: true, message: '必选项', trigger: ['change', 'blur'] }],
  };

  // 取消提交
  private balaceCancel() {
    this.showDetail = false; // 收起弹窗
    this.submitLoading = false; // 重置提交
    this.isEdit = false;
    this._resetFormFunc();
    (this.$refs.goodsOtherForm as VueComponentParent).resetFields(); // 重置表单
  }

  // 确认提交
  private balaceSubmit() {
    (this.$refs.goodsOtherForm as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        const sendData = JSON.parse(JSON.stringify(this.formData));
        const { newModel, oldModel, type } = sendData;
        if (type === 2 && newModel === oldModel) {
          this.$message.warning('新班别不可与原班别相同！');
          return;
        }
        this.submitLoading = true;
        if (sendData.id) {
          this.putProductExtList(sendData).then((res: any) => {
            this.queryList();
            this.$message.success('修改成功');
            this.balaceCancel();
          }).finally(() => {
            this.submitLoading = false;
          });
        } else {
          delete sendData.id; // 新增删除id
          this.savaProductExtList(sendData).then((res: any) => {
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
    const { searchForm, paginationData, sortSearchForm } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const sendData = {
      ..._data,
      ...sortSearchForm
    };
    const body = await this.queryProductExtList(sendData);
    const {
      data, current, total
    } = body;
    this.tableData.list = data;
    this.paginationData.current = current;
    this.paginationData.total = total;
    this.tableData.loading = false;
  }

  async queryClassesInfoListFunc() {
    const sendData = { type: 1 };
    this.queryClassesInfoList(sendData).then((res: any) => {
      this.classesOpts = res;
    });
  }

  /** 生命周期函数 */
  async mounted() {
    this.tableData._this = this;
    this.queryClassesInfoListFunc();
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
