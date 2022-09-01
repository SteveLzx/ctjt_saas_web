<template>
  <el-drawer
    :visible="visible"
    :direction="'rtl'"
    :size="'1200px'"
    :before-close="handleClose">
    <template slot="title">
      <span>打印预览： </span>
      <el-checkbox style="margin-right: 20px;" v-model="showVerifyContainer">是否打印审批流程</el-checkbox>
      <el-button style="margin-right: 20px;" type="primary" v-print="printObj">打印</el-button>
    </template>
    <el-row type="flex" justify="center">
      <div class="print_container" id="printContainerId">
        <table border="1" cellspacing="0" cellpadding="1" width="100%" style="border-collapse:collapse;color: #000;border:none;" bordercolor="#333333">
          <tr class="td_h500_class">
              <th colspan="8">学员退费申请单</th>
          </tr>
          <tr class="td_h500_class">
              <th width="220">服务店</th>
              <td width="220">{{data.storeName}}</td>
              <th width="220">申请日期</th>
              <td width="220">{{data.createdTime}}</td>
              <th width="220">申请单号</th>
              <td width="220">{{data.applyNo}}</td>
          </tr>
          <tr class="td_h500_class">
              <th width="220">学员姓名</th>
              <td width="220">{{data.userName}}</td>
              <th width="220">证件号码</th>
              <td width="220">{{data.idNo}}</td>
              <th width="220">联系电话</th>
              <td width="220">{{data.mobile}}</td>
          </tr>
          <tr class="td_h500_class">
              <th width="220">退费类型</th>
              <td width="220">{{data.refundType | refundTypeFilter}}</td>
              <th width="220">班别车型</th>
              <td width="220">{{data.classesName}}-{{data.carModel}}</td>
              <th width="220">报名日期</th>
              <td width="220">{{data.registerDate}}</td>
          </tr>
          <tr class="td_h500_class">
              <th width="220">报名费用(元)</th>
              <td width="220">{{data.registerCost}}</td>
              <th width="220">已缴费用(元)</th>
              <td width="220">{{data.paidCost}}</td>
              <th width="220">欠缴费用(元)</th>
              <td width="220">{{data.oweCost}}</td>
          </tr>
          <tr class="td_h500_class">
              <th width="220">学车进度</th>
              <td width="220">{{data.subjects | subjectsFilter}}</td>
              <th width="220">第三方学员</th>
              <td width="220">{{data.fundSupervision === '1'?'是':'否'}}</td>
              <th width="220">退费原因</th>
              <td width="220">{{data.refundCause | refundCauseFilter}}</td>
          </tr>
          <tr class="td_h500_class">
              <th rowspan="3">退费资料</th>
              <th rowspan="2">本人办理（必备资料）</th>
              <th>培训协议</th>
              <td width="220">{{data.trainProtocol | haveOrNoFilter}}</td>
              <th width="220">银行卡复印件</th>
              <td width="220">{{data.bankCardCopies | haveOrNoFilter}}</td>
          </tr>
          <tr class="td_h500_class">
              <th width="220">培训发票</th>
              <td width="220">{{data.trainInvoice | haveOrNoFilter}}</td>
              <th width="220">单位证明</th>
              <td width="220">{{data.firmProve | haveOrNoFilter}}</td>
          </tr>
          <tr class="td_h500_class">
              <th width="220">他人办理（添加资料）</th>
              <th width="220">委托书</th>
              <td width="220">{{data.powerOfAttorney | haveOrNoFilter}}</td>
              <th width="220">其他资料</th>
              <td width="220">{{data.otherInformation | haveOrNoFilter}}</td>
          </tr>
          <tr class="td_h500_class">
              <th width="220" rowspan="6">应扣费用</th>
              <th width="220">费用项目</th>
              <th width="220" colspan="2">应扣金额(元)</th>
              <th width="220" rowspan="6">应退费用</th>
              <td width="220" rowspan="5">
                大写金额人民币<br/><span style="font-weight: bold;font-size: 18px;margin-top: 20px;">{{refundableTotalAmountCh}}</span>
              </td>
          </tr>
          <tr class="td_h500_class">
              <th width="220">注册费</th>
              <td width="220" colspan="2">{{data.registeringCost || 0}}</td>
          </tr>
          <tr class="td_h500_class">
              <th width="220">培训费</th>
              <td width="220" colspan="2">{{data.trainCost || 0}}</td>
          </tr>
          <tr class="td_h500_class">
              <th width="220">其他费用</th>
              <td width="220" colspan="2">{{data.otherCost || 0}}</td>
          </tr>
          <tr class="td_h500_class">
              <th width="220">退差价</th>
              <td width="220" colspan="2">{{data.differCost || 0}}</td>
          </tr>
          <tr class="td_h500_class">
              <th width="220">合计</th>
              <td width="220" colspan="2">{{customerServiceDeductedTotalAmount}}</td>
              <td width="220">
                  小写金额 <span style="font-weight: bold;font-size: 18px;"> ￥{{customerServiceRefundableTotalAmount}}</span>
              </td>
          </tr>
          <tr class="td_h500_class">
              <th>账户名</th>
              <td colspan="2">{{data.account}}</td>
              <th>银行名称</th>
              <td colspan="2">{{data.bankMainName}}</td>
          </tr>
          <tr class="td_h500_class">
              <th>支行名称</th>
              <td colspan="2">{{data.bankName}}</td>
              <th>银行卡号</th>
              <td colspan="2">{{data.bankNo}}</td>
          </tr>
          <tr class="td_h500_class">
              <td width="220" rowspan="2" colspan="4"><span style="font-weight: bold;font-size: 18px;">本人同意以上应扣费用，请把退费转至以上银行账户。</span></td>
              <th width="220">学员确认签名（并按手印）</th>
              <th width="220" height="100"></th>
          </tr>
          <tr class="td_h500_class">
              <th width="220">经办人签名</th>
              <td width="220" height="100"></td>
          </tr>
          <template v-if="showVerifyContainer">
            <tr>
              <th colspan="6" align="center" class="td_h500_class">审批流程</th>
            </tr>
            <tr class="td_h500_class">
                <th width="220">审批环节</th>
                <th width="220">审核人</th>
                <th width="220">审核操作</th>
                <th width="220" colspan="2">审核意见</th>
                <th width="220">审核时间</th>
            </tr>
            <tr class="td_h500_class" v-for="(item,index) in data.approveRecord" :key="index">
                <td width="220">{{item.verifyNode}}</td>
                <td width="220">{{item.createdName}}</td>
                <td width="220">{{item.verifyOperation}}</td>
                <td width="220" colspan="2">{{item.verifyOpinion}}</td>
                <td width="220">{{item.verifyDate}}</td>
            </tr>
          </template>
        </table>
      </div>
    </el-row>
  </el-drawer>
</template>
<script lang="ts">
import {
  Component, Vue, Prop
} from 'vue-property-decorator';
import {
  jsReduceFunc, jsAddFunc, changeNumMoneyToChinese
} from '@/assets/js/common';
import { REFUND_TYPE, STUDY_STAGE } from '@/enums';
import {
  refundReasonOpts, haveOrNoOpts
} from '@/views/market/_enums';
import { CtjtTable } from '@/components';

@Component({
  components: {
    CtjtTable
  },
  filters: {
    refundTypeFilter(val: number): string {
      const _list = REFUND_TYPE.filter((item: any) => item.id === Number(val));
      if (_list.length > 0) {
        return _list[0].label;
      }
      return '';
    },
    subjectsFilter(val: number): string {
      const _list = STUDY_STAGE.filter((item: any) => item.id === Number(val));
      if (_list.length > 0) {
        return _list[0].label;
      }
      return '';
    },
    refundCauseFilter(val: number): string {
      const _list = refundReasonOpts.filter((item: any) => item.id === Number(val));
      if (_list.length > 0) {
        return _list[0].label;
      }
      return '';
    },
    haveOrNoFilter(val: number): string {
      const _list = haveOrNoOpts.filter((item: any) => item.id === Number(val));
      if (_list.length > 0) {
        return _list[0].label;
      }
      return '无';
    },
  }
})
export default class RefundPrint extends Vue {
  @Prop() visible!: boolean;

  @Prop({ default: {} }) data!: any

  handleClose() {
    this.showVerifyContainer = true;
    this.$emit('update:visible', false);
  }

  showVerifyContainer = true

  // 客服应扣金额合计
  get customerServiceDeductedTotalAmount() {
    const {
      refundType, registeringCost = 0, trainCost = 0, otherCost = 0, differCost = 0, idNo
    } = this.data;
    let _sum = 0;
    if (idNo) {
      if (refundType === 6) {
        _sum = differCost;
      } else {
        _sum = jsAddFunc(jsAddFunc(registeringCost, trainCost), otherCost);
      }
    }
    return _sum;
  }

  // 客服应退费用
  get customerServiceRefundableTotalAmount() {
    const { paidCost, refundType } = this.data;
    const { customerServiceDeductedTotalAmount } = this;
    if (refundType === 6) {
      return customerServiceDeductedTotalAmount;
    }
    const _sum = jsReduceFunc(paidCost, customerServiceDeductedTotalAmount);
    return _sum;
  }

  // 应扣金额合计
  get deductedTotalAmount() {
    const {
      refundType, financeRegisteringCost = 0, financeTrainCost = 0, financeOtherCost = 0, financeDifferCost = 0, idNo
    } = this.data;
    let _sum = 0;
    if (idNo) {
      if (refundType === 6) {
        _sum = financeDifferCost;
      } else {
        _sum = jsAddFunc(jsAddFunc(financeRegisteringCost, financeTrainCost), financeOtherCost);
      }
    }
    return _sum;
  }

  get refundableTotalAmountCh() {
    const { customerServiceRefundableTotalAmount } = this;
    return changeNumMoneyToChinese(customerServiceRefundableTotalAmount);
  }

  printObj = {
    id: 'printContainerId',
  }
}
</script>
<style lang="scss" scoped>
  @page {
    size: auto; // 设置横向打印
  }
  ::v-deep .el-drawer__body{
    overflow: scroll;
  }
  th,td {
    font-size: 16px;
  }
  .print_container {
    width: 1070px;
  }
  .td_h500_class {
    height: 30px;
    padding: 0 5px;
    text-align: center;
  }
  .td_h500_class {
    height: 50px;
    line-height: 50px;
    font-size: 20px;
    color: #000;
  }
</style>
