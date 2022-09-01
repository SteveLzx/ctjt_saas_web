<template>
  <div class="page">
    <CtjtCard :prop-data="{ title: `${formData.id ? '编辑' : '新增'}教学组` }">
      <template slot="content">
        <el-form ref="drawerFormRef" :model="formData" :rules="formRules" inline>
          <el-form-item class="ctjt_form_item" label="所属片区" prop="regionId">
            <el-select v-model="formData.regionId" :disabled="Number(formData.id) > 0" placeholder="请选择片区" @change="regionChanged">
              <el-option
                v-for="item in regionList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="ctjt_form_item" label="教学组名" prop="name">
            <el-input v-model.trim="formData.name" maxlength="18" show-word-limit placeholder="请输入教学组名"></el-input>
          </el-form-item>
          <el-form-item class="ctjt_form_item" label="教学组长" prop="leaderName">
            <el-input v-model="formData.leaderName" disabled placeholder="请选择教学组长"></el-input>
          </el-form-item>
          <el-button v-if="perm['btn_xzzz']" @click="chooseLeaderFunc()">选择组长</el-button>
        </el-form>
      </template>
    </CtjtCard>
    <CtjtTable
      :tableData="tableData"
      @option-call="tableOptionCallback"
      @selection-change="tableSelectionChange"
    ></CtjtTable>
    <!-- 选择教学组长 -->
    <el-drawer
      :visible.sync="drawerChoiceLeader"
      :direction="'rtl'"
      :show-close="false"
      :wrapperClosable="false"
      :size="'80%'">
      <template slot='title'>
        <CtjtCard :prop-data="{ title: drawerName }">
          <template slot='header'>
            <span style="float: right" class="iconfont close_icon" @click="handleClose()">&#xe62b;</span>
          </template>
          <template slot="content">
            <el-form inline>
              <el-form-item class="ctjt_form_item" label="片区:" >
                {{formData.regionName}}
              </el-form-item>
              <el-form-item class="ctjt_form_item ml-20" label="搜索关键字">
                <el-input v-model.trim="keyword" clearable placeholder="请输入教练姓名，手机号"></el-input>
              </el-form-item>
              <el-button type="primary" @click="searchDrawerTableData">搜索</el-button>
            </el-form>
          </template>
        </CtjtCard>
      </template>
      <CtjtTable
        :tableData="drawerTableData"
        @option-call="choiceLeaderTableOptionCallback"
        @selection-change="choiceLeaderTableSelectionChange"
      ></CtjtTable>
    </el-drawer>
  </div>
</template>
<script lang="ts">
import Index from './detail';

export default class EducationalCoachMgTeachGroupMgDetail extends Index {}
</script>
<style lang="scss" scoped>
::v-deep .el-drawer__body {
  padding: 0 20px 20px;
  overflow: auto;
}
</style>
