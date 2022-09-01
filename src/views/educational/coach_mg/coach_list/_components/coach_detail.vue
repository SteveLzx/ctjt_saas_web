<template>
  <div class="">
    <el-form ref="coachForm" :model="formData" :rules="formRules" label-width="140px" class="bgc_fff">
      <div class="form_header_box" v-if="!$route.query.id">
        <el-row :gutter="20" type="flex" justify="left" align="center">
          <el-button type="primary" @click="openDrawer()">选择员工</el-button>
          <el-link class="ml-20" type="info" :underline="false">请在员工中选择您要新增的教练员</el-link>
        </el-row>
      </div>
      <CtjtCard :prop-data="{ title: '基本信息' }">
        <template #content>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="教练姓名：" class="ctjt_form_item_class">
                {{formData.userName}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号：" class="ctjt_form_item_class">
                {{formData.mobile}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="性别：" class="ctjt_form_item_class">
                {{formData.sex | sexFilter}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="入职时间：" class="ctjt_form_item_class">
                {{formData.entryTime ? $dayjs(formData.entryTime).format('YYYY-MM-DD HH:mm:ss') : ''}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="岗位：" class="ctjt_form_item_class">
                {{formData.postType | postTypeFilter}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="教学组长姓名：" class="ctjt_form_item_class">
                {{formData.leaderName}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="所属驾校：" class="ctjt_form_item_class">
                {{formData.drivingSchoolName}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属片区：" class="ctjt_form_item_class">
                {{formData.regionName}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="供职状态：" class="ctjt_form_item_class">
                {{formData.status | statusFilter}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="身份证：" class="ctjt_form_item_class">
                {{formData.idNo}}
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </CtjtCard>
      <CtjtCard :prop-data="{ title: '车辆信息' }">
        <template #content>
          <el-row :gutter="20" v-for="(item, index) in carInformation" :key="index">
            <el-col :span="8">
              <el-form-item label="教练车：">
                <el-link type="primary" @click="$router.push({ path: '/vehicle/info_mg/basis_info/detail', query: { id: item.id }})">{{item.number}}</el-link>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="车辆品牌：">{{item.carBrand}}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="车辆使用性质：">{{item.property}}</el-form-item></el-col>
          </el-row>
        </template>

      </CtjtCard>
      <CtjtCard :prop-data="{ title: '带教信息' }">
        <template #content>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item style="width: 100%;" :label="`带教类型${isEdit ? '：' : ''}`" class="ctjt_form_item_class" prop="teachId">
                <template v-if="isEdit">
                  {{formData.teachingSubjects}}
                </template>
                <template v-else>
                  <el-radio-group v-model="formData.teachId" @change="teachingSubjectsChange" :disabled="isEdit">
                    <el-radio v-for="item in teachingSubjectsList" :label="item.id" :key="item.id">{{item.name}}</el-radio>
                  </el-radio-group>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item :label="`车辆类型${isEdit ? '：' : ''}`" class="ctjt_form_item_class" prop="teachCar">
                <template v-if="isEdit">
                  {{formData.teachCar}}
                </template>
                <template v-else>
                  <el-select class="w_200" v-model="formData.teachCar" placeholder="请选择" :disabled="isEdit">
                    <el-option
                      v-for="item in carModelList"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                </template>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="`星级${isEdit ? '：' : ''}`" class="ctjt_form_item_class" prop="showStar">
                <template v-if="isEdit">
                  {{formData.showStar}}
                </template>
                <template v-else>
                  <el-select class="w_200" v-model="formData.showStar" placeholder="请选择" :disabled="isEdit">
                    <el-option
                      v-for="item in starList"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item :label="`教练类型${isEdit ? '：' : ''}`" class="ctjt_form_item_class" prop="type">
                <template v-if="isEdit">
                  {{formData.type | typeFilter}}
                </template>
                <template v-else>
                  <el-radio-group v-model="formData.type" :disabled="isEdit">
                    <el-radio
                      v-for="item in coachTypeList"
                      :label="item.id"
                      :key="item.id"
                    >{{item.label}}</el-radio>
                  </el-radio-group>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item :label="`是否机器人教练${isEdit ? '：' : ''}`" prop="isIntelligentCar">
                <template v-if="isEdit">
                  {{formData.isIntelligentCar === 1 ? '是' : '否'}}
                </template>
                <template v-else>
                  <el-radio-group v-model="formData.isIntelligentCar" :disabled="isEdit">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </template>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-row type="flex">
                <el-form-item :label="`带教状态${isEdit ? '：' : ''}`" prop="teachingStatus">
                  <template v-if="isEdit">
                    {{formData.teachingStatus | teachingStatusFilter}}
                  </template>
                  <template v-else>
                    <el-select class="w_200" v-model="formData.teachingStatus" placeholder="请选择" :disabled="isEdit">
                      <el-option
                        v-for="item in statusOpts"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
                <template v-if="formData.teachingSubjects.includes('全程') && formData.teachingStatus === 2">
                  <el-form-item label-width="0px" label="" prop="pauseSubject">
                    <template v-if="isEdit">
                      /{{formData.pauseSubject | pauseSubjectFilter}}
                    </template>
                    <template v-else>
                      <el-select class="w_200" v-model="formData.pauseSubject" placeholder="请选择" :disabled="isEdit">
                        <el-option
                          v-for="item in pauseSubjectOpts"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </template>
                  </el-form-item>
                </template>
              </el-row>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item :label="`带教班别${isEdit ? '：' : ''}`" class="ctjt_form_item_class" prop="teachingClass">
                <template v-if="isEdit">
                  {{formData.teachingClass | teachingClassFilter}}
                </template>
                <template v-else>
                  <el-checkbox-group v-model="formData.teachingClass" :disabled="isEdit">
                    <el-checkbox v-for="item in teachingClassList" :label="item.id" :key="item.id">
                      {{`${item.name}-${item.carModel}`}}
                    </el-checkbox>
                  </el-checkbox-group>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="`标准负荷${isEdit ? '：' : ''}`" class="ctjt_form_item_class" prop="distributionStudentMax">
                <template v-if="isEdit">
                  {{formData.distributionStudentMax}}
                </template>
                <template v-else>
                  <el-input class="w_200" v-model.number="formData.distributionStudentMax" placeholder="请输入" :disabled="isEdit"></el-input>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="科二负荷：">{{formData.subjectTwoLoad}}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="科三负荷:">{{formData.subjectThreeLoad}}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="总负荷:">{{formData.totalLoad}}</el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-form-item :label="`可带教片区${isEdit ? '：' : ''}`" prop="teachingRegion">
              <template v-if="isEdit">
                {{formData.teachingRegion | arrayToString}}
              </template>
              <template v-else>
                <el-checkbox-group
                  v-model="formData.teachingRegion"
                  @change="handleTeachingRegion"
                  :disabled="isEdit">
                  <el-checkbox
                    v-for="(item, index) in teachingRegionOpts"
                    :key="index"
                    :disabled="formData.regionName === item.name"
                    :label="item.name">{{item.name}}</el-checkbox>
                </el-checkbox-group>
              </template>
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="`主要门店${isEdit ? '：' : ''}`" class="ctjt_form_item_class" prop="storeName">
                <template v-if="isEdit">
                  {{formData.storeName}}
                </template>
                <template v-else>
                  <el-select class="w_200"
                    v-model="formData.storeName"
                    @change="hadleStoreChange"
                    placeholder="请选择"
                    :disabled="isEdit">
                    <el-option
                      v-for="item in storeList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-form-item :label="`次要门店${isEdit ? '：' : ''}`">
              <template v-if="isEdit">
                {{formData.secondaryStore | secondaryStoreFilter}}
              </template>
              <template v-else>
                <el-checkbox-group
                  v-model="formData.secondaryStore"
                  :disabled="isEdit">
                  <el-checkbox
                    v-for="item in storeList"
                    :label="item.id"
                    :disabled="formData.storeId === item.id"
                    :key="item.id">
                    {{item.name}}
                  </el-checkbox>
                </el-checkbox-group>
              </template>
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item :label="`带教训练场${isEdit ? '：' : ''}`">
              <template v-if="isEdit">
                {{formData.spaceTrainingPlace | spaceTrainingPlaceFilter}}
              </template>
              <template v-else>
                <el-checkbox-group v-model="formData.spaceTrainingPlace" :disabled="isEdit">
                  <el-checkbox v-for="item in spaceTrainingPlaceOpts" :label="item.id" :key="item.id">
                    {{item.name}}
                  </el-checkbox>
                </el-checkbox-group>
              </template>
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item :label="`科目二考场${isEdit ? '：' : ''}`">
              <template v-if="isEdit">
                {{formData.subjectTwoExamPlace | arrayToString}}
              </template>
              <template v-else>
                <el-checkbox-group v-model="formData.subjectTwoExamPlace" :disabled="isEdit">
                  <el-checkbox v-for="item in subjectTwoExamPlaceOpts" :label="item" :key="item">
                    {{item}}
                  </el-checkbox>
                </el-checkbox-group>
              </template>
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item :label="`科目三考场${isEdit ? '：' : ''}`">
              <template v-if="isEdit">
                {{formData.subjectThreeExamPlace | arrayToString}}
              </template>
              <template v-else>
                <el-checkbox-group v-model="formData.subjectThreeExamPlace" :disabled="isEdit">
                  <el-checkbox v-for="item in subjectThreeExamPlaceOpts" :label="item" :key="item">
                    {{item}}
                  </el-checkbox>
                </el-checkbox-group>
              </template>
            </el-form-item>
          </el-row>
        </template>
      </CtjtCard>
      <CtjtCard :prop-data="{ title: '证件信息' }">
        <template #content>
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="驾驶证号：" class="ctjt_form_item_class">
                {{formData.driverLicenseNo}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="准驾车型：" class="ctjt_form_item_class">
                {{formData.quasiDrivingModel}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="驾驶证初领日期：" class="ctjt_form_item_class">
                {{formData.issueDate}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="驾驶证有效期至：" class="ctjt_form_item_class">
                {{formData.validDate}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="职业资格证号：" class="ctjt_form_item_class">
                {{formData.certificateNo || ''}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="职业资格等级：" class="ctjt_form_item_class">
                {{formData.certificateLevel || ''}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="职业资格证有效期：" class="ctjt_form_item_class">
                {{formData.certificateValidDate || ''}}
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </CtjtCard>
      <el-row type="flex" justify="center" style="padding: 30px 0;">
        <el-button type="info" style="color: #909399; background-color: transparent; border: 1px solid #DCDFE6;" @click="cancelSubmit">取消</el-button>
        <el-button v-if="perm['btn_submit']" type="primary" style="margin-left: 32px;" @click="submit" :disabled="isEdit" :loading="submitLoading">确认提交</el-button>
      </el-row>
    </el-form>
    <!-- 查询员工抽屉 -->
    <el-drawer
      title="选择员工"
      :visible.sync="changestaffDrawer"
      :direction="'rtl'"
      :size="'60%'"
      :before-close="() => changestaffDrawer = false">
      <div class="page">
        <SearchTable
          :prop-data.sync="searchForm"
          @select-change="searchSelectChange"
          @search-call="searchTableCallBack"></SearchTable>
        <CtjtTable
          :tableData="tableData"
          @option-call="tableOptionCallback"
          @selection-change="tableSelectionChange"
        ></CtjtTable>
        <CtjtPagination
          :prop-data="paginationData"
          @on-size-change="tableSizeChange"
          @on-current-change='tableCurrentChange'
        ></CtjtPagination>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import Index from './coach_detail';

export default class CoachDetail extends Index {}
</script>

<style lang="scss" scoped>
  .form_header_box {
    padding: 20px 30px;
    margin-bottom: 10px;
    background-color: #fff;
  }
  ::v-deep .el-drawer__body {
    overflow: auto;
  }
</style>
