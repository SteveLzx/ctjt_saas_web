<template>
  <el-drawer
    :visible="visible"
    :direction="'rtl'"
    :size="'60%'"
    :before-close="handleClose"
  >
    <template slot="title">
      <span>打印预览： </span>
      <el-button style="margin-right: 20px" type="primary" v-print="printObj"
        >打印</el-button
      >
    </template>
    <div class="print_preview_container" id="printContainerId">
      <div class="title">{{ tableData.title }}</div>
      <!--head-->
      <div class="head_container">
        <div class="head_one">
          <el-row>
            <el-col :span="12">
              <div class="img_wrap">
                <img :src="tableData.data.schoolLogo" />
              </div>
            </el-col>
            <el-col :span="12">
              <div class="basic_container">
                <p>官 网: {{ tableData.data.website }}</p>
                <p>地 址：{{ tableData.data.address }}</p>
                <p>电 话：{{ tableData.data.tell }}</p>
              </div>
            </el-col>
          </el-row>
          <el-row class="holder_wrap">
            <el-col :span="12">
              <div class="">
                受理单位：{{ tableData.data.drivingSchoolName }}
              </div></el-col
            >
            <el-col :span="12">
              <div class="basic_container">
                <p>收据编号：{{ tableData.data.receipt }}</p>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="head_second">
          <el-row>
            <el-col :span="24">
              <span
                >兹于：{{
                  this.$dayjs(tableData.data.payTime).format('YYYY-MM-DD')
                }}</span
              >
              <span>收到学员：{{ tableData.data.userName }}</span>
              <span>（证件号码：{{ tableData.data.idNo }}） 以下费用：</span>
            </el-col>
          </el-row>
        </div>
      </div>
      <!-- 表格 -->
      <div class="ctjt_table_container">
        <el-row>
          <el-col :span="6" class="table_border">
            <div class="table_tr">商品</div>
          </el-col>
          <el-col :span="6" class="table_border">
            <div class="table_tr">原价(元)</div>
          </el-col>
          <el-col :span="6" class="table_border">
            <div class="table_tr">优惠金额(元)</div>
          </el-col>
          <el-col :span="6" class="table_border">
            <div class="table_tr">订单金额(元)</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table_border">
            <div class="table_td">{{ tableData.data.productName }}</div>
          </el-col>
          <el-col :span="6" class="table_border">
            <div class="table_td">{{ tableData.data.originalPrice }}</div>
          </el-col>
          <el-col :span="6" class="table_border">
            <div class="table_td">{{ tableData.data.discountAmount }}</div>
          </el-col>
          <el-col :span="6" class="table_border">
            <div class="table_td">{{ tableData.data.salePrice }}</div>
          </el-col>
        </el-row>
      </div>
      <div class="foot_container">
        <!--金额相关-->
        <div class="fee_container">
          <el-row class="fee_row">
            <el-col :span="6" class="table_border">
              <div class="table_tr">
                实收金额：￥{{ tableData.data.amount }}
              </div>
            </el-col>
            <el-col :span="6" class="table_border">
              <div class="table_tr">
                大写金额：{{ tableData.data.amountInWords }}
              </div>
            </el-col>
            <el-col :span="6" class="table_border">
              <div class="table_tr">
                支付方式：{{ tableData.data.payType | payTypeFilter }}
                {{ tableData.data.payContent | payContentFilter }}
              </div>
            </el-col>
            <el-col :span="6" class="table_border">
              <div class="table_tr">
                发票金额：￥{{ tableData.data.invoiceAmount }}
              </div>
            </el-col>
          </el-row>
          <el-row class="fee_row">
            <el-col :span="6" class="table_border">
              <div class="table_tr">
                发票类型：{{ tableData.data.invoiceType | invoiceTypeFiter }}
              </div>
            </el-col>
            <el-col :span="6" class="table_border">
              <div class="table_tr">
                发票名称：{{ tableData.data.invoiceName }}
              </div>
            </el-col>
            <el-col :span="6" class="table_border">
              <div class="table_tr">
                纳税人识别号：{{ tableData.data.identifyNumber }}
              </div>
            </el-col>
          </el-row>
        </div>
        <!-- 落款 -->
        <div class="mt-20">
          <el-row>
            <el-col :span="8">
              <div>经手人（签名）：{{ tableData.data.handleName }}</div>
            </el-col>
            <el-col :span="8">
              <div>客户确认（签名）：</div>
            </el-col>
            <el-col :span="8">
              <div>门店名称：{{ tableData.data.storeName }}</div>
            </el-col>
          </el-row>
        </div>
        <!-- 底部备注 -->
        <div class="remark_container">
          <p>备注：</p>
          <p class="mt-10" v-if="tableData.type === 0">
            1.学员的培训费发票统一开具《增值税电子普通发票》，学员可在办理缴费业务7天后登陆深港驾校官网
            http://www.caronline.cn/，输入手机号码进行自助查询，
            下载打印电子普通发票；
          </p>
          <p class="mt-10" v-else>
            1.该票据只作为领取发票的依据，在领取发票时需出示该票据，同时为了您的权益，请妥善保管并及时领取发票（我司先统一开具发票后，再经报名点通知学员领取，请于收到通知后的1个月内领取发票）；
          </p>
          <p class="mt-10">
            2.该票据不作为报销凭证及退款的凭证，若出现退款时，凭我司开具的发票办理退款手续。
          </p>
        </div>
      </div>
    </div>
  </el-drawer>
</template>
<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import { ParamsType } from '@/type';
import { CtjtTable } from '@/components';
import { getSchoolImageProps } from '@/views/finance/_common/common';
import { ORDER_PAY_TYPE } from '@/enums';

@Component({
  components: {
    CtjtTable,
  },
  filters: {
    invoiceTypeFiter(val: number) {
      return val === 1 ? '普票' : '专票';
    },
    payTypeFilter(val: number) {
      const _text = ORDER_PAY_TYPE.filter(a => a.id === val);
      return _text[0] ? _text[0].label : '';
    },
    payContentFilter(val: any) {
      return val ? `（${val}）` : '';
    },
  },
})
export default class CtjtFinancePrint extends Vue {
  @Prop() visible!: boolean;

  @Prop({ default: {} }) tableData!: any;

  handleClose() {
    this.$emit('update:visible', false);
  }

  private printObj = {
    id: 'printContainerId',
  };
}
</script>
<style lang="scss" scoped>
@page {
  size: landscape; // 设置横向打印
}
.print_container {
  position: fixed;
  top: -1000px;
  left: -1000px;
}
.print_preview_container {
  padding: 0 20px 20px;
  display: flex;
  flex-direction: column;
}

::v-deep .el-table th {
  padding: 0px;
  div.cell {
    font-size: 12px;
  }
}
::v-deep .el-table td {
  padding: 0px;
  div.cell {
    font-size: 12px;
  }
}
::v-deep .el-drawer__body {
  overflow: scroll;
}
.title {
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  padding: 20px 0;
}
.mr-30 {
  margin-right: 30px;
}
.ml-30 {
  margin-left: 30px;
}
.mt-20 {
  margin-top: 20px;
}
.mt-10 {
  margin-top: 10px;
}
.head_container {
  .head_one {
    padding: 0px 0px 10px 0px;
    .img_wrap {
      width: 240px;
      height: 55px;
      img {
        width: 100%;
      }
    }
    .holder_wrap {
      padding: 10px;
    }
  }
  .head_second {
    padding: 30px 0px;
    border-top: 1px solid $--color-border-split;
    text-align: center;
    span {
      margin-right: 10px;
    }
  }
}
.basic_container {
  min-width: 250px;
  float: right;
  font-size: 13px;
  line-height: 20px;
}
.foot_container {
  padding: 20px 0px 30px 0px;
  .fee_container {
    border-bottom: 1px solid $--color-border-split;
    .fee_row {
      padding: 10px 0px;
    }
  }
  .remark_container {
    padding: 20px 0px 10px 0px;
  }
}
</style>
