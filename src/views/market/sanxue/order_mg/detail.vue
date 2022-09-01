<template>
  <el-form class="page" ref="sxpjOrderFormRef" :model="formData" :rules="formRules" label-width="100px">
    <el-divider content-position="left" v-if="formData.id > 0"><b>订单编号：{{formData.seq}}</b></el-divider>
    <CtjtCard :prop-data="{ title: '学员信息' }">
      <template #content>
        <el-row :gutter="8">
          <el-col :span="8">
            <el-form-item label="姓名" prop="name">
              <el-input class="w_260" v-model.trim="formData.name" placeholder="请输入" show-word-limit maxlength="10" clearable :disabled="type === 1"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号码" prop="mobile">
              <el-input class="w_260" v-model="formData.mobile" type="tel" placeholder="请输入" maxlength="11" clearable :disabled="type === 1"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证件类型" prop="papersType">
              <el-select
                class="w_260"
                v-model="formData.papersType"
                placeholder="请选择"
                :disabled="type === 1"
                @change="handleCertificateType">
                <el-option
                  v-for="item in idNoTypeOpts"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="8">
            <el-form-item label="证件号码" prop="idNo">
              <el-input
                class="w_260"
                v-model="formData.idNo"
                placeholder="请输入"
                show-word-limit
                clearable
                :disabled="type === 1"
                :maxlength="formData.papersType === 1 ? '18' : '20'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性别" prop="sex">
              <el-select
                class="w_260"
                v-model="formData.sex"
                :disabled="type === 1"
                placeholder="请选择">
                <el-option
                  v-for="item in sexOpts"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8" type="flex">
          <el-form-item label="接送地址" prop="pickUpProvinceId">
            <el-select class="w_160" v-model="formData.pickUpProvinceId" placeholder="选择省份" @change="provChange" :disabled="type === 1">
              <el-option
                v-for="item in provData"
                :key="item.adcode"
                :label="item.name"
                :value="item.adcode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="10px" prop="pickUpCityId">
            <el-select class="w_160" v-model="formData.pickUpCityId" placeholder="选择城市" @change="cityChange" @visible-change="cityVisible" :disabled="type === 1">
              <el-option
                v-for="item in cityData"
                :key="item.adcode"
                :label="item.name"
                :value="item.adcode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="10px" prop="pickUpAreaId">
            <el-select class="w_160" v-model="formData.pickUpAreaId" placeholder="选择区域" @change="areaChange" @visible-change="areaVisible" :disabled="type === 1">
              <el-option
                v-for="item in areaData"
                :key="item.adcode"
                :label="item.name"
                :value="item.adcode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="10px" prop="pickUpDetail">
            <el-input class="w_400" v-model.trim="formData.pickUpDetail"  placeholder="请输入详细地址" maxlength="50" show-word-limit clearable :disabled="type === 1" />
          </el-form-item>
        </el-row>
      </template>
    </CtjtCard>
    <CtjtCard :prop-data="{ title: '发票信息' }">
      <template #content>
        <el-row :gutter="8">
          <el-col :span="8">
            <el-form-item label="发票类型" prop="invoiceType">
              <el-select
                class="w_260"
                v-model="formData.invoiceType"
                :disabled="type === 1"
                placeholder="请选择">
                <el-option
                  v-for="item in invoiceTypeOpts"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开票方式" prop="invoiceMode">
              <el-select
                class="w_260"
                v-model="formData.invoiceMode"
                :disabled="type === 1"
                placeholder="请选择">
                <el-option
                  v-for="item in openIncoiceTypeOpts"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发票名称" prop="invoiceName">
              <el-input class="w_260" v-model.trim="formData.invoiceName" placeholder="请输入" maxlength="30" show-word-limit :disabled="type === 1"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="24">
            <el-form-item label="纳税人识别号" prop="identifyNumber" v-if="formData.invoiceMode===2">
              <el-input class="w_400" v-model.trim="formData.identifyNumber" placeholder="请输入" maxlength="30" show-word-limit :disabled="type === 1"/>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </CtjtCard>
    <CtjtCard :prop-data="{ title: '订单信息' }">
      <template #content>
        <el-row :gutter="8">
          <el-col :span="16">
            <el-row type="flex">
              <el-form-item label="业务来源/跟踪人" prop="channel">
                <el-select class="w_260" v-model="formData.channel" @change="handleChannelChange" placeholder="请选择" :disabled="type === 1">
                  <el-option
                    v-for="(item, index) in channelOpts"
                    :key="index"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
              </el-form-item>
              <template v-if="formData.channel === '深港转入' || formData.channel === '港安转入'">
                <el-form-item label="片区/门店" prop="thirdRegionName">
                  <el-row type="flex">
                    <el-select class="w_140" v-model="formData.thirdRegionName" @change="handleSGRegionChange" placeholder="请选择" :disabled="type === 1">
                      <el-option
                        v-for="item in sgRegionOpts"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name">
                      </el-option>
                    </el-select>
                    <el-form-item label="" prop="thirdStoreName" label-width="2px">
                      <el-select class="w_140" v-model="formData.thirdStoreName" @change="handleSGStoreChange" placeholder="请选择" :disabled="type === 1">
                        <el-option
                          v-for="item in sgStoreOpts"
                          :key="item.id"
                          :label="item.name"
                          :value="item.name">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-row>
                </el-form-item>
              </template>
              <template v-else>
                <el-form-item label-width="2px" prop="channel2">
                  <el-select class="w_260" v-model="formData.channel2" placeholder="请选择" :disabled="type === 1">
                    <el-option
                      v-for="(item, index) in channel2Opts"
                      :key="index"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-row>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="8">
            <el-form-item label="推荐人" prop="referrer">
              <el-input class="w_260" v-model.trim="formData.referrer" placeholder="请输入" maxlength="20" show-word-limit :disabled="type === 1"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="片区/门店" prop="regionName">
              <el-row type="flex">
                <el-select class="w_160" v-model="formData.regionName" @change="handleRegionChange" placeholder="请选择" :disabled="type === 1">
                  <el-option
                    v-for="item in regionOpts"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
                <el-form-item label="" prop="storeName" label-width="2px">
                  <el-select class="w_160" v-model="formData.storeName" @change="handleStoreChange" placeholder="请选择" :disabled="type === 1">
                    <el-option
                      v-for="item in storeOpts"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="8">
            <el-form-item label="散学班别" prop="examClasses">
              <el-select class="w_260" v-model="formData.examClasses" placeholder="请选择" clearable  @change="handleExamClassesChange" :disabled="type === 1">
                <el-option
                  v-for="(item, index) in classessOpts"
                  :key="index"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="散学车型" prop="carModel">
              <el-select class="w_260"
                v-model="formData.carModel"
                :disabled="type === 1"
                placeholder="请选择">
                <el-option
                  v-for="(item, index) in carModelOpts"
                  :key="index"
                  :label="item.label"
                  :value="item.label">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车辆品牌" prop="carBrand">
              <el-select class="w_260" v-model="formData.carBrand" placeholder="请选择" :disabled="type === 1">
                <el-option
                  v-for="(item, index) in carBrandOpts"
                  :key="index"
                  :label="item.brandName"
                  :value="item.brandName">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="8">
            <el-form-item label="散学学时" prop="period" ref="period">
              <el-input class="w_260"
                v-model="formData.period"
                :placeholder="userInfo.drivingSchoolId === '370' ? periodPlaceholder : '请输入>=0的数字'"
                @blur="handlePeriodInput"
                :disabled="type === 1"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="优惠方式" prop="discountType">
              <el-select class="w_260"
                v-model="formData.discountType"
                clearable
                placeholder="请选择"
                :disabled="type === 1"
                @change="discountTypeChange">
                <el-option
                  v-for="(item, index) in discountTypeOpts"
                  :key="index"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-row type="flex">
              <el-form-item label="优惠券号码" v-if="formData.discountType === 3" prop="couponNumber">
                <el-input class="w_140" v-model="formData.couponNumber" placeholder="请输入" maxlength="50" show-word-limit :disabled="type === 1"></el-input>
              </el-form-item>
              <el-form-item label="优惠金额" v-if="formData.discountType === 1 || formData.discountType === 3" prop="discountAmount">
                <el-input :class="[ formData.discountType === 1 ? 'w_260' : 'w_120' ]"
                  v-model="formData.discountAmount" @blur="handleDiscountAmountInput" placeholder="请输入" :disabled="type === 1"></el-input>
              </el-form-item>
              <el-form-item label="赠送学时" v-if="formData.discountType === 2" prop="presentPeriod">
                <el-input class="w_260" v-model="formData.presentPeriod" @blur="handlePresentPeriodInput" placeholder="请输入" :disabled="type === 1"></el-input>
              </el-form-item>
            </el-row>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="8">
            <el-form-item label="总学时：" prop="sumPeriod">{{formData.sumPeriod}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="剩余学时：" prop="">{{formData.sumPeriod - formData.usedPeriod}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="学车教练" prop="coachName">
              <el-select class="w_260" v-model="formData.coachName" @change="handleCoachChange" placeholder="请选择" filterable clearable :disabled="type === 1">
                <el-option
                  v-for="(item, index) in studyCarCoachOpts"
                  :key="index"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="8">
            <el-form-item label="报名日期" prop="examDateTime">
              <el-date-picker
                class="w_260"
                v-model="formData.examDateTime"
                type="datetime"
                :disabled="type === 1 || type === 4"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="业务途径" prop="learnChannel">
              <el-select class="w_260" v-model="formData.learnChannel" placeholder="请选择" :disabled="type === 1">
                <el-option
                  v-for="(item, index) in sourceOpts"
                  :key="index"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="录单人：" prop="createdName">{{type !== 0 ? formData.createdName : userInfo.name}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="代理人姓名" prop="agent">
              <el-input class="w_260" v-model.trim="formData.agent" placeholder="请输入" maxlength="20" show-word-limit :disabled="type === 1"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="备注" prop="remarks">
              <el-input class="w_400" v-model="formData.remarks" type="textarea" maxlength="200" show-word-limit :disabled="type === 1"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </CtjtCard>
    <CtjtCard :prop-data="{ title: '支付信息' }">
      <template #header>
        <b class="td_text_red mr-20">
          <span>原价：{{formData.originalPrice}}</span>
          <el-divider direction="vertical"></el-divider>
          <span>优惠金额：{{formData.discountAmount}}</span>
          <el-divider direction="vertical"></el-divider>
          <span>订单金额：{{formData.amount}}</span>
        </b>
      </template>
      <template #content>
        <template v-if="(['370', '3748'].includes(userInfo.drivingSchoolId) && type !== 1) || (userInfo.drivingSchoolId === '3374' && (type === 0 || type === 2))">
          <el-card shadow="never" v-for="(item, index) in formData.payInfoList" :key="index">
            <div slot="header" class="clearfix">
              <el-button type="primary" v-if="index === 0" @click="addOrderPayVos()">新增支付记录</el-button>
              <el-button type="danger" v-if="index > 0" @click="deleteOrderPayVos(index)">删除支付记录</el-button>
            </div>
            <el-form-item
              label="支付方式"
              :prop="`payInfoList.${index}.payType`"
              :rules="formRules.orderPayVosPayType">
              <el-radio-group v-model="item.payType" @change="payTypeChange(index)">
                <el-radio v-for="(item, index) in payTypeOpts" :key="index" :label="item.id" >{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="收款金额"
              :prop="`payInfoList.${index}.amount`"
              :rules="formRules.orderPayVosAmount">
              <el-input class="w_300" v-model="item.amount" placeholder="请输入"/>
            </el-form-item>
            <el-form-item
              label="收款时间"
              :prop="`payInfoList.${index}.payTime`"
              :rules="formRules.orderPayVosPayTime">
              <el-date-picker
                class="w_300"
                v-model="item.payTime"
                type="datetime"
                :clearable="false"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <!-- 不同支付方式，对应不同表单 -->
            <template v-if="item.payType === 2">
              <el-form-item
                label="pos终端号"
                :prop="`payInfoList.${index}.payContent`"
                :rules="formRules.orderPayVosPayContent">
                <el-select class="w_400" v-model="item.payContent" placeholder="请选择">
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
                :prop="`payInfoList.${index}.outTradeNo`"
                :rules="formRules.orderPayVosOutTradeNo">
                <el-input class="w_400" v-model.trim="item.outTradeNo" placeholder="请输入" maxlength="50" show-word-limit/>
                </el-form-item>
            </template>
            <template v-if="item.payType === 4">
              <el-form-item
                label="收款二维码编号"
                :prop="`payInfoList.${index}.payContent`"
                :rules="formRules.orderPayVosPayContent">
                  <el-select class="w_400" v-model="item.payContent"  placeholder="请选择">
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
                :prop="`payInfoList.${index}.outTradeNo`"
                :rules="formRules.orderPayVosOutTradeNo">
                <el-input class="w_400" v-model.trim="item.outTradeNo" placeholder="请输入" maxlength="50" show-word-limit/>
                </el-form-item>
            </template>
            <template v-if="item.payType === 3">
              <el-form-item
                label="付款账号"
                :prop="`payInfoList.${index}.transactionId`"
                :rules="formRules.orderPayVosTransactionId">
                <el-input class="w_400" v-model.trim="item.transactionId" placeholder="请输入" maxlength="50" show-word-limit/>
              </el-form-item>
              <el-form-item
                label="收款账号"
                :prop="`payInfoList.${index}.payContent`"
                :rules="formRules.orderPayVosPayContent">
                <el-select class="w_400" v-model="item.payContent" placeholder="请选择">
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
                :prop="`payInfoList.${index}.payContent`"
                :rules="formRules.orderPayVosPayContent">
                <el-select class="w_400" v-model="item.payContent" placeholder="请选择">
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
                :prop="`payInfoList.${index}.transactionId`"
                :rules="formRules.orderPayVosTransactionId">
                <el-input class="w_400" v-model.trim="item.transactionId" placeholder="请输入" maxlength="50" show-word-limit/>
                </el-form-item>
              <el-form-item
                label="核销码"
                :prop="`payInfoList.${index}.outTradeNo`"
                :rules="formRules.orderPayVosOutTradeNo">
                <el-input class="w_400" v-model.trim="item.outTradeNo" placeholder="请输入" maxlength="50" show-word-limit/>
                </el-form-item>
            </template>
            <template>
              <el-form-item
                label="备注"
                :prop="`payInfoList.${index}.remark`">
                <el-input class="w_400" type="textarea" v-model.trim="item.remark" placeholder="请输入" maxlength="200" show-word-limit/>
                </el-form-item>
            </template>
          </el-card>
        </template>
        <CtjtTable v-else :tableData="orderPaytableData"></CtjtTable>
      </template>
    </CtjtCard>
    <el-row type="flex" justify="center" style="padding-bottom: 30px;">
      <el-button @click="cancel()">{{ type !== 1 ? '取消' : '关闭' }}</el-button>
      <el-button v-if="type !== 1" type="primary" :loading="submitLoading" @click="submit()">{{type !== 4 ? '保存' : '完成审核'}}</el-button>
    </el-row>
  </el-form>
</template>
<script lang='ts'>
import Index from './detail';

export default class MarketSanXueOrderMgDetail extends Index {}
</script>
