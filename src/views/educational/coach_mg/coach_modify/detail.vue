<template>
  <div class="page">
    <el-card shadow="never" style="margin-bottom: 20px;">
      <el-row type="flex" justify="space-between" align="center">
        <span>
          审核教练信息修改- <span style="color: #409EFF;">{{detailData.verifyStatus | applyStatusFilter}}</span>
        </span>
        <div>
          <template v-if="detailData.verifyStatus === 0">
            <el-button v-if="perm['btn_pass']" type="success" :loading="btnLoading" @click="applySubmit(1)">审核通过</el-button>
            <el-button v-if="perm['btn_reject']" type="danger" :loading="btnLoading" @click="applySubmit(2)">驳回</el-button>
            <el-button v-if="perm['btn_revoke']" type="warning" :loading="btnLoading" @click="applySubmit(3)">撤销</el-button>
          </template>
          <el-button @click="goback()">返回</el-button>
        </div>
      </el-row>
    </el-card>
    <CtjtCard :propData="{ title: '基本信息' }">
      <template slot="content">
        <ul class="row_content no_bottom_bor">
          <li class="col_title">教练姓名</li>
          <li class="col_content">{{detailData.userName}}</li>
          <li class="col_title">手机号</li>
          <li class="col_content">{{detailData.mobile}}</li>
          <li class="col_title">负荷学员</li>
          <li class="col_content">{{detailData.totalLoad}}</li>
        </ul>
        <ul class="row_content no_bottom_bor">
          <li class="col_title">片区</li>
          <li class="col_content">{{detailData.regionName}}</li>
          <li class="col_title">负荷标准</li>
          <li class="col_content">{{detailData.distributionStudentMax}}</li>
          <li class="col_title">教学组长姓名</li>
          <li class="col_content">{{detailData.leaderName}}</li>
        </ul>
        <ul class="row_content">
          <li class="col_title">职业资格证号</li>
          <li class="col_content">{{detailData.certificateNo}}</li>
          <li class="col_title">职业资格证有效期</li>
          <li class="col_content">{{detailData.certificateValidDate}}</li>
          <li class="col_title"></li>
          <li class="col_content"></li>
        </ul>
      </template>
    </CtjtCard>
    <CtjtCard :propData="{ title: '车辆信息' }">
      <template slot="content">
        <ul :class="['row_content', { 'no_bottom_bor': index + 1 < carInformationList.length }]"
          v-for="(item, index) in carInformationList"
          :key="index">
          <li class="col_title">教练车</li>
          <li class="col_content">
            <el-link type="primary" @click="$router.push({ path: '/vehicle/info_mg/basis_info/detail', query: { id: item.id }})">{{item.number}}</el-link>
          </li>
          <li class="col_title">车辆品牌</li>
          <li class="col_content">{{item.carBrand}}</li>
          <li class="col_title">车辆使用性质</li>
          <li class="col_content">{{item.property}}</li>
        </ul>
      </template>
    </CtjtCard>
    <CtjtCard :propData="{ title: '原带教信息' }">
      <template slot="content">
        <ul class="row_content no_bottom_bor">
          <li class="col_title">带教类型</li>
          <li class="col_content">{{teachingInfoData.teachingSubjects}}</li>
          <li class="col_title">车辆类型</li>
          <li class="col_content">{{teachingInfoData.teachCar}}</li>
        </ul>
        <ul class="row_content no_bottom_bor">
          <li class="col_title">星级</li>
          <li class="col_content">{{teachingInfoData.showStar}}</li>
          <li class="col_title">教练类型</li>
          <li class="col_content">{{teachingInfoData.type | typeFilter}}</li>
        </ul>
        <ul class="row_content no_bottom_bor">
          <li class="col_title">是否机器人教练</li>
          <li class="col_content">{{teachingInfoData.isIntelligentCar === 1 ? '是' : '否'}}</li>
          <li class="col_title">带教状态</li>
          <li class="col_content">{{teachingInfoData.teachingStatus | teachingStatusFilter}}</li>
        </ul>
        <ul class="row_content no_bottom_bor">
          <li class="col_title">带教班别</li>
          <li class="col_content">{{teachingInfoData.teachingClass | teachingClassFilter}}</li>
          <li class="col_title">标准负荷</li>
          <li class="col_content">{{teachingInfoData.distributionStudentMax}}</li>
        </ul>
        <ul class="row_content no_bottom_bor">
          <li class="col_title">可带教片区</li>
          <li class="col_content">{{teachingInfoData.teachingRegion | arrayToString}}</li>
          <li class="col_title">带教训练场</li>
          <li class="col_content">{{teachingInfoData.spaceTrainingPlace | spaceTrainingPlaceFilter}}</li>
        </ul>
        <ul class="row_content no_bottom_bor">
          <li class="col_title">主要门店</li>
          <li class="col_content">{{teachingInfoData.storeName}}</li>
          <li class="col_title">次要门店</li>
          <li class="col_content">{{teachingInfoData.secondaryStore | secondaryStoreFilter}}</li>
        </ul>
        <ul class="row_content">
          <li class="col_title">科目二考场</li>
          <li class="col_content">{{teachingInfoData.subjectTwoExamPlace | arrayToString}}</li>
          <li class="col_title">科目三考场</li>
          <li class="col_content">{{teachingInfoData.subjectThreeExamPlace | arrayToString}}</li>
        </ul>
      </template>
    </CtjtCard>
    <CtjtCard :propData="{ title: '申请修改后带教信息' }">
      <template slot="content">
        <ul class="row_content no_bottom_bor">
          <li class="col_title">带教类型</li>
          <li class="col_content">{{changTeachingInfoData.teachingSubjects}}</li>
          <li class="col_title">车辆类型</li>
          <li class="col_content">{{changTeachingInfoData.teachCar}}</li>
        </ul>
        <ul class="row_content no_bottom_bor">
          <li class="col_title">星级</li>
          <li class="col_content">{{changTeachingInfoData.showStar}}</li>
          <li class="col_title">教练类型</li>
          <li class="col_content">{{changTeachingInfoData.type | typeFilter}}</li>
        </ul>
        <ul class="row_content no_bottom_bor">
          <li class="col_title">是否机器人教练</li>
          <li class="col_content">{{changTeachingInfoData.isIntelligentCar === 1 ? '是' : '否'}}</li>
          <li class="col_title">带教状态</li>
          <li class="col_content">{{changTeachingInfoData.teachingStatus | teachingStatusFilter}}</li>
        </ul>
        <ul class="row_content no_bottom_bor">
          <li class="col_title">带教班别</li>
          <li class="col_content">{{changTeachingInfoData.teachingClass | teachingClassFilter}}</li>
          <li class="col_title">标准负荷</li>
          <li class="col_content">{{changTeachingInfoData.distributionStudentMax}}</li>
        </ul>
        <ul class="row_content no_bottom_bor">
          <li class="col_title">可带教片区</li>
          <li class="col_content">{{changTeachingInfoData.teachingRegion | arrayToString}}</li>
          <li class="col_title">带教训练场</li>
          <li class="col_content">{{changTeachingInfoData.spaceTrainingPlace | spaceTrainingPlaceFilter}}</li>
        </ul>
        <ul class="row_content no_bottom_bor">
          <li class="col_title">主要门店</li>
          <li class="col_content">{{changTeachingInfoData.storeName}}</li>
          <li class="col_title">次要门店</li>
          <li class="col_content">{{changTeachingInfoData.secondaryStore | secondaryStoreFilter}}</li>
        </ul>
        <ul class="row_content">
          <li class="col_title">科目二考场</li>
          <li class="col_content">{{changTeachingInfoData.subjectTwoExamPlace | arrayToString}}</li>
          <li class="col_title">科目三考场</li>
          <li class="col_content">{{changTeachingInfoData.subjectThreeExamPlace | arrayToString}}</li>
        </ul>
      </template>
    </CtjtCard>
    <CtjtCard :propData="{ title: '流程审核记录' }">
      <template slot="content">
        <CtjtTable :tableData="tableData"></CtjtTable>
      </template>
    </CtjtCard>
  </div>
</template>
<script lang="ts">
import Index from './detail';

export default class EducationalCoachMgCoachModifyDetail extends Index {}
</script>
<style lang="scss" scss>
.mr_30 {
  margin-right: 30px !important;
}
.row_content {
  display: flex;
  border: 1px solid $--color-border-split;
  &.no_bottom_bor {
    border-bottom: 0;
  }
}
.col_title, .col_content {
  width: 25%;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.col_title {
  background-color: $--bg-grey;
}
</style>
