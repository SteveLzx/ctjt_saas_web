<template>
  <div class="page">
    <el-form ref="activitiesForm" :model="formData" :rules="formRules" label-width="120px">
      <CtjtCard :prop-data="{ title: '营销活动信息' }">
        <template #content>
          <el-row :gutter="8">
            <el-col :span="12">
              <el-form-item label="活动名称" class="ctjt_form_item_class" prop="name">
                <el-input class="w_200" v-model.trim="formData.name" placeholder="请输入" maxlength="20" show-word-limit :disabled="$route.query.id > 0"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="活动代码" class="ctjt_form_item_class" prop="code">
                <el-input class="w_200" v-model.trim="formData.code" placeholder="请输入" maxlength="16" show-word-limit :disabled="$route.query.id > 0"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="8">
            <el-col :span="12">
              <el-form-item label="营销渠道" class="ctjt_form_item_class" prop="activityOtherMarketReq">
                <el-cascader class="w_200"
                  :disabled="isEdit"
                  v-model="formData.activityOtherMarketReq"
                  :options="marketList"
                  :props="optionCityProps"
                  :show-all-levels="false"
                ></el-cascader>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <el-form-item label="适用超龄人员" class="ctjt_form_item_class" prop="isOverage">
                <el-select class="w_200" v-model="formData.isOverage" placeholder="请选择" :disabled="isEdit">
                  <el-option
                    v-for="item in overageList"
                    :key="item.id"
                    v-model="item.id"
                    :label="item.label"
                    :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col> -->
          </el-row>
          <el-row :gutter="8">
            <el-col :span="24">
              <el-form-item label="已选营销渠道">
                <el-tag
                  style="margin: 0 6px 6px 0;"
                  v-for="(tag, index) in activityOtherMarketList"
                  :key="`${tag.marketId}-${index}`"
                  :closable="!isEdit"
                  :disable-transitions="false"
                  @close="handleMarketClose(tag, index)"
                  :type="tag.marketId">
                  {{tag.marketName}}
                </el-tag>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="8">
            <el-col :span="12">
              <el-form-item label="关闭活动" class="ctjt_form_item_class" prop="status">
                <el-switch v-model="formData.status" :disabled="isEdit"></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="活动时间" class="ctjt_form_item_class" prop="beginAndendDate">
                <el-date-picker
                :disabled="isEdit"
                v-model="formData.beginAndendDate"
                @change="handleBeginAndendDateChange"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="ctjt_table_container">
            <el-row>
              <el-col :span="2" class="table_border">
                <div class="table_tr">序号</div>
              </el-col>
              <el-col :span="2" class="table_border">
                <div class="table_tr">班别名称</div>
              </el-col>
              <el-col :span="2" class="table_border">
                <div class="table_tr">车型</div>
              </el-col>
              <el-col :span="3" class="table_border">
                <div class="table_tr">原价</div>
              </el-col>
              <el-col :span="3" class="table_border">
                <div class="table_tr">限时优惠金额</div>
              </el-col>
              <el-col :span="5" class="table_border">
                <div class="table_tr">赠送陪驾学时</div>
              </el-col>
              <el-col :span="7" class="table_border">
                <div class="table_tr">可赠送学时（H）</div>
              </el-col>
            </el-row>
            <el-row v-for="(item, index) in formData.activityOtherClassesReq" :key="index">
              <el-col :span="2" class="table_border">
                <div class="table_td">{{index+1}}</div>
              </el-col>
              <el-col :span="2" class="table_border">
                <div class="table_td">
                  {{item.classesName}}
                </div>
              </el-col>
              <el-col :span="2" class="table_border">
                <div class="table_td">
                  {{item.carModel}}
                </div>
              </el-col>
              <el-col :span="3" class="table_border">
                <div class="table_td">
                  {{item.price}}
                </div>
              </el-col>
              <el-col :span="3" class="table_border">
                <div class="table_td">
                  <el-form-item
                    style="padding: 0; margin: 0;"
                    label=""
                    label-width="0"
                    :prop="`activityOtherClassesReq.${index}.amount`"
                    :rules="formRules.activityOtherClassesAmount"
                  >
                    <el-input v-model="item.amount" placeholder="请输入金额" @change="handleActivityOtherAmount(item)" :disabled="isEdit"></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="5" class="table_border">
                <div class="table_td">
                  <el-select
                    v-model="item.hasClassHours" placeholder="请选择" :disabled="isEdit"
                    @change="() => item.classHoursId = []"
                  >
                    <el-option
                      v-for="item in [{ id: 1, label: '不赠送' }, { id: 2, label: '赠送' }]"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
              </el-col>
              <el-col :span="7" class="table_border">
                <div class="table_td">
                  <el-cascader
                    v-model="item.classHoursId"
                    :disabled="item.hasClassHours === 1 || isEdit"
                    :options="classHoursOpts"
                    :show-all-levels="false"
                    :props="{ multiple: true, value: 'id', label: 'timeLength' }"
                    clearable></el-cascader>
                </div>
              </el-col>
            </el-row>
          </div>
        </template>
      </CtjtCard>
      <CtjtCard :prop-data="{ title: '营销活动适用范围' }">
        <template #content>
          <el-row style="margin-bottom: 16px;">
            <el-col :span="24">
              <el-radio-group v-model="activityAllStore" @change="handleActivityAllStore" :disabled="isEdit">
                <el-radio :label="1">所有门店</el-radio>
                <el-radio :label="2">部分门店</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
          <el-card v-for="(item, index) in formData.activityOtherStoreReq" :key="index" style="margin-bottom: 8px;">
            <div slot="header">
              <span>{{item.label}}</span>
            </div>
            <el-checkbox :indeterminate="item.isIndeterminate" v-model="item.checkAll" @change="handleCheckAllChange(item)" :disabled="isEdit">全选</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="item.checkedCities" @change="handleCheckedCitiesChange(item)" :disabled="isEdit">
              <el-checkbox
                v-for="(i, i_index) in item.list" :label="i.storeId" :key="`${i.storeName}-${i_index}`"
              >{{i.storeName}}</el-checkbox>
            </el-checkbox-group>
          </el-card>
        </template>
      </CtjtCard>
    </el-form>
    <el-row type="flex" justify="center" style="padding: 30px 0;">
      <el-button type="info" style="color: #909399; background-color: transparent; border: 1px solid #DCDFE6;" @click="cancelSubmit">关闭</el-button>
      <el-button v-if="perm['btn_submit']" type="primary" style="margin-left: 32px;" @click="submit" :disabled="isEdit" :loading="submitLoading">确认提交</el-button>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Action, State } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { CtjtCard } from '@/components';
import { ParamsType, VueComponentParent } from '@/type';
import { MARKET_BOOLEAN } from '@/enums';
import clearCacheMixins from '@/mixins/clearCache';
import { deepClone } from '@/assets/js/common';

const OptionCityProps = {
  value: 'id',
  label: 'secondLevelName',
  children: 'list',
  multiple: true, // 可多选
  emitPath: false,
};

@Component({
  components: { CtjtCard }
})
export default class MarketActivitiesDetail extends mixins(clearCacheMixins) {
  @Action('base/queryGroupMechanismData') private queryGroupMechanismData!: (data: any) => any;

  @Action('sale/queryMarketListDropDownBoxList') private queryMarketListDropDownBoxList!: (data: any) => ParamsType;

  @Action('sale/queryCreateActivityList') private queryCreateActivityList!: (data: any) => ParamsType;

  @Action('sale/queryModifyActivityList') private queryModifyActivityList!: (data: any) => ParamsType;

  @Action('sale/saveCreateActivity') private saveCreateActivity!: (data: any) => ParamsType;

  @Action('sale/saveModifyActivity') private saveModifyActivity!: (data: any) => ParamsType;

  @Action('sale/queryClassHoursList') private queryClassHoursList!: (data: any) => any;

  @State(state => state.base.userInfo) userInfo: any;

  private optionCityProps = OptionCityProps;

  private overageList = MARKET_BOOLEAN;

  private pickerOptions = {
    disabledDate(time: any) {
      return time.getTime() < (Date.now() - 24 * 60 * 60 * 1000);
    }
  }

  /** 时间切换触发 */
  private handleBeginAndendDateChange(val: string[]) {
    if (Array.isArray(val)) {
      this.formData.beginDate = this.$dayjs(val[0]).format('YYYY-MM-DD HH:mm:ss');
      this.formData.endDate = this.$dayjs(val[1]).format('YYYY-MM-DD HH:mm:ss');
    }
  }

  /** 删除已选营销渠道 */
  private handleMarketClose(val: ParamsType, index: number) {
    const { marketId } = val;
    const { activityOtherMarketReq } = this.formData;
    const { activityOtherMarketList } = this;
    activityOtherMarketList.splice(index, 1);
    const _list = JSON.parse(JSON.stringify(activityOtherMarketReq));
    _list.splice(activityOtherMarketReq.indexOf(marketId), 1);
    this.formData.activityOtherMarketReq = _list;
  }

  /** 表单设置 */

  private isEdit = false;

  private activityAllStore = 2; // 默认 部分门店

  private activityStatus = 1; // 活动状态

  private formData: ParamsType = {
    activityOtherClassesReq: [
      // {
      //   amount: null, // 优惠金额
      //   classesId: null, // 班别id
      //   classesName: '', // 班别名称
      //   carModel: '', // 车型
      //   price: 0, // 原价
      //   hasClassHours: false, // 是否赠送学时
      //   classHoursId: [], // 赠送学时id数组
      // }
    ], // 已参加活动的班别
    activityOtherMarketReq: [
      // {
      //   marketId: null, // 营销渠道id
      //   marketName: '', // 营销渠道名称
      // }
    ], // 已选择的营销渠道
    activityOtherStoreReq: [], // 已选择门店
    beginAndendDate: [], // 本地处理时间
    beginDate: '', // 活动开始时间
    endDate: '', // 活动结束时间
    code: '', // 代码
    drivingSchoolId: '', // 当前登录人所属驾校id
    isOverage: null, // 是否适用超年龄
    name: '', // 活动名称
    status: false, // 1未开始：2进行中：3已结束：4已关闭
    id: null, // id
  }

  private validatePeriod = (rule: any, value: string, callback: any) => {
    if (value === '0' || (value && !/^[0-9]\d{0,5}(\.\d{1,2})?$/.test(value))) {
      callback(new Error('范围0.01-999999.99, 可保留两位小数'));
    } else {
      callback();
    }
  }

  private handleActivityOtherAmount(val: ParamsType) {
    const { amount, price } = val;
    if (parseFloat(amount) > parseFloat(price)) {
      this.$message.warning('限时优惠金额应<=原价');
      const _val = val;
      _val.amount = null;
    }
  }

  private formRules = {
    name: [
      { required: true, message: '请输入活动名称', trigger: ['change', 'blur'] }
    ],
    code: [
      { required: true, message: '请输入活动代码', trigger: ['change', 'blur'] }
    ],
    activityOtherMarketReq: [
      { required: true, message: '请选择营销渠道', trigger: 'change' }
    ],
    isOverage: [
      { required: true, message: '请选择适用超年龄人员', trigger: 'change' }
    ],
    beginAndendDate: [
      { required: true, message: '请选择活动时间', trigger: 'change' }
    ],
    activityOtherClassesAmount: [
      {
        validator: this.validatePeriod, trigger: ['change']
      }
    ],
  };

  /** 表单提交 */
  private _specialHandleFormData() {
    // 深拷贝一份数据
    const { activityOtherMarketList, formData, activityStatus } = this;
    const sendData = JSON.parse(JSON.stringify(formData));
    const _activityOtherMarketList = JSON.parse(JSON.stringify(activityOtherMarketList));
    // 已参加活动的班别(过滤有优惠价格的班别)
    const { activityOtherClassesReq, activityOtherStoreReq, status } = sendData;
    const _activityOtherClassesList: ParamsType[] = [];
    activityOtherClassesReq.forEach((item: any) => {
      const {
        amount = 0, classesId, classesName, hasClassHours, classHoursId = []
      } = item;
      if (amount > 0 || hasClassHours === 2) {
        const _classHoursId: string[] = [];
        if (hasClassHours) {
          classHoursId.forEach((i: any) => {
            _classHoursId.push(i[1]);
          });
        }
        const obj: any = {
          amount, classesId, classesName
        };
        if (classHoursId.length > 0) {
          obj.classHoursId = _classHoursId.join(',');
        }
        _activityOtherClassesList.push(obj);
      }
    });
    sendData.activityOtherClassesReq = _activityOtherClassesList;
    // 已选择的营销渠道
    sendData.activityOtherMarketReq = _activityOtherMarketList;
    // 已选择门店
    const _activityOtherStoreList: ParamsType[] = [];
    activityOtherStoreReq.forEach((item : any) => {
      const { checkedCities, list } = item;
      list.forEach((i: any) => {
        const { storeId, storeName } = i;
        if (checkedCities.includes(storeId)) {
          _activityOtherStoreList.push({ storeId, storeName });
        }
      });
    });
    sendData.activityOtherStoreReq = _activityOtherStoreList;
    // 状态-默认传未开始
    if (activityStatus === 4) {
      sendData.status = status ? 4 : 1;
    } else {
      sendData.status = status ? 4 : activityStatus;
    }
    const { drivingSchoolId } = this.userInfo;
    sendData.drivingSchoolId = drivingSchoolId;
    // 删除本地处理时间
    delete sendData.beginAndendDate;
    // 处理好数据后，判断门店，班别至少选中一个
    if (sendData.activityOtherStoreReq.length === 0) {
      this.$message.warning('至少要有一个门店参加活动');
      return false;
    }
    if (sendData.activityOtherClassesReq.length === 0) {
      this.$message.warning('至少要有一个班别参加活动');
      return false;
    }
    return sendData;
  }

  private submitLoading = false; // 提交loading

  submit() {
    (this.$refs.activitiesForm as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        // 提交前，处理数据
        const sendData = this._specialHandleFormData();
        if (sendData === false) return;
        const { id } = sendData;
        if (id) {
          this.saveModifyActivity(sendData).then(() => {
            this.$message.success('修改成功');
            this.cancelSubmit();
          }).finally(() => {
            this.submitLoading = false;
          });
        } else {
          delete sendData.id;
          this.saveCreateActivity(sendData).then(() => {
            this.$message.success('新增成功');
            this.cancelSubmit();
          }).finally(() => {
            this.submitLoading = false;
          });
        }
      } else {
        this.$message.warning('您的信息填写有误，请仔细检查并修改！');
      }
    });
  }

  /** 取消提交 */
  cancelSubmit() {
    this.clearCache();
    this.$router.push({ path: '/market/market_manage/activities_set' });
  }

  @Watch('formData.activityOtherStoreReq', { immediate: true, deep: true })
  watchActivityOtherStore(val: ParamsType[]) {
    // 判断是否全选
    const _len = val.length;
    let _num = 0;
    val.forEach((item: any) => {
      this.handleCheckedCitiesChange(item);
      if (item.checkAll) {
        _num += 1;
      }
    });
    this.activityAllStore = _len === _num ? 1 : 2;
  }

  /** 所有，部分门店选择 */
  handleActivityAllStore(val: number) {
    const { activityOtherStoreReq } = this.formData;
    if (val === 1) {
      activityOtherStoreReq.forEach((item: any) => {
        const _item = item;
        _item.checkAll = true;
        _item.isIndeterminate = false;
        const { list } = _item;
        const _list: ParamsType[] = [];
        list.forEach((i: any) => {
          _list.push(i.storeId);
        });
        _item.checkedCities = _list;
      });
    }
    if (val === 2) {
      activityOtherStoreReq.forEach((item: any) => {
        const _item = item;
        _item.checkAll = false;
        _item.isIndeterminate = false;
        _item.checkedCities = [];
      });
    }
  }

  /** 每个片区全选 */
  handleCheckAllChange(val: ParamsType) {
    const _val = val;
    const {
      checkAll, list
    } = _val;
    _val.isIndeterminate = false;
    if (checkAll) {
      const _list: ParamsType[] = [];
      list.forEach((item: any) => {
        _list.push(item.storeId);
      });
      _val.checkedCities = _list;
    } else {
      _val.checkedCities = [];
    }
  }

  /** 单个选中切换 */
  handleCheckedCitiesChange(val: ParamsType) {
    const { checkedCities, list } = val;
    const _val = val;
    if (checkedCities.length === list.length) {
      _val.isIndeterminate = false;
      _val.checkAll = true;
    } else if (checkedCities.length > 0) {
      _val.isIndeterminate = true;
      _val.checkAll = false;
    } else {
      _val.isIndeterminate = false;
      _val.checkAll = false;
    }
  }

  /** 事件处理 */
  /**
   * 根据id获取到详情，设置表单数据
   */
  private _setFormDataFunc(param: ParamsType) {
  // 深拷贝一份数据
    const _data = JSON.parse(JSON.stringify(param));
    const {
      beginDate,
      endDate,
      code,
      isOverage,
      name,
      status,
      activityClassesModifyListDto,
      activityCreateClassesListDtoList,
      activityMarketListDto,
      activityStoreListDtoMaps,
      activityStoreModifyListDto
    } = _data;
    // 基础数据处理
    this.formData.code = code;
    this.formData.name = name;
    this.formData.isOverage = isOverage || 0;
    this.formData.status = status === 4;
    this.activityStatus = status;
    this.formData.beginDate = beginDate;
    this.formData.endDate = endDate;
    this.formData.beginAndendDate = [beginDate, endDate];
    // this.activityOtherMarketList = activityMarketListDto;
    // 复杂数据处理
    this._setClassesFunc(activityCreateClassesListDtoList);
    this._setRegionFunc(activityStoreListDtoMaps);
    this.$nextTick((() => {
      const { activityOtherClassesReq, activityOtherStoreReq } = this.formData;
      // 营销渠道处理
      const _marketList: string[] = [];
      activityMarketListDto.forEach((item :any) => {
        _marketList.push(item.marketId);
      });
      this.formData.activityOtherMarketReq = _marketList;
      // 班别处理
      activityOtherClassesReq.forEach(((item: any) => {
        const _item = item;
        activityClassesModifyListDto.forEach((i: any) => {
          if (i.classesId === item.classesId) {
            const { classHours, amount } = i;
            _item.amount = amount;
            if (classHours) {
              _item.hasClassHours = 2;
              const _classHours: string[] = classHours.split(',');
              const _list: any[] = [];
              _classHours.forEach((a: string) => {
                _list.push(['0', a]);
              });
              _item.classHoursId = _list;
            }
          }
        });
      }));
      // 门店处理
      const _listStore: string[] = [];
      activityStoreModifyListDto.forEach((item: any) => {
        _listStore.push(item.storeId);
      });
      activityOtherStoreReq.forEach((item: any) => {
        const { list } = item;
        const _item = item;
        const _list: string[] = [];
        list.forEach((i: any) => {
          const _i = i;
          const { storeId } = _i;
          if (_listStore.includes(storeId)) {
            _list.push(storeId);
          }
        });
        _item.checkedCities = _list;
      });
    }));
  }

  // 请求处理
  /**  获取活动详情 */
  async queryDetail() {
    const { id, isEdit } = this.$route.query;
    if (id) {
      this.formData.id = id;
      if (isEdit) {
        this.isEdit = true;
      }
      const data = await this.queryModifyActivityList({ id });
      // 处理返回来的字段
      this._setFormDataFunc(data);
    }
  }

  /** 获取营销渠道 */
  async queryMarketList() {
    const { drivingSchoolId } = this.userInfo;
    const { id } = this.$route.query;
    const sendData = {
      drivingSchoolId,
      status: !id ? 1 : null
    };
    const body = await this.queryMarketListDropDownBoxList(sendData);
    // 后端返回的Map类型数据，处理营销渠道
    this._setMarketListFunc(body);
  }

  /** 处理营销渠道数据 */
  private marketList: ParamsType[] = []; // 营销渠道

  private marketSecondAllList: ParamsType[] = []; // 所有二级渠道

  private activityOtherMarketList: ParamsType[] = []; // 选中的营销渠道

  private _setMarketListFunc(val: ParamsType) {
    const mapList = JSON.parse(JSON.stringify(val));
    const _mapList: ParamsType[] = [];
    Object.keys(mapList).forEach((key: string) => {
      const _item = {
        label: key,
        secondLevelName: key,
        list: mapList[key],
      };
      _mapList.push(_item);
      this.marketSecondAllList = [...this.marketSecondAllList, ...mapList[key]];
    });
    this.marketList = [
      { secondLevelName: '全部渠道', id: '0', list: _mapList },
    ];
  }

  @Watch('formData.activityOtherMarketReq', { immediate: true, deep: true })
  watchActivityOtherMarketReq(nVal: string[]) {
    const _list: ParamsType[] = [];
    // 判断上一次是否是全选
    const { marketSecondAllList } = this;
    marketSecondAllList.forEach((item: any) => {
      const { id, secondLevelName } = item;
      if (nVal.includes(id)) {
        _list.push({ marketId: id, marketName: secondLevelName });
      }
    });
    this.activityOtherMarketList = _list;
  }

  /** 获取该驾校下的所有片区门店 */
  async queryStoreAndRegion() {
    const { drivingSchoolId } = this.userInfo;
    this.formData.drivingSchoolId = drivingSchoolId;
    const sendData = {
      drivingSchoolId
    };
    const body = await this.queryCreateActivityList(sendData);
    const { activityCreateClassesListDto, activityRegionListDto } = body;
    if (Array.isArray(activityCreateClassesListDto)) {
      // 班别处理
      this._setClassesFunc(activityCreateClassesListDto);
    }
    if (activityRegionListDto !== null) {
      // 片区需要处理数据，后端返回的是Map类型数据
      this._setRegionFunc(activityRegionListDto);
    }
  }

  /** 处理班别 */
  private _setClassesFunc(val: ParamsType) {
    const list = JSON.parse(JSON.stringify(val));
    const _list: ParamsType[] = [];
    list.forEach((item: any) => {
      const {
        classesId, classesName, carModel, price
      } = item;
      _list.push({
        classesId, classesName, carModel, price, amount: null, hasClassHours: 1, classHoursId: []
      });
    });
    this.formData.activityOtherClassesReq = _list;
  }

  /** 处理片区门店 */
  private _setRegionFunc(val: ParamsType) {
    const mapList = JSON.parse(JSON.stringify(val));
    const _mapList: ParamsType[] = [];
    Object.keys(mapList).forEach((key: string) => {
      const _item = {
        label: key,
        list: mapList[key],
        isIndeterminate: false,
        checkAll: false,
        checkedCities: [],
      };
      _mapList.push(_item);
    });
    this.formData.activityOtherStoreReq = _mapList;
  }

  classHoursOpts: any[] = []

  handleClassHoursChange(val: any) {
    console.log(val);
  }

  // 生命周期钩子函数
  perm = {};

  async activated() {
    const { id } = this.$route.query;
    if (!id) {
      await this.queryStoreAndRegion();
    }

    this.queryMarketList();
    this.queryDetail();
    this.queryClassHoursList({
      current: 1,
      pageSize: 100,
      status: 1
    }).then((res: any) => {
      const { data } = res;
      const deepData = deepClone(data);
      deepData.forEach((item: any) => {
        const { timeLength } = item;
        const _item = item;
        _item.timeLength = timeLength / 60;
      });
      this.classHoursOpts = [
        {
          id: '0', timeLength: '全部', children: deepData
        }
      ];
    });
    const permObj = await this.$getPerm(this);
    this.perm = permObj.perm;
  }
}

</script>

<style lang="scss" scoped>
::v-deep .el-cascader__tags{
  flex-wrap: nowrap;
  overflow: hidden;
}
</style>
