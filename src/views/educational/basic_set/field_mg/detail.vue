<template>
  <el-form ref="spaceForm" :model="formData" :rules="formRules" label-width="130px" class="bgc_fff">
    <CtjtCard :prop-data="{ title: '场地基本信息' }">
      <template #content>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="场地名称" class="ctjt_form_item_class" prop="name">
              <el-input class="w_200" v-model.trim="formData.name" placeholder="请输入" :disabled="isEdit" maxlength="20" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属驾校" class="ctjt_form_item_class" prop="drivingSchoolId">
              <el-select
                class="w_200"
                v-model="formData.drivingSchoolId"
                placeholder="请选择"
                :disabled="isEdit"
                @change="handleDrivingSchoolChange"
              >
                <el-option
                  v-for="item in drivingSchoolList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属片区" class="ctjt_form_item_class" prop="regionId">
              <el-select
                class="w_200"
                v-model="formData.regionId"
                placeholder="请选择"
                :disabled="isEdit"
                @change="handleRegionChange"
              >
                <el-option
                  v-for="item in regionlList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主要门店" class="ctjt_form_item_class" prop="storeId">
              <el-select
                class="w_200"
                v-model="formData.storeId"
                placeholder="请选择"
                :disabled="isEdit"
                @change="handleStoreChange"
              >
                <el-option
                  v-for="item in storeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="false">
          <el-col :span="12">
            <el-form-item label="教学组长" class="ctjt_form_item_class" prop="groupLeaderName">
              <el-select class="w_200" v-model="formData.groupLeaderName" placeholder="请选择" :disabled="isEdit">
                <el-option
                  v-for="item in groupLeaderList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="片区经理" class="ctjt_form_item_class" prop="regionManagerName">
              <el-select class="w_200" v-model="formData.regionManagerName" placeholder="请选择" :disabled="isEdit">
                <el-option
                  v-for="item in regionManagerList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="场地类型" class="ctjt_form_item_class" prop="siteType">
              <el-radio-group v-model="formData.siteType" :disabled="isEdit">
                <el-radio
                  v-for="item in siteTypeList"
                  :label="item.id"
                  :key="item.id">{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="智能教练数量" class="ctjt_form_item_class" prop="coachNumber">
              <el-input class="w_200" v-model.number="formData.coachNumber" placeholder="请输入" :disabled="isEdit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="智能带教车辆数" class="ctjt_form_item_class" prop="carNumber">
              <el-input class="w_200" v-model.number="formData.carNumber" placeholder="请输入" :disabled="isEdit"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="使用状态" class="ctjt_form_item_class" prop="status">
              <el-radio-group v-model="formData.status" :disabled="isEdit">
                <el-radio
                  v-for="item in statusList"
                  :label="item.id"
                  :key="item.id"
                >{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备案状态" class="ctjt_form_item_class" prop="putOnRecordsStatus">
              <el-radio-group v-model="formData.putOnRecordsStatus" :disabled="isEdit">
                <el-radio :label="0">否</el-radio>
                <el-radio :label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </CtjtCard>
    <CtjtCard :prop-data="{ title: '桩位信息' }">
      <template #content>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="倒车入库" class="ctjt_form_item_class" prop="backGarageNumber">
              <el-input class="w_200" v-model.number="formData.backGarageNumber" placeholder="请输入" :disabled="isEdit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="侧方位停车" class="ctjt_form_item_class" prop="parallelParkNumber">
              <el-input class="w_200" v-model.number="formData.parallelParkNumber" placeholder="请输入" :disabled="isEdit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="曲线行驶" class="ctjt_form_item_class" prop="curveNumber">
              <el-input class="w_200" v-model.number="formData.curveNumber" placeholder="请输入" :disabled="isEdit"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="坡道定点域停车" class="ctjt_form_item_class" prop="slopeNumber">
              <el-input class="w_200" v-model.number="formData.slopeNumber" placeholder="请输入" :disabled="isEdit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="直角转弯" class="ctjt_form_item_class" prop="quarterTurningNumber">
              <el-input class="w_200" v-model.number="formData.quarterTurningNumber" placeholder="请输入" :disabled="isEdit"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="智能带教桩位数" class="ctjt_form_item_class" prop="intelligentPileNumber">
              <el-input class="w_200" v-model.number="formData.intelligentPileNumber" placeholder="请输入" :disabled="isEdit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总教桩位数" class="ctjt_form_item_class" prop="pileTotal">
              <el-input class="w_200" v-model.number="formData.pileTotal" placeholder="请输入" :disabled="isEdit"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </CtjtCard>
    <CtjtCard :prop-data="{ title: '承租信息' }">
      <template #content>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="合同签署日期" class="ctjt_form_item_class" prop="leaseDate">
              <el-date-picker
                class="w_200"
                :disabled="isEdit"
                type="date"
                v-model="formData.leaseDate"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="到期日期" class="ctjt_form_item_class" prop="expiryDate">
              <el-date-picker
                class="w_200"
                :disabled="isEdit"
                type="date"
                v-model="formData.expiryDate"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="场地面积" class="ctjt_form_item_class" prop="area">
              <el-input class="w_200" type="number" v-model="formData.area" placeholder="请输入" :disabled="isEdit"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="场地租金单价" class="ctjt_form_item_class" prop="rentPrice">
              <el-input class="w_200" type="number" v-model="formData.rentPrice" placeholder="请输入" :disabled="isEdit" style="width: 400px">
                <template slot="append">元/平方</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="场地租金/月" class="ctjt_form_item_class" prop="monthlyRent">
              <el-input class="w_200" type="number" v-model="formData.monthlyRent" placeholder="请输入" :disabled="isEdit" style="width: 400px">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="业主姓名" class="ctjt_form_item_class" prop="owner">
              <el-input class="w_200" v-model.trim="formData.owner" placeholder="请输入" :disabled="isEdit" maxlength="10" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="业主联系方式" class="ctjt_form_item_class" prop="ownerTelephone">
              <el-input class="w_200" type="tel" v-model="formData.ownerTelephone" placeholder="请输入" :disabled="isEdit"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </CtjtCard>
    <CtjtCard :propData="{ title: '地理位置' }">
      <template #content>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="详细地址" class="ctjt_form_item_class" prop="address">
              <CtjtSelectAddress
                :disabled="isEdit"
                :data-config="formData"
                @success-call="addressSuccessFunc">
              </CtjtSelectAddress>
              <el-input class="w_600" v-model.trim="formData.address" placeholder="请输入" :disabled="isEdit" maxlength="30" show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="经度" class="ctjt_form_item_class" prop="longitude">
              <el-input class="w_200" v-model="formData.longitude" placeholder="请输入" :disabled="isEdit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="纬度" class="ctjt_form_item_class" prop="latitude">
              <el-input class="w_200" v-model="formData.latitude" placeholder="请输入" :disabled="isEdit"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </CtjtCard>
    <CtjtCard :propData="{ title: '配套措施' }">
      <template #content>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="防撞墩" class="ctjt_form_item_class" prop="bumperNumber">
              <el-input class="w_200" v-model.number="formData.bumperNumber" placeholder="请输入" :disabled="isEdit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="灭火器" class="ctjt_form_item_class" prop="fireExtinguisherNumber">
              <el-input class="w_200" v-model.number="formData.fireExtinguisherNumber" placeholder="请输入" :disabled="isEdit"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="休息亭" class="ctjt_form_item_class" prop="kioskNumber">
              <el-input class="w_200" v-model.number="formData.kioskNumber" placeholder="请输入" :disabled="isEdit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="灯光" class="ctjt_form_item_class" prop="lightsNumber">
              <el-input class="w_200" v-model.number="formData.lightsNumber" placeholder="请输入" :disabled="isEdit"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </CtjtCard>
    <CtjtCard :propData="{ title: '场地图' }">
      <template #content>
        <el-form-item label="" class="ctjt_form_item_class" prop="photoUrl" label-width="0" ref="photoUrl">
          <div style="display: flex;">
            <CtjtUploadOSS :prop-config="uploadConfig" @on-upload="goodsUploadFunc">
              <template #content v-if="formData.photoUrl.length < 1 && !isEdit">
                <el-button type="primary">请选择图片</el-button>
              </template>
            </CtjtUploadOSS>
            <!-- 图片列表 -->
              <ul class="img_list_container">
                <li class="item_img" v-for="(item, index) in formData.photoUrl" :key="index">
                  <div class="img_box">
                    <el-image
                      style="width: 100%; height: 100%"
                      :src="`${ossBaseUrl}${item.photoUrl}`"
                      :fit="'cover'">
                    </el-image>
                  </div>
                  <div class="img_options">
                    <span @click="imageViewerFunc(item.photoUrl)">预览</span>
                    <template v-if="!isEdit">
                      <el-popconfirm
                        title="确定删除吗？"
                        @confirm="deteleImageFunc(index)"
                      >
                        <span slot="reference" style="color: #F56C6C;">删除</span>
                      </el-popconfirm>
                    </template>
                  </div>
                </li>
              </ul>
          </div>
        </el-form-item>
      </template>
    </CtjtCard>
    <CtjtCard :propData="{ title: '其他服务' }">
      <template #content>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="其他服务" class="ctjt_form_item_class" prop="otherService">
              <el-checkbox-group v-model="formData.otherService" :disabled="isEdit">
                <el-checkbox
                  v-for="item in otherServiceList"
                  :label="item.id"
                  :key="item.id">{{item.label}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="备注：" class="ctjt_form_item_class" prop="remark">
              <el-input v-model.trim="formData.remark" style="width: 600px" type="textarea" clearable show-word-limit placeholder="网络情况，是否支持加铁皮箱等" :disabled="isEdit" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </CtjtCard>
    <el-row type="flex" justify="center" style="padding: 30px 0;">
      <el-button type="info" style="color: #909399; background-color: transparent; border: 1px solid #DCDFE6;" @click="cancelSubmit">取消</el-button>
      <el-button v-if="perm['btn_submit']" type="primary" style="margin-left: 32px;" @click="submit" :disabled="isEdit" :loading="submitLoading">确认提交</el-button>
    </el-row>
    <!-- 图片预览 -->
    <CtjtImageViewer v-if="showImageViewer" :propData="imageViewerList"  @on-close="handleImageViewerClose"></CtjtImageViewer>
  </el-form>
</template>

<script lang="ts">
import { State, Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import {
  CtjtCard, CtjtSelectAddress, CtjtImageViewer, CtjtUploadOSS
} from '@/components';
import {
  EDUCATIONAL_OTHER_SERVICE, EDUCATIONAL_SITE_TYPE, EDUCATIONAL_STATUS
} from '@/enums';
import { VueComponentParent, ParamsType, CallAddressDataType } from '@/type';
import {
  REG_PRICE, REG_ZERO_INTEGER, REG_MOBILE_AND_TEL, OSS_BASEURL, REG_LONGITUDE, REG_LATITUDE, REG_INTEGER
} from '@/assets/js/common';
import clearCacheMixins from '@/mixins/clearCache';

@Component({
  components: {
    CtjtCard,
    CtjtSelectAddress,
    CtjtUploadOSS,
    CtjtImageViewer
  }
})
export default class EducationalFieldDetail extends mixins(clearCacheMixins) {
  @State(state => state.base.dictAllData) dictAllData!: Map<string, { id: number, label: string }[]>;

  @Action('base/addDictAllData') private addDictAllData!: (names: string[]) => void;

  @Action('base/queryGroupMechanismData') private queryGroupMechanismData!: (data: any) => any;

  @Action('space/queryTrainingPlace') private queryTrainingPlace!: (data: any) => ParamsType;

  @Action('space/addTrainingPlace') private addTrainingPlace!: (data: any) => ParamsType;

  @Action('space/updateTrainingPlace') private updateTrainingPlace!: (data: any) => ParamsType;

  private ossBaseUrl = OSS_BASEURL;

  // 驾校
  private drivingSchoolList: { id: string, name: string }[] = [];

  // 片区
  private regionlList: { id: string, name: string }[] = [];

  // 门店
  private storeList: { id: string, name: string }[] = [];

  // 教学组长
  private groupLeaderList: { id: number, label: string }[] = [];

  // 片区经理
  private regionManagerList: { id: number, label: string }[] = [];

  // 使用状态
  private statusList = EDUCATIONAL_STATUS;

  // 其他服务
  private otherServiceList = EDUCATIONAL_OTHER_SERVICE;

  // 场地类型
  private siteTypeList= EDUCATIONAL_SITE_TYPE;

  /** 表单配置 */
  private isEdit = false; // 是否可以编辑

  private submitLoading = false; // 提交loading

  private formData: ParamsType = {
    address: '', // 地址
    area: null, // 场地面积
    areaId: null, // 区域id
    areaName: '', // 区域名称
    backGarageNumber: null, // 倒车入库数量
    bumperNumber: null, // 防撞墩
    carNumber: null, // 车辆数量
    cityId: null, // 城市id
    cityName: '', // 城市名称
    coachNumber: null, // 教练人数
    curveNumber: null, // 弯道数量
    drivingSchoolName: '', // 所属驾校
    drivingSchoolId: '', // 驾校id
    expiryDate: '', // 合同到期日期
    fireExtinguisherNumber: null, // 灭火器
    groupLeaderId: null, // 教学组长id
    groupLeaderName: '', // 教学组长姓名
    id: null, // id
    intelligentPileNumber: null, // 智能桩位数量
    kioskNumber: null, // 休息亭
    latitude: null, // 纬度
    leaseDate: '', // 承租日期
    lightsNumber: null, // 灯光
    longitude: null, // 经度
    monthlyRent: null, // 月租金
    name: '', // 训练场名称
    otherService: [], // 其他服务，1模拟机练习室，2休息凉棚，4自动贩卖机
    owner: '', // 业主姓名
    ownerTelephone: '', // 业主电话
    parallelParkNumber: null, // 侧方库数量
    photoUrl: [], // 图片URL
    pileTotal: null, // 总桩位数量
    provinceId: null, // 省份id
    provinceName: '', // 省份名称
    putOnRecordsStatus: 0, // 备案状态
    quarterTurningNumber: null, // 直角转弯数量
    regionId: '', // 区域id
    regionManagerId: null, // 片区经理id
    regionManagerName: '', // 经理名称
    regionName: '', // 区域名称
    remark: '', // 备注
    rentPrice: null, // 租金单价
    revision: 0, // 乐观锁版本(后端生成,修改时需传入查询出来的版本ID)
    siteType: '', // {id:1,label:智能+人工}
    slopeNumber: null, // 坡道数量
    status: 0, // 使用状态，1正常，0停用
    storeId: '', // 门店id
    storeName: '' // 门店名称
  }

  // 表单校验
  private formRules = {
    name: [
      { required: true, message: '请输入场地名称', trigger: 'blur' }
    ],
    drivingSchoolId: [
      { required: true, message: '请选择所属驾校', trigger: 'change' }
    ],
    regionId: [
      { required: true, message: '请选择所属片区', trigger: 'change' }
    ],
    storeId: [
      { required: true, message: '请选择主要门店', trigger: 'change' }
    ],
    // groupLeaderName: [
    //   { required: true, message: '请选择教学组长', trigger: 'change' }
    // ],
    siteType: [
      { required: true, message: '请选择场地类型', trigger: 'change' }
    ],
    status: [
      { required: true, message: '请选择使用状态', trigger: 'change' }
    ],
    backGarageNumber: [
      { required: true, message: '请输入倒车入库', trigger: 'blur' },
      { pattern: REG_ZERO_INTEGER, message: '输入格式有误' },
      {
        min: 0, max: 100, message: '输入格式有误', type: 'number'
      }
    ],
    parallelParkNumber: [
      { required: true, message: '请输入侧方位停车', trigger: 'blur' },
      { pattern: REG_ZERO_INTEGER, message: '输入格式有误' },
      {
        min: 0, max: 100, message: '输入格式有误', type: 'number'
      }
    ],
    curveNumber: [
      { required: true, message: '请输入曲线行驶', trigger: 'blur' },
      { pattern: REG_ZERO_INTEGER, message: '输入格式有误' },
      {
        min: 0, max: 100, message: '输入格式有误', type: 'number'
      }
    ],
    slopeNumber: [
      { required: true, message: '请输入坡道定点域停车', trigger: 'blur' },
      { pattern: REG_ZERO_INTEGER, message: '输入格式有误' },
      {
        min: 0, max: 100, message: '输入格式有误', type: 'number'
      }
    ],
    quarterTurningNumber: [
      { required: true, message: '请输入直角转弯', trigger: 'blur' },
      { pattern: REG_ZERO_INTEGER, message: '输入格式有误' },
      {
        min: 0, max: 100, message: '输入格式有误', type: 'number'
      }
    ],
    intelligentPileNumber: [
      { required: true, message: '请输入智能带教桩位数', trigger: 'blur' },
      { pattern: REG_ZERO_INTEGER, message: '输入格式有误' },
      {
        min: 0, max: 100, message: '输入格式有误', type: 'number'
      }
    ],
    pileTotal: [
      { required: true, message: '请输入总教桩位数', trigger: 'blur' },
      { pattern: REG_ZERO_INTEGER, message: '输入格式有误' },
      {
        min: 0, max: 100, message: '输入格式有误', type: 'number'
      }
    ],
    address: [
      { required: true, message: '请输入详细地址', trigger: 'blur' }
    ],
    provinceId: [
      { required: true, message: '请选择省份', trigger: 'change' },
      { pattern: REG_INTEGER, message: '请选择省份' },
    ],
    cityId: [
      { required: true, message: '请选择城市', trigger: 'change' },
      { pattern: REG_INTEGER, message: '请选择城市' },
    ],
    areaId: [
      { required: true, message: '请选择区', trigger: 'change' },
      { pattern: REG_INTEGER, message: '请选择区' },
    ],
    longitude: [
      { required: true, message: '请输入经度', trigger: 'blur' },
      { pattern: REG_LONGITUDE, message: '-180.000000~180.000000' }
    ],
    latitude: [
      { required: true, message: '请输入纬度', trigger: 'blur' },
      { pattern: REG_LATITUDE, message: '-90.000000~90.000000' }
    ],
    photoUrl: [
      {
        type: 'array', required: true, message: '请上传一张图片', trigger: 'change'
      },
      {
        type: 'array', min: 1, max: 1, message: '最多上传1张', trigger: 'change'
      }
    ],
    otherService: [
      {
        type: 'array', required: true, message: '请至少选择一个其他服务', trigger: 'change'
      }
    ],
    remark: [
      { required: true, message: '请输入备注', trigger: 'blur' }
    ],
    bumperNumber: [
      { pattern: REG_ZERO_INTEGER, message: '输入格式有误' },
      { validator: this.checkCoach }
    ],
    fireExtinguisherNumber: [
      { pattern: REG_ZERO_INTEGER, message: '输入格式有误' },
      { validator: this.checkCoach }
    ],
    kioskNumber: [
      { pattern: REG_ZERO_INTEGER, message: '输入格式有误' },
      { validator: this.checkCoach }
    ],
    lightsNumber: [
      { pattern: REG_ZERO_INTEGER, message: '输入格式有误' },
      { validator: this.checkCoach }
    ],
    rentPrice: [
      { pattern: REG_PRICE, message: '范围1-999999,可保留两位小数' }
    ],
    monthlyRent: [
      { pattern: REG_PRICE, message: '范围1-999999,可保留两位小数' }
    ],
    ownerTelephone: [
      { pattern: REG_MOBILE_AND_TEL, message: '输入格式有误' }
    ],
    area: [
      { pattern: REG_PRICE, message: '输入格式有误' }
    ],
    coachNumber: [
      { pattern: REG_ZERO_INTEGER, message: '输入格式有误' },
      { validator: this.checkCoach }
    ],
    carNumber: [
      { pattern: REG_ZERO_INTEGER, message: '输入格式有误' },
      { validator: this.checkCoach }
    ]
  }

  private checkCoach(rule: any, value: any, callback: any) {
    if (value !== '') {
      if (parseInt(value, 0) < 0 || parseInt(value, 0) > 10000) {
        callback(new Error('请输入0-9999的数字'));
      } else {
        callback();
      }
    } else {
      callback();
    }
  }

  // 地址
  // 选中地址成功回调
  addressSuccessFunc(data: CallAddressDataType) {
    const { type, id, value } = data;
    if (type === 'prov') {
      this.formData.provinceId = id;
      this.formData.provinceName = value;
      // 清空
      this.formData.cityId = 0;
      this.formData.cityName = '';
      this.formData.areaId = 0;
      this.formData.areaName = '';
    }
    if (type === 'city') {
      this.formData.cityId = id;
      this.formData.cityName = value;
      // 清空
      this.formData.areaId = 0;
      this.formData.areaName = '';
    }
    if (type === 'area') {
      this.formData.areaId = id;
      this.formData.areaName = value;
    }
  }

  // 图片
  private uploadConfig = {
    haveVideo: false,
    multiple: false,
    accept: '',
    limit: 5,
    disabled: false,
    tips: '',
    business: 'space'
  }

  private showImageViewer = false;

  public goodsUploadFunc(val: string) {
    (this.$refs.photoUrl as VueComponentParent).resetField();
    this.formData.photoUrl.push({ photoUrl: val });
  }

  // 预览
  private imageViewerList: string[] = [];

  // 点击预览
  private imageViewerFunc(val: string) {
    this.imageViewerList = [`${this.ossBaseUrl}${val}`];
    this.showImageViewer = true;
  }

  // 关闭预览 提供给子组件掉用
  private handleImageViewerClose() {
    this.showImageViewer = false;
  }

  // 删除
  private deteleImageFunc(index: number) {
    this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.formData.photoUrl.splice(index, 1);
      this.$message.success('删除成功!');
    }).catch(() => {
      this.$message.info('已取消删除');
    });
  }

  /** 事件处理 */

  /** 驾校切换 */
  handleDrivingSchoolChange(val: string) {
    this.selectFunc('region', val); // 请求片区列表
    this.formData.regionId = '';
    this.formData.regionName = '';
    this.formData.storeId = '';
    this.formData.storeName = '';

    const _list = this.drivingSchoolList.filter(item => item.id === val);
    this.formData.drivingSchoolName = _list[0].name;
  }

  /** 片区切换 */
  handleRegionChange(val: string) {
    this.selectFunc('store', val); // 请求门店列表
    this.formData.storeId = '';
    this.formData.storeName = '';

    const _list = this.regionlList.filter(item => item.id === val);
    this.formData.regionName = _list[0].name;
  }

  /** 门店切换 */
  handleStoreChange(val: string) {
    const _list = this.storeList.filter(item => item.id === val);
    this.formData.storeName = _list[0].name;
  }

  /** 搜索下拉框筛选 */
  private _setFormSelectFunc(type: string, data: any) {
    if (data && data.length > 0) {
      const _data = JSON.parse(JSON.stringify(data));
      if (type === 'drivingSchool') {
        this.drivingSchoolList = _data;
      }
      if (type === 'region') {
        this.regionlList = _data;
      }
      if (type === 'store') {
        this.storeList = _data;
      }
    }
  }

  /**
   * 根据id获取到详情，设置表单数据
   */
  private async _setFormDataFunc(param: ParamsType) {
    // 深拷贝一份数据
    const _data = JSON.parse(JSON.stringify(param));
    await this.selectFunc('region', _data.drivingSchoolId); // 请求片区列表
    await this.selectFunc('store', _data.regionId); // 请求门店列表
    Object.keys(this.formData).forEach(key => {
      if (_data[key] !== null) {
        if (key === 'siteType') {
          const _siteType = JSON.parse(_data[key]);
          this.formData[key] = _siteType[0].id;
        } else if (key === 'otherService') {
          const _otherService = JSON.parse(_data[key]);
          _otherService.forEach((item: any) => {
            this.formData[key].push(item.id);
          });
        } else if (key === 'photoUrl') {
          this.formData[key] = JSON.parse(_data[key]);
        } else {
          this.formData[key] = _data[key];
        }
      }
    });
  }

  /**
   * 提交表单前，处理特殊字段
   */
  private _specialHandleFormData() {
    // 深拷贝一份数据
    const sendData = JSON.parse(JSON.stringify(this.formData));
    const {
      siteType, otherService, photoUrl, expiryDate, leaseDate
    } = sendData;
    // 处理 场地类型
    const _siteType = this.siteTypeList.filter(item => item.id === siteType);
    sendData.siteType = JSON.stringify(_siteType);
    // 处理 图片
    sendData.photoUrl = JSON.stringify(photoUrl);
    // 处理 其他服务
    const _otherServiceArr: any[] = [];
    this.otherServiceList.forEach(item => {
      if (otherService.includes(item.id)) {
        _otherServiceArr.push(item);
      }
    });
    sendData.otherService = JSON.stringify(_otherServiceArr);

    // 处理时间
    sendData.expiryDate = expiryDate ? this.$dayjs(expiryDate).format('YYYY-MM-DD') : '';
    sendData.leaseDate = leaseDate ? this.$dayjs(leaseDate).format('YYYY-MM-DD') : '';

    return sendData;
  }

  /** 请求处理 */

  /**
   * 下拉框请求参数处理
  */
  private async selectFunc(type: string, id: string) {
    const data = await this.queryGroupMechanismData({ pid: id });
    this._setFormSelectFunc(type, data);
  }

  /**
   * 根据id场地详情
   */
  async queryDetail() {
    const { id, edit } = this.$route.query;
    if (id) {
      if (edit) {
        this.isEdit = true;
      }
      const data = await this.queryTrainingPlace({ id });
      // 处理返回来的字段
      this._setFormDataFunc(data);
    }
  }

  /**
   * 提交场地信息
   * 新增/修改
   */
  async submit() {
    (this.$refs.spaceForm as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        // 特殊字段处理
        const sendData = this._specialHandleFormData();
        const { id } = sendData;
        this.submitLoading = true;
        if (id > 0) {
          this.updateTrainingPlace(sendData).then(() => {
            this.$message.success('修改成功');
            this.cancelSubmit();
          }).finally(() => {
            this.submitLoading = false;
          });
        } else {
          delete sendData.id;
          this.addTrainingPlace(sendData).then(() => {
            this.$message.success('新增成功');
            this.cancelSubmit();
          }).finally(() => {
            this.submitLoading = false;
          });
        }
      } else {
        this._specialHandleFormData();
        this.$message.warning('您的信息填写有误，请仔细检查并修改！');
      }
    });
  }

  /**
   * 取消提交
   * 返回上一页
   */
  cancelSubmit() {
    this.clearCache();
    this.$router.push({ path: '/educational/basic_set/field_mg' });
  }

  // 生命周期钩子函数
  perm = {};

  async activated() {
    this.selectFunc('drivingSchool', '0'); // 请求驾校列表
    this.queryDetail();
    this.$nextTick(() => {
      (this.$refs.spaceForm as VueComponentParent).clearValidate();
    });
    const permObj = await this.$getPerm(this);
    this.perm = permObj.perm;
  }
}

</script>

<style lang="scss" scoped>
.img_list_container {
  margin-left: 30px;
  display: flex;
  .item_img {
    margin-right: 8px;
    .img_box {
      width: 150px;
      height: 150px;
      border-radius: 4px;
      background-color: #F2F6FC;
      border: 1px dashed #409EFF;
      cursor: pointer;
    }
    .img_options {
      margin-top: 8px;
      display: flex;
      justify-content: center;
      span {
        color: #409EFF;
        font-size: 14px;
        cursor: pointer;
        &:nth-child(2) {
          margin: 0 8px;
        }
      }
    }
  }
}
.ctjt_training_programs_container {
  ::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner{
    background-color: #F2F7FF;
    border-color: #F2F7FF;
    box-shadow: -1px 0 0 0 #F2F7FF;
  }
}
</style>
