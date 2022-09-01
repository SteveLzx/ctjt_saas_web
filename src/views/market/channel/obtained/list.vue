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
    <el-dialog
      :show-close="false"
      :visible.sync="showDetail"
      width="30%"
      :before-close="balaceCancel">
      <el-form ref="obtainedForm" :model="formData" :rules="formRules" label-width="130px">
        <el-row>
          <el-col>
            <el-form-item label="途径名称" class="ctjt_form_item_class" prop="name">
              <el-input class="w_200" v-model.trim="formData.name" placeholder="请输入" maxlength="20" show-word-limit :disabled="isEdit"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="formData.id > 0">
          <el-col>
            <el-form-item label="状态" class="ctjt_form_item_class" prop="status">
              <el-radio-group v-model="formData.status" :disabled="isEdit">
                <el-radio v-for="(item, index) in statusList" :key="index" :label="item.id">{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-row type="flex" justify="center">
          <el-button type="info" @click="balaceCancel">取消</el-button>
          <el-button type="primary" style="margin-left: 32px;" :loading='submitLoading' @click="balaceSubmit">保存</el-button>
        </el-row>
      </span>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Action, State } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import {
  SearchTable, CtjtTable, CtjtPagination, CtjtCard
} from '@/components';
import { ParamsType, TableOptionsValue, VueComponentParent } from '@/type';
import { MARKET_CHANNEL_STATUS, MARKET_WRITE_OFF_TYPE } from '@/enums';
import { drawSearchForm } from '@/assets/js/search_table';
import ctjtPaginationMixins from '@/mixins/pagination';

@Component({
  components: {
    SearchTable, CtjtTable, CtjtPagination, CtjtCard
  }
})
export default class MarketChannelObtainedList extends mixins(ctjtPaginationMixins) {
  @Action('base/queryGroupMechanismData') private queryGroupMechanismData!: (data: any) => any;

  @Action('sale/querySourceList') private querySourceList!: (data: any) => ParamsType;

  @Action('sale/addSource') private addSource!: (data: any) => ParamsType;

  @Action('sale/modifySource') private modifySource!: (data: any) => ParamsType;

  @Action('sale/updateSourceStatusById') private updateSourceStatusById!: (data: any) => ParamsType;

  @State(state => state.base.userInfo) userInfo: any;

  private statusList = MARKET_CHANNEL_STATUS;

  private writeOffList = MARKET_WRITE_OFF_TYPE;

  /** 表单搜索 开始 */
  private searchForm = {
    inputList: [
      {
        label: '途径名称',
        key: 'name',
        type: 'text',
        value: '',
        width: 160,
        placeholder: '请输入途径名称',
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
        key: 'name',
        label: '途径名称',
      },
      {
        key: 'status',
        label: '状态',
        render(h: any, params: any) {
          const { status } = params.row;
          const _list = MARKET_CHANNEL_STATUS;
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
    const _data = JSON.parse(JSON.stringify(val));
    this.showDetail = true;
    this.$nextTick(() => {
      Object.keys(this.formData).forEach(key => {
        this.formData[key] = _data[key];
      });
    });
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
      sendData.status = sendData.status === 1 ? 99 : 1;
      delete sendData.name;
      await this.updateSourceStatusById(sendData);
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

  // 表单配置
  private formData: ParamsType = {
    name: '', // 名称
    id: null, // id
    status: null, // 状态:1有效，99删除
  }

  // 表单校验
  private formRules = {
    name: [{ required: true, message: '请输入途径名称', trigger: ['change', 'blur'] }],
    status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  }

  // 取消提交
  private balaceCancel() {
    (this.$refs.obtainedForm as VueComponentParent).resetFields(); // 重置表单
    this.formData = {
      name: '',
      id: null,
      status: null,
    };
    this.showDetail = false; // 收起弹窗
    this.submitLoading = false; // 重置提交
  }

  // 确认提交
  private balaceSubmit() {
    (this.$refs.obtainedForm as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        this.submitLoading = true;
        const sendData = JSON.parse(JSON.stringify(this.formData));
        const { drivingSchoolId } = this.userInfo;
        sendData.drivingSchoolId = drivingSchoolId;
        if (sendData.id) {
          this.modifySource(sendData).then(() => {
            this.queryList();
            this.$message.success('修改成功');
            this.balaceCancel();
          }).finally(() => {
            this.submitLoading = false;
          });
        } else {
          delete sendData.id; // 新增删除id
          this.addSource(sendData).then(() => {
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
    const { drivingSchoolId } = this.userInfo;
    const sendData = {
      ..._data,
      drivingSchoolId
    };
    const body = await this.querySourceList(sendData);
    const { data, current, total } = body;
    this.tableData.list = data;
    this.paginationData.total = total;
    this.paginationData.current = current;
    this.tableData.loading = false;
  }

  /** 生命周期函数 */
  async mounted() {
    this.tableData._this = this;

    this.queryList();
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
