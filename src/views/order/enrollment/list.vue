<template>
  <div class="page" ref="pageRef">
    <SearchTable :prop-data="searchForm" @select-change="searchSelectChange"></SearchTable>
    <section class="table_section" ref="table_section">
      <CtjtTable
        ref="ctjtTableReference"
        :tableData="tableData"
        @option-call="tableOptionCallback"
        @selection-change="tableSelectionChange"
      >
        <template #header>
          <div class="table_operation">
            <span style="color: #F56C6C;">汇总： 共{{orderTotal.totalNum || 0}}个订单，总实收金额：{{formatPrice(orderTotal.totalAmount || 0)}}元</span>
          </div>
        </template>
      </CtjtTable>
    </section>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change='tableCurrentChange'
    ></CtjtPagination>
    <!-- 收尾款弹窗 -->
    <el-drawer
      :visible="showBalance"
      :withHeader="false"
      :show-close="false"
      :size="'80%'"
      :direction="'rtl'">
      <el-container style="height: 100%">
        <el-main>
          <CtjtCard :prop-data="{ title: '订单记录' }">
            <template #content>
              <CtjtTable :tableData="orderRecordsData"></CtjtTable>
            </template>
          </CtjtCard>
          <CtjtCard :prop-data="{ title: '支付信息' }">
            <template #content>
              <el-form ref="balanceForm" :model="balanceSearchForm" :rules="balanceSearchFormRules" label-width="130px">
                <el-form-item label="支付方式" prop="payType">
                  <el-radio-group v-model="balanceSearchForm.payType" @change="payTypeChange">
                    <el-radio v-for="(item, index) in balancePayType" :key="index" :label="item.id" >{{item.label}}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="收款金额" prop="amount">
                  <el-input class="w_400" v-model="balanceSearchForm.amount" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="收款时间" prop="payTime">
                  <el-date-picker
                    class="w_400"
                    :picker-options="pickerOptions"
                    v-model="balanceSearchForm.payTime"
                    type="datetime"
                    :clearable="false"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
                <!-- 不同支付方式，对应不同表单 -->
                <template v-if="balanceSearchForm.payType === 2">
                  <el-form-item label="pos终端号" prop="payContent">
                    <el-select class="w_400" v-model="balanceSearchForm.payContent" placeholder="请选择">
                      <el-option
                        v-for="item in allPosTerminalNoOpts"
                        :key="item.id"
                        :label="item.label"
                        :value="item.label">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="交易参考号" prop="outTradeNo">
                    <el-input class="w_400" v-model.trim="balanceSearchForm.outTradeNo" placeholder="请输入" maxlength="50" show-word-limit />
                  </el-form-item>
                </template>
                <template v-if="balanceSearchForm.payType === 4">
                  <el-form-item label="收款二维码编号" prop="payContent">
                    <el-select class="w_400" v-model="balanceSearchForm.payContent" placeholder="请选择">
                      <el-option
                        v-for="item in allPosTerminalNoOpts"
                        :key="item.id"
                        :label="item.label"
                        :value="item.label">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="交易参考号" prop="outTradeNo">
                    <el-input class="w_400" v-model.trim="balanceSearchForm.outTradeNo" placeholder="请输入" maxlength="50" show-word-limit />
                  </el-form-item>
                </template>
                <template v-if="balanceSearchForm.payType === 3">
                  <el-form-item label="付款账号" prop="transactionId">
                    <el-input class="w_400" v-model.trim="balanceSearchForm.transactionId" placeholder="请输入" maxlength="50" show-word-limit />
                  </el-form-item>
                  <el-form-item label="收款账号" prop="payContent">
                    <el-select class="w_400" v-model="balanceSearchForm.payContent" placeholder="请选择">
                      <el-option
                        v-for="item in allBankAccountOpts"
                        :key="item.label"
                        :label="item.label"
                        :value="item.label">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </template>
                <template v-if="balanceSearchForm.payType === 1">
                  <el-form-item label="第三方渠道名称" prop="payContent">
                    <el-select class="w_400" v-model="balanceSearchForm.payContent" placeholder="请选择">
                      <el-option
                        v-for="item in thirdChannelsOpts"
                        :key="item.id"
                        :label="item.label"
                        :value="item.label">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="第三方订单号" prop="transactionId">
                    <el-input class="w_400" v-model.trim="balanceSearchForm.transactionId" placeholder="请输入" maxlength="50" show-word-limit />
                  </el-form-item>
                  <el-form-item label="核销码" prop="outTradeNo">
                    <el-input class="w_400" v-model.trim="balanceSearchForm.outTradeNo" placeholder="请输入" maxlength="50" show-word-limit />
                  </el-form-item>
                </template>
                <template>
                  <el-form-item label="备注" prop="remark">
                    <el-input class="w_400" type="textarea" v-model.trim="balanceSearchForm.remark" placeholder="请输入" maxlength="200"  show-word-limit/>
                    </el-form-item>
                </template>
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
  </div>
</template>
<script lang='ts'>
import { Action, State } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import FileSaver from 'file-saver';
import {
  SearchTable, CtjtTable, CtjtPagination, CtjtCard
} from '@/components';
import {
  ORDER_PAY_TYPE, THIRD_CHANNELS_OPTS
} from '@/enums';
import { ParamsType, TableOptionsValue, VueComponentParent } from '@/type';
import {
  REG_PRICE,
  spliceHoursAndMinutesAndSeconds,
  timestampSizeCompare,
  formatPrice,
  NUMBER_AND_EN_REG
} from '@/assets/js/common';
import { drawSearchForm } from '@/assets/js/search_table';
import ctjtPaginationMixins from '@/mixins/pagination';
import {
  defaultTableData, guangrenTableData, defaultsearchForm, guangrenSearchForm
} from './index';

interface ElementDOMS extends Element {
  offsetHeight: number;
}

const name = '招生订单';

let pageSizeFlag = true;

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtCard,

  }
})
export default class OrderEnrollmentList extends mixins(ctjtPaginationMixins) {
  @State(state => state.base.userInfo) userInfo: any;

  @Action('base/queryGroupMechanismData') private queryGroupMechanismData!: (data: any) => any;

  @Action('order/orderCancellation') private orderCancellation!: (data: any) => ParamsType;

  @Action('finance/queryAllPosTerminalNoList') private queryAllPosTerminalNoList!: (data: any) => ParamsType;

  @Action('finance/queryAllBankAccountList') private queryAllBankAccountList!: () => ParamsType;

  @Action('order/queryOrderList') private queryOrderList!: (data: any) => ParamsType;

  @Action('order/payBalance') private payBalance!: (data: any) => ParamsType;

  @Action('order/queryOrderTotalAmount') private queryOrderTotalAmount!: (data: any) => any;

  @Action('sale/queryMarketListDropDownBoxList') private queryMarketListDropDownBoxList!: (data: any) => ParamsType;

  @Action('order/queryExportOrderList') private queryExportOrderList!: (data: any) => any;

  @Action('order/orderFlowPush') private orderFlowPush!: (data: any) => any;

  @Action('order/queryOrdercreditApproval') private queryOrdercreditApproval!: (data: any) => any;

  // 第三方渠道名称
  private thirdChannelsOpts = THIRD_CHANNELS_OPTS;

  // 收款账号
  private allBankAccountOpts = [];

  // pos终端号
  private allPosTerminalNoOpts = [];

  private pickerOptions = {
    selectableRange: (() => {
      const data = new Date();
      const hour = data.getHours();
      const minute = data.getMinutes();
      const second = data.getSeconds();
      return [`00:00:00 - ${hour}:${minute}:${second}`];
    })(),
    disabledDate(time: any) {
      return time.getTime() > Date.now();
    }
  }

  formatPrice(val: number |string) {
    return formatPrice(val);
  }

  // 支付方式
  private balancePayType = ORDER_PAY_TYPE;

  /* 订单列表相关 开始 */
  // 列表搜索配置
  searchForm: ParamsType = defaultsearchForm;

  // 列表搜索 操作按钮回调
  public searchTableCallBack(key: string) {
    if (key === 'search') {
      this.paginationData.current = 1;
      this.queryList();
    }
  }

  // 表格
  tableData: ParamsType = defaultTableData;

  /** 导出 */
  private async _exportData() {
    const { searchForm, paginationData } = this;
    const { cascaderList } = searchForm;
    const _data = drawSearchForm(searchForm, paginationData);
    const { registrationBeginTime, registrationEndTime } = _data;
    // 处理数据
    const sendData = {
      ..._data,
      isExport: 1,
      marketingChannel: Array.isArray(cascaderList[0].value) ? cascaderList[0].value.join('/') : null,
      studentStatus: Array.isArray(cascaderList[1].value) ? cascaderList[1].value : null,
      // sourceChannel: '',
      registrationBeginTime: registrationBeginTime ? spliceHoursAndMinutesAndSeconds(1, registrationBeginTime) : '',
      registrationEndTime: registrationEndTime ? spliceHoursAndMinutesAndSeconds(2, registrationEndTime) : ''
    };
    const body = await this.queryExportOrderList(sendData);
    const blob = new Blob([body], {
      type: 'application/vnd.ms-excel'
    });
    FileSaver.saveAs(blob, `${name}${this.$dayjs(new Date()).format('YYYYMMDD')}`);
  }

  // 列表分页
  private orderTotal = {}; // 订单统计

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
  async tableOptionCallback(val: TableOptionsValue) {
    // 子项选中列表，必须是单选
    const { id } = val;
    if (id === 5) {
      this.jumpDetail('');
      return;
    }
    const { selectionList, labels } = this.tableData;
    const _len = selectionList.length;
    if (id === 4) {
      // 导出
      this._exportData();
      return;
    }
    if (_len >= 1) {
      const { id: spaceId } = selectionList[0];
      if (id === 1 || id === 2) {
        if (_len === 1) {
          if (id === 1) {
            // 编辑
            this.jumpDetail(spaceId);
          }
          if (id === 2) {
            // 收尾款
            this.showDrawer(selectionList[0]);
          }
        } else {
          this.$message.warning('只能单选一项进行操作！');
        }
      }
      if (id === 3) {
        // 订单作废
        this.$confirm('订单作废后，相应收款记录将会一起作废，需要重新录入学员信息与收款记录，确认是否作废?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.orderCancellation({ id: spaceId }).then(() => {
            this.queryList();
            this.$message.success('操作成功！');
          });
        });
      }
      if (id === 6) {
        // 转入牌证
        // 查看勾选数据是否可以转入牌证
        const _list = selectionList.filter((item: any) => item.syncFlag !== 1);
        if (_list.length === 0) {
          this.$message.warning('没有可以转入牌证的数据，请勾选正确数据！');
          return;
        }
        this.$confirm('温馨提示：转入牌证后将不能再修改或作废订单，届时如需修改或作废，需要发起相应变更流程，确认转入牌证吗？（订单在每日24点也会自动转入牌证）', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.flowPushFunc(_list);
        });
      }
      if (id === 7) {
        const orderIds = selectionList.map((item: any) => item.id);
        await this.queryOrdercreditApproval({ orderIds });
        this.queryList();
        this.$message.success('审核通过');
      }
    } else {
      this.$message.warning('请先勾选一项，再进行操作！');
    }
  }

  // 列表选中每一列切换回调
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }
  /* 订单列表相关 结束 */

  /* 收尾款相关 开始 */
  // 弹出窗-收尾款相关逻辑
  private showBalance = false;

  // 展示收尾款弹窗
  private async showDrawer(val: any) {
    // 几种不弹出收尾款的情况
    // 2. 订单应收金额为0
    const {
      salePrice, amount, id, seq, userName, idNo, balance
    } = val;
    if (balance === 0) {
      this.$message.warning('该订单已交清费用');
      return;
    }
    // 从当前订单拼凑数据到orderRecordsData里
    const _obj = {
      seq, userName, idNo, salePrice, amount, balance
    };
    this.orderRecordsData.list = [_obj];
    this.balanceSearchForm.orderId = id;
    this.showBalance = true;
  }

  // 尾款-订单记录列表

  private orderRecordsData: ParamsType = {
    selection: false,
    index: false,
    labels: [
      {
        key: 'seq',
        label: '订单号',
      },
      {
        key: 'userName',
        label: '学员姓名',
        width: 140,
        render(h: any, params: any) {
          const { userName } = params.row;
          if (!userName) return h('div', '-');
          return h('div', userName);
        }
      },
      {
        key: 'idNo',
        label: '证件号码',
        render(h: any, params: any) {
          const { idNo } = params.row;
          if (!idNo) return h('div', '-');
          return h('div', idNo);
        }
      },
      {
        key: 'salePrice',
        label: '订单金额(元)',
        width: 200,
      },
      {
        key: 'amount',
        label: '实收金额(元)',
        width: 200,
      },
      {
        key: 'balance',
        label: '待收金额(元)',
        width: 200,
      },
    ],
    list: []
  }

  // 尾款-支付信息列表
  private payTypeChange(val: number) {
    this.balanceSearchFormRules.refNum[0].required = val === 3;
    this.balanceSearchForm.payContent = val === 6 ? '上缴现金' : '';
    this.balanceSearchForm.transactionId = '';
    this.balanceSearchForm.outTradeNo = '';
    this.balanceSearchForm.remark = '';
  }

  // 尾款-支付信息表单
  private balanceSearchForm = {
    amount: '', // 支付金额
    orderId: '', // 订单id
    payContent: '', // pos终端号，第三方渠道名称，收款账号, 收款二维码编号，
    payTime: this.$dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'), // 支付完成时间
    payType: 2, // 支付类型
    outTradeNo: '', // 交易参考号、核销码、付款账号
    transactionId: '', // 第三方订单号
    remark: '', // 备注
  }

  /** 尾款-表单规则校验 */
  private balanceSearchFormRules = {
    payContent: [
      { required: true, message: '必填项', trigger: 'blur' }
    ],
    refNum: [
      { required: true, message: '请输入交易参考号', trigger: 'blur' }
    ],
    amount: [
      { required: true, message: '请输入收款金额', trigger: 'blur' },
      { pattern: REG_PRICE, message: '范围1-999999,可保留两位小数' }
    ],
    payTime: [
      { required: true, message: '请选择收款日期', trigger: 'change' }
    ],
    transactionId: [
      { required: true, message: '必填项', trigger: 'blur' },
      { pattern: NUMBER_AND_EN_REG, message: '请输入英文或数字', trigger: ['change'] }
    ],
    outTradeNo: [
      { pattern: NUMBER_AND_EN_REG, message: '请输入英文或数字', trigger: ['change'] }
    ]
  }

  private submitLoading = false;

  /** 尾款-提交 */
  balaceSubmit() {
    (this.$refs.balanceForm as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        const sendData = JSON.parse(JSON.stringify(this.balanceSearchForm));
        const { amount, payTime } = sendData;
        const { balance } = this.orderRecordsData.list[0];
        // 若收款金额大于待收金额
        if (parseFloat(amount) > parseFloat(balance)) {
          this.$message.warning('收款金额已经大于待收金额，请检查是否输入有误');
          return;
        }
        // 时间处理
        sendData.payTime = payTime ? this.$dayjs(payTime).format('YYYY-MM-DD HH:mm:ss') : '';
        // 提交
        this.payBalance(sendData).then(() => {
          this.balaceCancel();
          this.queryList();
          this.$message.success('添加成功');
        }).finally(() => {
          this.submitLoading = false;
        });
      } else {
        this.$message.warning('您的信息填写有误，请仔细检查并修改！');
      }
    });
  }

  /** 提交取消 */
  balaceCancel() {
    this.showBalance = false;
    (this.$refs.balanceForm as VueComponentParent).resetFields();
  }

  /* 收尾款相关 结束 */

  /** 业务处理 开始 */
  private jumpDetail(val: string, isEdit?: string): void {
    this.$router.push({ path: '/market/order/enrollment/detail', query: { id: val, edit: isEdit } });
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
      if (type === 'store') {
        const { drivingSchoolId } = this.userInfo;
        this.searchForm.selectList[drivingSchoolId === '370' ? 0 : 2].options = _data;
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
      this.searchForm.cascaderList[0].options = [];
      this.searchForm.cascaderList[0].value = [];
      if (value) {
        this.selectFunc('region', value);
        this.queryMarketList(value);
      }
    }
    if (key === 'regionId') {
      this.searchForm.selectList[2].options = [];
      this.searchForm.selectList[2].value = '';
      if (value) {
        this.selectFunc('store', value);
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

  // 请求处理

  /** 请求订单统计 */
  async getOrderTotal(data: any) {
    const sendData = {
      ...data
    };
    delete sendData.current;
    delete sendData.pageSize;
    const body = await this.queryOrderTotalAmount(sendData);
    this.orderTotal = body;
  }

  /** 获取营销渠道 */
  async queryMarketList(value: string) {
    if (parseFloat(value) > 0) {
      const sendData = {
        drivingSchoolId: value
      };
      const body = await this.queryMarketListDropDownBoxList(sendData);
      // 后端返回的Map类型数据，处理营销渠道
      this._setMarketListFunc(body);
    }
  }

  private _setMarketListFunc(val: ParamsType) {
    const mapList = JSON.parse(JSON.stringify(val));
    const _mapList: ParamsType[] = [];
    Object.keys(mapList).forEach((key: string) => {
      const _item = {
        secondLevelName: key,
        list: mapList[key],
      };
      _mapList.push(_item);
    });
    (this.searchForm.cascaderList[0] as ParamsType).options = _mapList;
  }

  /** 转牌证 */
  async flowPushFunc(list: any[]) {
    const idList: string[] = [];
    list.forEach((item: any) => {
      idList.push(item.id);
    });
    await this.orderFlowPush({ orderIds: idList });
    this.queryList();
    this.$message.success('转入牌证成功');
  }

  /**
   * 请求订单列表
   */
  async queryList() {
    const { searchForm, paginationData } = this;
    const { cascaderList } = searchForm;
    const _data = drawSearchForm(searchForm, paginationData);
    const { registrationBeginTime, registrationEndTime } = _data;
    // 判断时间
    if (registrationBeginTime && registrationEndTime && timestampSizeCompare(registrationBeginTime, registrationEndTime)) {
      this.$message.warning('开始时间不能大于结束时间');
      return;
    }
    const sendData = {
      ..._data,
      // sourceChannel: '',
      marketingChannel: Array.isArray(cascaderList[0].value) ? cascaderList[0].value.join('/') : null,
      studentStatus: Array.isArray(cascaderList[1].value) ? cascaderList[1].value : null,
      registrationBeginTime: registrationBeginTime ? spliceHoursAndMinutesAndSeconds(1, registrationBeginTime) : '',
      registrationEndTime: registrationEndTime ? spliceHoursAndMinutesAndSeconds(2, registrationEndTime) : ''
    };
    try {
      const body = await this.queryOrderList(sendData);
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
    this.getOrderTotal(sendData);
  }

  // 生命周期函数
  async mounted() {
    const { drivingSchoolId, regionId } = this.userInfo;
    if (drivingSchoolId === '370') {
      this.tableData = guangrenTableData;
      this.searchForm = guangrenSearchForm;
      this.selectFunc('store', regionId !== '0' ? regionId : '1470');
      this.queryMarketList(drivingSchoolId);
    } else {
      this.selectFunc('driverSchool', '0');
    }
    this.tableData._this = this;
    this.queryAllBankAccountList().then((res: any) => {
      this.allBankAccountOpts = res;
    });
    this.queryAllPosTerminalNoList({ type: 2 }).then((res: any) => {
      this.allPosTerminalNoOpts = res;
    });

    const permObj = await this.$getPerm(this, this.tableData.options, this.searchForm.buttonList);
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
    this.perm = permObj.perm;
  }

  perm = {};

  activated() {
    if (pageSizeFlag) {
      this.paginationData.pageSize = 30;
      pageSizeFlag = false;
    }
    this.queryList();
    // 可见区域高度
    this.$nextTick(() => {
      const _dom = document.querySelector('#container_body');
      if (_dom) {
        const _mh = (_dom as ElementDOMS).offsetHeight;
        (this.$refs.pageRef as VueComponentParent).style.height = `${_mh}px`;
        const _tbsetionH = (this.$refs.table_section as VueComponentParent).offsetHeight;
        this.tableData.height = _tbsetionH - 70;
      }
    });
  }
}
</script>
<style lang="scss" scoped>
.page {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.table_section {
  flex: 1;
}
.table_operation {
  padding: 5px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.time_input_no_r {
  width: 170px;
  ::v-deep .el-input__inner{
    padding-right: 0;
  }
}
</style>
