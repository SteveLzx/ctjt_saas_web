<template>
  <el-form ref="goodsForm" :model="formData" :rules="formRules" label-width="140px" class="bgc_fff">
    <CtjtCard :prop-data="{ title: '商品基本信息' }">
      <template #content>
        <el-form-item label="商品编码" class="ctjt_form_item_class" v-if="formData.seq">
          <span>{{formData.seq}}</span>
        </el-form-item>
        <el-form-item :label="`驾校${noEditClassess?'：':''}`" class="ctjt_form_item_class" prop="drivingSchoolName">
          <span v-if="noEditClassess">{{formData.drivingSchoolName}}</span>
          <el-select v-else class="w_200" v-model="formData.drivingSchoolName" placeholder="请选择" :disabled="isEdit" @change="handleDrivingSchoolChange">
            <el-option
              v-for="item in drivingSchoolList"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <br/>
        <el-form-item :label="`班别名称${noEditClassess?'：':''}`" class="ctjt_form_item_class" prop="className">
          <span v-if="noEditClassess">{{formData.className}}</span>
          <el-select v-else class="w_200" v-model="formData.className" placeholder="请选择" :disabled="isEdit" @change="handleClassNameChange">
            <el-option
              v-for="item in classessList"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <br/>
        <el-form-item :label="`培训车型${noEditClassess?'：':''}`" class="ctjt_form_item_class" prop="carModel">
          <span v-if="noEditClassess">{{formData.carModel.join('/')}}</span>
          <div v-else style="width: 600px">
          <el-checkbox-group v-model="formData.carModel" @change="handleCarModelChange" :disabled="isEdit">
            <el-checkbox
              v-for="item in carModelList"
              :key="item.id"
              :disabled="item.disabled"
              :label="item.carModel"></el-checkbox>
          </el-checkbox-group>
          </div>
        </el-form-item><br/>
        <el-form-item :label="`参加活动${noEditClassess?'：':''}`" class="ctjt_form_item_class" prop="activityName">
          <span v-if="noEditClassess">{{formData.activityName}}</span>
          <el-select v-else class="w_200"
            v-model="formData.activityName"
            placeholder="请选择"
            :disabled="isEdit || formData.carModel.length === 0"
            @change="handleActivityChange">
            <el-option
              v-for="item in activityList"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item><br/>
        <el-form-item label="商品名称" class="ctjt_form_item_class" prop="name">
          <el-input class="w_400" v-model.trim="formData.name" maxlength="20" show-word-limit placeholder="请输入商品名称" :disabled="isEdit"></el-input>
        </el-form-item><br/>
        <el-form-item label="状态" class="ctjt_form_item_class" prop="status">
          <el-radio-group v-model="formData.status" :disabled="isEdit">
            <el-radio v-for="item in statusList" :key="item.id" :label="item.id" :disabled="item.id===0">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </template>
    </CtjtCard>
    <CtjtCard :prop-data="{ title: '价格设置' }">
      <template #content>
        <div v-for="item in formData.salesPrice" :key="item.carModel">
          <el-form-item :label="`${item.name}原价：`" class="ctjt_form_item_class">
            {{item.oAmount}}元
          </el-form-item>
          <el-form-item :label="`${item.name}销售价：`" class="ctjt_form_item_class">
            {{item.sAmount}}元
          </el-form-item><br/>
        </div>
        <el-form-item label="分期缴费设置" class="ctjt_form_item_class" prop="isInstallment">
          <el-radio-group v-model="formData.isInstallment" :disabled="true">
            <el-radio :label="0">不支持分期缴费</el-radio>
            <el-radio :label="1">支持分期缴费</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="formData.isInstallment === 1" label="第一期金额：" class="ctjt_form_item_class" prop="phaseOneAmount">
          {{formData.phaseOneAmount}}元
        </el-form-item><br/>
        <el-form-item label="是否高端班" class="ctjt_form_item_class" prop="isHighEndClass">
          <el-radio-group v-model="formData.isHighEndClass" :disabled="true">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item><br/>
        <el-form-item label="赠送补考次数" class="ctjt_form_item_class ctjt_margin_20r" prop="examinationNumber">
          <el-select class="w_200" v-model="formData.examinationNumber" placeholder="请选择" :disabled="true">
            <el-option
              v-for="item in makeUpExamList"
              :key="item.id"
              :label="item.label"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </template>
    </CtjtCard>
    <CtjtCard :prop-data="{ title: '商品图片/视频' }">
      <template #content>
        <el-form-item label="" class="ctjt_form_item_class" label-width="0" prop="photoUrl" ref="photoUrl">
        <div style="display: flex;">
          <CtjtUploadOSS :prop-config="uploadConfig" @on-upload="goodsUploadFunc" v-if="!isEdit && formData.photoUrl.length < 5">
            <template #content>
              <el-button size="small" type="primary">请选择图片或视频</el-button>
            </template>
          </CtjtUploadOSS>
          <!-- 图片列表 -->
          <ul class="img_list_container">
            <li class="item_img" v-for="(item, index) in formData.photoUrl" :key="index">
              <div class="img_box">
                <template v-if="getFilterType(item.photoUrl) === 'img'">
                  <el-image
                    class="w_h100"
                    :src="`${ossBaseUrl}${item.photoUrl}`"
                    :fit="'cover'">
                  </el-image>
                </template>
                <template v-if="getFilterType(item.photoUrl) === 'video'">
                  <video class="w_h100" :src="`${ossBaseUrl}${item.photoUrl}`"></video>
                </template>
              </div>
              <div class="img_options">
                <span @click="imageViewerFunc(item.photoUrl)">预览</span>
                <template v-if="!isEdit">
                  <span v-if="index !== 0"  @click="setMainImageFunc(index)">设为主图</span>
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
    <CtjtCard :prop-data="{ title: '商品详情描述' }">
      <template #content>
        <CtjtEditor :prop-data="editorConfig" @on-change="editorChangeCallback"></CtjtEditor>
      </template>
    </CtjtCard>
    <el-row type="flex" justify="center" style="padding-bottom: 30px;">
      <el-button type="info" style="color: #909399; background-color: transparent; border: 1px solid #DCDFE6;" @click="cancelSubmit">取消提交</el-button>
      <el-button v-if="perm['btn_submit']" type="primary" style="margin-left: 32px;" @click="submit" :disabled="isEdit" :loading="submitLoading">确认提交</el-button>
    </el-row>
    <!-- 图片预览 -->
    <CtjtImageViewer v-if="showImageViewer" :propData="imageViewerList" @on-close="handleImageViewerClose"></CtjtImageViewer>
    <!-- 视频预览 -->
    <CtjtVideoViewer :show="showVideo" :url="ViewerVideoUrl" @on-close="handleVideoViewerClose"></CtjtVideoViewer>
  </el-form>
</template>
<script lang='ts'>
import { Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import {
  CtjtCard, CtjtEditor, CtjtUploadOSS, CtjtImageViewer, CtjtVideoViewer
} from '@/components';
import {
  MARKET_MAKE_UP_EXAM, MARKET_STATUS
} from '@/enums';
import { VueComponentParent, ParamsType } from '@/type';
import {
  FILTER_IMG_TYPE, FILTER_VIDEO_TYPE, OSS_BASEURL
} from '@/assets/js/common';
import clearCacheMixins from '@/mixins/clearCache';

@Component({
  components: {
    CtjtCard,
    CtjtEditor,
    CtjtUploadOSS,
    CtjtImageViewer,
    CtjtVideoViewer
  }
})
export default class MarketGoodsDetail extends mixins(clearCacheMixins) {
  @Action('base/queryGroupMechanismData') private queryGroupMechanismData!: (data: any) => any;

  @Action('goods/addProduct') private addProduct!: (data: any) => ParamsType;

  @Action('goods/updateProduct') private updateProduct!: (data: any) => ParamsType;

  @Action('goods/getProduct') private getProduct!: (data: any) => ParamsType;

  @Action('goods/queryClasses') private queryClasses!: (data: any) => ParamsType;

  @Action('goods/queryClassesInfoList') private queryClassesInfoList!: (data: any) => ParamsType;

  @Action('sale/queryActivityPageList') private queryActivityPageList!: (data: any) => ParamsType;

  @Action('sale/queryActivityDropDownBoxList') private queryActivityDropDownBoxList!: (data: any) => ParamsType[];

  private ossBaseUrl = OSS_BASEURL;

  // 商品上架状态
  private statusList = MARKET_STATUS;

  // 培训车型切换
  private handleCarModelChange(val: string[]) {
    // C1,C2可同时选择，C5仅支持单选，D,E可同时选择；
    // 选择C1/C2后不能选择C5、D、E； 同理C5/D/E和其他车型不支持同时选择；
    if (val.length === 0) {
      this.carModelList.forEach(item => {
        const _item = item;
        _item.disabled = false;
      });
    } else {
      this.carModelList.forEach(item => {
        const _item = item;
        const { carModel } = _item;
        if (val.includes('C1') || val.includes('C2')) {
          if (carModel !== 'C1' && carModel !== 'C2') {
            _item.disabled = true;
          } else {
            _item.disabled = false;
          }
        }
        if (val.includes('C5')) {
          _item.disabled = carModel !== 'C5';
        }
        if (val.includes('D') || val.includes('E')) {
          if (carModel !== 'D' && carModel !== 'E') {
            _item.disabled = true;
          } else {
            _item.disabled = false;
          }
        }
      });
      // 配置公共参数
      const { highEndClass, installment, phaseOneAmount } = this.carModelList[0];
      this.formData.isInstallment = installment ? 1 : 0;
      this.formData.isHighEndClass = highEndClass ? 1 : 0;
      this.formData.phaseOneAmount = phaseOneAmount;
    }
    // 设置价格列表
    const _val = JSON.parse(JSON.stringify(val));
    const _list: ParamsType[] = [];
    _val.forEach((item: any) => {
      this.carModelList.forEach((i: any) => {
        const { carModel, price } = i;
        if (carModel === item) {
          _list.push({
            oAmount: price, sAmount: price, name: carModel
          });
        }
      });
    });
    this.formData.salesPrice = _list;
  }

  // 赠送补考次数
  private makeUpExamList = MARKET_MAKE_UP_EXAM;

  // 驾校
  private drivingSchoolList: { id: string, name: string }[] = [];

  @Watch('formData.carModel', { immediate: true, deep: true })
  private watchCarModel(val: string[]) {
    // 判断是否选择了活动
    const { activityId } = this.formData;
    if (activityId > 0) {
      // 请求活动对应班别接口
      this.queryActivityByClassess(activityId);
    }
  }

  /** 表单配置 */
  private isEdit = false; // 是否可以编辑

  private submitLoading = false; // 提交loading

  private formData: ParamsType = {
    baseBrowseNumber: 0, // 基础浏览数量
    baseRegisteredNumber: 0, // 基础已报名数量
    browseNumber: 0, // 浏览数量
    carModel: [], // 车型 1:C1,2:C2
    className: '', // 班别名称
    classId: '', // 班别id
    description: '', // 描述
    drivingSchoolId: '', // 驾校ID
    drivingSchoolName: '', // 驾校名称
    examinationNumber: null, // 赠送补考次数
    id: 0,
    isHighEndClass: null, // 是否高端班
    isInstallment: null, // 是否分期，1是，0否
    isManualInput: 0, // 是否手工录入，1是，0否
    name: '', // 商品名称
    originalPrice: {}, // 原价
    phaseOneAmount: null, // 一期金额
    photoUrl: [], // 图片地址
    registeredNumber: 0, // 已报名数量
    revision: 0, // 乐观锁版本(后端生成,修改时需传入查询出来的版本ID)
    seq: '', // 商品序列号
    status: 2, // 1上架，0下架，2待上架
    // trainingItem: [], // {id:1,label:c1人工带教}，{id:2,label:C1人工智能班}
    salesPrice: [], // 销售价
    activityId: null, // 该商品参加的活动id
    activityName: '', // 改详情参加活动的名称
  }

  // 表单校验
  private validatorPhoto(rule: any, value: any, callback: any) {
    const valLen = value.length; // 上传文件数组长度
    if (valLen < 1 || valLen > 5) {
      callback(new Error('最少上传1张, 最多上传5张'));
    }
    // 根据文件后缀，判断至少上传1张图片
    let flag = false;
    value.forEach((item: { photoUrl: string }) => {
      const _type = this.getFilterType(item.photoUrl);
      if (_type === 'img') {
        flag = true;
      }
    });
    if (flag) {
      callback();
    } else {
      callback(new Error('请至少上传一张图片'));
    }
  }

  private formRules = {
    carModel: [
      { required: true, message: '请选择车型', trigger: 'change' }
    ],
    className: [
      { required: true, message: '请输入班别名称', trigger: 'blur' }
    ],
    description: [
      { required: true, message: '请输入商品描述', trigger: 'blur' }
    ],
    drivingSchoolId: [
      { required: true, message: '请选择驾校', trigger: 'change' }
    ],
    name: [
      { required: true, message: '请输入商品名称', trigger: 'blur' }
    ],
    photoUrl: [
      {
        required: true, validator: this.validatorPhoto, trigger: 'change'
      },
    ],
    status: [
      { required: true, message: '请选择状态', trigger: 'change' }
    ],
    activityName: [
      { required: true, message: '请选择活动', trigger: 'change' }
    ]
  }

  // 图片相关
  private uploadConfig = {
    haveVideo: true,
    multiple: false,
    accept: '',
    limit: 5,
    disabled: false,
    tips: '',
    business: 'goods'
  }

  private showImageViewer = false;

  public goodsUploadFunc(val: string) {
    (this.$refs.photoUrl as VueComponentParent).clearValidate();
    this.formData.photoUrl.push({ photoUrl: val });
  }

  // 预览
  private imageViewerList: string[] = [];

  // 点击预览
  private imageViewerFunc(val: string) {
    // 判断文件类型
    const _type = this.getFilterType(val);
    if (_type === 'img') {
      this.imageViewerList = [`${this.ossBaseUrl}${val}`];
      this.showImageViewer = true;
    }
    if (_type === 'video') {
      this.ViewerVideoUrl = `${this.ossBaseUrl}${val}`;
      this.showVideo = true;
    }
  }

  // 设为主图
  private setMainImageFunc(index: number) {
    const _list = JSON.parse(JSON.stringify(this.formData.photoUrl));
    const _itemImage = _list.splice(index, 1);
    _list.unshift(_itemImage[0]);
    this.formData.photoUrl = _list;
  }

  // 提供给子组件掉用，关闭图片预览弹窗
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
      this.$message({
        type: 'success',
        message: '删除成功!'
      });
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消删除'
      });
    });
  }

  // 视频相关
  private showVideo = false;

  private ViewerVideoUrl = '';

  private handleVideoViewerClose() {
    this.showVideo = false;
  }

  // 富文本
  private editorConfig = {
    domId: 'goods_detail_editor',
    placeholder: '请输入正文',
    height: 500,
    zIndex: 10,
    content: '',
    business: 'goods',
    disable: false,
  }

  editorChangeCallback(data: { html: string; text: string }) {
    this.formData.description = data.html;
  }

  /** 事件处理 */
  getFilterType(val: string) {
    const _type = val.split('.').pop() || '';
    const _imgType = FILTER_IMG_TYPE;
    const _videoType = FILTER_VIDEO_TYPE;
    if (_imgType.includes(_type)) return 'img';
    if (_videoType.includes(_type)) return 'video';
    return '';
  }

  /**
   * 请求回来数据特殊处理
   */
  private noEditClassess = false;

  private _setFormDataFunc(param: ParamsType) {
    // 深拷贝一份数据
    const _data = JSON.parse(JSON.stringify(param));
    Object.keys(this.formData).forEach(key => {
      if (key === 'photoUrl') {
        this.formData[key] = JSON.parse(_data[key]);
      } else if (key === 'description') {
        this.formData[key] = _data[key];
        this.editorConfig.content = _data[key];
      } else if (key === 'carModel') {
        if (_data[key]) {
          this.formData[key] = _data[key].split(',');
        }
      } else if (key === 'salesPrice') {
        const _salesPrice = JSON.parse(_data[key]);
        const _originalPrice = JSON.parse(_data.originalPrice);
        const _list: ParamsType[] = [];
        Object.keys(_salesPrice).forEach(sKey => {
          _list.push({ name: sKey, sAmount: _salesPrice[sKey], oAmount: _originalPrice[sKey] });
        });
        this.formData[key] = _list;
      } else if (key === 'originalPrice') {
        const _originalPrice = JSON.parse(_data[key]);
        this.formData[key] = _originalPrice;
      } else {
        this.formData[key] = _data[key];
      }
    });
    const { className } = _data;
    // 判断该商品的班别是否在班别列表里面
    const { classessList } = this;
    const _classesList = classessList.filter((item: any) => item.name === className);
    if (_classesList.length === 0) {
      this.noEditClassess = true;
    }
  }

  /** 搜索下拉框筛选 */
  private _setFormSelectFunc(type: string, data: any) {
    if (data && data.length > 0) {
      const _data = JSON.parse(JSON.stringify(data));
      _data.forEach((item: any) => {
        const _item = item;
        _item.label = _item.name;
      });
      if (type === 'driverSchool') {
        this.drivingSchoolList = _data;
      }
    }
  }

  /**
   * 下拉框请求参数处理
  */
  private async selectFunc(type: string, id: string) {
    const data = await this.queryGroupMechanismData({ pid: id });
    this._setFormSelectFunc(type, data);
  }

  /** 清空数据 */
  private _clearData() {
    this.formData.carModel = [];
    this.formData.originalPrice = {};
    this.formData.isInstallment = null;
    this.formData.isHighEndClass = null;
    this.formData.phaseOneAmount = null;
    this.formData.examinationNumber = null;
    this.formData.salesPrice = [];
  }

  /** 驾校切换 */
  handleDrivingSchoolChange(val: string) {
    const _list = this.drivingSchoolList.filter(item => item.name === val);
    const { id } = _list[0];
    this.formData.drivingSchoolId = id;
    this.formData.className = '';
    this.activityList = [];
    this._clearData();
    this.queryClassessList(id);
    this.queryActivityList(id);
  }

  /** 班别切换 */
  handleClassNameChange(val: string) {
    // 先清空
    this._clearData();
    this.classessList.forEach((item: any) => {
      // 请求班别下面的所有车型
      const { resitCount, name, id } = item;
      if (name === val) {
        this.formData.classId = id;
        this.formData.examinationNumber = resitCount || 0;
        this._getCarModel(item);
      }
    });
  }

  /** 活动切换 */
  async handleActivityChange(val: string) {
    //
    const { activityList } = this;
    activityList.forEach((item: any) => {
      const { id, name } = item;
      if (name === val) {
        this.formData.activityId = id;
        // 查询对应活动和班别的优惠价
        this.queryActivityByClassess(id);
      }
    });
  }

  /** 查询优惠活动下的所对应班别 */
  async queryActivityByClassess(val: string) {
    const { formData, carModelList } = this;
    const { drivingSchoolId } = this.formData;
    const list: ParamsType[] = [];
    carModelList.forEach((item: any) => {
      const { carModel, id } = item;
      if (formData.carModel.includes(carModel)) {
        list.push({ activityId: val, classesId: id, drivingSchoolId });
      }
    });
    if (list.length > 0) {
      const sendData = {
        activityDropDownBoxReqList: list
      };
      const body = await this.queryActivityDropDownBoxList(sendData);
      // 拿到对应班别优惠信息，处理销售价
      this._setSalesPrice(body);
    }
  }

  /** 设置销售价 */
  private _setSalesPrice(val: ParamsType[]) {
    const { salesPrice } = this.formData;
    if (val && val.length > 0) {
      this.carModelList.forEach((item: any) => {
        salesPrice.forEach((k: any) => {
          const _k = k;
          if (item.carModel === k.name) {
            _k.id = item.id;
          }
        });
      });
      val.forEach((item: any) => {
        const { classesId, amount } = item;
        salesPrice.forEach((k: any) => {
          const _k = k;
          if (classesId === k.id) {
            _k.sAmount -= parseFloat(amount);
          }
        });
      });
    } else {
      // 价格重置
      this.carModelList.forEach((item: any) => {
        salesPrice.forEach((k: any) => {
          const _k = k;
          if (item.carModel === k.name) {
            _k.sAmount = parseFloat(item.price);
          }
        });
      });
    }
  }

  /** 查询班别所有活动 */
  private activityList: ParamsType[] = [];

  async queryActivityList(val: string) {
    const sendData = {
      drivingSchoolId: val,
      status: 2,
      pageSize: 50,
      current: 1,
    };
    const body = await this.queryActivityPageList(sendData);
    this.activityList = body.data;
  }
  /** 请求处理 */

  /**
   * 提交表单前，处理特殊字段
   */
  private _specialHandleFormData() {
    // 深拷贝一份数据
    const sendData = JSON.parse(JSON.stringify(this.formData));
    const {
      photoUrl, salesPrice, carModel, phaseOneAmount
    } = sendData;

    // 处理车型
    sendData.carModel = carModel.join(',');

    // 处理 销售价
    let _salesPrice = {};
    let _originalPrice = {};
    let _flag = true;
    salesPrice.forEach((item: any) => {
      const {
        name, sAmount, oAmount, classessPid, classessId
      } = item;
      // 判断一期金额不能高于销售价
      if (phaseOneAmount >= sAmount) _flag = false;
      _salesPrice = { ..._salesPrice, ...{ [name]: String(sAmount), classessPid, classessId } };
      _originalPrice = { ..._originalPrice, ...{ [name]: String(oAmount) } };
    });
    if (!_flag) {
      this.$message.warning('销售价不能小于等于一期金额！');
      return false;
    }
    sendData.salesPrice = JSON.stringify(_salesPrice);
    // 处理原价
    sendData.originalPrice = JSON.stringify(_originalPrice);
    // 处理 图片集和
    sendData.photoUrl = JSON.stringify(photoUrl);
    return sendData;
  }

  /**
   * 提交商品信息
   * 新增/修改
   */
  async submit() {
    (this.$refs.goodsForm as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        // 特殊字段处理
        const sendData = this._specialHandleFormData();
        if (sendData) {
          const { id } = sendData;
          this.submitLoading = true;
          if (id > 0) {
            this.updateProduct(sendData).then((res: any) => {
              this.$message.success('修改成功');
              this.cancelSubmit();
              this.submitLoading = false;
            }).catch(() => {
              this.submitLoading = false;
            });
          } else {
            delete sendData.id;
            this.addProduct(sendData).then((res: any) => {
              this.$message.success('新增成功');
              this.cancelSubmit();
              this.submitLoading = false;
            }).catch(() => {
              this.submitLoading = false;
            });
          }
        }
      } else {
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
    this.$router.push({ path: '/market/goods/list' });
  }

  /**
   * 根据id请求商品详情
   */
  async queryDetail() {
    const { id, edit } = this.$route.query;
    if (id) {
      if (edit) {
        this.isEdit = true;
        this.editorConfig.disable = true;
      }
      const data = await this.getProduct({ id });
      const { drivingSchoolId, classId, className } = data;
      await this.queryClassessList(drivingSchoolId);
      // 处理返回来的字段
      this._setFormDataFunc(data);
      this.queryActivityList(drivingSchoolId);
      this._getCarModel({ id: classId, name: className });
    }
  }

  /** 查询用户下下面所有班别 */
  private classessList: ParamsType = [];

  async queryClassessList(val: string) {
    const sendData = { isExamFee: true, type: 1 };
    const body = await this.queryClassesInfoList(sendData);
    this.classessList = body;
  }

  /** 查询班别下面的所有车型 */
  private carModelList: ParamsType[] = [];

  async _getCarModel(val: ParamsType) {
    const { id, name } = val;
    const sendData = {
      id,
      name,
      status: 1,
      type: 1,
      current: 1,
      pageSize: 20,
    };
    const body = await this.queryClasses(sendData);
    const { data } = body;
    const _list = JSON.parse(JSON.stringify(data));
    _list.forEach((item: any) => {
      const _item = item;
      _item.disabled = false;
    });
    this.carModelList = _list;
  }

  // 生命周期钩子函数
  perm = {};

  async activated() {
    this.selectFunc('driverSchool', '0');
    this.queryDetail();
    const permObj = await this.$getPerm(this);
    this.perm = permObj.perm;
    this.$nextTick(() => {
      (this.$refs.goodsForm as VueComponentParent).clearValidate();
    });
  }
}
</script>
<style lang="scss" scoped>
.ctjt_table_container {
  width: 1000px;
}
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
      .w_h100 {
        width: 100%;
        height: 100%;
      }
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
