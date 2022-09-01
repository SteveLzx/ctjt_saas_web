<template>
  <div class="page">
    <SearchTable :prop-data.sync="searchForm" @select-change="searchSelectChange"></SearchTable>
    <CtjtTable
      :tableData="tableData"
      @option-call="tableOptionCallback"
      @selection-change="tableSelectionChange"
      @sort-change="tableSortChange"
    ></CtjtTable>
    <CtjtPagination
      :prop-data="paginationData"
      @on-size-change="tableSizeChange"
      @on-current-change='tableCurrentChange'
    ></CtjtPagination>
    <!-- 新增带教记录 -->
    <el-drawer
      title="新增带教记录"
      :visible.sync="teachLogsDrawer"
      :direction="'rtl'"
      :size="'80%'"
      :before-close="handleCloseTeachLogs">
      <el-form class="page" ref="teachLogsFormRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="查找学员">
          <el-autocomplete
            popper-class="seach_table_autocomplete"
            class="w_300"
            clearable
            v-model="keyword"
            @select="hanldCarNumberSelect"
            :fetch-suggestions="queryCarNumberSearch"
            value-key="idNo"
            placeholder="请输入证件号/姓名"
          >
            <template slot-scope="{ item }">
              <div class="idNo">{{ item.idNo }}</div>
              <span class="name">{{ item.name }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>
        <b class="td_text_red">请选择一个订单</b>
        <el-table border :data="orderList" @row-click="chooseOrder" highlight-current-row>
          <el-table-column align="center" label="序号" type="index" :index="index => index + 1" width="50"/>
          <el-table-column align="center" prop="name" label="姓名" width="80" show-overflow-tooltip />
          <el-table-column align="center" prop="idNo" label="证件号码" width="170"/>
          <el-table-column align="center" prop="mobile" label="联系方式" width="120"/>
          <el-table-column align="center" prop="regionName" label="片区"/>
          <el-table-column align="center" prop="storeName" label="门店"/>
          <el-table-column align="center" prop="seq" label="订单号"/>
          <el-table-column align="center" prop="applyDate" label="报名日期"/>
          <el-table-column align="center" prop="carModel" label="车型" width="50"/>
          <el-table-column align="center" prop="carBrand" label="车辆品牌" width="80"/>
          <el-table-column align="center" prop="sumPeriod" label="总学时(含赠送)" width="80"/>
          <el-table-column align="center" prop="usedPeriod" label="已学学时" width="80"/>
          <el-table-column align="center" prop="surplusPeriod" label="剩余学时" width="80"/>
        </el-table>
        <CtjtCard class="mt-20" :prop-data="{ title: '约车信息'}">
          <template #content>
            <el-row :gutter="8">
              <el-col :span="12">
                <el-form-item label="约车日期" prop="appointDate">
                  <el-date-picker
                    class="w_200"
                    v-model="formData.appointDate"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="8">
              <el-col :span="12">
                <el-form-item label="约车时间" prop="startTime">
                  <el-row type="flex">
                    <el-time-select
                      class="w_120"
                      v-model="formData.startTime"
                      :picker-options="{ start: '00:00', end: '24:00', step: '00:01' }"
                      placeholder="开始时间">
                    </el-time-select>
                    <el-form-item label-width="0" prop="endTime">
                      <el-time-select
                        class="w_120"
                        v-model="formData.endTime"
                        :picker-options="{ start: '00:00', end: '24:00', step: '00:01', minTime: formData.startTime }"
                        placeholder="结束时间">
                      </el-time-select>
                    </el-form-item>
                  </el-row>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="跟踪人：" prop="followPerson">{{formData.followPerson}}</el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="8">
              <el-col :span="12">
                <el-form-item label="教练姓名" prop="coachName">
                  <el-select class="w_200" v-model="formData.coachName" filterable placeholder="请选择" @change="hanldChangeCoachName">
                    <el-option
                      v-for="item in assignCoachOpts"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="车 型：" prop="carModel">{{formData.carModel}}</el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="8">
              <el-col :span="12">
                <el-form-item label="总学时（含赠送）：" prop="sumPeriod">{{formData.sumPeriod}}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="已学学时：" prop="usedPeriod">{{formData.usedPeriod}}</el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="8">
              <el-col :span="12">
                <el-form-item label="剩余学时：">{{formData.sumPeriod ? formData.sumPeriod - formData.usedPeriod : ''}}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="教学学时：" prop="period">{{formData.period || currentPeriod}}</el-form-item>
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
                <el-form-item label="回访评价" prop="remark">
                  <el-input type="textarea" v-model.trim="formData.remark" placeholder="请输入" maxlength="300" show-word-limit></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
        </CtjtCard>
        <el-row class="mt-20" type="flex" justify="center">
          <el-button @click="handleCloseTeachLogs()">取消</el-button>
          <el-button type="primary" :loading="submitLoading" @click="handleSubmitAdd()">确定</el-button>
        </el-row>
      </el-form>
    </el-drawer>
</div>
</template>
<script lang='ts'>
import Index from './list';

export default class MarketSanXueTeachMg extends Index {}
</script>
<style lang="scss" scoped>
::v-deep .el-drawer__body {
  overflow: auto;
}
</style>
