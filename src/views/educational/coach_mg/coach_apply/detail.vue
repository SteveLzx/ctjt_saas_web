<template>
  <div class="page">
    <el-card shadow="never" style="margin-bottom: 20px;">
      <el-row type="flex" justify="space-between" align="center">
        <span>
          审核教练信息新增- <span style="color: #409EFF;">{{detailData.verifyStatus | applyStatusFilter}}</span>
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
        </ul>
        <ul class="row_content no_bottom_bor">
          <li class="col_title">性别</li>
          <li class="col_content">{{detailData.sex | sexFilter}}</li>
          <li class="col_title">入职时间</li>
          <li class="col_content">{{$dayjs(detailData.entryTime).format('YYYY-MM-DD HH:mm:ss')}}</li>
        </ul>
        <ul class="row_content no_bottom_bor">
          <li class="col_title">岗位</li>
          <li class="col_content">{{detailData.postType | postTypeFilter}}</li>
          <li class="col_title">教学组长姓名</li>
          <li class="col_content">{{detailData.leaderName}}</li>
        </ul>
        <ul class="row_content no_bottom_bor">
          <li class="col_title">所属驾校</li>
          <li class="col_content">{{detailData.drivingSchoolName}}</li>
          <li class="col_title">所属片区</li>
          <li class="col_content">{{detailData.regionName}}</li>
        </ul>
        <ul class="row_content">
          <li class="col_title">供职状态</li>
          <li class="col_content">{{detailData.status | statusFilter}}</li>
          <li class="col_title">身份证</li>
          <li class="col_content">{{detailData.idNo}}</li>
        </ul>
      </template>
    </CtjtCard>
    <CtjtCard :propData="{ title: '车辆信息' }" v-if="false">
      <template slot="content">
        <ul class="row_content no_bottom_bor">
          <li class="col_title">教练车</li>
          <li class="col_content"></li>
          <li class="col_title">车辆品牌</li>
          <li class="col_content"></li>
          <li class="col_title">车辆使用性质</li>
          <li class="col_content"></li>
        </ul>
      </template>
    </CtjtCard>
    <CtjtCard :propData="{ title: '带教信息' }">
      <template slot="content">
        <ul class="row_content no_bottom_bor">
          <li class="col_title">带教类型</li>
          <li class="col_content">{{detailData.teachingSubjects}}</li>
          <li class="col_title">车辆类型</li>
          <li class="col_content">{{detailData.teachCar}}</li>
        </ul>
        <ul class="row_content no_bottom_bor">
          <li class="col_title">星级</li>
          <li class="col_content">{{detailData.showStar}}</li>
          <li class="col_title">教练类型</li>
          <li class="col_content">{{detailData.type | typeFilter}}</li>
        </ul>
        <ul class="row_content no_bottom_bor">
          <li class="col_title">是否机器人教练</li>
          <li class="col_content">{{detailData.isIntelligentCar === 1 ? '是' : '否'}}</li>
          <li class="col_title">带教状态</li>
          <li class="col_content">{{detailData.teachingStatus | teachingStatusFilter}}</li>
        </ul>
        <ul class="row_content no_bottom_bor">
          <li class="col_title">带教班别</li>
          <li class="col_content">{{detailData.teachingClass | teachingClassFilter}}</li>
          <li class="col_title">标准负荷</li>
          <li class="col_content">{{detailData.distributionStudentMax}}</li>
        </ul>
        <ul class="row_content no_bottom_bor">
          <li class="col_title">科二负荷</li>
          <li class="col_content">{{detailData.subjectTwoLoad}}</li>
          <li class="col_title">科三负荷</li>
          <li class="col_content">{{detailData.subjectThreeLoad}}</li>
        </ul>
        <ul class="row_content no_bottom_bor">
          <li class="col_title">总负荷</li>
          <li class="col_content">{{detailData.totalLoad}}</li>
          <li class="col_title">可带教片区</li>
          <li class="col_content">{{detailData.teachingRegion | arrayToString}}</li>
        </ul>
        <ul class="row_content no_bottom_bor">
          <li class="col_title">主要门店</li>
          <li class="col_content">{{detailData.storeName}}</li>
          <li class="col_title">次要门店</li>
          <li class="col_content">{{detailData.secondaryStore | secondaryStoreFilter}}</li>
        </ul>
        <ul class="row_content no_bottom_bor">
          <li class="col_title">带教训练场</li>
          <li class="col_content">{{detailData.spaceTrainingPlace | spaceTrainingPlaceFilter}}</li>
          <li class="col_title">科目二考场</li>
          <li class="col_content">{{detailData.subjectTwoExamPlace | arrayToString}}</li>
        </ul>
        <ul class="row_content">
          <li class="col_title">科目三考场</li>
          <li class="col_content">{{detailData.subjectThreeExamPlace | arrayToString}}</li>
          <li class="col_title"></li>
          <li class="col_content"></li>
        </ul>
      </template>
    </CtjtCard>
    <CtjtCard :propData="{ title: '证件信息' }">
      <template slot="content">
        <ul class="row_content no_bottom_bor">
          <li class="col_title">驾驶证号</li>
          <li class="col_content">{{detailData.driverLicenseNo}}</li>
          <li class="col_title">准驾车型</li>
          <li class="col_content">{{detailData.quasiDrivingModel}}</li>
        </ul>
        <ul class="row_content no_bottom_bor">
          <li class="col_title">驾驶证初领日期</li>
          <li class="col_content">{{detailData.issueDate}}</li>
          <li class="col_title">驾驶证有效期至</li>
          <li class="col_content">{{detailData.validDate}}</li>
        </ul>
        <ul class="row_content no_bottom_bor">
          <li class="col_title">职业资格证号</li>
          <li class="col_content">{{detailData.certificateNo}}</li>
          <li class="col_title">职业资格等级</li>
          <li class="col_content">{{detailData.certificateLevel}}</li>
        </ul>
        <ul class="row_content no_bottom_bor">
          <li class="col_title">职业资格证有效期</li>
          <li class="col_content">{{detailData.certificateValidDate}}</li>
          <li class="col_title"></li>
          <li class="col_content"></li>
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

export default class EducationalCoachMgCoachApplyDetail extends Index {}
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
