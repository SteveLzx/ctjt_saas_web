<template>
  <div class="page">
    <SearchTable :prop-data.sync="searchForm" @select-change="searchSelectChange"></SearchTable>
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
    <el-drawer
      :title="`${formData.id ? '编辑' : '新增'}推文`"
      :size="1200"
      :visible.sync="drawer"
      :direction="'rtl'"
      :before-close="handleClose">
      <el-form :model="formData" :rules="formRules" label-width="160px" ref="formRef">
        <el-form-item label="推文ID：" v-if="formData.id">{{formData.tweetId}}</el-form-item>
        <el-form-item label="参与区域：" prop="storeListDtoList">
          <el-cascader
            class="w_260"
            v-model="formData.storeListDtoList"
            :options="options"
            :props="props"
            collapse-tags
            clearable
            @change="storeDtoChange">
            </el-cascader>
        </el-form-item>
        <el-form-item label="推文名称：" prop="name">
          <el-input class="w_260" v-model.trim="formData.name" maxlength="20" show-word-limit clearable />
        </el-form-item>
        <el-form-item label="上传封面(尺寸建议5:4)：" prop="cover" ref="photoUrl">
          <CtjtUploadOSS :prop-config="uploadConfig" @on-upload="goodsUploadFunc">
            <template #content>
              <el-image
              style="width: 260px; height: 208px"
              :src="coverUrl"
              :fit="'fill'">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
              </el-image>
            </template>
          </CtjtUploadOSS>
        </el-form-item>
        <el-form-item label="发布推文时间：" prop="beginDate">
          <el-row type="flex">
            <el-date-picker
              type="datetime"
              format="yyyy-MM-dd HH:mm"
              v-model="formData.beginDate"
              placeholder="选择日期时间">
            </el-date-picker>
            <el-form-item prop="endDate">
              <el-date-picker
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                v-model="formData.endDate"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-row>
        </el-form-item>
        <el-form-item label="推文地址：" prop="addressUrl">
          <el-input class="w_400" v-model.trim="formData.addressUrl" clearable />
        </el-form-item>
        <el-form-item label="推文状态：" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio v-for="item in statusOpts" :key="item.value" :label="item.value">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row type="flex" justify="center">
          <el-button @click="closeDrawer">取消</el-button>
          <el-button type="primary" @click="submit" :loading="submitLoading">保存推文</el-button>
        </el-row>
      </el-form>
    </el-drawer>
    <el-dialog
      title="预览"
      :visible.sync="dialogVisible"
      width="300px"
      center
      :before-close="() => dialogVisible = false">
      <el-row type="flex" justify="center">
        <el-image
          style="width: 200px; height: 200px"
          :src="qrImg"
          :fit="'fill'"></el-image>
      </el-row>
    </el-dialog>
  </div>
</template>
<script lang='ts'>
import Component from 'vue-class-component';
import {
  SearchTable, CtjtTable, CtjtPagination, CtjtUploadOSS
} from '@/components';
import List from './list';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtUploadOSS
  }
})
export default class MarketMiniProgramsTweet extends List {}
</script>
<style lang="scss" scoped>
::v-deep .el-drawer__body {
  overflow: auto;
}
::v-deep .image-slot {
  width: 100%;
  height: 100%;
  background-color: $--bg-grey;
  display: flex;
  align-items: center;
  justify-content: center;
  .el-icon-picture-outline {
    font-size: 46px;
  }
}
</style>
