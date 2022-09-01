<template>
  <div class="page">
    <el-form ref="customerServiceForm" :model="formData" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="客服姓名：" class="ctjt_form_item_class" prop="userName">
            {{formData.userName}}
            <!-- <el-input v-model="formData.userName" placeholder="请输入" :disabled="isEdit"/> -->
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号：" class="ctjt_form_item_class" prop="mobile">
            {{formData.mobile}}
            <!-- <el-input v-model="formData.mobile" placeholder="请输入" :disabled="isEdit"/> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="供职状态：" class="ctjt_form_item_class" prop="servingStatus">
        {{formData.status | servingStatusFilter}}
        <!-- <el-select v-model="formData.regionManagerName" placeholder="请选择" :disabled="isEdit">
          <el-option
            v-for="item in servingStatusList"
            :key="item.id"
            :label="item.label"
            :value="item.id">
          </el-option>
        </el-select> -->
      </el-form-item><br/>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="所属驾校：" class="ctjt_form_item_class" prop="drivingSchoolName">
            {{formData.drivingSchoolName}}
            <!-- <el-select v-model="formData.regionManagerName" placeholder="请选择" :disabled="isEdit">
              <el-option
                v-for="item in drivingSchoolList"
                :key="item.id"
                :label="item.label"
                :value="item.id">
              </el-option>
            </el-select> -->
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属片区：" class="ctjt_form_item_class" prop="regionName">
            {{formData.regionName}}
            <!-- <el-select v-model="formData.regionManagerName" placeholder="请选择" :disabled="isEdit">
              <el-option
                v-for="item in drivingSchoolList"
                :key="item.id"
                :label="item.label"
                :value="item.id">
              </el-option>
            </el-select> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="门店名称：" class="ctjt_form_item_class" prop="storeName">
            {{formData.storeName}}
            <!-- <el-select v-model="formData.regionManagerName" placeholder="请选择" :disabled="isEdit">
              <el-option
                v-for="item in storeNamelList"
                :key="item.id"
                :label="item.label"
                :value="item.id">
              </el-option>
            </el-select> -->
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="门店代码：" class="ctjt_form_item_class" prop="storeCode">
            {{formData.storeCode}}
            <!-- <el-input v-model="formData.storeCode" placeholder="请输入" :disabled="isEdit" /> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="门店规模：" class="ctjt_form_item_class" prop="storeScale">
        {{formData.storeScale | storeScaleFilter}}
        <!-- <el-select v-model="formData.regionManagerName" placeholder="请选择" :disabled="isEdit">
          <el-option
            v-for="item in storeScaleList"
            :key="item.id"
            :label="item.label"
            :value="item.id">
          </el-option>
        </el-select> -->
      </el-form-item><br/>
      <el-form-item label="入职时间：" class="ctjt_form_item_class" prop="entryTime">
        {{formData.entryTime}}
        <!-- <el-date-picker
          :disabled="isEdit"
          type="date"
          v-model="formData.entryTime"
          placeholder="选择日期">
        </el-date-picker> -->
      </el-form-item><br/>
      <el-form-item label="岗位类型：" class="ctjt_form_item_class" prop="postType">
        {{formData.postType | getPostTypeFilter}}
        <!-- <el-radio-group v-model="formData.radio" :disabled="isEdit">
          <el-radio
            v-for="(item, index) in postTypeList"
            :key="index"
            :label="item.id">{{item.label}}</el-radio>
        </el-radio-group> -->
      </el-form-item>
    </el-form>
    <el-row type="flex" justify="center" style="padding: 30px 0;">
      <el-button type="info" style="color: #909399; background-color: transparent; border: 1px solid #DCDFE6;" @click="cancelSubmit">关闭</el-button>
      <!-- <el-button type="primary" style="margin-left: 32px;">确认提交</el-button> -->
    </el-row>
  </div>
</template>

<script lang="ts">
import { Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import { ParamsType } from '@/type';
import { MARKET_POST_TYPE, MARKET_SERVICE_STATUS, MARKET_STORE_SCALE } from '@/enums';
import clearCacheMixins from '@/mixins/clearCache';

@Component({
  filters: {
    getPostTypeFilter: (value: number) => {
      if (value === 0) return '-';
      const _list = MARKET_POST_TYPE;
      const _item = _list.filter(item => item.id === value);
      if (!_item.length) return '-';
      return _item[0].label;
    },
    storeScaleFilter: (value: number) => {
      if (value === 0) return '-';
      const _list = MARKET_STORE_SCALE;
      const _item = _list.filter(item => Number(item.id) === value);
      if (!_item.length) return '-';
      return _item[0].label;
    },
    servingStatusFilter: (value: number) => {
      if (value === 0) return '-';
      const _list = MARKET_SERVICE_STATUS;
      const _item = _list.filter(item => item.id === value);
      if (!_item.length) return '-';
      return _item[0].label;
    },
  }
})
export default class MarketCustomerServiveDetail extends mixins(clearCacheMixins) {
  @Action('user/queryUserCustomerDetail') private queryUserCustomerDetail!: (data: any) => ParamsType;
  // 供职状态
  // private servingStatusList:{ id: number, label: string }[] = MARKET_SERVICE_STATUS;

  // 驾校
  // private drivingSchoolList: { id: number, label: string }[] = [];

  // 所属门店
  // private storeNamelList: { id: number, label: string }[] = [];

  // 门店类型
  // private storeScaleList: { id: number, label: string }[] = MARKET_STORE_SCALE;

  // 岗位类型
  // private postTypeList = MARKET_POST_TYPE;

  // 表单数据
  // private isEdit = true; // 禁止编辑

  private formData: ParamsType = {
    drivingSchoolName: '', // 驾校名称
    entryTime: '', // 入职时间
    mobile: '', // 手机号
    postType: 0, // 岗位类型，1顶班客服，2客服专员，3代班客服，4储备客服
    regionName: '', // 片区名称
    status: 0, // 供职状态，1正式员工，2离职·
    storeCode: '', // 门店代码
    storeName: '', // 门店名称
    storeScale: 0, // 门店类型:1旗舰店，2服务店，3中型门店
    userName: '', // 姓名
  }

  /** 事件处理 */
  /**
   * 根据id获取到详情，设置表单数据
   */
  private _setFormDataFunc(param: ParamsType) {
    // 深拷贝一份数据
    const _data = JSON.parse(JSON.stringify(param));
    Object.keys(this.formData).forEach(key => {
      this.formData[key] = _data[key];
    });
  }

  /** 请求处理 */
  /**
   * 根据id场地详情
   */
  async queryDetail() {
    const { id } = this.$route.query;
    if (id) {
      const data = await this.queryUserCustomerDetail({ id });
      // 处理返回来的字段
      this._setFormDataFunc(data);
    }
  }

  /** 取消提交 */
  cancelSubmit() {
    this.clearCache();
    this.$router.push({ path: '/market/customerService/list' });
  }

  // 生命周期钩子函数
  async activated() {
    await this.queryDetail();
  }
}

</script>

<style lang="scss" scoped>

</style>
