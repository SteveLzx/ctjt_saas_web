<template>
  <div class="page">
    <el-form ref="formDetailRef" :model="formData" :rules="formRules" label-width="120px">
      <el-row>
        <el-col :span="24"><div class="grid-content">{{`${$route.query.id ? '编辑' : '新增'}`}}分配规则</div></el-col>
      </el-row>
      <CtjtCard :prop-data="{ title: '基础配置' }">
        <template #content>
          <el-form-item label="规则开启/关闭">
            <el-switch v-model="formData.status" :disabled="isEdit"></el-switch>
          </el-form-item>
          <el-form-item label="分配规则名称" prop="name">
            <el-input class="w_400" v-model="formData.name" clearable maxlength="60" show-word-limit :disabled="isEdit"></el-input>
          </el-form-item>
          <el-form-item label="选择适用的班别和车型" prop="classesInfo">
            <el-checkbox-group v-model="formData.classesInfo" :disabled="isEdit">
              <div v-for="(item, index) in classesMapOpts" :key="index">
                <el-checkbox
                  v-for="(i, i_index) in item"
                  :key="i_index"
                  :label="i.id"
                >{{`${i.name}-${i.carModel}`}}</el-checkbox>
              </div>
            </el-checkbox-group>
          </el-form-item>
        </template>
      </CtjtCard>
      <CtjtCard :prop-data="{ title: '科目二分配规则'}">
        <template #content>
          <el-row type="flex">
            <el-form-item label="学员入库条件" prop="subjectTwoAccess">
              <el-select class="w_200" v-model="formData.subjectTwoAccess" placeholder="请选择" @change="changeSubjectTwoAccess" :disabled="isEdit">
                <el-option
                  v-for="(item, index) in subjectTwoAccessOpts"
                  :key="index"
                  :value="item.id"
                  :label="item.label"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" label-width="0" prop="subjectTwoAccessStatus">
              <el-select class="w_200" v-model="formData.subjectTwoAccessStatus" placeholder="请选择" :disabled="isEdit">
                <el-option
                  v-for="(item, index) in subjectTwoAccessStatusOpts"
                  :key="index"
                  :value="item.id"
                  :label="item.label"></el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row type="flex">
            <el-form-item label="学员出库条件" prop="subjectTwoOut">
              <el-select class="w_200" v-model="formData.subjectTwoOut" placeholder="请选择" @change="changeSubjectTwoOut" :disabled="isEdit">
                <el-option
                  v-for="(item, index) in subjectTwoOutOpts"
                  :key="index"
                  :value="item.id"
                  :label="item.label"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" label-width="0" prop="subjectTwoOutStatus">
              <el-select class="w_200" v-model="formData.subjectTwoOutStatus" placeholder="请选择" :disabled="isEdit">
                <el-option
                  v-for="(item, index) in subjectTwoOutStatusOpts"
                  :key="index"
                  :value="item.id"
                  :label="item.label"></el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <p>可参与分配的教练</p>
          <el-form-item label="带教类型" prop="subjectTwoTeach">
            <el-row style="margin-bottom: 16px;" type="flex" v-for="(item, index) in subjectTwoTeachOpts" :key="index">
              <el-checkbox class="w_200" v-model="item.check" @change="handleChangeSubjectTwoTeach" :disabled="isEdit">{{item.name}}</el-checkbox>
              <el-form-item label="停止分配负荷">
                <el-input class="w_200" :disabled="!item.check || isEdit" v-model.number="item.load" placeholder="请输入" @keyup.native="subjectTwoTeachKeyup(index)"></el-input>
              </el-form-item>
            </el-row>
          </el-form-item>
        </template>
      </CtjtCard>
      <CtjtCard :prop-data="{ title: '科目三分配规则'}">
        <template #content>
          <el-row type="flex">
            <el-form-item label="学员入库条件" prop="subjectThreeAccess">
              <el-select class="w_200" v-model="formData.subjectThreeAccess" placeholder="请选择" @change="changeSubjectThreeAccess" :disabled="isEdit">
                <el-option
                  v-for="(item, index) in subjectThreeAccessOpts"
                  :key="index"
                  :value="item.id"
                  :label="item.label"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" label-width="0" prop="subjectThreeAccessStatus">
              <el-select class="w_200" v-model="formData.subjectThreeAccessStatus" placeholder="请选择" :disabled="isEdit">
                <el-option
                  v-for="(item, index) in subjectThreeAccessStatusOpts"
                  :key="index"
                  :value="item.id"
                  :label="item.label"></el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row type="flex">
            <el-form-item label="学员出库条件" prop="subjectThreeOut">
              <el-select class="w_200" v-model="formData.subjectThreeOut" placeholder="请选择" @change="changeSubjectThreeOut" :disabled="isEdit">
                <el-option
                  v-for="(item, index) in subjectThreeOutOpts"
                  :key="index"
                  :value="item.id"
                  :label="item.label"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" label-width="0" prop="subjectThreeOutStatus">
              <el-select class="w_200" v-model="formData.subjectThreeOutStatus" placeholder="请选择" :disabled="isEdit">
                <el-option
                  v-for="(item, index) in subjectThreeOutStatusOpts"
                  :key="index"
                  :value="item.id"
                  :label="item.label"></el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <p>可参与分配的教练</p>
          <el-form-item label="带教类型" prop="subjectThreeTeach">
            <el-row style="margin-bottom: 16px;" type="flex" v-for="(item, index) in subjectThreeTeachOpts" :key="index">
              <el-checkbox class="w_200" v-model="item.check" @change="handleChangeSubjectThreeTeach" :disabled="isEdit">{{item.name}}</el-checkbox>
              <el-form-item label="停止分配负荷">
                <el-input class="w_200" :disabled="!item.check || isEdit" v-model.number="item.load" placeholder="请输入" @keyup.native="subjectThreeTeachKeyup(index)"></el-input>
              </el-form-item>
            </el-row>
          </el-form-item>
        </template>
      </CtjtCard>
      <CtjtCard :prop-data="{ title: '通用分配规则'}">
        <template #content>
          <el-row type="flex">
            <el-form-item label="带教车型" prop="teachCar" class="w_400">
              <el-checkbox v-model="formData.teachCar" :disabled="isEdit">与学员报名车型一致</el-checkbox>
            </el-form-item>
            <el-form-item label="带教班别" prop="classes" class="w_400">
              <el-checkbox v-model="formData.classes" :disabled="isEdit">与学员报名班别一致</el-checkbox>
            </el-form-item>
          </el-row>
          <el-form-item label="可分配教练范围" prop="allowScope">
            <el-radio-group v-model="formData.allowScope" :disabled="isEdit">
              <el-radio
                v-for="(item, index) in allowScopeOpts"
                :key="index"
                :label="item.value"
              >{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否优先教练自招自带" prop="coachOwn">
            <el-select v-model="formData.coachOwn" placeholder="请选择" :disabled="isEdit">
              <el-option :value="false" label="否"></el-option>
              <el-option :value="true" label="是"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="参考负荷规则" prop="loadRule">
            <el-checkbox-group v-model="formData.loadRule" @change="handleChangeLoadRule" :disabled="isEdit">
              <el-checkbox :label="1">参考标准负荷值，优先负荷占比小的</el-checkbox>
              <!-- <el-checkbox :label="2" :disabled="formData.loadRule.includes(3)">启用学员年龄规则</el-checkbox> -->
              <!-- <el-checkbox :label="3" :disabled="formData.loadRule.includes(1) || formData.loadRule.includes(2)">超过标准负荷值不能再分配，无优先占比规则小</el-checkbox> -->
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="教练产能" prop="capacity" v-if="false">
            <el-checkbox v-model="formData.capacityFlag" @change="handleChangeCapacityFlag" :disabled="isEdit">
              <el-row type="flex">
                <el-input class="w_200" :disabled="!formData.capacityFlag || isEdit" @input="handleChangeCapacity" v-model.number="formData.capacity" placeholder="请设置权重%"></el-input>
                <el-form-item label="" prop="capacityPeriod">
                  <el-select class="w_200" :disabled="!formData.capacityFlag || isEdit" v-model="formData.capacityPeriod" placeholder="请选择周期">
                    <el-option :value="30" label="过去30天"></el-option>
                    <el-option :value="60" label="过去60天"></el-option>
                    <el-option :value="90" label="过去90天"></el-option>
                  </el-select>
                </el-form-item>
              </el-row>
            </el-checkbox>
          </el-form-item>
          <el-form-item label="合格率" prop="qualified" v-if="false">
            <el-checkbox v-model="formData.capacityFlag" @change="handleChangeCapacityFlag" :disabled="isEdit">
              <el-row type="flex">
                <el-input class="w_200" :disabled="!formData.capacityFlag || isEdit" @input="handleChangeQualified" v-model.number="formData.qualified" placeholder="请设置权重%"></el-input>
                <el-form-item label="" prop="qualifiedPeriod">
                  <el-select class="w_200" :disabled="!formData.capacityFlag || isEdit" v-model="formData.qualifiedPeriod" placeholder="请选择周期">
                    <el-option :value="30" label="过去30天"></el-option>
                    <el-option :value="60" label="过去60天"></el-option>
                    <el-option :value="90" label="过去90天"></el-option>
                  </el-select>
                </el-form-item>
              </el-row>
            </el-checkbox>
          </el-form-item>
        </template>
      </CtjtCard>
      <el-row type="flex" justify="center">
        <el-button @click="goback()">取消</el-button>
        <el-button type="primary" :disabled="isEdit" :loading="submitLoading" @click="submit()">提交</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts">
import Index from './detail';

export default class EducationalBasicSetCoachDistributionAutoSetDetail extends Index {}
</script>
