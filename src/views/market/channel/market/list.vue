<template>
  <div class="page">
    <CtjtTable
      :tableData="tableData"
      @option-call="tableOptionCallback"
      @selection-change="tableSelectionChange"
    ></CtjtTable>
    <!-- 一级渠道 新增，编辑-弹窗 -->
    <el-drawer
      :visible="showDetail"
      :withHeader="false"
      :show-close="false"
      :size="'80%'"
      :direction="'rtl'">
      <el-container style="height: 100%">
        <el-main>
          <CtjtCard :prop-data="{ title: '新增/编辑渠道' }">
            <template #content>
              <el-form ref="marketChannelForm" :model="formData" :rules="formRules" label-width="130px">
                <el-form-item label="一级渠道名称" prop="firstLevelName">
                  <el-input class="w_200" v-model.trim="formData.firstLevelName" maxlength="16" show-word-limit placeholder="请输入"></el-input>
                </el-form-item>
                <el-card>
                  <div slot="header">
                    <span>关联二级渠道</span>
                  </div>
                  <CtjtTable
                    :tableData="secondLevelTableData"
                    @option-call="secondLevelTableOptionCallback"
                    @selection-change="secondLevelTableSelectionChange"
                  ></CtjtTable>
                </el-card>
              </el-form>
            </template>
          </CtjtCard>
        </el-main>
        <el-footer>
          <el-row type="flex" justify="center">
            <el-button type="info" @click="balaceCancel">取消</el-button>
            <el-button type="primary" style="margin-left: 32px;" :loading='submitLoading' @click="balaceSubmit">保存</el-button>
          </el-row>
        </el-footer>
      </el-container>
    </el-drawer>
    <!-- 二级渠道添加弹窗 -->
    <el-dialog
      title="新增/编辑二级营销渠道"
      :visible.sync="showSecondLevelForm"
      width="600px"
      :before-close="handleSecondLevelClose">
      <el-row type="flex" justify="center">
        <el-form ref="secondForm" :model="secondFormData" :rules="secondFormRule" label-width="120px">
          <el-form-item label="所属一级渠道：">{{formData.firstLevelName}}</el-form-item>
          <el-form-item label="二级渠道名称" prop="secondLevelName">
            <el-input class="w_400" v-model.trim="secondFormData.secondLevelName" placeholder="请输入二级渠道名称" maxlength="16" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="招生计提类型">
            <el-select class="w_400" v-model="secondFormData.commissionType" placeholder="请选择招生计提类型">
              <el-option v-for="item in commissionTypeList" :key="item.id" :value="item.id" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="推荐属性">
            <el-radio-group v-model="secondFormData.recommend">
              <el-radio v-for="item in recommendList" :key="item.id" :label="item.id">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="额外优惠属性" prop="isDiscounts">
            <el-radio-group v-model="secondFormData.isDiscounts">
              <el-radio :label="1">有</el-radio>
              <el-radio :label="0">无</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="额外优惠金额" prop="discounts" v-if="secondFormData.isDiscounts===1">
            <el-input class="w_400" v-model="secondFormData.discounts" placeholder="请输入金额">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input class="w_400" v-model.trim="secondFormData.remark" type="textarea" placeholder="请输入备注" maxlength="100" show-word-limit></el-input>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row type="flex" justify="center">
        <el-button type="info" @click="handleSecondLevelClose">取消</el-button>
        <el-button type="primary" style="margin-left: 32px;" @click="handleSecondLevelSubmit">保存</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Action, State } from 'vuex-class';
import { Component, Vue, Watch } from 'vue-property-decorator';
import {
  CtjtTable, CtjtCard
} from '@/components';
import { ParamsType, TableOptionsValue, VueComponentParent } from '@/type';
import {
  MARKET_CLASS_FEE_STATUS, MARKET_WRITE_OFF_TYPE, MARKET_COMMISSION_TYPE, MARKET_RECOMMEND_TYPE
} from '@/enums';

@Component({
  components: {
    CtjtTable, CtjtCard
  }
})
export default class MarketChannelMarketList extends Vue {
  @Action('base/queryGroupMechanismData') private queryGroupMechanismData!: (data: any) => any;

  @Action('sale/queryMarketList') private queryMarketList!: (data: any) => ParamsType;

  @Action('sale/addMarket') private addMarket!: (data: any) => ParamsType;

  @Action('sale/modifyMarket') private modifyMarket!: (data: any) => ParamsType;

  @Action('sale/updateMarketStatusById') private updateMarketStatusById!: (data: any) => ParamsType;

  @State(state => state.base.userInfo) userInfo: any;

  private statusList = MARKET_CLASS_FEE_STATUS;

  private writeOffList = MARKET_WRITE_OFF_TYPE;

  private commissionTypeList = MARKET_COMMISSION_TYPE;

  private recommendList = MARKET_RECOMMEND_TYPE;

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
        type: '',
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
        label: '启用',
        type: 'warning',
        icon: '&#xe615;',
        path: 'btn_enable'
      },
      {
        id: 4,
        label: '停用',
        type: 'warning',
        icon: '&#xe617;',
        path: 'btn_disable'
      },
    ],
    labels: [
      {
        key: 'firstLevelName',
        label: '一级渠道名称',
        width: 120,
        showOverflowTooltip: true
      },
      {
        key: 'secondLevelName',
        label: '二级渠道名称',
        width: 120,
        showOverflowTooltip: true
      },
      {
        key: 'createdTime',
        label: '添加时间',
        showOverflowTooltip: true,
        render(h: any, params: any) {
          const { createdTime } = params.row;
          const { _this } = params._self.tableData;
          if (createdTime) {
            return h('span', _this.$dayjs(createdTime).format('YYYY-MM-DD HH:mm:ss'));
          }
          return h('span', '-');
        }
      },
      {
        key: 'createdName',
        label: '添加人',
        showOverflowTooltip: true,
        render(h: any, params: any) {
          const { createdName } = params.row;
          return h('span', createdName || '-');
        }
      },
      {
        key: 'commissionType',
        label: '招生计提类型',
        width: 120,
        showOverflowTooltip: true,
        render(h: any, params: any) {
          const { commissionType } = params.row;
          const _list = MARKET_COMMISSION_TYPE;
          const _arr = _list.filter((item: any) => item.id === commissionType);
          if (_arr.length > 0) {
            return h('span', _arr[0].label);
          }
          return h('span', '-');
        },
      },
      {
        key: 'discounts',
        label: '额外优惠金额(元)',
        width: 140,
        render(h: any, params: any) {
          const { discounts } = params.row;
          if (discounts > 0) {
            return h('span', discounts);
          }
          return h('span', '无');
        },
      },
      {
        key: 'remark',
        label: '备注',
        showOverflowTooltip: true,
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
    if (id === 1) {
      // 新增
      this.formData.firstLevelName = '';
      this.showDetail = true;
      return;
    }
    // 子项选中列表，必须是单选
    const { selectionList } = this.tableData;
    const _len = selectionList.length;
    if (_len > 1) this.$message.warning('只能单选一项进行操作！');
    if (_len === 0) this.$message.warning('请先勾选一项，再进行操作！');
    if (_len === 1) {
      if (id === 2) {
        // 编辑
        this.openDetail(selectionList[0]);
      }
      if (id === 3 || id === 4) {
        this.upDataStatusFunc(selectionList[0], id);
      }
    }
  }

  // 列表选中每一列切换回调
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  // 打开二级详情弹窗
  private openDetail(val: ParamsType) {
    // 深拷贝一份单项数据
    const valData = JSON.parse(JSON.stringify(val));
    // 先循环遍历数组，找到当前选中的一级渠道下的所有二级渠道。
    const { firstLevelName } = valData;
    this.formData.firstLevelName = firstLevelName;
    Object.keys(this.secondFormData).forEach(key => {
      if (key === 'discounts') {
        this.secondFormData[key] = valData[key];
      } else {
        this.secondFormData[key] = valData[key];
      }
    });
    this.secondFormData.isDiscounts = valData.discounts > 0 ? 1 : 0;
    this.showSecondLevelForm = true;
  }

  private upDataStatusFunc(val: ParamsType, type: number) {
    const { status, id } = val;
    if ((status === 1 && type === 3) || (status !== 1 && type === 4)) {
      this.$message.warning(`${type === 3 ? '当前状态已经是启用' : '当前状态已经是停用'}`);
      return;
    }
    this.$confirm(`${status === 1 ? '状态修改为停用' : '状态修改为启用'}, 是否继续?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      const sendData = {
        status, id
      };
      sendData.status = sendData.status === 1 ? 0 : 1;
      await this.updateMarketStatusById(sendData);
      this.$message.success('修改成功！');
      await this.queryList();
    });
  }
  /** 列表配置 结束 */

  /** 列表分页 结束 */

  /** 新增 编辑 弹窗 开始 */
  private showDetail = false; // 展示弹窗

  private showSecondLevelForm = false; // 展示二级渠道添加弹窗

  private isEdit = false; // 可编辑

  private submitLoading = false; // 提交loading

  /** 一级渠道 开始 */

  private _resetFormData() {
    this.secondLevelTableData.list = [];
    this.formData.firstLevelName = '';
  }

  private formData: ParamsType = {
    firstLevelName: '', // 一级渠道名称
  }

  private formRules = {
    firstLevelName: [{ required: true, message: '请输入一级渠道名称', trigger: ['change', 'blur'] }],
  }

  // 一级表单提交前数据处理
  private _specialHandleFormData() {
    const { list } = this.secondLevelTableData;
    const { drivingSchoolId } = this.userInfo;
    const { firstLevelName } = this.formData;
    if (list.length > 0) {
      const sendData = JSON.parse(JSON.stringify(list));
      // 添加驾校id
      sendData.forEach((item: any) => {
        const _item = item;
        _item.drivingSchoolId = drivingSchoolId;
        _item.firstLevelName = firstLevelName;
        delete _item.createdBy;
        delete _item.createdTime;
      });
      return sendData;
    }
    // 二级渠道为空时，二级渠道名称同一级渠道
    const sendData = JSON.parse(JSON.stringify(this.secondFormData));
    sendData.drivingSchoolId = drivingSchoolId;
    sendData.secondLevelName = firstLevelName;
    sendData.firstLevelName = firstLevelName;
    delete sendData.isDiscounts;
    return [sendData];
  }

  // 取消提交
  private balaceCancel() {
    this._resetFormData();
    (this.$refs.marketChannelForm as VueComponentParent).resetFields(); // 重置表单
    this.showDetail = false; // 收起弹窗
    this.submitLoading = false; // 重置提交
    this.isEdit = false;
  }

  // 确认提交
  private balaceSubmit() {
    (this.$refs.marketChannelForm as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        const sendData = this._specialHandleFormData();
        this.submitLoading = true;
        this.addMarket(sendData).then(() => {
          this.queryList();
          this.$message.success('新增成功');
          this.balaceCancel();
        }).finally(() => {
          this.submitLoading = false;
        });
      }
    });
  }

  /** 一级渠道 结束 */

  /** 二级渠道 开始 */

  // 重置二级表单
  private _resetSecondFormData() {
    this.secondFormData = {
      commissionType: null,
      createTime: '',
      createdName: '',
      discounts: null,
      drivingSchoolId: null,
      isDiscounts: 1, // 是否有优惠
      id: null,
      recommend: 0,
      remark: '',
      secondLevelName: '',
      status: 1
    };
  }

  private secondFormData: ParamsType = {
    commissionType: null,
    createTime: '',
    createdName: '',
    discounts: null,
    drivingSchoolId: null,
    isDiscounts: 1, // 是否有优惠
    id: null,
    recommend: 0,
    remark: '',
    secondLevelName: '',
    status: 1
  }

  @Watch('secondFormData.isDiscounts', { immediate: true, deep: true })
  private watchIsDiscounts(newVal: number) {
    if (newVal === 0) {
      this.secondFormData.discounts = null;
    }
  }

  private validatePeriod = (rule: any, value: string, callback: any) => {
    if (value && !/^[0-9]\d{0,5}(\.\d{1,2})?$/.test(value)) {
      callback(new Error('范围0.01-999999.99, 可保留两位小数'));
    } else {
      callback();
    }
  }

  private secondFormRule = {
    secondLevelName: [{ required: true, message: '请输入二级渠道名称', trigger: ['change', 'blur'] }],
    isDiscounts: [
      { required: true, message: '请选择额外优惠属性', trigger: ['change'] },
    ],
    discounts: [
      { required: true, message: '请输入额外优惠金额', trigger: ['change', 'blur'] },
      { validator: this.validatePeriod, trigger: ['change', 'blur'] }
    ],
  }
  /** 二级渠道 结束 */

  private secondLevelTableData: ParamsType = {
    _this: {},
    loading: false,
    selection: true,
    index: true,
    options: [
      {
        id: 1,
        label: '添加二级渠道',
        type: 'primary',
      },
      {
        id: 2,
        label: '删除',
        type: 'danger',
      },
    ],
    labels: [
      {
        key: 'secondLevelName',
        label: '二级渠道名称',
      },
      {
        key: 'recommend',
        label: '推荐属性',
        render(h: any, params: any) {
          const { recommend } = params.row;
          const _list = MARKET_RECOMMEND_TYPE;
          const _arr = _list.filter((item: any) => item.id === recommend);
          if (_arr.length > 0) {
            return h('span', _arr[0].label);
          }
          return h('span', '-');
        },
      },
      {
        key: 'discounts',
        label: '额外优惠属性',
        render(h: any, params: any) {
          const { discounts } = params.row;
          return h('span', discounts > 0 ? `${discounts}元` : '无');
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
      {
        key: 'commissionType',
        label: '招生计提类型',
        render(h: any, params: any) {
          const { commissionType } = params.row;
          const _list = MARKET_COMMISSION_TYPE;
          const _arr = _list.filter((item: any) => item.id === commissionType);
          if (_arr.length > 0) {
            return h('span', _arr[0].label);
          }
          return h('span', '-');
        },
      },
      {
        key: 'remark',
        label: '备注',
      },
    ],
    list: [],
    selectionList: []
  }

  // 列表操作回调
  private secondLevelTableOptionCallback(val: TableOptionsValue) {
    const { id } = val;
    if (id === 1) {
      // 添加
      // 新增二级渠道
      // 判断一级渠道名称是否为空
      const { firstLevelName } = this.formData;
      if (!firstLevelName) {
        this.$message.warning('一级渠道名称为空');
        return;
      }
      const { drivingSchoolId } = this.userInfo;
      this.secondFormData.firstLevelName = firstLevelName;
      this.secondFormData.drivingSchoolId = drivingSchoolId;
      this.showSecondLevelForm = true;
      return;
    }
    // 子项选中列表，必须是单选
    const { selectionList } = this.secondLevelTableData;
    const _len = selectionList.length;
    if (_len > 1) this.$message.warning('只能单选一项进行操作！');
    if (_len === 0) this.$message.warning('请先勾选一项，再进行操作！');
    if (_len === 1) {
      if (id === 2) {
        // 删除
        this._deteleSecondTableList(selectionList[0]);
      }
    }
  }

  // 列表选中每一列切换回调
  private secondLevelTableSelectionChange(val: []) {
    this.secondLevelTableData.selectionList = val;
  }

  /** 二级渠道 开始 */

  // 二级表单提交前处理
  private _specialHandleSecondFormData() {
    // 深拷贝一份数据
    const sendData = JSON.parse(JSON.stringify(this.secondFormData));
    const { discounts } = sendData;
    sendData.discounts = discounts || 0;
    delete sendData.isDiscounts;
    return sendData;
  }

  // 二级渠道表单关闭
  private handleSecondLevelClose() {
    this._resetSecondFormData();
    this.showSecondLevelForm = false;
    (this.$refs.secondForm as VueComponentParent).resetFields();
  }

  // 二级渠道表单提交
  private handleSecondLevelSubmit() {
    (this.$refs.secondForm as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        const sendData = this._specialHandleSecondFormData();
        const { id } = sendData;
        if (id) {
          this.submitLoading = true;
          const { drivingSchoolId } = this.userInfo;
          const { firstLevelName } = this.formData;
          sendData.drivingSchoolId = drivingSchoolId;
          sendData.firstLevelName = firstLevelName;
          this.modifyMarket(sendData).then(() => {
            this.queryList();
            this.$message.success('修改成功');
            this.handleSecondLevelClose();
          }).finally(() => {
            this.submitLoading = false;
          });
        } else {
          const { list } = this.secondLevelTableData;
          this.secondLevelTableData.list = [sendData, ...list];
          this.handleSecondLevelClose();
        }
      }
    });
  }

  // 删除二级渠道单项
  private _deteleSecondTableList(val: ParamsType) {
    this.$confirm('确定删除该项吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      const _list = JSON.parse(JSON.stringify(this.secondLevelTableData.list));
      const { secondLevelName } = val;
      let _index = null;
      _list.forEach((item: any, index: number) => {
        if (item.secondLevelName === secondLevelName) {
          _index = index;
        }
      });
      if (_index !== null) {
        _list.splice(_index, 1);
        this.secondLevelTableData.list = _list;
        this.$message.success('删除成功');
      }
    });
  }
  /** 二级渠道 结束 */
  /** 新增 编辑 弹窗 结束 */

  /** 请求处理 */
  async queryList() {
    const { drivingSchoolId } = this.userInfo;
    const sendData = {
      drivingSchoolId
    };
    const body = await this.queryMarketList(sendData);
    this.tableData.list = body;
    this.tableData.loading = false;
  }

  /** 生命周期函数 */
  async mounted() {
    this.tableData._this = this;

    await this.queryList();
  }

  perm = {};

  async created() {
    const permObj = await this.$getPerm(this, this.tableData.options);
    this.tableData.options = permObj.tablePerm;
    this.perm = permObj.perm;
  }
}
</script>
