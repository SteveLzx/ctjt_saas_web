<template>
  <el-form ref="otherOrderForm" :model="formData" :rules="formRules" label-width="100px" class="page">
    <el-row type="flex">
      <el-form-item label="证件号码" prop="idNo" v-if="!$route.query.id">
        <el-input class="w_300"
          v-model.trim="idNo"
          :select-when-unmatched="true"
          placeholder="请输入"
          show-word-limit
          clearable
          maxlength="20"
          @keyup.enter.native="idNoBlur"
          @blur="idNoBlur"
        ></el-input>
      </el-form-item>
      <el-form-item label="是否领导特批优惠" label-width="145px">
        <el-radio-group v-model="formData.isRatifyDiscounts" @change="handleIsRatifyDiscountsChange" :disabled="isEdit">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="2">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="formData.isRatifyDiscounts === 1" label="领导姓名"  prop="leader">
        <el-input v-model.trim="formData.leader" :disabled="isEdit" show-word-limit maxlength="10"></el-input>
      </el-form-item>
    </el-row>
    <CtjtCard :prop-data="{ title: '学员学车信息' }">
      <template #content>
        <el-row :gutter="8">
          <el-col :span="8">
            <el-form-item label="学员姓名：">{{formData.userName}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证件号码：">{{formData.idNo}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="培训车型：">{{formData.carModel}}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="8">
            <el-form-item label="班别：">{{formData.classesName}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号：">{{formData.mobile}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否高端班：">{{formData.isHighEndClass | isSuperviseFilter}}</el-form-item>
          </el-col>
        </el-row>
      </template>
    </CtjtCard>
    <CtjtCard :prop-data="{ title: '商品信息' }">
      <template #content>
        <div class="ctjt_table_container">
          <el-row>
            <el-col :span="9" class="table_border">
              <div class="table_tr">商品名称</div>
            </el-col>
            <el-col :span="4" class="table_border">
              <div class="table_tr">单价(元)</div>
            </el-col>
            <el-col :span="4" class="table_border">
              <div class="table_tr">数量</div>
            </el-col>
            <el-col :span="7" class="table_border">
              <div class="table_tr">总价</div>
            </el-col>
          </el-row>
          <el-row v-for="(item, index) in formData.productList" :key="index">
            <el-col :span="9" class="table_border">
              <div class="table_td">
                <el-form-item :prop="`productList.${index}.productId`"
                  :rules="formRules.productReqId"
                  label-width="0"
                  style="padding: 0; margin: 0;">
                  <el-select
                    v-model="item.productId"
                    @change="productChange"
                    placeholder="请选择"
                    :disabled="isEdit || item.type === '1' || item.type === '2'">
                    <el-option
                      v-for="(i, index) in productList"
                      :key="index"
                      :label="i.name"
                      :value="i.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="4" class="table_border">
              <div class="table_td">
                {{item.price}}
              </div>
            </el-col>
            <el-col :span="4" class="table_border">
              <div class="table_td">
                <el-form-item :prop="`productList.${index}.number`"
                  :rules="formRules.productReqNumber"
                  label-width="0"
                  style="padding: 0; margin: 0;">
                  <el-input v-model.number="item.number" @input="productReqNumberChange" placeholder="请输入" :disabled="isEdit || item.type === '1' || item.type === '2'"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="7" class="table_border">
              <div class="table_td">
                <el-form-item :prop="`productList.${index}.totalPrice`"
                  :rules="formRules.productReqTotalPrice"
                  label-width="0"
                  style="padding: 0; margin: 0;">
                  <el-input
                    v-model="item.totalPrice"
                    placeholder="请输入"
                    @input="productTotalInput"
                    :disabled="isEdit || formData.isRatifyDiscounts === 2 || item.type === '1' || item.type === '2'"></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </div>
      </template>
    </CtjtCard>
    <CtjtCard :prop-data="{ title: '发票信息' }">
      <template #content>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item label="发票类型" class="ctjt_form_item_class" prop="invoiceType">
              <el-radio-group v-model="formData.invoiceType" :disabled="isEdit">
                <el-radio
                  v-for="(item, index) in invoiceTypeList"
                  :key="index"
                  :label="item.id"
                >{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开票方式" class="ctjt_form_item_class" prop="invoiceMode">
              <el-radio-group v-model="formData.invoiceMode" :disabled="isEdit">
                <el-radio
                  v-for="(item, index) in openIncoiceTypeList"
                  :key="index"
                  :label="item.id"
                >{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item label="发票名称" class="ctjt_form_item_class" prop="invoiceName">
              <el-input class="w_400" v-model="formData.invoiceName" placeholder="请输入" maxlength="30" :disabled="isEdit" show-word-limit/>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formData.invoiceMode === 2">
            <el-form-item label="纳税人识别号" class="ctjt_form_item_class" prop="identifyNumber">
              <el-input class="w_400" v-model="formData.identifyNumber" placeholder="请输入" maxlength="30" :disabled="isEdit" show-word-limit/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="24">
            <el-form-item label="备注" class="ctjt_form_item_class" prop="remark">
              <el-input class="w_600" v-model="formData.remark" placeholder="请输入" maxlength="60" :disabled="isEdit" show-word-limit/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="24">
            <el-form-item label="订单金额：" class="ctjt_form_item_class" prop="amount">
              {{formData.amount || 0}}元
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </CtjtCard>
    <CtjtCard :prop-data="{ title: '支付信息' }">
      <template #content>
        <!-- 默认展示列表 -->
        <template v-if="$route.query.id > 0">
          <CtjtTable :tableData="orderPaytableData"></CtjtTable>
        </template>
        <!-- 编辑时展示 -->
        <template v-if="!$route.query.id">
          <el-card class="mt-20" shadow="never" v-for="(item, index) in formData.payMsgList" :key="index">
            <el-form-item
              label="支付方式"
              :prop="`payMsgList.${index}.payType`"
              :rules="formRules.orderPayVosPayType">
              <el-radio-group v-model="item.payType" @change="payTypeChange(index)" :disabled="isEdit || item.isEdit">
                <el-radio v-for="(item, index) in payTypeList" :key="index" :label="item.id" >{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="收款金额"
              :prop="`payMsgList.${index}.amount`"
              :rules="formRules.orderPayVosAmount">
              <el-input class="w_300" v-model="item.amount" placeholder="请输入" :disabled="item.payType !== 1"/>
            </el-form-item>
            <el-form-item
              label="收款时间"
              :prop="`payMsgList.${index}.payTime`"
              :rules="formRules.orderPayVosPayTime">
              <el-date-picker
                class="w_300"
                :picker-options="pickerOptions"
                v-model="item.payTime"
                :disabled="isEdit || item.isEdit"
                type="datetime"
                :clearable="false"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <!-- 不同支付方式，对应不同表单 -->
            <template v-if="item.payType === 2">
              <el-form-item
                label="pos终端号"
                :prop="`payMsgList.${index}.payContent`"
                :rules="formRules.orderPayVosPayContent">
                <el-select class="w_400" v-model="item.payContent" :disabled="isEdit || item.isEdit" placeholder="请选择">
                  <el-option
                    v-for="item in allPosTerminalNoOpts"
                    :key="item.id"
                    :label="item.label"
                    :value="item.label">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="交易参考号"
                :prop="`payMsgList.${index}.outTradeNo`"
                :rules="formRules.orderPayVosOutTradeNo">
                <el-input class="w_400" v-model.trim="item.outTradeNo" placeholder="请输入" maxlength="50" :disabled="isEdit || item.isEdit" show-word-limit/>
                </el-form-item>
            </template>
            <template v-if="item.payType === 4">
              <el-form-item
                label="收款二维码编号"
                :prop="`payMsgList.${index}.payContent`"
                :rules="formRules.orderPayVosPayContent">
                <el-select class="w_400" v-model="item.payContent" :disabled="isEdit || item.isEdit" placeholder="请选择">
                  <el-option
                    v-for="item in allPosTerminalNoOpts"
                    :key="item.id"
                    :label="item.label"
                    :value="item.label">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="交易参考号"
                :prop="`payMsgList.${index}.outTradeNo`"
                :rules="formRules.orderPayVosOutTradeNo">
                <el-input class="w_400" v-model.trim="item.outTradeNo" placeholder="请输入" maxlength="50" :disabled="isEdit || item.isEdit" show-word-limit/>
                </el-form-item>
            </template>
            <template v-if="item.payType === 3">
              <el-form-item
                label="付款账号"
                :prop="`payMsgList.${index}.transactionId`"
                :rules="formRules.orderPayVosTransactionId">
                <el-input class="w_400" v-model.trim="item.transactionId" placeholder="请输入" maxlength="50" :disabled="isEdit || item.isEdit" show-word-limit/>
              </el-form-item>
              <el-form-item
                label="收款账号"
                :prop="`payMsgList.${index}.payContent`"
                :rules="formRules.orderPayVosPayContent">
                <el-select class="w_400" v-model="item.payContent" :disabled="isEdit || item.isEdit" placeholder="请选择">
                  <el-option
                    v-for="item in allBankAccountOpts"
                    :key="item.label"
                    :label="item.label"
                    :value="item.label">
                  </el-option>
                </el-select>
                </el-form-item>
            </template>
            <template v-if="item.payType === 1">
              <el-form-item
                label="第三方渠道名称"
                :prop="`payMsgList.${index}.payContent`"
                :rules="formRules.orderPayVosPayContent">
                <el-select class="w_400" v-model="item.payContent" :disabled="isEdit || item.isEdit" placeholder="请选择">
                  <el-option
                    v-for="item in thirdChannelsOpts"
                    :key="item.id"
                    :label="item.label"
                    :value="item.label">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="第三方订单号"
                :prop="`payMsgList.${index}.transactionId`"
                :rules="formRules.orderPayVosTransactionId">
                <el-input class="w_400" v-model.trim="item.transactionId" placeholder="请输入" maxlength="50" :disabled="isEdit || item.isEdit" show-word-limit/>
                </el-form-item>
              <el-form-item
                label="核销码"
                :prop="`payMsgList.${index}.outTradeNo`"
                :rules="formRules.orderPayVosOutTradeNo">
                <el-input class="w_400" v-model.trim="item.outTradeNo" placeholder="请输入" maxlength="50" :disabled="isEdit || item.isEdit" show-word-limit/>
                </el-form-item>
            </template>
            <template>
              <el-form-item
                label="备注"
                :prop="`payMsgList.${index}.remark`">
                <el-input class="w_400" type="textarea" v-model.trim="item.remark" placeholder="请输入" maxlength="200" :disabled="isEdit || item.isEdit" show-word-limit/>
                </el-form-item>
            </template>
          </el-card>
        </template>
      </template>
    </CtjtCard>
    <el-row type="flex" justify="center">
      <el-button @click="cancelSubmit">取消</el-button>
      <el-button v-if="perm['btn_save']" type="primary" @click="submit" :disabled="isEdit" :loading="submitLoading">保存</el-button>
    </el-row>
  </el-form>
</template>
<script lang="ts">
import { State, Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { CtjtCard, CtjtTable } from '@/components';
import {
  ORDER_IS_INSTALLMENT, ORDER_INVOICE_TYPE, ORDER_OPEN_INVOICE_TYPE, ORDER_PAY_TYPE, THIRD_CHANNELS_OPTS
} from '@/enums';
import { ParamsType, VueComponentParent } from '@/type';
import {
  REG_PRICE_OR_ZONE, REG_INTEGER, deepClone, NUMBER_AND_EN_REG
} from '@/assets/js/common';
import clearCacheMixins from '@/mixins/clearCache';

@Component({
  components: { CtjtCard, CtjtTable },
  filters: {
    isSuperviseFilter(params: number) {
      if (params === 1) return '是';
      return '否';
    },
  }
})
export default class OrderOtherDetail extends mixins(clearCacheMixins) {
  @State((state) => state.base.userInfo) userInfo: any;

  @Action('finance/queryAllPosTerminalNoList') private queryAllPosTerminalNoList!: (data: any) => ParamsType;

  @Action('finance/queryAllBankAccountList') private queryAllBankAccountList!: () => ParamsType;

  @Action('goods/queryProductExtList') private queryProductExtList!: (data: any) => ParamsType;

  @Action('order/addExtOrder') private addExtOrder!: (data: any) => ParamsType;

  @Action('order/updateExtOrder') private updateExtOrder!: (data: any) => ParamsType;

  @Action('order/queryOrderExtById') private queryOrderExtById!: (data: any) => ParamsType;

  @Action('order/queryStudentInfoByIdNo') private queryStudentInfoByIdNo!: (data: any) => ParamsType;

  // 是否列表
  private booleanList = ORDER_IS_INSTALLMENT;

  // 发票类型
  private invoiceTypeList = ORDER_INVOICE_TYPE;

  // 开票方式
  private openIncoiceTypeList = ORDER_OPEN_INVOICE_TYPE;

  // 支付方式
  private payTypeList = ORDER_PAY_TYPE;

  // 第三方渠道名称
  private thirdChannelsOpts = THIRD_CHANNELS_OPTS;

  // 收款账号
  private allBankAccountOpts = [];

  // pos终端号
  private allPosTerminalNoOpts = [];

  // 商品列表
  private productList = [];

  // 商品切换选择
  private productChange(val: string) {
    const { productList } = this;
    productList.forEach((item: any) => {
      const {
        id, price, name, newModel, type, oldModel, feeName
      } = item;
      if (id === val) {
        const { number } = this.formData.productList[0];
        this.formData.productList[0].price = price;
        this.formData.productList[0].newModel = newModel;
        this.formData.productList[0].oldModel = oldModel;
        this.formData.productList[0].type = type;
        this.formData.productList[0].name = name;
        this.formData.productList[0].feeName = feeName;
        // 判断是否是高端班
        // const { isHighEndClass } = this.formData;
        // if (isHighEndClass === 1) {
        //   this.formData.productList[0].totalPrice = 0;
        //   this.formData.payMsgList[0].amount = 0;
        // } else {
        //   this.formData.productList[0].totalPrice = price * number;
        //   this.formData.payMsgList[0].amount = price * number;
        // }
        this.formData.productList[0].totalPrice = price * number;
        this.formData.payMsgList[0].amount = price * number;
      }
    });
  }

  private productReqNumberChange(val: number) {
    if (val > 0) {
      // 判断是否是高端班
      // const { isHighEndClass } = this.formData;
      // if (isHighEndClass === 1) {
      //   this.formData.productList[0].totalPrice = 0;
      //   this.formData.payMsgList[0].amount = 0;
      // } else {
      const { price } = this.formData.productList[0];
      this.formData.productList[0].totalPrice = price * val;
      this.formData.payMsgList[0].amount = price * val;
      // }
    }
  }

  private productTotalInput(val: string) {
    this.formData.payMsgList[0].amount = val;
  }

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

  /** 领导特批优惠 */
  private handleIsRatifyDiscountsChange(val: number) {
    if (val === 2) {
      // 把价格重置
      const { productList, payMsgList, isHighEndClass } = this.formData;
      if (isHighEndClass === 1) {
        productList.forEach((item: any) => {
          const _item = item;
          const { price, number } = item;
          _item.totalPrice = price * number;
        });
        payMsgList[0].amount = productList[0].totalPrice;
      }
    }
  }

  private idNo = ''; // 搜索的证件号

  private oldIdNo = ''; // 搜索的证件号

  // 搜索失去焦点
  private async idNoBlur() {
    const { idNo, oldIdNo } = this;
    if (idNo) {
      if (oldIdNo === idNo) return;
      const body = await this.queryStudentInfoByIdNo({ idNo });
      this.oldIdNo = idNo;
      this._setFormDataByIDNo(body);
    }
  }

  private _setFormDataByIDNo(val: ParamsType) {
    const _data = JSON.parse(JSON.stringify(val));
    Object.keys(this.formData).forEach(key => {
      if (_data[key] !== null && _data[key] !== undefined) {
        this.formData[key] = _data[key];
      }
      this.formData.invoiceName = _data.userName;
    });
  }

  @Watch('formData.productList', { deep: true })
  watchProductListFunc(val: any) {
    const { totalPrice } = val[0];
    this.formData.payMsgList[0].salePrice = totalPrice;
  }

  @Watch('formData.payMsgList', { deep: true })
  watchPayMsgListListFunc(val: any) {
    const { amount } = val[0];
    this.formData.amount = amount;
  }

  /** 表单配置开始 */
  isEdit = false; // 禁用

  formData: ParamsType = {
    amount: 0, // 订单金额
    carModel: '', // 车型 C1,C2
    classesName: '', // 班别名称
    createdName: '', // 创建人姓名
    id: null, // id
    idNo: '', // 身份证号码
    identifyNumber: '', // 纳税人识别号
    invoiceId: null, // 发票id
    invoiceMode: 1, // 开票方式
    invoiceName: '', // 发票名称
    invoiceType: 1, // 发票类型
    mobile: '', // 手机号码
    payMsgList: [ // 支付信息
      {
        salePrice: 0, // 订单金额
        amount: null, // 收款金额
        id: '', // 主键id(修改必传)
        payContent: '', // 支付类容，pos机终端号或二维码, 收款二维码编号，
        payTime: this.$dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'), // 收款日期
        payType: 2, // 收款方式
        receipt: '', // 收据编号
        outTradeNo: '', // 交易参考号、核销码
        transactionId: '', // 第三方订单号、付款账号
        isEdit: false, // 是否可以编辑
        remark: ''
      }
    ],
    productList: [ // 商品信息
      {
        id: null, // 主键id
        name: '', // 商品名称
        number: 1, // 数量
        orderId: null, // 订单ID
        price: 0, // 单价
        productId: null, // 商品ID
        totalPrice: null, // 总价
        newModel: '', //
        oldModel: '', //
        type: null,
        feeName: '',
      }
    ],
    remark: '', // 订单备注
    userName: '', // 用户姓名
    isHighEndClass: null, // 是否高端班
    isRatifyDiscounts: 2, // 是否领导特批优惠，1是，2否
    leader: '', // 领导姓名
    orderId: '', // 订单id
  }

  // 校验规则
  private formRules = {
    leader: [
      { required: true, message: '请输入领导姓名', trigger: 'change' }
    ],
    // 发票
    invoiceType: [
      { required: true, message: '请选择发票类型', trigger: 'change' }
    ],
    invoiceMode: [
      { required: true, message: '请选择开票方式', trigger: 'change' }
    ],
    invoiceName: [
      { required: true, message: '请输入发票名称', trigger: ['change', 'blur'] }
    ],
    identifyNumber: [
      { required: true, message: '请输入纳税人识别号', trigger: ['change', 'blur'] }
    ],
    // 商品列表校验
    productReqId: [
      { required: true, message: '请选择商品', trigger: 'change' }
    ],
    productReqNumber: [
      { required: true, message: '请输入数量', trigger: ['change', 'blur'] },
      { pattern: REG_INTEGER, message: '请输入正整数' },
      {
        type: 'number', min: 1, max: 100, message: '最小1, 最大100'
      }
    ],
    productReqTotalPrice: [
      { required: true, message: '请输入总价', trigger: ['change', 'blur'] },
      { pattern: REG_PRICE_OR_ZONE, message: '范围0-999999,可保留两位小数' }
    ],
    // 支付列表校验
    orderPayVosPayType: [
      { required: true, message: '请选择支付方式', trigger: 'change' }
    ],
    orderPayVosPayContent: [
      { required: true, message: '必填项', trigger: ['change', 'blur'] }
    ],
    orderPayVosOutTradeNo: [
      { pattern: NUMBER_AND_EN_REG, message: '请输入英文或数字', trigger: ['change'] }
    ],
    orderPayVosTransactionId: [
      { required: true, message: '必选项', trigger: ['blur', 'change'] },
      { pattern: NUMBER_AND_EN_REG, message: '请输入英文或数字', trigger: ['change'] }
    ],
    orderPayVosAmount: [
      { required: true, message: '请输入收款金额', trigger: ['change', 'blur'] },
      { pattern: REG_PRICE_OR_ZONE, message: '范围0-999999,可保留两位小数' }
    ],
    orderPayVosPayTime: [
      { required: true, message: '请选择收款日期', trigger: 'change' }
    ]
  }

  private editOrderPayVos(val: number) {
    let sendData = {};
    this.formData.payMsgList.forEach((item: any, index: number) => {
      if (index === val) {
        const { id } = item;
        const { id: orderId } = this.$route.query;
        sendData = {
          orderId, orderType: 2, payId: id
        };
      }
    });
    this.$router.push({
      path: '/finance/transaction_mg/system_flow/detail',
      query: { obj: encodeURIComponent(JSON.stringify({ ...sendData, isDetail: false })) }
    });
  }

  private payTypeChange(val: number) {
    const { salePrice } = this.formData.payMsgList[0];
    this.formData.payMsgList.forEach((item: any, index: number) => {
      if (index === val) {
        const _item = item;
        _item.amount = salePrice;
        _item.payContent = _item.payType === 6 ? '上缴现金' : '';
        _item.outTradeNo = '';
        _item.transactionId = '';
        _item.remark = '';
      }
    });
  }

  private orderPaytableData: ParamsType = {
    _this: {},
    index: true,
    labels: [
      {
        key: 'payType',
        label: '收款方式',
        render(h: any, params: any) {
          const { payType } = params.row;
          if (!payType) return h('div', '-');
          const _list = ORDER_PAY_TYPE.filter(item => item.id === payType);
          return h('div', _list.length > 0 ? _list[0].label : '');
        }
      },
      {
        key: 'receipt',
        label: '收据编号',
      },
      {
        key: 'amount',
        label: '收款金额(元)',
      },
      {
        key: '',
        label: '收据信息',
        render(h: any, params: any) {
          const {
            payType, payContent, outTradeNo, transactionId
          } = params.row;
          if (payType === 5) {
            return h('div', '');
          }
          if (payType === 2) {
            return h('div', { style: 'white-space: pre-line;' }, `POS机号：${payContent || ''}\n交易参考号：${outTradeNo || ''}`);
          }
          if (payType === 4) {
            return h('div', { style: 'white-space: pre-line;' }, `收款二维码编号：${payContent || ''}\n交易参考号：${outTradeNo || ''}`);
          }
          if (payType === 3) {
            return h('div', { style: 'white-space: pre-line;' }, `付款账号：${transactionId || ''}\n收款账号：${payContent || ''}`);
          }
          if (payType === 1) {
            return h('div', { style: 'white-space: pre-line;' }, `第三方渠道名称：${payContent || ''}\n第三方订单号：${transactionId || ''}\n核销码：${outTradeNo || ''}`);
          }
          return h('div', '');
        }
      },
      {
        key: 'payTime',
        label: '收款时间',
      },
      {
        key: 'remark',
        label: '备注',
        render(h: any, params: any) {
          const { remark } = params.row;
          return h('el-popover', {
            props: {
              placement: 'top-start',
              width: '300',
              trigger: 'hover',
              content: remark,
            },
            scopedSlots: {
              reference: () => h('p', remark),
            },
          });
        }
      },
      {
        key: '',
        label: '修改',
        render(h: any, params: any) {
          const { payType } = params.row;
          const that = params._self.tableData._this;
          return h('el-link', {
            props: {
              type: 'primary',
              underline: false,
              disabled: payType === 5 || that.isEdit
            },
            on: {
              click: () => {
                that.editOrderPayVos(params.$index);
              }
            }
          },
          '修改');
        }
      },
    ],
    list: [],
  }

  // 表单提交
  private submitLoading = false;

  /**
   * 提交表单前，处理特殊字段
   */
  private _specialHandleFormData() {
    // 深拷贝一份数据
    const sendData = JSON.parse(JSON.stringify(this.formData));
    const {
      payMsgList, productList, amount, classesName
    } = sendData;
    // 第三方支付，支付金额不能高于销售价
    if (parseFloat(amount) < parseFloat(payMsgList[0].amount)) {
      this.$message.warning('收款金额不能高于订单金额！');
      return false;
    }
    payMsgList.forEach((item: any) => {
      const { payTime, id } = item;
      const _item = item;
      if (!id) delete _item.id;
      _item.payTime = payTime ? this.$dayjs(payTime).format('YYYY-MM-DD HH:mm:ss') : '';
    });
    let _flag = true;
    productList.forEach((item: any) => {
      const { id, oldModel, type } = item;
      const _item = item;
      if (type === 2 && oldModel !== classesName) {
        this.$message.warning('新班别不可与原班别相同！');
        _flag = false;
      }
      if (!id) delete _item.id;
    });
    if (!_flag) return false;
    return sendData;
  }

  private submit() {
    (this.$refs.otherOrderForm as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        const sendData = this._specialHandleFormData();
        if (!sendData) return;
        const { id, invoiceId } = sendData;
        if (id <= 0) delete sendData.id;
        if (invoiceId <= 0) delete sendData.invoiceId;
        // 修改提交时，弹窗输入修改理由
        if (id > 0 && !this.isEdit) {
          this.submitLoading = true;
          this.updateExtOrder(sendData).then(() => {
            this.$message.success('修改成功');
            this.cancelSubmit();
          }).finally(() => {
            this.submitLoading = false;
          });
        } else {
          this.submitLoading = true;
          this.addExtOrder(sendData).then(() => {
            this.$message.success('新增成功');
            this.cancelSubmit();
          }).finally(() => {
            this.submitLoading = false;
          });
        }
      } else {
        this.$message.warning('您的信息填写有误，请仔细检查并修改！');
      }
    });
  }

  // 取消提交
  private cancelSubmit() {
    (this.$refs.otherOrderForm as VueComponentParent).resetFields();
    this.clearCache();
    this.$router.push({ path: '/market/order/other/list' });
  }
  /** 表单配置结束 */

  /** 请求回来数据特殊处理 */
  private _setFormDataFunc(param: ParamsType) {
    // 深拷贝一份数据
    const _data = JSON.parse(JSON.stringify(param));
    Object.keys(this.formData).forEach(key => {
      if (key === 'payMsgList') {
        const _payMsgList = _data[key];
        _payMsgList.forEach((item: any) => {
          const _item = item;
          _item.isEdit = true;
        });
        this.formData[key] = _payMsgList;
        this.orderPaytableData.list = deepClone(_payMsgList);
      } else {
        this.formData[key] = _data[key];
      }
    });
    this.$nextTick(() => {
      (this.$refs.otherOrderForm as VueComponentParent).clearValidate();
    });
  }

  /** 查询商品列表 */
  async queryProductList() {
    const { id } = this.$route.query;
    const sendData = {
      current: 1,
      pageSize: 100,
      status: !id ? 1 : null,
    };
    const body = await this.queryProductExtList(sendData);
    const { data } = body;
    this.productList = data;
  }

  /**
   * 根据id获取订单详情
   */
  async queryDetail() {
    const { id, edit } = this.$route.query;
    if (id) {
      if (edit) {
        this.isEdit = true;
      }
      const data = await this.queryOrderExtById({ id });
      // 处理返回来的字段
      this._setFormDataFunc(data);
    }
  }

  /** 获取客服详情 */

  async getUserInfos() {
    const { name } = this.userInfo;
    const { id } = this.$route.query;
    if (!id) {
      // 新增的时候，给本地赋值，编辑不需要赋值
      this.formData.createdName = name;
    }
  }

  // 生命周期函数
  perm = {};

  async activated() {
    this.orderPaytableData._this = this;
    this.getUserInfos();
    this.queryProductList();
    this.queryDetail();
    this.queryAllBankAccountList().then((res: any) => {
      this.allBankAccountOpts = res;
    });
    this.queryAllPosTerminalNoList({ type: 2 }).then((res: any) => {
      this.allPosTerminalNoOpts = res;
    });
    const permObj = await this.$getPerm(this);
    this.perm = permObj.perm;
  }
}
</script>
