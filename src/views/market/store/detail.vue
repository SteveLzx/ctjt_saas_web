<template>
  <el-form ref="storeForm" :rules="formRules" :model="formData" label-width="120px" class="bgc_fff">
    <CtjtCard :prop-data="{ title: '门店基本信息' }">
      <template #content>
        <el-row>
          <el-col :span="12">
            <el-form-item label="门店代码" class="ctjt_form_item_class" prop="code">
              <el-input class="w_200" v-model.trim="formData.code" placeholder="请输入" :disabled="isEdit" maxlength="20" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="门店名称" class="ctjt_form_item_class" prop="name">
              <el-input class="w_200" v-model.trim="formData.name" placeholder="请输入" :disabled="isEdit" maxlength="20" show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属驾校" class="ctjt_form_item_class" prop="drivingSchoolId">
              <el-select
                class="w_200"
                v-model="formData.drivingSchoolId"
                placeholder="请选择"
                :disabled="isEdit"
                @change="handledrivingSchoolChange"
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
                  v-for="item in regionList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="门店电话" class="ctjt_form_item_class" prop="telephone">
              <el-input class="w_200" type="tel" v-model="formData.telephone" placeholder="请输入" :disabled="isEdit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开业时间" class="ctjt_form_item_class" prop="openingTime">
              <el-date-picker
                class="w_200"
                :disabled="isEdit"
                v-model="formData.openingTime"
                align="right"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="门店性质" class="ctjt_form_item_class" prop="pattern">
              <el-radio-group v-model="formData.pattern" :disabled="isEdit">
                <el-radio
                  v-for="item in patternList"
                  :key="item.id"
                  :label="item.id" >{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="门店类型" class="ctjt_form_item_class" prop="storeType">
              <el-radio-group v-model="formData.storeType" :disabled="isEdit">
                <el-radio
                  v-for="item in storeTypeList"
                  :key="item.id"
                  :label="item.id" >{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="门店规模" class="ctjt_form_item_class" prop="scale">
              <el-radio-group v-model="formData.scale" :disabled="isEdit">
                <el-radio
                  v-for="item in scaleList"
                  :key="item.id"
                  :label="item.id" >{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="营业状态" class="ctjt_form_item_class" prop="businessStatus">
              <el-radio-group v-model="formData.businessStatus" :disabled="isEdit">
                <el-radio
                  v-for="item in businessStatusList"
                  :key="item.id"
                  :label="item.id" >{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="客服人数" class="ctjt_form_item_class" prop="customerNumber">
              <el-input class="w_200" v-model.number="formData.customerNumber" placeholder="请输入" :disabled="isEdit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="教练人数" class="ctjt_form_item_class" prop="coachNumber">
              <el-input class="w_200" v-model.number="formData.coachNumber" placeholder="请输入" :disabled="isEdit"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </CtjtCard>
    <CtjtCard :prop-data="{ title: '承租信息' }">
      <template #content>
        <el-row>
          <el-col :span="12">
            <el-form-item label="承租日期" class="ctjt_form_item_class" prop="leaseDate">
              <el-date-picker
                class="w_200"
                :disabled="isEdit"
                v-model="formData.leaseDate"
                align="right"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同到期时间" class="ctjt_form_item_class" prop="expiryDate">
              <el-date-picker
                class="w_200"
                :disabled="isEdit"
                v-model="formData.expiryDate"
                align="right"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="门店面积" class="ctjt_form_item_class" prop="area">
              <el-input class="w_200" type="number" v-model="formData.area" placeholder="请输入" :disabled="isEdit"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="业主姓名" class="ctjt_form_item_class" prop="owner">
              <el-input class="w_200" v-model.trim="formData.owner" placeholder="请输入" :disabled="isEdit" maxlength="10" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="业主电话" class="ctjt_form_item_class" prop="ownerTelephone">
              <el-input class="w_200" type="tel" v-model="formData.ownerTelephone" placeholder="请输入" :disabled="isEdit"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="门店租金单价" class="ctjt_form_item_class" prop="rentPrice">
              <el-input class="w_200" type="number" v-model="formData.rentPrice" placeholder="请输入" :disabled="isEdit">
                <template #append>元/平米</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="门店租金/月" class="ctjt_form_item_class" prop="monthlyRent">
              <el-input class="w_200" type="number" v-model="formData.monthlyRent" placeholder="请输入" :disabled="isEdit">
                <template #append>元</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </CtjtCard>
    <CtjtCard :prop-data="{ title: '地理位置' }">
      <template #content>
        <el-row>
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
        <el-row>
          <el-col :span="6">
            <el-form-item label="经度" class="ctjt_form_item_class" prop="longitude">
              <el-input class="w_200" v-model="formData.longitude" placeholder="请输入" :disabled="isEdit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="纬度" class="ctjt_form_item_class" prop="latitude">
              <el-input class="w_200" v-model="formData.latitude" placeholder="请输入" :disabled="isEdit"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </CtjtCard>
    <CtjtCard :prop-data="{ title: '门店图片' }">
      <template #content>
        <el-form-item label="" class="ctjt_form_item_class" prop="image" label-width="0" ref="photoUrl">
          <div style="display: flex;">
            <CtjtUploadOSS :prop-config="uploadConfig" @on-upload="goodsUploadFunc" v-if="formData.image.length === 0 && !isEdit">
              <template #content>
                <el-button type="primary">请选择图片</el-button>
              </template>
            </CtjtUploadOSS>
            <!-- 图片列表 -->
            <ul class="img_list_container">
              <li class="item_img" v-for="(item, index) in formData.image" :key="index">
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
    <CtjtCard :prop-data="{ title: '其他服务' }">
      <template #content>
        <el-col :span="24">
          <el-form-item label="其他服务" class="ctjt_form_item_class" prop="otherService">
            <el-checkbox-group v-model="formData.otherService" :disabled="isEdit">
              <el-checkbox
                v-for="item in otherServiceList"
                :key="item.id"
                :label="item.id">{{item.label}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </template>
    </CtjtCard>
    <el-row type="flex" justify="center" style="padding: 30px;">
      <el-button type="info" style="color: #909399; background-color: transparent; border: 1px solid #DCDFE6;" @click="cancelSubmit">取消</el-button>
      <el-button v-if="perm['btn_submit']" type="primary" style="margin-left: 32px;" @click="submit" :disabled="isEdit" :loading="submitLoading">提交</el-button>
    </el-row>
    <!-- 图片预览 -->
    <CtjtImageViewer v-if="showImageViewer" :propData="imageViewerList"  @on-close="handleImageViewerClose"></CtjtImageViewer>
  </el-form>
</template>

<script lang="ts">
import { State, Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import {
  CtjtCard, CtjtUploadOSS, CtjtImageViewer, CtjtSelectAddress
} from '@/components';
import { VueComponentParent, ParamsType, CallAddressDataType } from '@/type';
import {
  REG_PRICE, REG_INTEGER, REG_MOBILE_AND_TEL, OSS_BASEURL, REG_LONGITUDE, REG_LATITUDE
} from '@/assets/js/common';
import {
  MARKET_STORE_OTHER_SERVICE, MARKET_STORE_SCALE, MARKET_STORE_TYPE, MARKET_STORE_PATTERN, MARKET_STORE_BUDINESS_STATUS
} from '@/enums';
import clearCacheMixins from '@/mixins/clearCache';

@Component({
  components: {
    CtjtCard,
    CtjtUploadOSS,
    CtjtImageViewer,
    CtjtSelectAddress
  }
})
export default class MarketStoreDetail extends mixins(clearCacheMixins) {
  @Action('base/queryGroupMechanismData') private queryGroupMechanismData!: (data: any) => any;

  @Action('space/addStore') private addStore!: (data: any) => ParamsType;

  @Action('space/updateStoreById') private updateStoreById!: (data: any) => ParamsType;

  @Action('space/queryStoreById') private queryStoreById!: (data: any) => ParamsType;

  private ossBaseUrl = OSS_BASEURL;

  // 驾校
  private drivingSchoolList: { id: string, name: string }[] = [];

  // 片区
  private regionList: { id: string, name: string }[] = [];

  // 门店性质
  private patternList: { id: string, label: string }[] = MARKET_STORE_PATTERN;

  // 门店类型
  private storeTypeList: { id: string, label: string }[] = MARKET_STORE_TYPE;

  // 门店规模
  private scaleList: { id: string, label: string }[] = MARKET_STORE_SCALE;

  // 营业状态
  private businessStatusList: { id: string, label: string }[] = MARKET_STORE_BUDINESS_STATUS;

  // 其他服务
  private otherServiceList = MARKET_STORE_OTHER_SERVICE;

  /** 表单配置 */
  private isEdit = false; // 是否可以编辑

  private submitLoading = false; // 提交loading

  private formData: ParamsType = {
    address: '', // 地址
    area: null, // 门店面积
    areaId: null, // 区域id
    areaName: '', // 区域名称
    businessStatus: '', // 营业状态
    cityId: null, // 城市id
    cityName: '', // 城市名称
    coachNumber: null, // 教练人数
    code: '', // 门店代码
    customerNumber: null, // 客服人数
    drivingSchoolId: '', // 驾校id
    drivingSchoolName: '', // 驾校名称
    expiryDate: '', // 合同到期日期
    id: '', // ID,修改时必传
    image: [], // 门店图片
    latitude: null, // 纬度
    leaseDate: '', // 承租日期
    longitude: null, // 经度
    monthlyRent: null, // 月租金
    name: '', // 门店名称
    openingTime: '', // 开业时间
    otherService: [], // 其他服务
    owner: '', // 业主姓名
    ownerTelephone: '', // 业主电话
    pattern: '', // 门店性质
    provinceId: null, // 省份id
    provinceName: '', // 省份名称
    regionId: '', // 片区id
    regionName: '', // 片区名称
    rentPrice: null, // 租金单价
    revision: 0, // 乐观锁版本(新增禁传,修改时需传入查询出来的版本ID)
    scale: '', // 门店规模
    storeType: '', // 门店类型
    telephone: '', // 电话
  }

  // 表单验证
  private formRules = {
    code: [
      { required: true, message: '请输入门店代码', trigger: 'blur' }
    ],
    name: [
      { required: true, message: '请输入门店名称', trigger: 'blur' }
    ],
    drivingSchoolId: [
      { required: true, message: '请选择所属驾校', trigger: 'change' }
    ],
    regionId: [
      { required: true, message: '请选择所属片区', trigger: 'change' }
    ],
    telephone: [
      { required: true, message: '请输入门店电话', trigger: 'blur' },
      { pattern: REG_MOBILE_AND_TEL, message: '请输入正确电话格式' },
    ],
    openingTime: [
      {
        required: true, message: '请选择开业时间', trigger: 'change'
      }
    ],
    pattern: [
      { required: true, message: '请选择门店性质', trigger: 'change' }
    ],
    storeType: [
      { required: true, message: '请选择门店类型', trigger: 'change' }
    ],
    scale: [
      { required: true, message: '请选择门店规模', trigger: 'change' }
    ],
    businessStatus: [
      { required: true, message: '请选择营业状态', trigger: 'change' }
    ],
    customerNumber: [
      { required: true, message: '请输入客服人数', trigger: 'blur' },
      { pattern: REG_INTEGER, message: '请输入正确的格式, >=0正整数' },
      {
        type: 'number', min: 0, max: 9999, message: '请输入正确的1-9999的数字'
      },
    ],
    coachNumber: [
      { required: true, message: '请输入教练人数', trigger: 'blur' },
      { pattern: REG_INTEGER, message: '请输入正确的格式, >=0正整数' },
      {
        type: 'number', min: 0, max: 9999, message: '请输入正确的1-9999的数字'
      },
    ],
    leaseDate: [
      {
        required: true, message: '请选择承租日期', trigger: 'change'
      }
    ],
    expiryDate: [
      {
        required: true, message: '请选择合同到期时间', trigger: 'change'
      }
    ],
    area: [
      { required: true, message: '请输入门店面积', trigger: 'blur' },
      { pattern: REG_PRICE, message: '范围1-999999,可保留两位小数' },
    ],
    rentPrice: [
      { required: true, message: '请输入门店租金单价', trigger: 'blur' },
      { pattern: REG_PRICE, message: '范围1-999999,可保留两位小数' },
    ],
    monthlyRent: [
      { required: true, message: '请输入门店租金/月', trigger: 'blur' },
      { pattern: REG_PRICE, message: '范围1-999999,可保留两位小数' },
    ],
    owner: [
      { required: true, message: '请输入业主姓名', trigger: 'blur' }
    ],
    ownerTelephone: [
      { required: true, message: '请输入业主电话', trigger: 'blur' },
      { pattern: REG_MOBILE_AND_TEL, message: '请输入正确电话格式' },
    ],
    address: [
      { required: true, message: '请输入详细地址', trigger: 'blur' }
    ],
    provinceId: [
      { required: true, message: '请选择省份', trigger: 'change' },
      { pattern: REG_INTEGER, message: '请输选择省份' },
    ],
    cityId: [
      { required: true, message: '请选择城市', trigger: 'change' },
      { pattern: REG_INTEGER, message: '请输选择城市' },
    ],
    areaId: [
      { required: true, message: '请选择区', trigger: 'change' },
      { pattern: REG_INTEGER, message: '请输选择区' },
    ],
    longitude: [
      { required: true, message: '请输入经度', trigger: 'blur' },
      { pattern: REG_LONGITUDE, message: '-180.000000~180.000000' }
    ],
    latitude: [
      { required: true, message: '请输入纬度', trigger: 'blur' },
      { pattern: REG_LATITUDE, message: '-90.000000~90.000000' }
    ],
    image: [
      { required: true, message: '请上传图片', trigger: 'change' }
    ]
  }

  // 图片
  private uploadConfig = {
    haveVideo: false,
    multiple: false,
    accept: '',
    limit: 1,
    disabled: false,
    tips: '',
    business: 'store'
  }

  private showImageViewer = false;

  public goodsUploadFunc(val: string) {
    (this.$refs.photoUrl as VueComponentParent).resetField();
    this.formData.image.push({ photoUrl: val });
  }

  private imageViewerList: string[] = [];

  // 预览
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
      this.formData.image = [];
      this.$message.success('删除成功!');
    }).catch(() => {
      this.$message.info('已取消删除');
    });
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

  /** 事件处理 */
  /** 驾校切换 */
  private handledrivingSchoolChange(val: string) {
    this.selectFunc('region', val); // 请求片区
    this.formData.regionId = '';
    this.formData.regionName = '';

    const _list = this.drivingSchoolList.filter(item => item.id === val);
    this.formData.drivingSchoolName = _list[0].name;
  }

  /** 片区切换 */
  private handleRegionChange(val: string) {
    const _list = this.regionList.filter(item => item.id === val);
    this.formData.regionName = _list[0].name;
  }

  /** 搜索下拉框筛选 */
  private _setFormSelectFunc(type: string, data: any) {
    if (data && data.length > 0) {
      const _data = JSON.parse(JSON.stringify(data));
      if (type === 'drivingSchool') {
        this.drivingSchoolList = _data;
      }
      if (type === 'region') {
        this.regionList = _data;
      }
    }
  }

  /**
   * 根据id获取到详情，设置表单数据
   */
  private async _setFormDataFunc(param: ParamsType) {
    // 深拷贝一份数据
    const _data = JSON.parse(JSON.stringify(param));
    await this.selectFunc('region', _data.drivingSchoolId); // 请求片区
    Object.keys(this.formData).forEach(key => {
      if (_data[key] !== null) {
        if (key === 'otherService') {
          try {
            const _otherService = JSON.parse(_data[key]);
            _otherService.forEach((item: any) => {
              this.formData[key].push(item.id);
            });
          } catch (error) {
            //
          }
        } else if (key === 'image') {
          this.formData[key] = _data[key] === '{}' || !_data[key] ? [] : JSON.parse(_data[key]);
        } else if (key === 'openingTime') {
          this.formData[key] = this.$dayjs(_data[key]).format('YYYY-MM-DD');
        } else if (key === 'businessStatus' || key === 'pattern' || key === 'scale' || key === 'storeType') {
          const _obj = JSON.parse(_data[key]);
          this.formData[key] = _obj.id;
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
      otherService, expiryDate, openingTime, leaseDate, image, businessStatus, pattern, scale, storeType
    } = sendData;
    sendData.expiryDate = this.$dayjs(expiryDate).format('YYYY-MM-DD');
    sendData.openingTime = this.$dayjs(openingTime).format('YYYY-MM-DD');
    sendData.leaseDate = this.$dayjs(leaseDate).format('YYYY-MM-DD');

    // 处理 图片集和
    sendData.image = JSON.stringify(image);

    // 处理 其他服务
    const _otherServiceArr: any[] = [];
    this.otherServiceList.forEach(item => {
      if (otherService.includes(item.id)) {
        _otherServiceArr.push(item);
      }
    });
    sendData.otherService = JSON.stringify(_otherServiceArr);

    // 处理门店相关
    const _businessStatus = this.businessStatusList.filter(item => item.id === businessStatus);
    const _pattern = this.patternList.filter(item => item.id === pattern);
    const _scale = this.scaleList.filter(item => item.id === scale);
    const _storeType = this.storeTypeList.filter(item => item.id === storeType);
    sendData.businessStatus = JSON.stringify(_businessStatus[0]);
    sendData.pattern = JSON.stringify(_pattern[0]);
    sendData.scale = JSON.stringify(_scale[0]);
    sendData.storeType = JSON.stringify(_storeType[0]);

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
   * 根据id获取门店详情
   */
  async queryDetail() {
    const { id, edit } = this.$route.query;
    if (id) {
      if (edit) {
        this.isEdit = true;
      }
      const data = await this.queryStoreById({ id });
      this._setFormDataFunc(data);
    }
  }

  /**
   * 提交门店信息
   * 新增/修改
   */
  async submit() {
    (this.$refs.storeForm as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        // 特殊字段处理
        const sendData = this._specialHandleFormData();
        const { id } = sendData;
        this.submitLoading = true;
        if (id > 0) {
          this.updateStoreById(sendData).then(() => {
            this.$message.success('修改成功');
            this.cancelSubmit();
          }).finally(() => {
            this.submitLoading = false;
          });
        } else {
          this.addStore(sendData).then((res: any) => {
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
    this.resetForm();
    this.clearCache();
    this.$router.push({ path: '/market/store/list' });
  }

  /**
   * 重置
   */
  resetForm() {
    (this.$refs.storeForm as VueComponentParent).resetFields();
  }

  // 生命周期
  perm = {};

  async activated() {
    this.selectFunc('drivingSchool', '0'); // 请求驾校列表
    this.queryDetail();
    this.$nextTick(() => {
      (this.$refs.storeForm as VueComponentParent).clearValidate();
    });
    const permObj = await this.$getPerm(this);
    this.perm = permObj.perm;
  }
}

</script>

<style lang="scss" scoped>
.img_list_container {
  margin-left: 30px;
  .item_img {
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
