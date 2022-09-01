<template>
  <el-form ref="orderForm" :model="formData" :rules="formRules" label-width="125px" class="page">
    <el-divider v-if="formData.seq" content-position="left"><b>订单号：{{formData.seq}}</b></el-divider>
    <CtjtCard :prop-data="{ title: '学员基本信息' }">
      <template #content>
        <el-row :gutter="8">
          <el-col :span="8">
            <el-form-item label="学员姓名" class="ctjt_form_item_class" prop="userName">
              <el-input class="w_300" v-model.trim="formData.userName" type="text" placeholder="请输入" maxlength="10" :disabled="isEdit" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="户籍" class="ctjt_form_item_class" prop="studentVo.domicile">
              <el-select class="w_300" v-model="formData.studentVo.domicile" placeholder="请选择" :disabled="isEdit">
                <el-option
                  v-for="(item, index) in domicileOpts"
                  :key="index"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号码" class="ctjt_form_item_class" prop="mobile">
              <el-input class="w_300" v-model.trim="formData.mobile" type="tel" maxlength="11" placeholder="请输入" :disabled="isEdit" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="8">
            <el-form-item label="证件类型" class="ctjt_form_item_class" prop="studentVo.certificateType">
              <el-select
                class="w_300"
                v-model="formData.studentVo.certificateType"
                :disabled="isEdit"
                placeholder="请选择"
                @change="handleCertificateType">
                <el-option
                  v-for="item in idNoTypeList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证件号码" class="ctjt_form_item_class" prop="studentVo.idNo">
              <el-input
                class="w_300"
                v-model.trim="formData.studentVo.idNo"
                placeholder="请输入"
                maxlength="18"
                :disabled="isEdit" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性别" class="ctjt_form_item_class" prop="studentVo.sex">
              <el-select class="w_300" v-model="formData.studentVo.sex" placeholder="请选择" :disabled="isEdit">
                <el-option
                  v-for="item in sexList"
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
            <el-form-item label="出生日期" class="ctjt_form_item_class" prop="studentVo.birthdate">
                <el-date-picker
                  class="w_300"
                  type="date"
                  :disabled="isEdit || formData.studentVo.certificateType === 1"
                  v-model="formData.studentVo.birthdate"
                  placeholder="选择出生日期">
                </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="紧急联系人" class="ctjt_form_item_class" prop="studentVo.emergencyContact">
              <el-input class="w_300" v-model.trim="formData.studentVo.emergencyContact" placeholder="请输入" :disabled="isEdit" maxlength="10" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="紧急联系人电话" class="ctjt_form_item_class" prop="studentVo.emergencyContactPhone">
              <el-input class="w_300" v-model.trim="formData.studentVo.emergencyContactPhone" type="tel" maxlength="11" :disabled="isEdit" placeholder="请输入" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="职业" class="ctjt_form_item_class" prop="studentVo.isStudent">
              <el-radio-group v-model="formData.studentVo.isStudent" @change="handleIsStudentChange" :disabled="isEdit">
                <el-radio :label="1">学生</el-radio>
                <el-radio :label="0">其他</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="formData.studentVo.isStudent===0">
            <el-form-item label="职业名称" class="ctjt_form_item_class" prop="studentVo.job">
              <el-input
                class="w_300"
                v-model.trim="formData.studentVo.job"
                :disabled="isEdit"
                placeholder="请输入"
                maxlength="12"
                show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="userInfo.drivingSchoolId === '3374' && formData.studentVo.isStudent === 1">
            <el-form-item label="学校名称" class="ctjt_form_item_class" prop="extension.schoolName">
              <el-select class="w_300" v-model="formData.extension.schoolName" placeholder="请选择" :disabled="isEdit">
                <el-option
                  v-for="item in schoolNameOpts"
                  :key="item.id"
                  :label="item.label"
                  :value="item.label">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8" v-if="userInfo.drivingSchoolId !== '370'">
          <el-col :span="24">
            <el-form-item label="接送服务站" class="ctjt_form_item_class" prop="serviceStation">
              <el-select class="w_600 c_select" v-model="formData.serviceStation" placeholder="请选择" :popper-append-to-body="false" clearable :disabled="isEdit">
                <el-option
                  v-for="item in serviceStationOpts"
                  :key="item.id"
                  :label="`${item.code}-${item.address}`"
                  :value="`${item.code}-${item.address}`">
                  <div class="c_div">
                    <div class="c_label">{{ item.code }}</div>
                    <div class="c_value">{{ item.address }}</div>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="24">
            <el-form-item label="证件地址" class="ctjt_form_item_class" prop="studentVo.certificateAddress">
              <template v-if="userInfo.drivingSchoolId === '370'">
                <el-input v-if="formData.id > 0" class="w_600" v-model.trim="formData.studentVo.certificateAddress" placeholder="请输入" disabled />
                <el-row :gutter="8" type="flex" v-if="!isEdit">
                  <el-form-item label="" prop="_certificateProvince">
                    <el-select class="w_160" placeholder="选择省份" v-model="formData._certificateProvince" @change="certificateProvChange" :disabled="isEdit">
                      <el-option
                        v-for="item in provData"
                        :key="item.adcode"
                        :label="item.name"
                        :value="item.name">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label-width="10px" prop="_certificateCity">
                    <el-select class="w_160" placeholder="选择城市" v-model="formData._certificateCity" @change="certificateCityChange" @visible-change="certificateCityVisible" :disabled="isEdit">
                      <el-option
                        v-for="item in certificateCityOpts"
                        :key="item.adcode"
                        :label="item.name"
                        :value="item.name">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label-width="10px">
                    <el-select class="w_160" placeholder="选择区域" v-model="formData._certificateArea"  @visible-change="certificateAreaVisible" :disabled="isEdit" clearable>
                      <el-option
                        v-for="item in certificateAreaOpts"
                        :key="item.adcode"
                        :label="item.name"
                        :value="item.name">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label-width="10px" prop="_certificateAddress">
                    <el-input class="w_400" v-model.trim="formData._certificateAddress" placeholder="请输入详细地址" :disabled="isEdit" maxlength="60" show-word-limit clearable />
                  </el-form-item>
                </el-row>
              </template>
              <template v-else>
                <el-input class="w_600" v-model.trim="formData.studentVo.certificateAddress" placeholder="请输入" maxlength="60" show-word-limit clearable :disabled="isEdit" />
              </template>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8" type="flex">
          <el-form-item label="居住地址" prop="studentVo.dwellProvinceId">
            <el-select class="w_160" placeholder="选择省份" v-model="formData.studentVo.dwellProvinceId" @change="provChange" :disabled="isEdit">
              <el-option
                v-for="item in provData"
                :key="item.adcode"
                :label="item.name"
                :value="item.adcode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="10px" prop="studentVo.dwellCityId">
            <el-select class="w_160" placeholder="选择城市" v-model="formData.studentVo.dwellCityId" @change="cityChange" @visible-change="cityVisible" :disabled="isEdit">
              <el-option
                v-for="item in cityData"
                :key="item.adcode"
                :label="item.name"
                :value="item.adcode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="10px">
            <el-select class="w_160" placeholder="选择区域" v-model="formData.studentVo.dwellAreaId"  @visible-change="areaVisible" :disabled="isEdit" clearable>
              <el-option
                v-for="item in areaData"
                :key="item.adcode"
                :label="item.name"
                :value="item.adcode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="10px">
            <el-input class="w_400" v-model.trim="formData.studentVo.address" placeholder="请输入详细地址" :disabled="isEdit" maxlength="60" show-word-limit clearable />
          </el-form-item>
        </el-row>
      </template>
    </CtjtCard>
    <CtjtCard :prop-data="{ title: '报考信息' }">
      <template #content>
        <el-row :gutter="8">
          <el-col :span="8">
            <el-form-item label="商品名称" class="ctjt_form_item_class" prop="" v-if="formData.productName">
              {{formData.productName}}
            </el-form-item>
            <el-form-item label="班别" class="ctjt_form_item_class" prop="classesName" v-else>
              <el-select class="w_300" v-model="formData.classesName" placeholder="请选择" @change="handleclassesNameChange" :disabled="isEdit || syncFlag">
                <el-option
                  v-for="(item, index) in classessList"
                  :key="index"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="培训车型" class="ctjt_form_item_class" prop="carModel">
              <el-select  class="w_300" v-model="formData.carModel" placeholder="请选择" @change="handleCarModelChange" :disabled="isEdit || syncFlag">
                <el-option
                  v-for="(item, index) in carModelList"
                  :key="index"
                  :label="item.carModel"
                  :value="item.carModel">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="学车类型" class="ctjt_form_item_class" prop="learnType">
              <el-select  class="w_300" v-model="formData.learnType" @change="handleLearnTypeChange" placeholder="请选择" :disabled="isEdit">
                <el-option
                  v-for="(item, index) in learnTypeList"
                  :key="index"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="8" v-if="formData.learnType === '3' || formData.learnType === '4'">
            <el-form-item label="培训阶段" class="ctjt_form_item_class" prop="trainStage">
              <el-select  class="w_300" v-model="formData.trainStage" placeholder="请选择" :disabled="isEdit">
                <el-option
                  v-for="(item, index) in trainingPhaseList"
                  :key="index"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同编号" class="ctjt_form_item_class" prop="contractNumber">
              <el-input  class="w_300" v-model.trim="formData.contractNumber" placeholder="请输入" maxlength="30" :disabled="isEdit" show-word-limit/>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="带教方式" class="ctjt_form_item_class" prop="teachingType">
              <el-radio-group v-model="formData.teachingType" :disabled="isEdit">
                <el-radio
                  v-for="(item, index) in teachingTypeList"
                  :key="index"
                  :label="item.id">{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-row :gutter="8">
          <el-col :span="8">
              <el-form-item label="训练场" class="ctjt_form_item_class" prop="trainingPlaceName">
                <el-select class="w_300" v-model="formData.trainingPlaceName" placeholder="请选择" :disabled="isEdit" @change="trainingPlaceChange">
                  <el-option
                    v-for="(item, index) in spaceTrainingPlaceOpts"
                    :key="index"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          <template v-if="formData.learnType==='2'">
            <el-col :span="8">
              <el-form-item label="原驾驶证" class="ctjt_form_item_class" prop="studentVo.driveType">
                <el-select class="w_300" v-model="formData.studentVo.driveType" placeholder="请选择" :disabled="isEdit">
                  <el-option
                    v-for="(item, index) in driveTypelList"
                    :key="index"
                    :label="item.label"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="原驾驶证截止日期" class="ctjt_form_item_class"  prop="studentVo.driveEndDate">
                <el-date-picker
                  class="w_300"
                  :disabled="isEdit"
                  type="date"
                  v-model="formData.studentVo.driveEndDate"
                  placeholder="选择结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </template>
    </CtjtCard>
    <CtjtCard :prop-data="{ title: '发票信息' }">
      <template #content>
        <el-row :gutter="8">
          <el-col :span="8">
            <el-form-item label="发票类型" class="ctjt_form_item_class" prop="invoiceVo.type">
              <el-radio-group v-model="formData.invoiceVo.type" :disabled="isEdit">
                <el-radio
                  v-for="(item, index) in invoiceTypeList"
                  :key="index"
                  :label="item.id"
                >{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开票方式" class="ctjt_form_item_class" prop="invoiceVo.mode">
              <el-radio-group v-model="formData.invoiceVo.mode" :disabled="isEdit">
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
            <el-form-item label="发票名称" class="ctjt_form_item_class" prop="invoiceVo.name">
              <el-input class="w_400" v-model.trim="formData.invoiceVo.name" placeholder="请输入" maxlength="30" :disabled="isEdit" show-word-limit/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="formData.invoiceVo.mode===2" label="纳税人识别号" class="ctjt_form_item_class" prop="invoiceVo.identifyNumber">
              <el-input class="w_400" v-model.trim="formData.invoiceVo.identifyNumber" placeholder="请输入" maxlength="30" :disabled="isEdit" show-word-limit/>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </CtjtCard>
    <CtjtCard :prop-data="{ title: '营销优惠信息' }">
      <template #content>
        <el-tabs v-model="markemodulId">
          <el-tab-pane label="营销优惠信息" name="1">
            <el-row :gutter="8">
              <el-col :span="8">
                <el-form-item label="获知途径" class="ctjt_form_item_class" prop="sourceChannel">
                  <el-select class="w_300" v-model="formData.sourceChannel" placeholder="请选择" :disabled="isEdit" clearable>
                    <el-option
                      v-for="(item, index) in sourceList"
                      :key="index"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="营销渠道" class="ctjt_form_item_class" prop="marketingChannel">
                  <el-cascader class="w_300"
                    :disabled="isEdit"
                    v-model="formData.marketingChannel"
                    :options="marketList"
                    :props="optionCityProps"
                    @change="handleMarketingChannelChange"
                    clearable
                  ></el-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item v-if="formData.marketingChannel.length > 0" label="推荐人" class="ctjt_form_item_class" prop="referrerName">
                  <template v-if="marketingChannelByReferrerOpt.includes(formData.marketingChannel[0])">
                    <el-autocomplete class="w_300"
                      :disabled="isEdit"
                      v-model.trim="formData.referrerName"
                      :fetch-suggestions="queryCoachList"
                      placeholder="请输入"
                      :maxlength="20"
                      show-word-limit
                      @select="handleReferrerNameSelect"
                    >
                      <template slot-scope="{ item }">
                        <div>{{ item.name }}</div>
                        <span>{{ item.mobile }}</span>
                      </template>
                    </el-autocomplete>
                  </template>
                  <template v-else>
                    <el-input class="w_300" v-model.trim="formData.referrerName" placeholder="请输入" :maxlength="20" show-word-limit :disabled="isEdit"></el-input>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="8">
              <el-col :span="8">
                <el-form-item label="渠道优惠金额：" class="ctjt_form_item_class">{{formData.channelAmount || 0}}元</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="优惠活动" class="ctjt_form_item_class" prop="activityName">
                  <el-select class="w_300" v-model="formData.activityName" @change="handleActivityChange" :disabled="isEdit || !formData.classesId" clearable placeholder="请选择">
                    <el-option
                      v-for="(item, index) in activityList"
                      :key="index"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="活动优惠：" class="ctjt_form_item_class">{{formData.activityAmount || 0}}元</el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="classHoursOpts.length > 0">
              <el-col :span="8">
                <el-form-item label="赠送陪驾学时" class="ctjt_form_item_class" prop="presentPeriod">
                  <el-select class="w_300" v-model="formData.presentPeriod" :disabled="isEdit" clearable placeholder="请选择">
                    <el-option
                      v-for="(item, index) in classHoursOpts"
                      :key="index"
                      :label="item.timeLength"
                      :value="item.timeLength">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="8">
              <el-col :span="8">
                <el-form-item label="其他优惠" class="ctjt_form_item_class" prop="otherDiscounts">
                  <el-input class="w_300" v-model="formData.otherDiscounts" placeholder="请输入" :disabled="isEdit"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="录入客服：" class="ctjt_form_item_class" prop="createdName">
                  {{formData.createdName}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="报名门店：" class="ctjt_form_item_class" prop="storeName">
                  {{formData.storeName}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="8">
              <el-col :span="8">
                <el-form-item label="赠品" class="ctjt_form_item_class" prop="gift">
                  <el-select class="w_300" v-model="formData.gift" :disabled="isEdit" @change="handleGiftChange" clearable placeholder="请选择">
                    <el-option
                      v-for="(item, index) in giftOpts"
                      :key="index"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                  <p class="td_text_red" v-if="surplus !== null">剩余库存：{{surplus}}</p>
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="formData.gift">
                <el-form-item label="赠品数量" class="ctjt_form_item_class" prop="giftNum">
                  <el-input class="w_300" v-model.number="formData.giftNum" @input="handleGiftNumInput" placeholder="请输入" :disabled="isEdit"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="代理人姓名" class="ctjt_form_item_class" prop="agent">
                  <el-input class="w_300" v-model.trim="formData.agent" placeholder="请输入" maxlength="20" show-word-limit :disabled="isEdit"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="考试费/补考费信息" name="2">
            <el-divider content-position="left">考试费</el-divider>
            <el-row :gutter="4">
              <el-col :span="24">
                <el-form-item label="包含科目" label-width="140px" class="ctjt_form_item_class" prop="containFee">
                  <el-checkbox-group disabled v-model="markemodulData.containFee">
                    <el-checkbox v-for="(item, index) in containFeeOpt" :key="index" :label="item.value">{{item.label}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-divider content-position="left">补考费</el-divider>
            <el-form-item label="包含科目/考试次数" prop="resit" label-width="140px">
              <el-row>
                <el-col :span="12">
                  <el-form-item style="margin-bottom: 20px;" label="科目一" prop="subjectOneResit" label-width="90px">
                    <el-select class="w_200" v-model="markemodulData.subjectOneResit" placeholder="" disabled>
                      <el-option v-for="item in upExamList" :key="item.id" :label="item.label" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item style="margin-bottom: 20px;" label="科目二" prop="subjectTwoResit" label-width="90px">
                    <el-select class="w_200" v-model="markemodulData.subjectTwoResit" placeholder="" disabled>
                      <el-option v-for="item in upExamList" :key="item.id" :label="item.label" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item style="margin-bottom: 10px;" label="科目三" prop="subjectThreeResit" label-width="90px">
                    <el-select class="w_200" v-model="markemodulData.subjectThreeResit" placeholder="" disabled>
                      <el-option v-for="item in upExamList" :key="item.id" :label="item.label" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
            <el-divider content-position="left">缺考费</el-divider>
            <el-form-item label="包含科目/考试次数" label-width="140px" prop="absent">
              <el-row>
                <el-col :span="12">
                  <el-form-item style="margin-bottom: 20px;" label="科目一" prop="subjectOneAbsent" label-width="90px">
                    <el-select class="w_200" v-model="markemodulData.subjectOneAbsent" placeholder="" disabled>
                      <el-option v-for="item in upExamList" :key="item.id" :label="item.label" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item style="margin-bottom: 20px;" label="科目二" prop="subjectTwoAbsent" label-width="90px">
                    <el-select class="w_200" v-model="markemodulData.subjectTwoAbsent" placeholder="" disabled>
                      <el-option v-for="item in upExamList" :key="item.id" :label="item.label" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item style="margin-bottom: 10px;" label="科目三" prop="subjectThreeAbsent" label-width="90px">
                    <el-select class="w_200" v-model="markemodulData.subjectThreeAbsent" placeholder="" disabled>
                      <el-option v-for="item in upExamList" :key="item.id" :label="item.label" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </template>
    </CtjtCard>
    <CtjtCard :prop-data="{ title: '订单信息' }">
      <template #content>
        <el-row :gutter="8">
          <el-col :span="8">
            <el-form-item label="原价：" class="ctjt_form_item_class" prop="">
              {{formData.originalPrice}}元
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="优惠总金额：" class="ctjt_form_item_class">{{formData.discountAmount}}元</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单金额：" class="ctjt_form_item_class" prop="salePrice">{{formData.salePrice}}元</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="8">
            <el-form-item label="学费缴费方式" class="ctjt_form_item_class" prop="isInstallment">
              <el-select
                class="w_300"
                v-model="formData.isInstallment" placeholder="请选择"
                :disabled="isEdit || syncFlag || !isInstallmentChange">
                <el-option
                  v-for="(item, index) in payMentTypeList"
                  :key="index"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="订单备注" class="ctjt_form_item_class" prop="remark">
              <el-input class="w_600" v-model.trim="formData.remark" type="text" maxlength="100" placeholder="请输入" :disabled="isEdit" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="8" v-if="userInfo.drivingSchoolId !== '3374'">
            <el-form-item label="资金监管缴纳方式" class="ctjt_form_item_class" prop="superviseType">
              <el-select
                class="w_300"
                v-model="formData.superviseType" placeholder="请选择"
                :disabled="isEdit">
                <el-option
                  v-for="(item, index) in [{ id: 1, label: '全款' }, {id:2, label: '分期' }]"
                  :key="index"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="userInfo.drivingSchoolId === '370'">
            <el-form-item label="上门接送" class="ctjt_form_item_class">
              <el-select
                class="w_300"
                v-model="formData.extension.driver" placeholder="请选择"
                clearable
                filterable
                :disabled="isEdit">
                <el-option
                  v-for="(item) in companyUsersOpts"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </CtjtCard>
    <CtjtCard :prop-data="{ title: '支付信息'}">
      <template #header>
        <b class="td_text_red mr-20">
          <template v-if="formData.isInstallment === 1 && formData.phaseOneAmount > 0">
            首期金额：{{ Number(formData.phaseOneAmount).toFixed(2) }}
            <el-divider direction="vertical"></el-divider>
          </template>
          待收金额：￥{{(formData.salePrice - orderAmount).toFixed(2) || 0}}
          <el-divider direction="vertical"></el-divider>
          实收金额：￥{{Number(orderAmount).toFixed(2)}}
        </b>
      </template>
      <template #content>
        <!-- 默认展示列表 -->
        <template v-if="$route.query.id > 0">
          <CtjtTable :tableData="orderPaytableData"></CtjtTable>
        </template>
        <!-- 编辑时展示 -->
        <template v-if="!$route.query.id">
          <el-card class="mt-20" shadow="never" v-for="(item, index) in formData.orderPayVos" :key="index">
            <div slot="header" class="clearfix">
              <el-button type="primary" v-if="index === 0" @click="addOrderPayVos">新增支付记录</el-button>
              <el-button type="danger" v-if="index > 0" @click="deleteOrderPayVos(index)">删除支付记录</el-button>
            </div>
            <el-form-item
              label="支付方式"
              :prop="`orderPayVos.${index}.payType`"
              :rules="formRules.orderPayVosPayType">
              <el-radio-group v-model="item.payType" @change="payTypeChange(index)" :disabled="isEdit || item.isEdit">
                <el-radio v-for="(item, index) in payTypeList" :key="index" :label="item.id" >{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="收款金额"
              :prop="`orderPayVos.${index}.amount`"
              :rules="formRules.orderPayVosAmount">
              <el-input class="w_300" v-model="item.amount" placeholder="请输入"/>
            </el-form-item>
            <el-form-item
              label="收款时间"
              :prop="`orderPayVos.${index}.payTime`"
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
                :prop="`orderPayVos.${index}.payContent`"
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
                :prop="`orderPayVos.${index}.outTradeNo`"
                :rules="formRules.orderPayVosOutTradeNo">
                <el-input class="w_400" v-model.trim="item.outTradeNo" placeholder="请输入" maxlength="50" :disabled="isEdit || item.isEdit" show-word-limit/>
                </el-form-item>
            </template>
            <template v-if="item.payType === 4">
              <el-form-item
                label="收款二维码编号"
                :prop="`orderPayVos.${index}.payContent`"
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
                :prop="`orderPayVos.${index}.outTradeNo`"
                :rules="formRules.orderPayVosOutTradeNo">
                <el-input class="w_400" v-model.trim="item.outTradeNo" placeholder="请输入" maxlength="50" :disabled="isEdit || item.isEdit" show-word-limit/>
                </el-form-item>
            </template>
            <template v-if="item.payType === 3">
              <el-form-item
                label="付款账号"
                :prop="`orderPayVos.${index}.transactionId`"
                :rules="formRules.orderPayVosTransactionId">
                <el-input class="w_400" v-model.trim="item.transactionId" placeholder="请输入" maxlength="50" :disabled="isEdit || item.isEdit" show-word-limit/>
              </el-form-item>
              <el-form-item
                label="收款账号"
                :prop="`orderPayVos.${index}.payContent`"
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
                :prop="`orderPayVos.${index}.payContent`"
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
                :prop="`orderPayVos.${index}.transactionId`"
                :rules="formRules.orderPayVosTransactionId">
                <el-input class="w_400" v-model.trim="item.transactionId" placeholder="请输入" maxlength="50" :disabled="isEdit || item.isEdit" show-word-limit/>
                </el-form-item>
              <el-form-item
                label="核销码"
                :prop="`orderPayVos.${index}.outTradeNo`"
                :rules="formRules.orderPayVosOutTradeNo">
                <el-input class="w_400" v-model.trim="item.outTradeNo" placeholder="请输入" maxlength="50" :disabled="isEdit || item.isEdit" show-word-limit/>
                </el-form-item>
            </template>
            <template>
              <el-form-item
                label="备注"
                :prop="`orderPayVos.${index}.remark`">
                <el-input class="w_400" type="textarea" v-model.trim="item.remark" placeholder="请输入" maxlength="200" :disabled="isEdit || item.isEdit" show-word-limit/>
                </el-form-item>
              <el-form-item
                label="费用科目"
                :prop="`orderPayVos.${index}.feeName`"
                :rules="formRules.orderPayVosFeeName">
                <el-select class="w_400" v-model="item.feeName" :disabled="isEdit || item.isEdit" placeholder="请选择">
                  <el-option
                    v-for="item in ['培训费', '预报名费']"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-card>
        </template>
      </template>
    </CtjtCard>
    <CtjtCard :prop-data="{ title: '订单修改记录' }" v-if="modifyTableList.length > 0">
      <template #content>
        <section class="update_table_container" v-for="item in modifyTableList" :key="item.label">
          <p style="padding: 16px 0;">变更内容：</p>
          <el-table :data="item.options" border style="width: 100%">
            <el-table-column type="index" width="50" label="序号" :align="'center'"></el-table-column>
            <el-table-column prop="updateField" label="字段" :align="'center'" :formatter="formUpdateField"></el-table-column>
            <el-table-column prop="afterField" label="变更前" :align="'center'" :formatter="formUpdateAfter"></el-table-column>
            <el-table-column prop="beforeField" label="变更后" :align="'center'" :formatter="formUpdateBefore"></el-table-column>
          </el-table>
          <p style="padding: 16px 0;">{{item.options[0] | updatedData}}</p>
        </section>
      </template>
    </CtjtCard>
    <el-row type="flex" justify="center" style="padding-bottom: 30px;">
      <el-button @click="cancelSubmit">取消</el-button>
      <el-button v-if="perm['btn_save']" type="primary" @click="submit" :disabled="isEdit" :loading="submitLoading">保存</el-button>
    </el-row>
  </el-form>
</template>

<script lang="ts">
import { State, Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { CtjtCard, CtjtTable, CtjtAutocomplete } from '@/components';
import {
  OLD_DRIVER_LICENSE, ORDER_LEARN_TYPE, ORDER_TEACHING_TYPE, ORDER_PAYMENT_TYPE,
  ORDER_IDNO_TYPE, ORDER_TRAINING_PHASE, ORDER_OPEN_INVOICE, ORDER_INVOICE_TYPE, ORDER_OPEN_INVOICE_TYPE,
  ORDER_IS_INSTALLMENT, MARKET_MAKE_UP_EXAM, ORDER_PAY_TYPE, EDUCATIONAL_SEX, NATIVE_PLACE, THIRD_CHANNELS_OPTS
} from '@/enums';
import { VueComponentParent, ParamsType } from '@/type';
import {
  REG_PHONE, REG_PRICE, getUUserCardSex, getUUserCardBirth, REG_USERCARD, mapDataExChange, deepClone,
  jsReduceFunc, jsAddFunc, REG_INTEGER, NUMBER_AND_EN_REG, REG_PRICE_OR_ZONE
} from '@/assets/js/common';
import { examSubjectsOpt } from '@/views/educational/_enums';
import clearCacheMixins from '@/mixins/clearCache';

const OptionCityProps = {
  value: 'secondLevelName',
  label: 'secondLevelName',
  children: 'list',
  multiple: false, // 可多选
  emitPath: true,
};

@Component({
  components: {
    CtjtCard,
    CtjtTable,
    CtjtAutocomplete
  },
  filters: {
    updatedData: (val: any) => {
      const { reason, updatedName, updatedTime } = val;
      return `修改原因：客服${updatedName}：${reason}；修改时间：${updatedTime}`;
    }
  }
})
export default class OrderEnrollmentDetail extends mixins(clearCacheMixins) {
  @State((state) => state.base.userInfo) userInfo: any;

  @Action('space/queryTrainingPlaceByDrivingSchoolIdList') private queryTrainingPlaceByDrivingSchoolIdList!: () => ParamsType;

  @Action('finance/queryAllPosTerminalNoList') private queryAllPosTerminalNoList!: (data: any) => ParamsType;

  @Action('finance/queryAllBankAccountList') private queryAllBankAccountList!: () => ParamsType;

  @Action('goods/queryClasses') private queryClasses!: (data: any) => ParamsType;

  @Action('goods/queryClassesInfoList') private queryClassesInfoList!: (data: any) => ParamsType;

  @Action('user/queryReferrerInfo') private queryReferrerInfo!: (data?: any) => any;

  @Action('order/saveOrUpdate') private saveOrUpdate!: (data: any) => ParamsType;

  @Action('order/queryOrder') private queryOrder!: (data: any) => ParamsType;

  @Action('sale/querySourceDropDownBoxList') private querySourceDropDownBoxList!: (data: any) => ParamsType;

  @Action('sale/queryMarketListDropDownBoxList') private queryMarketListDropDownBoxList!: (data: any) => ParamsType;

  @Action('sale/queryActivityDropDownBoxList') private queryActivityDropDownBoxList!: (data: any) => any;

  @Action('sale/queryActivityList') private queryActivityListOpts!: () => any;

  @Action('goods/queryExamFeeConditions') private queryExamFeeConditions!: (data: any) => any;

  @Action('order/getExamFeeByOrderId') private getExamFeeByOrderId!: (data: any) => any;

  @Action('sale/queryClassHoursDropDownBox') private queryClassHoursDropDownBox!: (data: any) => any;

  @Action('sale/queryGiftStickDropDownBox') private queryGiftStickDropDownBox!: () => any;

  @Action('sale/queryServiceStationOpts') private queryServiceStationOpts!: (data: any) => any;

  @Action('user/queryCompanyUsers') private queryCompanyUsers!: () => any;

  private optionCityProps = OptionCityProps;

  private containFeeOpt = deepClone(examSubjectsOpt).splice(0, 3);

  // 拉取省市区json
  // 户籍
  private domicileOpts: any[] = [];

  // 省数组
  private provCity = require('@/assets/json/prov.json');

  // 省数组
  private provData: any[] = [];

  // 市数组
  private cityData: any[] = [];

  // 区数组
  private areaData: any[] = [];

  private addressData = {
    provinceSubs: [],
    citySubs: [],
  }

  private orderField = require('@/assets/json/order_field.json');

  // 训练场
  private spaceTrainingPlaceOpts: ParamsType = [];

  // 证件类型
  private idNoTypeList = ORDER_IDNO_TYPE;

  // 培训阶段
  private trainingPhaseList = ORDER_TRAINING_PHASE;

  // 原驾驶证类型
  private driveTypelList = OLD_DRIVER_LICENSE;

  // 学车类型
  private learnTypeList = ORDER_LEARN_TYPE;

  // 带教方式
  private teachingTypeList = ORDER_TEACHING_TYPE;

  // 缴费方式
  private payMentTypeList = ORDER_PAYMENT_TYPE;

  // 是否开发票
  private openIncoiceList = ORDER_OPEN_INVOICE;

  // 发票类型
  private invoiceTypeList = ORDER_INVOICE_TYPE;

  // 开票方式
  private openIncoiceTypeList = ORDER_OPEN_INVOICE_TYPE;

  // 是否包含考试费/是否包含缺考费
  private booleanList = ORDER_IS_INSTALLMENT;

  // 补考次数
  private upExamList = MARKET_MAKE_UP_EXAM;

  // 支付方式
  private payTypeList = ORDER_PAY_TYPE;

  // 性别
  private sexList = EDUCATIONAL_SEX;

  // 客服所在驾校商品列表
  private goodsList = [];

  // 收款账号
  private allBankAccountOpts = [];

  // pos终端号
  private allPosTerminalNoOpts = [];

  // 第三方渠道名称
  private thirdChannelsOpts = THIRD_CHANNELS_OPTS;

  // 营销模块展示
  private markemodulId = '1';

  // 赠送学时列表
  private classHoursOpts: any[] = []

  // 服务站地址列表
  private serviceStationOpts: any[] = []

  // 惠州学校名称
  private schoolNameOpts: any[] = [
    { id: 1, label: '惠州经济职业技术学院' },
    { id: 2, label: '惠州卫生职业技术学院' },
    { id: 3, label: '惠州城市职业学院' },
    { id: 4, label: '惠州大学' },
    { id: 99, label: '其他' },
  ]

  // 接送人
  companyUsersOpts = []

  // 职业切换
  handleIsStudentChange(val: number) {
    if (val === 0) {
      this.formData.extension.schoolName = '';
    }
    if (val === 1) {
      this.formData.studentVo.job = '';
    }
  }

  // 赠品
  private giftOpts: any[] = []

  surplus = null // 赠品数量

  handleGiftChange(val: string) {
    const list = this.giftOpts.filter((item: any) => item.name === val);
    this.formData.giftId = list[0] ? list[0].id : '';
    this.surplus = list[0] ? list[0].surplus : null;
    this.formData.giftNum = null;
  }

  handleGiftNumInput(val: any) {
    const { surplus = 0 } = this;
    if (Number(surplus) < val) {
      this.formData.giftNum = surplus;
    }
  }

  // 获取赠送学时
  queryClassHoursOpts(classesId: string, activityId: string) {
    this.queryClassHoursDropDownBox({ classesId, activityId }).then((res: any) => {
      if (Array.isArray(res)) {
        const classHoursList: any[] = deepClone(res);
        classHoursList.forEach((item: any) => {
          const { timeLength } = item;
          const _item = item;
          _item.timeLength = timeLength / 60;
        });
        this.classHoursOpts = classHoursList;
      }
    });
  }

  private markemodulDataDeep: any = {
    containFee: [],
    subjectFourAbsent: null,
    subjectFourResit: null,
    subjectOneAbsent: null,
    subjectOneResit: null,
    subjectThreeAbsent: null,
    subjectThreeResit: null,
    subjectTwoAbsent: null,
    subjectTwoResit: null,
  };

  private markemodulData: any = deepClone(this.markemodulDataDeep)

  private async handlemarkemodulFunc() {
    const { id } = this.formData;
    if (id > 0) {
      const body = await this.getExamFeeByOrderId({ orderId: id });
      if (body) {
        Object.keys(this.markemodulData).forEach(key => {
          if (key === 'containFee') {
            this.markemodulData[key] = body[key] ? JSON.parse(body[key]) : [];
          } else {
            this.markemodulData[key] = body[key];
          }
        });
      } else {
        this.markemodulData = (this as any)._data.markemodulDataDeep;
      }
    }
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

  /** 证件类型切换 */
  private handleCertificateType() {
    this.formData.studentVo.idNo = '';
    this.formData.studentVo.sex = 0;
    this.formData.studentVo.birthdate = '';
  }

  /** 班别切换 */
  private isInstallmentChange = false; // 分期缴费是否可以修改

  private async handleclassesNameChange(val: string) {
    this.classessList.forEach((item: any) => {
      // 请求班别下面的所有车型
      const { resitCount, name, containFee } = item;
      if (name === val) {
        this.formData.resitCount = resitCount || 0;
        this.formData.isResitCost = containFee ? 1 : 0;
        this._getCarModel(item);
      }
    });
    // 清空数据
    this._resetFormData();
    const body = await this.queryExamFeeConditions({ classesName: val });
    if (body) {
      Object.keys(this.markemodulData).forEach(key => {
        if (key === 'containFee') {
          this.markemodulData[key] = body[key] ? JSON.parse(body[key]) : [];
        } else {
          this.markemodulData[key] = body[key];
        }
      });
    } else {
      this.markemodulData = (this as any)._data.markemodulDataDeep;
    }
  }

  /** 培训车型切换 */
  handleCarModelChange(val: string) {
    // 清空数据
    this._resetFormData('carModel');
    this.carModelList.forEach((item: any) => {
      const {
        carModel, price, id, installment, phaseOneAmount
      } = item;
      if (carModel === val) {
        this.formData.originalPrice = price;
        this.formData.salePrice = price;
        this.formData.classesId = id;
        // 判断是否支持分期缴费
        this.isInstallmentChange = installment;
        this.formData.isInstallment = installment ? 1 : 0;
        this.formData.phaseOneAmount = installment ? phaseOneAmount : 0;
      }
    });
  }

  trainingPlaceChange(val: string) {
    this.spaceTrainingPlaceOpts.forEach((item: any) => {
      if (item.name === val) {
        this.formData.trainingPlaceId = item.id;
      }
    });
  }

  get allDiscount() {
    const { channelAmount, activityAmount, otherDiscounts } = this.formData;
    const _price = jsAddFunc(jsAddFunc(Number(channelAmount), Number(activityAmount)), Number(otherDiscounts));
    return _price;
  }

  @Watch('allDiscount')
  private watchAllDiscount(newVal: number) {
    const { originalPrice } = this.formData;
    this.formData.discountAmount = newVal;
    if (originalPrice > 0) {
      const _price = jsReduceFunc(originalPrice, newVal);
      this.formData.salePrice = _price;
    }
  }

  @Watch('formData.studentVo.idNo', { immediate: true, deep: true })
  private setUUserCardSex(newVal: string) {
    if (this.formData.studentVo.certificateType === 1) {
      if (newVal.length === 18) {
        this.formData.studentVo.sex = getUUserCardSex(newVal);
        this.formData.studentVo.birthdate = getUUserCardBirth(newVal);
      }
    }
  }

  @Watch('formData.userName', { immediate: true, deep: true })
  private setinvoiceVoNameByName(val: number) {
    const { id } = this.$route.query;
    if (this.formData.invoiceVo.mode === 1 && !id) {
      this.formData.invoiceVo.name = val;
    }
  }

  @Watch('formData.invoiceVo.mode', { immediate: true, deep: true })
  private setinvoiceVoName(val: number) {
    const { id } = this.$route.query;
    if (val === 1 && !id) {
      this.formData.invoiceVo.name = this.formData.userName;
    }
  }

  handleLearnTypeChange(val: string) {
    if (val !== '2') {
      this.formData.studentVo.driveType = null;
      this.formData.studentVo.driveEndDate = '';
    }
    if (val !== '3' && val !== '4') {
      this.formData.trainStage = null;
    }
  }

  /** 根据字段转换中文 */
  formUpdateField(row: any) {
    const { updateField } = row;
    const _text = this.orderField[updateField];
    if (!_text) return updateField;
    return _text;
  }

  /** 详情表单 开始 */

  /** 班别切换清空数据 */
  _resetFormData(val?: string) {
    this.formData.learnType = null;
    this.formData.teachingType = null;
    this.formData.sourceChannel = '';
    this.formData.marketingChannel = [];
    this.formData.channelAmount = 0;
    this.formData.activityId = null;
    this.formData.activityName = '';
    this.formData.activityAmount = 0;
    this.formData.presentPeriod = null;
    this.classHoursOpts = [];
    this.formData.otherDiscounts = null;
    this.formData.isInstallment = 0;
    this.formData.phaseOneAmount = 0;
    if (!val || !val.includes('carModel')) {
      this.formData.carModel = '';
    }
  }

  private isEdit = false; // 表单是否可编辑

  private submitLoading = false; // 提交loading

  private orderAmount = 0; // 实际收款金额

  private oldOrderDetail = ''; // 原始订单详情

  // 表单数据配置
  private formData: ParamsType = {
    activityId: '', // 活动id
    activityName: '', // 活动名称
    balance: null, // 待收金额
    seq: '', // 订单号
    auditStatus: 0, // 审核状态1已审核，0未审核
    carModel: '', // 车型 C1,C2
    classesName: '', // 班别名称
    classesId: '', // 班别id
    coachId: '', // 教练id
    coachName: '', // 意向教练
    contractNumber: '', // 合同编号
    createdName: '', // 创建人姓名
    drivingSchoolId: '', // 驾校id
    drivingSchoolName: '', // 驾校名称
    discountAmount: 0, // 总优惠金额
    id: '', // id
    invoiceVo: {
      id: '', // 发票id 新增不用，修改返回后端
      identifyNumber: '', // 纳税人识别号
      mode: 1, // 开票方式，1个人，2企业
      name: '', // 发票名称
      type: 1, // 发票类型，1普通，2专票
    },
    isInstallment: 0, // 是否分期付款，0为否，1为是
    superviseType: 2, // 资金监管缴纳方式 1全款, 2分期
    isInvoice: 1, // 是否开发票，1是，0否
    isMissExamCost: 0, // 是否包含缺考费，1是，2否
    isResitCost: 0, // 是否包含补考费，1是，0否
    learnType: '', // 学车类型 {id:1,label:初学}，{id:2,label:增驾}，{id:3,label:本地转入}，{id:4,label:异地转入}
    marketingChannel: [], // 营销渠道
    mobile: '', // 手机号码
    orderLogReq: {
      reason: '', // 修改理由
      updatedName: '', // 修改姓名
    }, // 修改理由, // 订单日志
    orderPayVos: [
      {
        amount: '', // 支付金额，单位
        id: '', // 支付id
        payContent: '', // pos终端号，第三方渠道名称，收款账号, 收款二维码编号
        payTime: this.$dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'), // 支付完成时间
        payType: 2, // 支付类型
        receipt: '', // 收据编号
        outTradeNo: '', // 交易参考号、核销码
        transactionId: '', // 第三方订单号、付款账号
        isEdit: false, // 是否可以编辑
        remark: '', // 上缴现金备注
        feeName: '培训费', // 费用科目
      }
    ], // 支付信息
    originalPrice: 0, // 原价
    productId: '', // 商品id
    productName: '', // 商品名称
    referrerName: '', // 推荐人姓名
    referrerId: '', // 推荐人id
    regionId: '', // 片区id
    regionName: '', // 片区名称
    remark: '', // 订单备注
    resitCount: 0, // 补考次数，-1不限补考次数，0不包补考次数，其他为多少次
    salePrice: 0, // 销售价
    sourceChannel: '', // 来源渠道
    storeId: '', // 门店id
    storeName: '', // 门店名称
    studentVo: { // 学员信息
      address: '', // 居住地址
      dwellProvinceId: '', // 省份
      dwellCityId: '', // 城市
      dwellAreaId: '', // 区域
      birthdate: '', // 出生日期
      certificateAddress: '', // 证件地址
      certificateType: 1, // 证件类型，1身份证，2护照，3军官证
      domicile: '', // 户籍
      driveEndDate: '', // 原驾驶证截止时间
      driveNumber: '', // 原驾驶证号码
      driveType: null, // 原驾驶证类型
      emergencyContact: '', // 紧急联系人
      emergencyContactPhone: '', // 紧急联系人手机
      isStudent: 1, // 是否学生
      job: '', // 职业
      sex: 0, // 性別，1男，2女
      idNo: '', // 证件号
    },
    trainStage: '', // 培训阶段 {id:1：label：未学科}
    teachingType: '', // 带教方式
    userId: '', // 用id
    userName: '', // 用户姓名
    channelAmount: null, // 渠道优惠金额
    activityAmount: null, // 活动优惠金额
    presentPeriod: null, // 赠送活动时间
    otherDiscounts: null, // 其他优惠金额
    trainingPlaceName: '', // 训练场名
    trainingPlaceId: '', // 训练场ID
    syncFlag: null, // 是否转牌证
    gift: '', // 赠品
    giftId: '', // 赠品id
    giftNum: null, // 赠品数量
    agent: '', // 代理人姓名
    serviceStation: '', // 接送服务站
    extension: {
      schoolName: '',
      driver: ''
    }, // 扩展字段 {schoolName: '惠州大学', driver: '接送人'}
    phaseOneAmount: 0, // 首期金额
    _certificateProvince: '', // 本地字段
    _certificateCity: '', // 本地字段
    _certificateArea: '', // 本地字段
    _certificateAddress: '', // 本地字段
  }

  // 表单验证规则

  private validateIdNo = (rule: any, value: string, callback: any) => {
    const { certificateType } = this.formData.studentVo;
    if (value === '') {
      callback(new Error('请输入证件号码'));
    } else if (certificateType === 1 && !REG_USERCARD.test(value)) {
      callback(new Error('身份证号码有误'));
    } else {
      callback();
    }
  };

  private validatePeriod = (rule: any, value: string, callback: any) => {
    const { drivingSchoolId } = this.$store.state.base.userInfo;
    const { marketingChannel } = this.formData;
    if (drivingSchoolId === '370') {
      if (marketingChannel.includes('关系户学员')) {
        if (!/^[0-9]\d{0,5}(\.\d{1,2})?$/.test(value)) {
          callback(new Error('范围0-999999.99, 可保留两位小数'));
        } else {
          callback();
        }
      } else if ((value && !/^[0-9]\d{0,3}(\.\d{1,2})?$/.test(value)) || Number(value) > 300) {
        callback(new Error('范围0.01-300.00, 可保留两位小数'));
      } else {
        callback();
      }
    } else if ((value && !/^[0-9]\d{0,3}(\.\d{1,2})?$/.test(value)) || Number(value) > 300) {
      callback(new Error('范围0.01-300.00, 可保留两位小数'));
    } else {
      callback();
    }
  }

  private formRules = {
    'invoiceVo.type': [
      { required: true, message: '请选择发票类型', trigger: 'change' }
    ],
    'invoiceVo.mode': [
      { required: true, message: '请选择开票方式', trigger: 'change' }
    ],
    'invoiceVo.name': [
      { required: true, message: '请输入发票名称', trigger: 'blur' }
    ],
    'invoiceVo.identifyNumber': [
      { required: true, message: '请输入纳税人识别号', trigger: 'blur' }
    ],
    'studentVo.isStudent': [
      { required: true, message: '请选择职业', trigger: 'change' }
    ],
    'studentVo.certificateType': [
      { required: true, message: '请选择证件类型', trigger: 'change' }
    ],
    'studentVo.certificateAddress': [
      { required: true, message: '请输入证件地址', trigger: 'blur' }
    ],
    'studentVo.idNo': [
      { required: true, message: '请输入证件号码', trigger: 'change' },
      {
        validator: this.validateIdNo, trigger: ['change', 'blur']
      }
    ],
    'studentVo.sex': [
      { required: true, message: '请选择性别', trigger: 'change' }
    ],
    'studentVo.birthdate': [
      { required: true, message: '请选择出生日期', trigger: 'change' }
    ],
    'studentVo.driveType': [
      { required: true, message: '请选择原驾驶证', trigger: 'change' }
    ],
    'studentVo.driveEndDate': [
      { required: true, message: '选择结束日期', trigger: 'change' }
    ],
    'studentVo.emergencyContactPhone': [
      { pattern: REG_PHONE, message: '请输入正确的格式' }
    ],
    'studentVo.dwellProvinceId': [
      { required: true, message: '请选择省份', trigger: 'blur' }
    ],
    'studentVo.dwellCityId': [
      { required: true, message: '请选择城市', trigger: 'blur' }
    ],
    'extension.schoolName': [
      { required: true, message: '请选择学校名称', trigger: 'blur' }
    ],
    trainStage: [
      { required: true, message: '请选择培训阶段', trigger: 'change' }
    ],
    mobile: [
      { required: true, message: '请输入手机号码', trigger: 'blur' },
      { pattern: REG_PHONE, message: '请输入正确的格式', trigger: 'change' }
    ],
    carModel: [
      { required: true, message: '请选择车型', trigger: 'change' }
    ],
    trainingPlaceName: [
      { required: false, message: '请选择训练场', trigger: ['change', 'blur'] }
    ],
    learnType: [
      { required: true, message: '请选择学车类型', trigger: 'change' }
    ],
    isResitCost: [
      { required: true, message: '请选择是否包含考试费', trigger: 'change' }
    ],
    resitCount: [
      { required: true, message: '请选择赠送补考次数', trigger: 'change' }
    ],
    isMissExamCost: [
      { required: true, message: '请选择是否包含缺考费', trigger: 'change' }
    ],
    classesName: [
      { required: true, message: '请输入班别名称', trigger: 'change' }
    ],
    isInstallment: [
      { required: true, message: '请选择缴费方式', trigger: 'change' }
    ],
    marketingChannel: [
      { required: true, message: '请选择营销渠道', trigger: 'change' }
    ],
    sourceChannel: [
      { required: false, message: '请选择来源渠道', trigger: 'change' }
    ],
    referrerName: [
      { required: false, message: '请输入推荐人姓名', trigger: 'blur' }
    ],
    userName: [
      { required: true, message: '请输入学员姓名', trigger: 'blur' }
    ],
    originalPrice: [
      { required: true, message: '请输入原价', trigger: 'blur' },
      { pattern: REG_PRICE, message: '范围1-999999,可保留两位小数' }
    ],
    otherDiscounts: [
      { validator: this.validatePeriod, trigger: ['change', 'blur'] }
    ],
    activityName: [
      { required: true, message: '请选择优惠活动', trigger: 'change' }
    ],
    presentPeriod: [
      { required: true, message: '请选择赠送陪驾学时', trigger: 'change' }
    ],
    // 循环支付列表校验
    orderPayVosPayType: [
      { required: true, message: '必选项', trigger: 'blur' }
    ],
    orderPayVosPayContent: [
      { required: true, message: '必填项', trigger: 'blur' }
    ],
    orderPayVosOutTradeNo: [
      { pattern: NUMBER_AND_EN_REG, message: '请输入英文或数字', trigger: ['change'] }
    ],
    orderPayVosTransactionId: [
      { required: true, message: '必填项', trigger: 'blur' },
      { pattern: NUMBER_AND_EN_REG, message: '请输入英文或数字', trigger: ['change'] }
    ],
    orderPayVosAmount: [
      { required: true, message: '请输入收款金额', trigger: 'blur' },
      { pattern: REG_PRICE_OR_ZONE, message: '范围0-999999,可保留两位小数' }
    ],
    orderPayVosPayTime: [
      { required: true, message: '请选择收款日期', trigger: 'change' }
    ],
    orderPayVosFeeName: [
      { required: true, message: '请选择费用科目', trigger: 'change' }
    ],
    superviseType: [
      { required: true, message: '必填项', trigger: 'blur' }
    ],
    giftNum: [
      { required: true, message: '必填项', trigger: 'blur' },
      { pattern: REG_INTEGER, message: '请输入>0的正整数' }
    ]
  }
  /** 详情表单 结束 */

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

  editOrderPayVos(val: number) {
    let sendData = {};
    this.formData.orderPayVos.forEach((item: any, index: number) => {
      if (index === val) {
        const { id, orderId } = item;
        sendData = {
          orderId, orderType: 1, payId: id
        };
      }
    });
    this.$router.push({
      path: '/finance/transaction_mg/system_flow/detail',
      query: { obj: encodeURIComponent(JSON.stringify({ ...sendData, isDetail: false })) }
    });
  }

  payTypeChange(val: number) {
    let _index = 0;
    let _item: any = {};
    this.formData.orderPayVos.forEach((item: any, index: number) => {
      if (index === val) {
        _index = index;
        _item = deepClone(item);
        _item.payContent = _item.payType === 6 ? '上缴现金' : '';
        _item.outTradeNo = '';
        _item.transactionId = '';
        _item.remark = '';
        _item.feeName = '培训费';
      }
    });
    this.$set(this.formData.payInfoList, _index, _item);
  }

  addOrderPayVos() {
    const { orderPayVos } = this.formData;
    const len = orderPayVos.length;
    if (len > 9) {
      this.$message.warning('支付记录不能超过10条');
    } else {
      const obj = {
        amount: '',
        id: '',
        payContent: '',
        payTime: this.$dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        payType: 2,
        receipt: '',
        outTradeNo: '',
        transactionId: '',
        isEdit: false,
        remark: '',
        feeName: '培训费',
      };
      orderPayVos.push(obj);
    }
  }

  deleteOrderPayVos(index: number) {
    const { orderPayVos } = this.formData;
    orderPayVos.splice(index, 1);
  }

  // 订单修改记录表格设置
  private modifyTableList = [];

  private syncFlag = false;

  /**
   * 请求回来数据特殊处理
   */
  private _setFormDataFunc(param: ParamsType) {
    // 深拷贝一份数据
    const _data = deepClone(param);
    this.syncFlag = _data.syncFlag !== 0; // 转牌证后，部分字段不能修改
    Object.keys(this.formData).forEach(key => {
      if (_data[key] !== null && _data[key] !== undefined) {
        if (key === 'originalPrice' || key === 'salePrice') {
          this.formData[key] = String(_data[key]);
        } else if (key === 'trainStage' && _data[key]) {
          const _trainStage = JSON.parse(_data[key]);
          this.formData[key] = _trainStage.id;
        } else if (key === 'learnType') {
          const _learnType = JSON.parse(_data[key]);
          const _id = _learnType.id;
          this.formData[key] = _id === '0' ? '-' : _id;
        } else if (key === 'teachingType') {
          if (_data[key]) {
            const _teachingType = JSON.parse(_data[key]);
            const _id = _teachingType.id;
            this.formData[key] = _id === '0' ? '-' : _id;
          }
        } else if (key === 'studentVo') {
          const _studentVo = _data[key];
          Object.keys(_studentVo).forEach(k => {
            if (k === 'driveType') {
              this.formData[key][k] = _studentVo[k] > 0 ? _studentVo[k] : null;
            } else if (k === 'dwellProvinceId' || k === 'dwellCityId' || k === 'dwellAreaId') {
              this.formData[key][k] = _studentVo[k] > 0 ? String(_studentVo[k]) : '';
              if (k === 'dwellProvinceId') {
                this.provChange(this.formData[key][k]);
              }
              if (k === 'dwellCityId') {
                this.cityChange(this.formData[key][k]);
              }
            } else {
              this.formData[key][k] = _studentVo[k];
            }
          });
        } else if (key === 'invoiceVo') {
          const _invoiceVo = _data[key];
          Object.keys(_invoiceVo).forEach(k => {
            this.formData[key][k] = _invoiceVo[k];
            if (k === 'name') {
              if (this.formData[key].mode === 1 && !this.formData[key].name) {
                this.formData[key][k] = this.formData.userName;
              }
            }
          });
        } else if (key === 'orderPayVos') {
          const _orderPayVos = _data[key];
          let _amount = 0;
          _orderPayVos.forEach((item: any) => {
            const _item = item;
            _item.amount = String(_item.amount);
            _amount = jsAddFunc(parseFloat(_item.amount), _amount);
            _item.isEdit = true;
          });
          this.formData[key] = _orderPayVos;
          this.orderAmount = _amount;
          this.orderPaytableData.list = deepClone(_orderPayVos);
        } else if (key === 'isInvoice') {
          this.formData[key] = 1;
        } else if (key === 'marketingChannel') {
          if (_data[key]) {
            this.formData[key] = _data[key].split('/');
          }
        } else if (key === 'extension') {
          if (_data[key]) {
            this.formData[key] = JSON.parse(_data[key]);
          }
        } else if (key === 'classesName') {
          this.formData[key] = _data[key];
          this._getCarModel({ name: _data[key], id: _data.classesId });
        } else {
          this.formData[key] = _data[key];
        }
      } else if (key === 'invoiceVo') {
        this.formData[key].name = _data.userName;
      } else if (key === 'studentVo') {
        this.formData[key].isStudent = null;
      }
    });
    // 修改列表
    if (_data.orderLogDtoMap) {
      // 订单修改列表
      const _list = mapDataExChange(_data.orderLogDtoMap);
      this.modifyTableList = _list;
    }
    this.oldOrderDetail = JSON.stringify(this.formData); // 提交时对比
    this.$nextTick(() => {
      (this.$refs.orderForm as VueComponentParent).clearValidate();
    });
    this.formRules.trainingPlaceName[0].required = _data.drivingSchoolId === '370';
  }

  /** 请求处理 */

  /** 查询用户下下面所有班别 */
  private classessList: ParamsType = [];

  async queryClassessList() {
    const sendData = { isExamFee: true, type: 1 };
    const body = await this.queryClassesInfoList(sendData);
    this.classessList = body;
  }

  /** 查询班别下面的所有车型 */
  private carModelList: ParamsType[] = [];

  async _getCarModel(val: ParamsType) {
    const { id, name } = val;
    const sendData = {
      id,
      name,
      status: 1,
      type: 1,
      current: 1,
      pageSize: 100,
    };
    const body = await this.queryClasses(sendData);
    const { data } = body;
    const _list = deepClone(data);
    _list.forEach((item: any) => {
      const _item = item;
      _item.disabled = false;
    });
    this.carModelList = _list;
  }

  /** 获取客服详情 */
  async getUserInfos() {
    const {
      regionName, regionId, storeName, storeId, name, drivingSchoolName, drivingSchoolId
    } = this.userInfo;
    const { id } = this.$route.query;
    if (!id) {
      // 新增的时候，给本地赋值，编辑不需要赋值
      this.formData.drivingSchoolName = drivingSchoolName;
      this.formData.drivingSchoolId = drivingSchoolId;
      this.formData.regionName = regionName;
      this.formData.regionId = regionId;
      this.formData.storeName = storeName;
      this.formData.storeId = storeId;
      this.formData.createdName = name;
      this.formRules.trainingPlaceName[0].required = drivingSchoolId === '370';
    }
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
      const data = await this.queryOrder({ id });
      const { classesId, activityId } = data;
      this.queryClassHoursOpts(classesId, activityId);
      // 处理返回来的字段
      this._setFormDataFunc(data);
      // 请求考试费
      this.handlemarkemodulFunc();
    } else {
      const { drivingSchoolId } = this.userInfo;
      if (drivingSchoolId === '370') {
        this.formData.studentVo.dwellProvince = '广东省';
        this.formData.studentVo.dwellProvinceId = '440000';
        this.provChange('440000');
        this.formData.studentVo.dwellCity = '深圳市';
        this.formData.studentVo.dwellCityId = '440300';
        this.cityChange('440300');
        this.formData._certificateProvince = '广东省';
        this.certificateProvChange('广东省');
        this.formData._certificateCity = '深圳市';
        this.certificateCityChange('深圳市');
      }
    }
  }

  private coachListOpts = [];

  private coachLoading = false;

  private timeout: any = null

  /**
   * 查询当前驾校下所有教练的列表
   */
  async queryCoachList(name: string, cb: any) {
    const sendData = { name: name.trim() };
    if (name === '') {
      this.formData.referrerName = '';
      this.formData.referrerId = '';
      cb([]);
      return;
    }
    clearTimeout(this.timeout);
    this.timeout = setTimeout(async () => {
      this.coachLoading = true;
      const body = await this.queryReferrerInfo(sendData);
      this.coachListOpts = body;
      this.coachLoading = false;
      if (!body || body.length === 0) {
        this.formData.referrerName = '';
        this.formData.referrerId = '';
        this.$message.warning('暂无此人!');
        cb([]);
      }
      cb(body);
    }, 3000);
  }

  private handleReferrerNameSelect(val: any) {
    const { name, userId } = val;
    this.formData.referrerName = name;
    this.formData.referrerId = userId;
  }

  /** 查询获知途径 */
  private sourceList: ParamsType = [];

  async querySourceList() {
    const { drivingSchoolId } = this.userInfo;
    const sendData = {
      drivingSchoolId,
    };
    const body = await this.querySourceDropDownBoxList(sendData);
    this.sourceList = body;
  }

  private marketList: ParamsType[] = []; // 营销渠道

  /** 获取营销渠道 */
  async queryMarketList() {
    const { drivingSchoolId } = this.userInfo;
    const { id } = this.$route.query;
    const sendData = {
      drivingSchoolId,
      status: !id ? 1 : null
    };
    const body = await this.queryMarketListDropDownBoxList(sendData);
    // 后端返回的Map类型数据，处理营销渠道
    this._setMarketListFunc(body);
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
    this.marketList = _mapList;
  }

  private marketingChannelByReferrerOpt = [
    '市场专员招生', '顶班', '客服专员', '教练', '大客户', '内部员工', '服务店', '门店', '职能人员', '导师介绍'
  ]

  private handleMarketingChannelChange(val: string[]) {
    const { marketList } = this;
    if (val[0]) {
      marketList.forEach((item: any) => {
        const { list, secondLevelName } = item;
        if (secondLevelName === val[0]) {
          list.forEach((i: any) => {
            const { secondLevelName: _secondLevelName, discounts } = i;
            if (_secondLevelName === val[1]) {
              this.formData.channelAmount = discounts;
            }
          });
        }
      });
    } else {
      this.formData.channelAmount = 0;
    }
  }

  /** 查询班别所有活动 */
  private activityList: ParamsType[] = [];

  async queryActivityList() {
    const body = await this.queryActivityListOpts();
    this.activityList = body;
  }

  /** 优惠活动切换 */
  async handleActivityChange(val: string) {
    // 通过班别id，驾校id，活动id 去查询这个车型优惠活动金额
    const { drivingSchoolId, regionId, storeId } = this.userInfo;
    const { classesId } = this.formData;
    const { activityList } = this;
    const _list = activityList.filter(item => item.name === val);
    if (_list.length > 0) {
      const activityId = _list[0].id;
      this.formData.activityId = activityId;
      const list = [
        {
          drivingSchoolId,
          regionId,
          storeId,
          classesId,
          activityId
        }
      ];
      const sendData = {
        activityDropDownBoxReqList: list
      };
      this.queryActivityDropDownBoxList(sendData).then((res: any) => {
      // 拿到对应班别优惠信息，处理销售价
        if (res && res.length > 0) {
          this._setActivityAmount(res[0]);
        } else {
          this.formData.activityAmount = 0;
        }
      });
      this.queryClassHoursOpts(classesId, activityId);
    } else {
      this.formData.activityAmount = 0;
    }
    this.formData.presentPeriod = null;
    this.classHoursOpts = [];
  }

  private _setActivityAmount(val: ParamsType) {
    const { amount } = val;
    this.formData.activityAmount = amount;
  }

  /** 提交表单前，处理特殊字段 */
  private _specialHandleFormData() {
    // 深拷贝一份数据
    const sendData = deepClone(this.formData);
    const {
      studentVo, orderPayVos, isInvoice, learnType, invoiceVo, teachingType, salePrice,
      marketingChannel, trainStage, isInstallment, extension, phaseOneAmount, otherDiscounts
    } = sendData;
    // 时间处理
    sendData.studentVo.birthdate = studentVo.birthdate ? this.$dayjs(studentVo.birthdate).format('YYYY-MM-DD') : '';
    sendData.studentVo.driveEndDate = studentVo.driveEndDate ? this.$dayjs(studentVo.driveEndDate).format('YYYY-MM-DD') : '';
    // 支付列表处理
    let _orderPayVosAmount = 0; // 总收款金额
    orderPayVos.forEach((item: any) => {
      const { payTime, id, amount } = item;
      const _item = item;
      if (!id) delete _item.id;
      _item.payTime = payTime ? this.$dayjs(payTime).format('YYYY-MM-DD HH:mm:ss') : '';
      _orderPayVosAmount = jsAddFunc(_orderPayVosAmount, amount);
    });
    sendData.otherService = Number(otherDiscounts);
    // 判断价格
    const _salePrice = parseFloat(salePrice);
    if (_salePrice < 0) {
      this.$message.warning('订单金额小于0，请检查是否输入有误');
      return false;
    }
    sendData.balance = salePrice - this.orderAmount || 0;
    // 关系户，订单金额是可以为0
    const { drivingSchoolId } = this.userInfo;
    if (drivingSchoolId !== '370' || (drivingSchoolId === '370' && !marketingChannel.includes('关系户学员'))) {
      if (isInstallment === 1) {
        // 分期支付
        // 支付列表的支付信息要与首期金额一致
        if (!this.$route.query.id) {
          // 首期款≤【收款金额】＜全款报名费
          if (phaseOneAmount > _orderPayVosAmount) {
            this.$message.warning('分期缴费时，实收金额应>=首期款，请检查是否输入有误');
            return false;
          }
          if (_salePrice <= _orderPayVosAmount) {
            this.$message.warning('分期缴费时，实收金额应<全款报名费，请检查是否输入有误');
            return false;
          }
        }
      } else {
        // 全款支付
        // 收款金额不能高于销售价
        if (!this.$route.query.id) {
          if (_salePrice < _orderPayVosAmount) {
            this.$message.warning('收款金额不能高于订单金额，请检查是否输入有误');
            return false;
          }
          // 全款时，收款总金额必须等于订单金额
          if (_salePrice !== _orderPayVosAmount) {
            this.$message.warning('全款缴费时，实收金额与应收金额不一致，请检查是否输入有误');
            return false;
          }
        }
        // 待收金额
        if (sendData.balance < 0) {
          this.$message.warning('待收金额不能小于0，请检查是否输入有误');
          return false;
        }
      }
    } else if (_salePrice !== _orderPayVosAmount) {
      this.$message.warning('实收金额与待收金额不相等，不可提交！');
      return false;
    }

    // 学车类型
    const _learnType = this.learnTypeList.filter(item => item.id === learnType);
    sendData.learnType = JSON.stringify(_learnType[0]) || '';
    // 带教方式
    const _teachingType = this.teachingTypeList.filter(item => item.id === teachingType);
    sendData.teachingType = JSON.stringify(_teachingType[0]) || '';
    // 培训阶段
    const _trainStage = this.trainingPhaseList.filter((item: any) => item.id === trainStage);
    sendData.trainStage = JSON.stringify(_trainStage[0]) || '';
    // 发票
    if (isInvoice === 1 && !invoiceVo.id) {
      delete sendData.invoiceVo.id;
    }
    // 营销渠道
    sendData.marketingChannel = marketingChannel.join('/');
    sendData.presentPeriod = sendData.presentPeriod || 0;
    // 扩展字段
    sendData.extension = JSON.stringify(extension) || '';
    return sendData;
  }

  /**
   * 提交订单详情
   * 手动新增/修改
   */
  async submit() {
    const _formData = JSON.stringify(this.formData);
    if (this.oldOrderDetail === _formData) {
      this.cancelSubmit();
      return;
    }
    // 推荐人在搜索中，不让提交
    const { referrerName, referrerId, marketingChannel } = this.formData;
    if (this.marketingChannelByReferrerOpt.includes(marketingChannel[0])) {
      if (referrerName && !referrerId) {
        this.$message.warning('请选择推荐人！');
        return;
      }
    }
    (this.$refs.orderForm as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        // 特殊字段处理
        const sendData = this._specialHandleFormData();
        const { id } = sendData;
        if (id <= 0) delete sendData.id;
        // 修改提交时，弹窗输入修改理由
        if (id > 0 && !this.isEdit) {
          this.$prompt('请输入修改理由', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /^.{1,100}$/,
            inputErrorMessage: '输入内容长度为1-100'
          }).then((val: any) => {
            const { value } = val;
            sendData.orderLogReq.reason = value;
            sendData.orderLogReq.updatedName = this.userInfo.name;
            this.submitLoading = true;
            this.saveOrUpdate(sendData).then(() => {
              this.$message.success('修改成功');
              this.cancelSubmit();
            }).finally(() => {
              this.submitLoading = false;
            });
          }).catch(() => {
            this.$message.info('已放弃修改');
          });
        } else {
          sendData.orderLogReq.updatedName = this.userInfo.name;
          this.submitLoading = true;
          this.saveOrUpdate(sendData).then(() => {
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

  cancelSubmit() {
    (this.$refs.orderForm as VueComponentParent).resetFields();
    this.clearCache();
    this.$router.push({ path: '/market/order/enrollment/list' });
  }

  private formUpdateAfter(row: any) {
    const { updateField, afterField } = row;
    let _textArr = [];
    switch (updateField) {
      case 'mode':
        _textArr = this.openIncoiceTypeList.filter(item => item.id === parseFloat(afterField));
        if (_textArr.length > 0) {
          return _textArr[0].label;
        }
        return '-';
      case 'type':
        _textArr = this.invoiceTypeList.filter(item => item.id === parseFloat(afterField));
        if (_textArr.length > 0) {
          return _textArr[0].label;
        }
        return '-';
      case 'isResitCost':
        _textArr = this.booleanList.filter(item => item.id === parseFloat(afterField));
        if (_textArr.length > 0) {
          return _textArr[0].label;
        }
        return '-';
      case 'isMissExamCost':
        _textArr = this.booleanList.filter(item => item.id === parseFloat(afterField));
        if (_textArr.length > 0) {
          return _textArr[0].label;
        }
        return '-';
      case 'resitCount':
        _textArr = this.upExamList.filter(item => item.id === parseFloat(afterField));
        if (_textArr.length > 0) {
          return _textArr[0].label;
        }
        return '-';
      case 'certificateType':
        _textArr = this.idNoTypeList.filter(item => item.id === parseFloat(afterField));
        if (_textArr.length > 0) {
          return _textArr[0].label;
        }
        return '-';
      case 'driveType':
        _textArr = this.driveTypelList.filter(item => item.id === parseFloat(afterField));
        if (_textArr.length > 0) {
          return _textArr[0].label;
        }
        return '-';
      case 'isStudent':
        _textArr = this.booleanList.filter(item => item.id === parseFloat(afterField));
        if (_textArr.length > 0) {
          return _textArr[0].label;
        }
        return '-';
      case 'sex':
        _textArr = this.sexList.filter(item => item.id === parseFloat(afterField));
        if (_textArr.length > 0) {
          return _textArr[0].label;
        }
        return '-';
      case 'payType':
        _textArr = this.payTypeList.filter(item => item.id === parseFloat(afterField));
        if (_textArr.length > 0) {
          return _textArr[0].label;
        }
        return '-';
      case 'payTime':
        if (afterField) {
          return this.$dayjs(afterField).format('YYYY-MM-DD HH:mm:ss');
        }
        return '-';
      case 'dwellProvinceId':
        if (afterField) {
          let _text = '';
          this.provCity.forEach((item: any) => {
            const { adcode, name } = item;
            if (adcode === afterField) {
              _text = name;
            }
          });
          return _text;
        }
        return '-';
      case 'dwellCityId':
        if (afterField) {
          let _text = '';
          let _arr: any = [];
          this.provCity.forEach((item: any) => {
            const { subs } = item;
            _arr = [..._arr, item, ...subs];
          });
          _arr.forEach((item: any) => {
            const { adcode, name } = item;
            if (adcode === afterField) {
              _text = name;
            }
          });
          return _text;
        }
        return '-';
      case 'dwellAreaId':
        if (afterField) {
          let _text = '';
          let _arr: any = [];
          this.provCity.forEach((item: any) => {
            const { subs } = item;
            _arr = [..._arr, item, ...subs];
            subs.forEach((i: any) => {
              const { subs: _subs } = i;
              _arr = [..._arr, ..._subs];
            });
          });
          _arr.forEach((item: any) => {
            const { adcode, name } = item;
            if (adcode === afterField) {
              _text = name;
            }
          });
          return _text;
        }
        return '-';
      case 'channelAmount':
      case 'activityAmount':
      case 'presentPeriod':
      case 'discountAmount':
      case 'otherDiscounts':
        if (afterField) {
          return afterField;
        }
        return '0';
      default:
        return afterField || '-';
    }
  }

  private formUpdateBefore(row: any) {
    const { updateField, beforeField } = row;
    let _textArr = [];
    switch (updateField) {
      case 'mode':
        _textArr = this.openIncoiceTypeList.filter(item => item.id === parseFloat(beforeField));
        if (_textArr.length > 0) {
          return _textArr[0].label;
        }
        return '-';
      case 'type':
        _textArr = this.invoiceTypeList.filter(item => item.id === parseFloat(beforeField));
        if (_textArr.length > 0) {
          return _textArr[0].label;
        }
        return '-';
      case 'isResitCost':
        _textArr = this.booleanList.filter(item => item.id === parseFloat(beforeField));
        if (_textArr.length > 0) {
          return _textArr[0].label;
        }
        return '-';
      case 'isMissExamCost':
        _textArr = this.booleanList.filter(item => item.id === parseFloat(beforeField));
        if (_textArr.length > 0) {
          return _textArr[0].label;
        }
        return '-';
      case 'resitCount':
        _textArr = this.upExamList.filter(item => item.id === parseFloat(beforeField));
        if (_textArr.length > 0) {
          return _textArr[0].label;
        }
        return '-';
      case 'certificateType':
        _textArr = this.idNoTypeList.filter(item => item.id === parseFloat(beforeField));
        if (_textArr.length > 0) {
          return _textArr[0].label;
        }
        return '-';
      case 'driveType':
        _textArr = this.driveTypelList.filter(item => item.id === parseFloat(beforeField));
        if (_textArr.length > 0) {
          return _textArr[0].label;
        }
        return '-';
      case 'isStudent':
        _textArr = this.booleanList.filter(item => item.id === parseFloat(beforeField));
        if (_textArr.length > 0) {
          return _textArr[0].label;
        }
        return '-';
      case 'sex':
        _textArr = this.sexList.filter(item => item.id === parseFloat(beforeField));
        if (_textArr.length > 0) {
          return _textArr[0].label;
        }
        return '-';
      case 'payType':
        _textArr = this.payTypeList.filter(item => item.id === parseFloat(beforeField));
        if (_textArr.length > 0) {
          return _textArr[0].label;
        }
        return '-';
      case 'payTime':
        if (beforeField) {
          return this.$dayjs(beforeField).format('YYYY-MM-DD HH:mm:ss');
        }
        return '-';
      case 'dwellProvinceId':
        if (beforeField) {
          let _text = '';
          this.provCity.forEach((item: any) => {
            const { adcode, name } = item;
            if (adcode === beforeField) {
              _text = name;
            }
          });
          return _text;
        }
        return '-';
      case 'dwellCityId':
        if (beforeField) {
          let _text = '';
          let _arr: any = [];
          this.provCity.forEach((item: any) => {
            const { subs } = item;
            _arr = [..._arr, item, ...subs];
          });
          _arr.forEach((item: any) => {
            const { adcode, name } = item;
            if (adcode === beforeField) {
              _text = name;
            }
          });
          return _text;
        }
        return '-';
      case 'dwellAreaId':
        if (beforeField) {
          let _text = '';
          let _arr: any = [];
          this.provCity.forEach((item: any) => {
            const { subs } = item;
            _arr = [..._arr, item, ...subs];
            subs.forEach((i: any) => {
              const { subs: _subs } = i;
              _arr = [..._arr, ..._subs];
            });
          });
          _arr.forEach((item: any) => {
            const { adcode, name } = item;
            if (adcode === beforeField) {
              _text = name;
            }
          });
          return _text;
        }
        return '-';
      case 'channelAmount':
      case 'activityAmount':
      case 'presentPeriod':
      case 'discountAmount':
      case 'otherDiscounts':
        if (beforeField) {
          return beforeField;
        }
        return '0';
      default:
        return beforeField || '-';
    }
  }

  // 设置省
  setProvFunc() {
    this.provData = [];
    this.provCity.forEach((item: any) => {
      const { adcode, name } = item;
      const _obj = { adcode, name };
      this.provData.push(_obj);
    });
  }

  // 设置城市
  setCityFunc() {
    const { provinceSubs } = this.addressData;
    provinceSubs.forEach((item: any) => {
      const { adcode, name } = item;
      const _obj = { adcode, name };
      this.cityData.push(_obj);
    });
  }

  // 设置区域
  setAreaFunc() {
    const { citySubs } = this.addressData;
    citySubs.forEach((item: any) => {
      const { adcode, name } = item;
      const _obj = { adcode, name };
      this.areaData.push(_obj);
    });
  }

  // 省份切换选择
  provChange(event: string) {
    // 省份切换，清空城市，区域数组
    this.cityData = [];
    this.areaData = [];
    this.addressData.provinceSubs = [];
    this.addressData.citySubs = [];
    this.formData.studentVo.dwellCityId = '';
    this.formData.studentVo.dwellAreaId = '';

    this.provCity.forEach((item: any) => {
      const { adcode, subs } = item;
      if (adcode === event) {
        this.addressData.provinceSubs = subs;
      }
    });
    this.setCityFunc();
  }

  // 城市展开
  cityVisible(bool: boolean) {
    // 判断省份是否选中
    if (bool) {
      const { dwellProvinceId } = this.formData.studentVo;
      if (!dwellProvinceId) this.$message.warning('请先选中省份!');
    }
  }

  // 城市切换选择
  cityChange(event: string) {
    // 城市切换，区域数组
    this.areaData = [];
    this.addressData.citySubs = [];

    const { provinceSubs } = this.addressData;
    provinceSubs.forEach((item: any) => {
      const { adcode, subs } = item;
      if (adcode === event) {
        this.addressData.citySubs = subs;
      }
    });
    this.setAreaFunc();
  }

  // 区域展开
  areaVisible(bool: boolean) {
    // 判断省份是否选中
    if (bool) {
      const { dwellCityId } = this.formData.studentVo;
      if (!dwellCityId) this.$message.warning('请先选中城市!');
    }
  }

  // 证件地址
  certificateCityOpts = [];

  certificateAreaOpts = [];

  // 省份切换选择
  certificateProvChange(event: string) {
    // 省份切换，清空城市，区域数组
    this.certificateCityOpts = [];
    this.certificateAreaOpts = [];
    this.formData._certificateCity = '';
    this.formData._certificateArea = '';

    this.provCity.forEach((item: any) => {
      const { name, subs } = item;
      if (name === event) {
        this.certificateCityOpts = subs;
      }
    });
  }

  certificateCityChange(event: string) {
    // 城市切换，区域数组
    this.certificateAreaOpts = [];
    this.certificateCityOpts.forEach((item: any) => {
      const { name, subs } = item;
      if (name === event) {
        this.certificateAreaOpts = subs;
      }
    });
  }

  certificateCityVisible(bool: boolean) {
    if (bool) {
      const { _certificateProvince } = this.formData;
      if (!_certificateProvince) this.$message.warning('请先选中省份!');
    }
  }

  certificateAreaVisible(bool: boolean) {
    if (bool) {
      const { _certificateCity } = this.formData;
      if (!_certificateCity) this.$message.warning('请先选中城市!');
    }
  }

  @Watch('formData._certificateProvince', { immediate: true, deep: true })
  watchCertificateProvince() {
    this.getCertificateAddress();
  }

  @Watch('formData._certificateCity', { immediate: true, deep: true })
  watchCertificateCity() {
    this.getCertificateAddress();
  }

  @Watch('formData._certificateArea', { immediate: true, deep: true })
  watchCertificateArea() {
    this.getCertificateAddress();
  }

  @Watch('formData._certificateAddress', { immediate: true, deep: true })
  watchCertificateAddress() {
    this.getCertificateAddress();
  }

  getCertificateAddress() {
    const {
      _certificateProvince, _certificateCity, _certificateArea, _certificateAddress
    } = this.formData;
    this.formData.studentVo.certificateAddress = `${_certificateProvince}${_certificateCity}${_certificateArea}${_certificateAddress}`;
  }

  private async init() {
    this.domicileOpts = [...NATIVE_PLACE, ...this.provCity];
    this.setProvFunc();
    this.getUserInfos();
    this.queryClassessList();
    this.querySourceList();
    this.queryMarketList();
    this.queryActivityList();
    await this.queryDetail();
    this.queryGiftStickDropDownBox().then((res: any) => {
      if (Array.isArray(res)) {
        const deepRes = deepClone(res);
        deepRes.forEach((item: any) => {
          const { name, surplus } = item;
          const _item = item;
          if (name === this.formData.gift) {
            _item.surplus += Number(this.formData.giftNum);
            this.surplus = _item.surplus;
          }
        });
        this.giftOpts = deepRes;
      }
    });
    this.queryTrainingPlaceByDrivingSchoolIdList().then((res: any) => {
      this.spaceTrainingPlaceOpts = res;
    });
    this.queryAllBankAccountList().then((res: any) => {
      this.allBankAccountOpts = res;
    });
    this.queryAllPosTerminalNoList({ type: 2 }).then((res: any) => {
      this.allPosTerminalNoOpts = res;
    });
    const { drivingSchoolId } = this.userInfo;
    if (drivingSchoolId !== '370') {
      this.queryServiceStationOpts({ status: 0 }).then((res: any) => {
        this.serviceStationOpts = res;
      });
    } else {
      this.queryCompanyUsers().then((res: any) => {
        this.companyUsersOpts = res;
      });
    }
  }

  // 生命周期函数
  perm = {};

  async activated() {
    this.orderPaytableData._this = this;
    this.init();
    const permObj = await this.$getPerm(this);
    this.perm = permObj.perm;
  }
}
</script>
<style lang="scss" scoped>
.c_select {
  ::v-deep .el-select-dropdown__item {
    height: 46px !important;
  }
  ::v-deep .el-select-dropdown__wrap {
    max-height: 180px !important;
  }
}
.c_label {
  font-size: 14px;
  line-height: 26px;
}
.c_value {
  font-size: 12px;
  color: #999;
  line-height: 20px;
}
</style>
