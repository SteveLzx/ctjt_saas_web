<template>
  <div class="page">
    <CtjtCard :prop-data="{ title: '转陪驾审核' }">
      <template slot="header">
        <span style="float: right">
          <el-button type="primary" v-if="perm['btn_cxbj']" @click="submit(3)">重新编辑</el-button>
          <el-button type="danger" v-if="perm['btn_shbtg']" @click="submit(1)">驳回</el-button>
          <el-button type="primary" v-if="perm['btn_shtg']" @click="submit(2)">通过</el-button>
          <el-button @click="close">返回</el-button>
        </span>
      </template>
      <template #content>
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formDataRules"
          label-width="110px"
          class="approval_form page"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="招生订单：" >
                <span>{{ formData.seq }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="姓名：" >
                <span>{{ formData.userName }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="证件号码：" >
                <span>{{ formData.idNo }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="班别：" >
                <span>{{ formData.classesName }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="优惠活动：" >
                <span>{{ formData.activityName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="门店：" >
                <span>{{ formData.storeName }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="报名日期：" >
                <span>{{ $dayjs(formData.registerTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="毕业日期：" >
                <span>{{ $dayjs(formData.graduationTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="转入类型：" prop="type">
                <el-radio-group v-model="formData.type" ::disabled="type !== 1">
                  <el-radio :label="1">转入散学陪驾</el-radio>
                  <el-radio :label="3">转入散学陪驾历史库（不需要后续服务）</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="赠送学时：" prop="presentPeriod">
                <el-input v-model="formData.presentPeriod" readonly class="w_260"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="散学车型：" prop="carModel">
                <el-select v-model="formData.carModel" :disabled="type !== 1" placeholder="请选择散学车型" class="w_260">
                  <el-option
                    v-for="item in sanxueCarType"
                    :key="item.id"
                    :label="item.label"
                    :value="item.label"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="8" type="flex">
            <el-form-item
              label="接送地址："
              prop="pickUpProvinceId"
            >
              <el-select
                class="w_200"
                placeholder="选择省份"
                v-model="formData.pickUpProvinceId"
                @change="provChange"
                :disabled="type !== 1"
              >
                <el-option
                  v-for="item in provData"
                  :key="item.adcode"
                  :label="item.name"
                  :value="item.adcode"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label-width="10px" prop="pickUpCityId">
              <el-select
                class="w_200"
                :disabled="type !== 1"
                placeholder="选择城市"
                v-model="formData.pickUpCityId"
                @change="cityChange"
                @visible-change="cityVisible"
              >
                <el-option
                  v-for="item in cityData"
                  :key="item.adcode"
                  :label="item.name"
                  :value="item.adcode"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label-width="10px">
              <el-select
                class="w_200"
                :disabled="type !== 1"
                placeholder="选择区域"
                v-model="formData.pickUpAreaId"
                @visible-change="areaVisible"
                clearable
              >
                <el-option
                  v-for="item in areaData"
                  :key="item.adcode"
                  :label="item.name"
                  :value="item.adcode"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label-width="10px" prop="pickUpDetail">
              <el-input
                class="w_400"
                v-model.trim="formData.pickUpDetail"
                :disabled="type !== 1"
                placeholder="请输入详细地址"
                maxlength="60"
                show-word-limit
                clearable
              />
            </el-form-item>
          </el-row>
          <el-row :gutter="8">
            <el-col :span="12">
              <el-form-item label="回访情况：" prop="returnVisit">
                <el-input
                  v-model.trim="formData.returnVisit"
                  :readonly="type !== 1"
                  type="textarea"
                  maxlength="300"
                  show-word-limit
                  :rows="4"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center" v-if="type === 1">
            <el-button
              type="primary"
              class="mr-20"
              :loading="submitLoading"
              @click="submitForm">保存</el-button>
          </el-row>
        </el-form>
      </template>
    </CtjtCard>
    <CtjtCard :prop-data="{ title: '审核信息' }">
      <template #content>
        <CtjtTable :tableData="tableData"></CtjtTable>
      </template>
    </CtjtCard>
    <CtjtRejectDialog
      :dialogVisible.sync="rejectShow"
      :type="2"
      :id="formData.approveId"
      @on-submit="rejectCallBack"
    ></CtjtRejectDialog>
  </div>
</template>
<script lang='ts'>
import Index from './edit';

export default class MarketSanXueCxToPjMgEdit extends Index {}
</script>
