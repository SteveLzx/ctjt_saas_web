<template>
  <div class="page" ref="pageRef">
    <SearchTable :prop-data.sync="searchForm" @select-change="searchSelectChange"></SearchTable>
    <p>
      <b class="td_text_red">{{totalAndSumAmountHtml}}</b>
    </p>
    <section class="table_section" ref="table_section">
      <CtjtTable
        :tableData="tableData"
        @option-call="tableOptionCallback"
        @selection-change="tableSelectionChange"
      ></CtjtTable>
    </section>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change='tableCurrentChange'
    ></CtjtPagination>
    <!-- 转车型 -->
    <el-drawer
      title="转车型"
      :visible.sync="drawerCarType"
      :direction="'rtl'"
      :size="'80%'"
      :before-close="handleCloseChangeCarType">
      <el-form class="page" ref="changeCarModelFormRef" :model="changeCarModelFormData" :rules="changeCarModelFormRules" label-width="100px">
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item label="学员姓名：">{{changeCarModelFormData.name}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证件号码：">{{changeCarModelFormData.idNo}}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item label="总学时（含赠送）：">{{changeCarModelFormData.sumPeriod}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="剩余学时：">{{changeCarModelFormData.surplusPeriod}}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item label="原车型：">{{changeCarModelFormData.oldCarModel}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="现车型" prop="carModel">
              <el-select class="w_200"
                v-model="changeCarModelFormData.carModel"
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
        </el-row>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item label="原车品牌：">{{changeCarModelFormData.oldCarBrand}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="现车品牌" prop="carBrand">
              <el-select class="w_200"
                v-model="changeCarModelFormData.carBrand"
                placeholder="请选择">
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
          <el-col :span="12">
            <el-form-item label="学 时" prop="period">
              <el-input class="w_200" v-model="changeCarModelFormData.period" placeholder="请输入"></el-input>
              <p class="td_text_red">学时不可大于剩余学时</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="补费金额" prop="amount">
              <el-input class="w_200" v-model="changeCarModelFormData.amount" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item label="操作日期：">{{$dayjs(new Date()).format('YYYY-MM-DD')}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作人：">{{userInfo.name}}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item label="备注" prop="remarks">
              <el-input type="textarea" v-model="changeCarModelFormData.remarks" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left"><b>支付信息</b></el-divider>
        <el-card shadow="never" v-for="(item, index) in changeCarModelFormData.payInfoList" :key="index">
          <div slot="header" class="clearfix">
            <el-button type="primary" v-if="index === 0" @click="addOrderPayVos()">新增支付记录</el-button>
            <el-button type="danger" v-if="index > 0" @click="deleteOrderPayVos(index)">删除支付记录</el-button>
          </div>
          <el-form-item
            label="支付方式"
            :prop="`payInfoList.${index}.payType`"
            :rules="changeCarModelFormRules.orderPayVosPayType">
            <el-radio-group v-model="item.payType" @change="payTypeChange(index)">
              <el-radio v-for="(item, index) in payTypeOpts" :key="index" :label="item.id" >{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="收款金额"
            :prop="`payInfoList.${index}.amount`"
            :rules="changeCarModelFormRules.orderPayVosAmount">
            <el-input class="w_300" v-model="item.amount" placeholder="请输入"/>
          </el-form-item>
          <el-form-item
            label="收款时间"
            :prop="`payInfoList.${index}.payTime`"
            :rules="changeCarModelFormRules.orderPayVosPayTime">
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
              :rules="changeCarModelFormRules.orderPayVosPayContent">
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
              :rules="changeCarModelFormRules.orderPayVosOutTradeNo">
              <el-input class="w_400" v-model.trim="item.outTradeNo" placeholder="请输入" maxlength="50" show-word-limit/>
              </el-form-item>
          </template>
          <template v-if="item.payType === 4">
            <el-form-item
              label="收款二维码编号"
              :prop="`payInfoList.${index}.payContent`"
              :rules="changeCarModelFormRules.orderPayVosPayContent">
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
              :rules="changeCarModelFormRules.orderPayVosOutTradeNo">
              <el-input class="w_400" v-model.trim="item.outTradeNo" placeholder="请输入" maxlength="50" show-word-limit/>
              </el-form-item>
          </template>
          <template v-if="item.payType === 3">
            <el-form-item
              label="付款账号"
              :prop="`payInfoList.${index}.transactionId`"
              :rules="changeCarModelFormRules.orderPayVosTransactionId">
              <el-input class="w_400" v-model.trim="item.transactionId" placeholder="请输入" maxlength="50" show-word-limit/>
            </el-form-item>
            <el-form-item
              label="收款账号"
              :prop="`payInfoList.${index}.payContent`"
              :rules="changeCarModelFormRules.orderPayVosPayContent">
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
              :rules="changeCarModelFormRules.orderPayVosPayContent">
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
              :rules="changeCarModelFormRules.orderPayVosTransactionId">
              <el-input class="w_400" v-model.trim="item.transactionId" placeholder="请输入" maxlength="50" show-word-limit/>
              </el-form-item>
            <el-form-item
              label="核销码"
              :prop="`payInfoList.${index}.outTradeNo`"
              :rules="changeCarModelFormRules.orderPayVosOutTradeNo">
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
        <el-row type="flex" justify="center">
          <el-button @click="handleCloseChangeCarType()">取消</el-button>
          <el-button type="primary" :loading="submitLoading" @click="handleSubmitChangeCarType()">确定</el-button>
        </el-row>
      </el-form>
    </el-drawer>
    <!-- 学车记录 -->
    <el-drawer
      title="学车记录"
      :visible.sync="drawerStudyCarLogs"
      :direction="'rtl'"
      :size="'80%'">
      <section class="page">
        <CtjtTable v-if="drawerStudyCarLogs" :tableData="studyCarLogsTable" @sort-change="studyCarLogsTableSortChange"></CtjtTable>
        <CtjtPagination
          :prop-data="studyCarLogsPaginationData"
          @on-size-change="studyCarLogsTableSizeChange"
          @on-current-change='studyCarLogsTableCurrentChange'
        ></CtjtPagination>
      </section>
    </el-drawer>
    <!-- 分配教练 -->
    <el-dialog
      title="分配教练"
      :visible.sync="dialogVisibleAssignCoach"
      width="30%">
      <el-form ref="assignCoachFormRef" :model="assignCoachFormData" :rules="assignCoachFormRules" label-width="100px">
        <el-form-item label="教练" prop="coachId">
          <el-select class="w_200" v-model="assignCoachFormData.coachId" @change="handleChangeCoach" placeholder="请选择">
            <el-option
              v-for="item in assignCoachOpts"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-button @click="handleCloseAssignCoach()">取 消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmitAssignCoach()">确 定</el-button>
      </el-row>
    </el-dialog>
    <!-- 选择打印支付记录 -->
    <el-dialog
      title="选择要打印的收据"
      :visible.sync="showReceipt"
      width="360px"
      center
      :before-close="handleReceiptClose">
      <el-select v-model="receiptType" placeholder="请选择" style="width: 100%">
        <el-option
          v-for="item in receiptOpts"
          :key="item.id"
          :label="item.receipt"
          :value="item.id">
        </el-option>
      </el-select>
      <span slot="footer">
        <el-button @click="handleReceiptClose">取 消</el-button>
        <el-button type="primary" @click="handleReceiptSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 打印 -->
    <CtjtFinancePrint
      :visible.sync="printShow"
      :table-data="printTableData"
    ></CtjtFinancePrint>
    <!-- 学时解冻 -->
    <el-dialog
      title="学时解冻"
      :visible.sync="dialogVisibleUnfreeze"
      width="800px"
      :before-close="handleCloseUnfreeze">
      <el-form :mode="formUnfreeze" label-width="80px" ref="formUnfreezeRef">
        <el-form-item label="解冻备注" prop="unfreezeRemark">
          <el-input v-model.trim="formUnfreeze.unfreezeRemark" type="textarea" show-word-limit maxlength="100" />
        </el-form-item>
        <el-form-item label="附件" prop="unfreezeAccessory" ref="photoUrl">
          <CtjtUploadOSS :prop-config="uploadConfig" @on-upload="unfreezeUploadFunc">
            <template #content>
              <el-button size="small" type="primary">上传</el-button>
            </template>
          </CtjtUploadOSS>
          <div style="margin-top: 10px;">
            <el-tag
              class="mr-20"
              v-for="(item, index) in formUnfreeze.unfreezeAccessory"
              :key="item"
              closable
              @close="deleteUnfreeze(index)"
            >
              <el-link
                :href="`${ossBaseUrl}${item}`"
                type="primary"
                :underline="false"
                target="_blank">附件{{index+1}}</el-link>
            </el-tag>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseUnfreeze">取 消</el-button>
        <el-button type="primary" @click="submitUnfreeze">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script lang='ts'>
import Index from './list';

export default class MarketSanXueOrderMgList extends Index {}
</script>
<style lang="scss" scoped>
::v-deep .el-drawer__body {
  overflow: auto;
}
.page {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.table_section {
  flex: 1;
}
</style>
