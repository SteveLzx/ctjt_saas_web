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
              <th colspan="12">深港驾校-学员散学退费申请单</th>
          </tr>
          <tr class="td_h500_class">
              <th width="180" colspan="2">申请日期</th>
              <td width="180" colspan="2">{{data.createdTime}}</td>
              <th width="180" colspan="2">申请单号</th>
              <td width="180" colspan="6">{{data.applyNo}}</td>
          </tr>
          <tr class="td_h500_class">
              <th width="180" colspan="2">学员姓名</th>
              <td width="180" colspan="2">{{data.userName}}</td>
              <th width="180" colspan="2">证件号码</th>
              <td width="180" colspan="2">{{data.idNo}}</td>
              <th width="180" colspan="2">联系电话</th>
              <td width="180" colspan="2">{{data.mobile}}</td>
          </tr>
          <tr class="td_h500_class">
              <th width="180" colspan="2">退费类型</th>
              <td width="180" colspan="2">{{ data.scatteredType | scatteredTypeFilter }}</td>
              <th width="180" colspan="2">总订单金额</th>
              <td width="180" colspan="2">{{data.totalOrderMoney}}</td>
              <th width="180" colspan="2">总实收金额</th>
              <td width="180" colspan="2">{{data.totalRealMoney}}</td>
          </tr>
          <tr class="td_h500_class">
              <th width="180" colspan="2">已学学时</th>
              <td width="180" colspan="2">{{data.learnedPeriod}}</td>
              <th width="180" colspan="2">备注</th>
              <td width="180" colspan="6">{{data.remark}}</td>
          </tr>
          <template>
            <tr>
              <th colspan="12" align="left" class="td_h500_class">缴费明细</th>
            </tr>
            <tr class="td_h500_class">
                <th width="180" colspan="1">门店</th>
                <th width="180" colspan="2">订单号</th>
                <th width="180" colspan="1">报名日期</th>
                <th width="90" colspan="1">班别</th>
                <th width="90" colspan="1">车型</th>
                <th width="90" colspan="1">散学学时</th>
                <th width="90" colspan="1">赠送学时</th>
                <th width="90" colspan="1">总学时</th>
                <th width="90" colspan="1">剩余学时</th>
                <th width="90" colspan="1">订单金额</th>
                <th width="90" colspan="1">实收金额</th>
            </tr>
            <tr class="td_h500_class" v-for="(item,index) in data.orderInfoList" :key="index">
                <td width="180" colspan="1">{{item.storeName}}</td>
                <td width="180" colspan="2">{{item.seq}}</td>
                <td width="180" colspan="1">{{$dayjs(item.registerTime).format('YYYY-MM-DD')}}</td>
                <td width="90" colspan="1">{{item.examClasses}}</td>
                <td width="90" colspan="1">{{item.carModel}}</td>
                <td width="90" colspan="1">{{item.period}}</td>
                <td width="90" colspan="1">{{item.presentPeriod}}</td>
                <td width="90" colspan="1">{{Number(item.period) + Number(item.presentPeriod)}}</td>
                <td width="90" colspan="1">{{Number(item.period) + Number(item.presentPeriod) - Number(item.usedPeriod)}}</td>
                <td width="90" colspan="1">{{item.salePrice}}</td>
                <td width="90" colspan="1">{{item.amount}}</td>
            </tr>
          </template>

          <tr class="td_h500_class">
              <th width="180" colspan="2" rowspan="4">应扣费用</th>
              <th width="180" colspan="2">费用项目</th>
              <th width="180" colspan="2">应扣金额(元)</th>
              <th width="180" colspan="2" rowspan="4">应退费用</th>
              <th width="360" colspan="4" rowspan="3">
                大写金额人民币<br/><span style="font-weight: bold;font-size: 18px;margin-top: 20px;">{{refundableTotalAmountCh}}</span>
              </th>
          </tr>
          <tr class="td_h500_class">
              <th width="180" colspan="2">已学学时费</th>
              <td width="180" colspan="2">{{data.learnedPeriodFee}}</td>
          </tr>
          <tr class="td_h500_class">
              <th width="180" colspan="2">应扣服务费</th>
              <td width="180" colspan="2">{{data.deductTrainFee}}</td>
          </tr>
          <tr class="td_h500_class">
              <th width="180" colspan="2">合计</th>
              <td width="180" colspan="2">{{Number(data.learnedPeriodFee) + Number(data.deductTrainFee)}}</td>
              <td width="360" colspan="4">
                小写金额 <span style="font-weight: bold;font-size: 18px;"> ￥{{data.refundableFee}}</span>
              </td>
          </tr>

          <tr class="td_h500_class">
              <th width="180" colspan="2">账户名</th>
              <td width="360" colspan="4">{{data.accountName}}</td>
              <th width="180" colspan="2">银行名称</th>
              <td width="360" colspan="4">{{data.bankMainName}}</td>
          </tr>
          <tr class="td_h500_class">
              <th width="180" colspan="2">支行名称</th>
              <td width="360" colspan="4">{{data.bankName}}</td>
              <th width="180" colspan="2">银行卡号</th>
              <td width="360" colspan="4">{{data.cardNo}}</td>
          </tr>
          <tr class="td_h500_class">
              <td width="720" rowspan="2" colspan="8"><span style="font-weight: bold;font-size: 18px;">本人同意以上应扣费用，请把退费转至以上银行账户。</span></td>
              <th width="180" colspan="2">学员确认签名（并按手印）</th>
              <th width="180" colspan="2" height="100"></th>
          </tr>
          <tr class="td_h500_class">
              <th width="180" colspan="2">经办人签名</th>
              <td width="180" colspan="2" height="100"></td>
          </tr>
          <template v-if="showVerifyContainer">
            <tr>
              <th colspan="12" align="center" class="td_h500_class">审批流程</th>
            </tr>
            <tr class="td_h500_class">
                <th width="180" colspan="2">审批环节</th>
                <th width="180" colspan="2">审核人</th>
                <th width="180" colspan="2">审核操作</th>
                <th width="360" colspan="4">审核意见</th>
                <th width="180" colspan="2">审核时间</th>
            </tr>
            <tr class="td_h500_class" v-for="(item,index) in data.recordDoList" :key="index">
                <td width="180" colspan="2">{{item.verifyNode}}</td>
                <td width="180" colspan="2">{{item.createdName}}</td>
                <td width="180" colspan="2">{{item.verifyOperation}}</td>
                <td width="360" colspan="4">{{item.verifyOpinion}}</td>
                <td width="180" colspan="2">{{item.verifyDate}}</td>
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
import dayjs from 'dayjs'; // 时间日期处理库
import {
  jsReduceFunc, jsAddFunc, changeNumMoneyToChinese
} from '@/assets/js/common';
import { REFUND_TYPE, STUDY_STAGE, SCATTERED_TYPE } from '@/enums';
import {
  refundReasonOpts, haveOrNoOpts
} from '@/views/market/_enums';
import { CtjtTable } from '@/components';

@Component({
  components: {
    CtjtTable
  },
  filters: {
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
    scatteredTypeFilter(val: number): string {
      const _item = SCATTERED_TYPE.filter((item: any) => item.id === val);
      if (_item.length === 0) {
        return '';
      }
      return _item[0].label;
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
    const { refundableFee } = this.data;
    return changeNumMoneyToChinese(refundableFee);
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
  th,td {
    font-size: 16px;
    word-break: break-word;
  }
</style>
