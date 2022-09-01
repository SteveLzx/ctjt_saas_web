<template>
  <div class="page">
    <SearchTable :prop-data="localSearchForm"></SearchTable>
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
    <!--新增-->
    <el-drawer
      size="70%"
      :wrapperClosable="false"
      :visible.sync="drawerShow"
      :direction="'rtl'"
      :show-close="false"
    >
      <CtjtCard :prop-data="{ title: '新增' }">
        <template slot="header">
          <span
            style="float: right"
            class="iconfont close_icon"
            @click="handleTableButtonClick"
            >&#xe62b;</span
          >
        </template>
        <template slot="content">
          <el-form
            ref="insert_form"
            :model="formData"
            :rules="formDataRules"
            inline
          >
            <el-form-item label="礼品名称：" class="form_item_wrap" prop="name">
              <el-input
                v-model="formData.name"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="单价：" class="form_item_wrap" prop="amount">
              <el-input v-model="formData.amount" />
            </el-form-item>
            <el-form-item label="库存总数：" class="form_item_wrap" prop="sum">
              <el-input v-model="formData.sum" />
            </el-form-item>
            <el-form-item
              label="适用范围："
              class="form_item_wrap"
              prop="storeIds"
            >
              <el-cascader
                class="w_200"
                placeholder="请选择"
                v-model="formData.storeIds"
                :options="storeOption"
                :props="optionStoreProps"
                :clearable="true"
                collapse-tags
                :show-all-levels="false"
              ></el-cascader>
            </el-form-item>
            <el-form-item class="form_item_wrap" label="备注：" prop="remarks">
              <el-input
                v-model.trim="formData.remarks"
                type="text"
                maxlength="200"
                show-word-limit
                placeholder="请输入，限200字以内"
                style="width: 250px"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                style="margin-right: 10px"
                @click="addFormCallBack"
                :loading="submitLoading"
                >添加</el-button
              >
            </el-form-item>
          </el-form>
          <CtjtTable
            :tableData="addTableData"
            @option-call="addTableOptionCallback"
            @selection-change="addTableSelectionChange"
          >
          </CtjtTable>
        </template>
      </CtjtCard>
    </el-drawer>
    <el-dialog title="编辑" width="700px" :visible.sync="dialogShow">
      <el-form
        label-width="120px"
        label-position="right"
        ref="edit_form"
        :model="formEditData"
        :rules="formEditDataRules"
        :style="{ padding: '0px 40px' }"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="礼品名称："
              class="ctjt_form_item_class"
              prop="name"
            >
              <el-input
                v-model="formEditData.name"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="单价："
              class="ctjt_form_item_class"
              prop="amount"
            >
              <el-input v-model="formEditData.amount" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="库存总数："
              class="ctjt_form_item_class"
              prop="sum"
            >
              <el-input v-model="formEditData.sum" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="已用库存："
              class="ctjt_form_item_class"
              prop="used"
            >
              <el-input v-model="formEditData.used" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="剩余库存："
              class="ctjt_form_item_class"
              prop="surplus"
            >
              <el-input v-model="formEditData.surplus" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="适用范围："
              class="ctjt_form_item_class"
              prop="storeIds"
            >
              <el-cascader
                placeholder="请选择"
                v-model="formEditData.storeIds"
                :options="storeOption"
                :props="optionStoreProps"
                :clearable="true"
                collapse-tags
                :show-all-levels="false"
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              class="ctjt_form_item_class"
              label="备注："
              prop="remarks"
            >
              <el-input
                v-model.trim="formEditData.remarks"
                type="textarea"
                maxlength="200"
                show-word-limit
                :rows="2"
                placeholder="请输入，限200字以内"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-button
            type="primary"
            style="margin-right: 10px"
            @click="editBtnClickFun('submit')"
            :loading="submitLoading"
            >确定</el-button
          >
          <el-button
            style="
              color: #909399;
              background-color: transparent;
              border: 1px solid #dcdfe6;
            "
            @click="editBtnClickFun('cancel')"
            >取消</el-button
          >
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Action, State } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import dayjs from 'dayjs';
import { Watch } from 'vue-property-decorator';
import {
  SearchTable,
  CtjtTable,
  CtjtPagination,
  CtjtCard,
  CtjtForm,
} from '@/components';
import { ParamsType, TableOptionsValue, VueComponentParent } from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import { REG_TWO_FLOAT_NUMBER, REG_ZERO_INTEGER } from '@/assets/js/common';
import ctjtPaginationMixins from '@/mixins/pagination';
import { MARKET_ACTIVITIES_SET_STATUS } from '@/enums';
import ctjtAreaStoreSeachTableMixins from '@/mixins/areaStoreSeachTable';
import store from '@/store';

// 拉取省市区json
const ProvCity = require('@/assets/json/prov.json');

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtCard,
    CtjtForm,
  },
})
export default class MarketGiftSetList extends mixins(
  ctjtPaginationMixins,
  ctjtAreaStoreSeachTableMixins
) {
  @Action('user/queryGroupList') private queryGroupList!: () => ParamsType;

  @Action('sale/queryGiftList') private queryGiftList!: (
    data: any
  ) => ParamsType;

  @Action('sale/batchAddGift') private batchAddGift!: (data: any) => ParamsType;

  @Action('sale/updateGift') private updateGift!: (data: any) => ParamsType;

  @Action('sale/updateGiftStatus') private updateGiftStatus!: (
    data: any
  ) => ParamsType;

  /** 表单搜索 开始 */
  private localSearchForm = {
    inputList: [
      {
        label: '礼品名称',
        key: 'name',
        type: 'text',
        value: '',
        width: 160,
        clearable: true,
        placeholder: '请输入礼品名称',
      },
    ],
    selectList: [
      {
        label: '状态',
        key: 'status',
        value: '',
        width: 160,
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: MARKET_ACTIVITIES_SET_STATUS,
      },
    ],
    datePickerList: [],
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
    options: [
      {
        id: 1,
        label: '新增',
        path: 'btn_add',
      },
      {
        id: 2,
        label: '编辑',
        type: 'primary',
        icon: '&#xe60f;',
        path: 'btn_edit',
      },
      {
        id: 3,
        label: '停用',
        type: 'warning',
        path: 'btn_disable',
      },
      {
        id: 4,
        label: '启用',
        type: 'success',
        path: 'btn_enable',
      },
    ],
    labels: [
      {
        key: 'name',
        label: '礼品名称',
        showOverflowTooltip: true,
      },
      {
        key: 'amount',
        label: '单价(不影响订单价格)',
        minWidth: 140,
      },
      {
        key: 'sum',
        label: '库存总数'
      },
      {
        key: 'used',
        label: '已用库存'
      },
      {
        key: 'surplus',
        label: '剩余库存'
      },
      {
        key: 'storeNames',
        label: '适用范围',
        showOverflowTooltip: true,
        render(h: any, params: any) {
          const { storeNames } = params.row;
          return h('el-popover', {
            props: {
              placement: 'top-start',
              width: '300',
              trigger: 'hover',
              content: storeNames,
            },
            scopedSlots: {
              reference: () => h('p', storeNames),
            },
          });
        },
      },
      {
        key: 'remarks',
        label: '备注',
        showOverflowTooltip: true,
        render(h: any, params: any) {
          const { remarks } = params.row;
          return h('el-popover', {
            props: {
              placement: 'top-start',
              width: '300',
              trigger: 'hover',
              content: remarks,
            },
            scopedSlots: {
              reference: () => h('p', remarks),
            },
          });
        },
      },
      {
        key: 'status',
        label: '状态',
        showOverflowTooltip: true,
        render(h: any, params: any) {
          const { status } = params.row;
          const _list = MARKET_ACTIVITIES_SET_STATUS;
          const _arr = _list.filter((item: any) => item.id === status);
          return h('div', _arr && _arr[0] ? _arr[0].label : '');
        },
      },
      {
        key: 'createTime',
        label: '创建日期',
        showOverflowTooltip: true,
        render(h: any, params: any) {
          const { createdTime } = params.row;
          if (!createdTime || createdTime === undefined) return h('div', '');
          return h('div', dayjs(createdTime).format('YYYY-MM-DD HH:mm:ss'));
        },
      },
      {
        key: 'createdName',
        label: '创建人',
      },
    ],
    list: [],
    selectionList: [], // 勾选的项
  };

  private dialogShow = false;

  private drawerShow = false;

  // 列表操作回调
  private tableOptionCallback(val: TableOptionsValue) {
    const { id } = val;
    const { selectionList } = this.tableData;
    const _len = selectionList.length;
    if (id === 1) {
      this.drawerShow = true;
      return;
    }
    if (id === 2) {
      // 编辑
      if (_len > 1) this.$message.warning('只能单选一项进行操作！');
      if (_len === 0) this.$message.warning('请先勾选数据!');
      if (_len === 1) {
        this.bindformData(selectionList[0]);
        this.dialogShow = true;
      }
    }
    if (id === 3) {
      // 停用
      if (_len >= 1) {
        this._changeStatusFunc(selectionList, 2);
      } else {
        this.$message.warning('请先勾选数据!');
      }
    }
    if (id === 4) {
      // 启用
      if (_len >= 1) {
        this._changeStatusFunc(selectionList, 1);
      } else {
        this.$message.warning('请先勾选数据!');
      }
    }
  }

  // 列表选中每一列切换回调
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
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

  private submitLoading = false;

  // 适用范围list
  private storeOption: any = [];

  // 请求片区门店
  async _queryStoreOption() {
    const wriper: any = [
      {
        id: '0000',
        name: '全部',
        children: [],
      },
    ];
    const list = await this.queryGroupList();
    wriper[0].children = list;
    this.storeOption = list ? wriper : [];
  }

  private optionStoreProps = {
    value: 'id',
    label: 'name',
    children: 'children',
    emitPath: false, // 只展示最后一级
    multiple: true, // 可多选
  };

  /**
   * 递归数组返回想要的值，返回所有匹配到的门店名节点组成的数组
   * @param {Array}           list        要递归的数组
   * @param {String}          childKey    子集字段
   */
  handleGetStoreName(list: any, childKey: string, val: any, result: any = []) {
    list.forEach((item: any) => {
      const { id, name } = item; // 门店
      if (val.includes(id)) {
        result.push(name);
      }
      if (item[childKey] && item[childKey].length > 0) {
        this.handleGetStoreName(item[childKey], childKey, val, result);
      }
    });
    return result;
  }

  // 新增、编辑表单
  private formData: ParamsType = {
    id: '',
    name: '',
    price: null,
    sum: null,
    remarks: '',
    storeIds: [],
    storeNames: [],
    amount: null,
  };

  private formEditData: ParamsType = {
    id: '',
    name: '',
    price: null,
    sum: null,
    remarks: '',
    storeIds: [],
    storeNames: [],
    amount: null,
    used: null,
    surplus: null,
  };

  // 编辑表单验证
  private formEditDataRules = {
    name: [{ required: true, message: '请输入礼品名称', trigger: 'blur' }],
    amount: [
      {
        pattern: REG_TWO_FLOAT_NUMBER,
        message: '请输入最多保留两位小数的数值',
      },
    ],
    used: [
      {
        required: true,
        message: '请输入库存总数',
        trigger: 'blur',
      },
    ],
    sum: [
      { required: true, message: '请输入库存总数', trigger: 'blur' },
      {
        pattern: REG_ZERO_INTEGER,
        message: '请输入正整数',
      },
      {
        validator: (rule: any, value: any, callback: any) => {
          if (Number(value) < this.formEditData.used) {
            callback(new Error('库存总数不可小于已用库存'));
          }
          callback();
        },
      }
    ],
    storeIds: [
      { required: true, message: '请选择适用范围', trigger: '[blur,change]' },
    ],
  };

  // 新增表单验证
  private formDataRules = {
    name: [{ required: true, message: '请输入礼品名称', trigger: 'blur' }],
    amount: [
      {
        pattern: REG_TWO_FLOAT_NUMBER,
        message: '请输入最多保留两位小数的数值',
      },
    ],
    sum: [
      { required: true, message: '请输入库存总数', trigger: 'blur' },
      {
        pattern: REG_ZERO_INTEGER,
        message: '请输入正整数',
      },
    ],
    storeIds: [
      { required: true, message: '请选择适用范围', trigger: '[blur,change]' },
    ],
  };

  // 新增礼品表格配置
  private addTableData: ParamsType = {
    _this: {},
    loading: false,
    selection: true,
    index: false,
    options: [
      {
        id: 1,
        label: '删除',
        type: 'danger',
      },
      {
        id: 2,
        label: '保存',
        type: 'success',
      },
      {
        id: 3,
        label: '取消',
        type: 'info',
      },
    ],
    labels: [
      {
        key: 'name',
        label: '礼品名称',
        minWidth: 120,
        showOverflowTooltip: true,
      },
      {
        key: 'amount',
        label: '单价（不影响订单价格）',
        minWidth: 140,
      },
      {
        key: 'sum',
        label: '库存总数',
        minWidth: 90,
      },
      {
        key: 'storeIds',
        label: '适用范围',
        minWidth: 300,
        render(h: any, params: any) {
          const { storeIds } = params.row;
          if (Array.isArray(storeIds)) {
            const _list: string[] = [];
            const that = params._self.tableData._this;
            const storeNames: [] = that.handleGetStoreName(
              that.storeOption[0].children,
              'children',
              storeIds
            );
            const _text = storeNames.join('，');
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
          return h('span', '-');
        },
      },
      {
        key: 'remarks',
        label: '备注',
        minWidth: 150,
        render(h: any, params: any) {
          const { remarks } = params.row;
          return h('el-popover', {
            props: {
              placement: 'top-start',
              width: '300',
              trigger: 'hover',
              content: remarks,
            },
            scopedSlots: {
              reference: () => h('p', remarks),
            },
          });
        },
      },
    ],
    list: [],
    selectionList: [], // 勾选的项
  };

  /** 新增表单添加事件 */
  addFormCallBack() {
    (this.$refs.insert_form as VueComponentParent).validate(
      (valid: boolean) => {
        if (valid) {
          const { addTableData, formData } = this;
          const sendData = {
            ...formData,
            idi: addTableData.list ? this._getMax(addTableData.list) + 1 : 1,
          };
          this.addTableData.list.push(sendData);
          this.$message.success('添加成功');
          (this.$refs.insert_form as VueComponentParent).resetFields(); // 清空表单
        } else {
          this.$message.warning('您的信息填写有误，请仔细检查并修改！');
        }
      }
    );
  }

  /** 获取最大的id */
  _getMax(array: []) {
    let max = 0;
    array.map((obj: any) => {
      if (obj.idi > max) max = obj.idi;
      return max;
    });
    return max;
  }

  /** 新增列表操作回调 */
  private addTableOptionCallback(val: TableOptionsValue) {
    const { selectionList } = this.addTableData;
    const idList: Array<number> = [];
    if (selectionList) {
      selectionList.forEach((item: any) => {
        const _item = item;
        idList.push(_item.idi);
      });
    }
    const _len = selectionList ? selectionList.length : 0;
    const { id } = val;
    if (id === 1) {
      // 删除
      if (_len >= 1) {
        this.addTableData.list = this.addTableData.list.filter(
          (item: any) => !idList.includes(item.idi)
        );
        this.$message.success('删除成功');
      } else {
        this.$message.warning('请先选择数据！');
      }
    }
    // 保存
    if (id === 2) {
      this.handleTableButtonClick('submit');
    }
    if (id === 3) {
      // 取消
      this.handleTableButtonClick('cancel');
    }
  }

  // 新增列表选中每一列切换回调
  private addTableSelectionChange(val: []) {
    this.addTableData.selectionList = val;
  }

  /** 新增礼品 */
  private handleTableButtonClick(key?: string) {
    if (key === 'submit') {
      const { list } = this.addTableData;
      const sendData = [...list];
      if (sendData && sendData.length > 0) {
        this.batchAddGift(sendData).then((res: any) => {
          this.$message.success('新增成功');
          (this.$refs.insert_form as VueComponentParent).resetFields(); // 清空表单
          this.drawerShow = false;
          this.addTableData.list = [];
          this.paginationData.current = 1;
          this.queryList();
        });
      } else {
        this.$message.warning('请先添加礼品信息！');
      }
    } else {
      // 清空表单，关闭抽屉
      (this.$refs.insert_form as VueComponentParent).resetFields(); // 清空表单
      this.drawerShow = false;
      this.addTableData.list = [];
    }
  }

  /** 绑定编辑表单数据 */
  private bindformData(item: any) {
    this.formEditData.id = item.id;
    this.formEditData.used = item.used;
    this.formEditData.name = item.name;
    this.formEditData.price = item.price;
    this.formEditData.amount = item.amount;
    this.formEditData.storeIds = item.storeIds;
    this.formEditData.sum = item.sum;
    this.formEditData.surplus = item.surplus;
    this.formEditData.remarks = item.remarks;
  }

  private editBtnClickFun(key: string) {
    if (key === 'submit') {
      const { formEditData } = this;
      const sendData = formEditData;
      (this.$refs.edit_form as VueComponentParent).validate(
        (valid: boolean) => {
          if (valid) {
            this.updateGift(sendData)
              .then(() => {
                this.paginationData.current = 1;
                this.queryList();
                this.$message.success('保存成功！');
              })
              .finally(() => {
                this.dialogShow = false;
                (this.$refs.edit_form as VueComponentParent).resetFields(); // 清空表单
              });
          } else {
            this.$message.warning('您的信息填写有误，请仔细检查并修改！');
          }
        }
      );
    } else {
      (this.$refs.edit_form as VueComponentParent).resetFields(); // 清空表单
      this.dialogShow = false;
    }
  }

  /** @description 启用/停用 */
  _changeStatusFunc(selectionList: any, status: number) {
    const ids: any = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      ids.push(_item.id);
    });
    const sendData = { ids, status };
    this.updateGiftStatus(sendData)
      .then(() => {
        const _msg = status === 1 ? '启用' : '停用';
        this.$message.success(`礼品已${_msg}！`);
      })
      .finally(() => {
        this.paginationData.current = 1;
        this.queryList();
      });
  }

  /** 请求处理 */
  async queryList() {
    const { localSearchForm, paginationData } = this;
    const sendData = drawSearchForm(localSearchForm, paginationData);
    const body = await this.queryGiftList(sendData);
    const { data, current, total } = body;
    this.tableData.list = data;
    this.paginationData.current = current;
    this.paginationData.total = total;
    this.tableData.loading = false;
  }

  /** 生命周期函数 */
  async mounted() {
    this.tableData._this = this;
    this.addTableData._this = this;
    this.queryList();
  }

  perm = {};

  async created() {
    this._queryStoreOption();
    const permObj = await this.$getPerm(
      this,
      this.tableData.options,
      this.localSearchForm.buttonList
    );
    this.tableData.options = permObj.tablePerm;
    this.localSearchForm.buttonList = permObj.searchPerm;
    this.perm = permObj.perm;
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-drawer__header {
  margin-bottom: 0;
}
::v-deep .el-drawer__body {
  overflow: auto;
  padding: 0 20px 20px;
}
.close_icon {
  cursor: pointer;
}
.form_item_wrap {
  ::v-deep .el-form-item__label {
    font-weight: bold;
  }
}
.ctjt_form_item_class {
  width: 100%;
  .el-cascader {
    width: 100%;
  }
  ::v-deep .el-form-item__label {
    font-weight: bold;
  }
}
</style>
