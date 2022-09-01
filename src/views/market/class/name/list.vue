<template>
  <div class="page">
    <SearchTable :prop-data="searchForm"></SearchTable>
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
    <!-- 新增，编辑-弹窗 -->
    <el-drawer
      :visible="showDetail"
      :withHeader="false"
      :show-close="false"
      :size="'80%'"
      :direction="'rtl'">
      <el-container style="height: 100%">
        <el-main>
          <CtjtCard :prop-data="{ title: '新增/编辑班别' }">
            <template #content>
              <el-form ref="classessForm" :model="formData" :rules="formRules" label-width="130px">
                <el-row :gutter="4">
                  <el-col :span="8">
                    <el-form-item label="班别类型" class="ctjt_form_item_class" prop="type">
                      <el-select class="w_200" v-model="formData.type" placeholder="请选择" @change="handleTypeChange" :disabled="isEdit">
                        <el-option v-for="(item, index) in classessTypeList" :key="index" :value="item.id" :label="item.label"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="班别名称" class="ctjt_form_item_class" prop="name">
                      <el-input class="w_200" v-model="formData.name" placeholder="请输入" maxlength="16" show-word-limit :disabled="isEdit"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="formData.type === 1">
                    <el-form-item label="车型" class="ctjt_form_item_class" prop="carModel">
                      <el-select class="w_200" v-model="formData.carModel" placeholder="请选择" clearable :disabled="isEdit">
                        <el-option v-for="(item, index) in motorcycleTypeList" :key="index" :label="item.label" :value="item.label"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="4">
                  <el-col :span="8">
                    <el-form-item :label="formData.type === 2 ? '散学单价' : '价格'" class="ctjt_form_item_class" prop="price">
                      <el-input class="w_200" v-model="formData.price" placeholder="请输入" :disabled="isEdit">
                        <template slot="append">元</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="高端班" class="ctjt_form_item_class" prop="highEndClass">
                      <el-select class="w_200" v-model="formData.highEndClass" placeholder="请选择" :disabled="isEdit">
                        <el-option :value="true" label="是"></el-option>
                        <el-option :value="false" label="否"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="外地班" class="ctjt_form_item_class" prop="otherSpace">
                      <el-select class="w_200" v-model="formData.otherSpace" placeholder="请选择" :disabled="isEdit">
                        <el-option :value="true" label="是"></el-option>
                        <el-option :value="false" label="否"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="4">
                  <el-col :span="8" v-if="formData.otherSpace">
                    <el-form-item label="所属城市" class="ctjt_form_item_class" prop="cityId">
                      <el-cascader
                        class="w_200"
                        placeholder="请选择"
                        :disabled="isEdit"
                        v-model="formData.cityId"
                        :options="optionsCity"
                        :props="optionCityProps"
                        :clearable="true"
                        :show-all-levels="false"
                        @change="handleCityChange"></el-cascader>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="formData.type !== 2">
                    <el-form-item label="是否支持分期" class="ctjt_form_item_class" prop="installment">
                      <el-select class="w_200" v-model="formData.installment" placeholder="请选择" :disabled="isEdit || formData.type === 2">
                        <el-option :value="true" label="是"></el-option>
                        <el-option :value="false" label="否"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="formData.installment">
                    <el-form-item label="首期金额" class="ctjt_form_item_class" prop="phaseOneAmount">
                      <el-input class="w_200" v-model="formData.phaseOneAmount" placeholder="请输入" :disabled="isEdit">
                        <template slot="append">元</template>
                      </el-input>
                      <p class="td_text_red" v-if="userInfo.drivingSchoolId == 370">不得低于2500</p>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="4">
                  <el-col :span="24">
                    <el-form-item label="状态" class="ctjt_form_item_class" prop="status">
                      <el-radio-group v-model="formData.status" :disabled="isEdit">
                        <el-radio v-for="(item, index) in statusList" :key="index" :label="item.id">{{item.label}}</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </template>
          </CtjtCard>
        </el-main>
        <el-footer>
          <el-row type="flex" justify="center">
            <el-button type="info" @click="balaceCancel">取消</el-button>
            <el-button v-if="!isEdit" type="primary" style="margin-left: 32px;" :loading='submitLoading' @click="balaceSubmit">保存</el-button>
          </el-row>
        </el-footer>
      </el-container>
    </el-drawer>
  </div>
</template>
<script lang="ts">
import { Action, State } from 'vuex-class';
import { Watch } from 'vue-property-decorator';
import Component, { mixins } from 'vue-class-component';
import {
  SearchTable, CtjtTable, CtjtPagination, CtjtCard
} from '@/components';
import { ParamsType, TableOptionsValue, VueComponentParent } from '@/type';
import { MARKET_UP_DOWN_STATUS, MARKET_CLASSESS_TYPE, MARKET_MOTORCYCLE_TYPE } from '@/enums';
import { REG_PRICE_OR_ZONE, NUMBER_AND_EN_REG } from '@/assets/js/common';
import { drawSearchForm } from '@/assets/js/search_table';
import ctjtPaginationMixins from '@/mixins/pagination';
// 拉取省市区json
const ProvCity = require('@/assets/json/prov.json');

// 设置城市列表
const _setCityFunc = () => {
  const _list = JSON.parse(JSON.stringify(ProvCity));
  _list.forEach((item: any) => {
    item.subs.forEach((i: any) => {
      const _i = i;
      delete _i.subs;
    });
  });
  return _list;
};

const OptionCityProps = {
  value: 'adcode',
  label: 'name',
  children: 'subs',
  emitPath: false, // 只展示最后一级
  multiple: true, // 可多选
};

@Component({
  components: {
    SearchTable, CtjtTable, CtjtPagination, CtjtCard
  }
})
export default class MarketClassNameList extends mixins(ctjtPaginationMixins) {
  @Action('base/queryGroupMechanismData') private queryGroupMechanismData!: (data: any) => any;

  @Action('goods/queryClasses') private queryClasses!: (data: any) => ParamsType;

  @Action('goods/postClasses') private postClasses!: (data: any) => ParamsType;

  @Action('goods/putClasses') private putClasses!: (data: any) => ParamsType;

  @State(state => state.base.userInfo) userInfo: any;

  private statusList = MARKET_UP_DOWN_STATUS;

  private classessTypeList = MARKET_CLASSESS_TYPE;

  private motorcycleTypeList = MARKET_MOTORCYCLE_TYPE;

  private optionsCity = [];

  private optionCityProps = OptionCityProps;

  private handleCityChange(value: string[]) {
    const _list = JSON.parse(JSON.stringify(ProvCity));
    this.formData.cityName = [];
    _list.forEach((item: any) => {
      item.subs.forEach((i: any) => {
        const { adcode, name } = i;
        value.forEach((city: any) => {
          if (adcode === city) {
            this.formData.cityName.push(name);
          }
        });
      });
    });
  }

  @Watch('formData.otherSpace', { immediate: true, deep: true })
  setOtherSpaceFunc(val: boolean) {
    if (!val) {
      this.formData.cityId = [];
      this.formData.cityName = [];
    }
  }

  /** 表单搜索 开始 */
  private searchForm = {
    inputList: [
      {
        label: '班别名称',
        key: 'name',
        type: 'text',
        value: '',
        width: 160,
        clearable: true,
        placeholder: '请输入班别名称',
      }
    ],
    selectList: [
      {
        label: '班别类型',
        key: 'type',
        value: '',
        width: 100,
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: MARKET_CLASSESS_TYPE
      },
      {
        label: '状态',
        key: 'status',
        value: '',
        width: 100,
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: MARKET_UP_DOWN_STATUS
      },
    ],
    cascaderList: [
      {
        label: '城市',
        key: 'cityId',
        value: '',
        width: 140,
        placeholder: '请选择',
        clearable: true,
        options: _setCityFunc(),
        optionProps: Object.assign(JSON.parse(JSON.stringify(OptionCityProps)), { multiple: false })
      }
    ],
    buttonList: [
      {
        label: '查询',
        key: 'search',
        type: 'primary',
        plain: false,
        path: 'btn_search'
      }
    ]
  }

  // 点击搜索回调方法
  public searchTableCallBack(key: string) {
    if (key === 'search') {
      this.paginationData.current = 1;
      this.queryList();
    }
  }

  /** 表单搜索 结束 */

  /** 列表配置 开始 */
  private tableData: ParamsType = {
    _this: {},
    loading: true,
    selection: true,
    index: true,
    options: [
      {
        id: 4,
        label: '新增',
        path: 'btn_add'
      },
      {
        id: 1,
        label: '编辑',
        type: 'primary',
        icon: '&#xe60f;',
        path: 'btn_edit'
      },
      {
        id: 2,
        label: '上架',
        type: 'warning',
        icon: '&#xe615;',
        path: 'btn_upper'
      },
      {
        id: 3,
        label: '下架',
        type: 'warning',
        icon: '&#xe617;',
        path: 'btn_lower'
      },
    ],
    labels: [
      {
        key: 'name',
        label: '班别名称',
        width: 120,
        render(h: any, params: any) {
          const { name } = params.row;
          return h('el-link', {
            props: {
              type: 'primary',
              underline: false
            },
            on: {
              click: () => {
                params._self.tableData._this.jumpDetail(params.row, '1');
              }
            }
          },
          name);
        }
      },
      {
        key: 'type',
        label: '班别类型',
        render(h: any, params: any) {
          const { type } = params.row;
          const _list = MARKET_CLASSESS_TYPE;
          const _arr = _list.filter((item: any) => item.id === type);
          if (_arr.length > 0) {
            return h('span', _arr[0].label);
          }
          return h('span', '-');
        },
      },
      {
        key: 'price',
        label: '价格(元)',
        isPrice: true
      },
      {
        key: 'carModel',
        label: '车型',
        render(h: any, params: any) {
          const { carModel } = params.row;
          if (!carModel) {
            return h('span', '-');
          }
          return h('span', carModel);
        },
      },
      {
        key: 'city',
        label: '所属城市',
        render(h: any, params: any) {
          const { city } = params.row;
          if (city) {
            const _city = JSON.parse(city);
            const _text: string[] = [];
            _city.forEach((item: any) => {
              _text.push(item.name);
            });
            return h('div', _text.join(', '));
          }
          return h('span', '');
        },
      },
      {
        key: 'highEndClass',
        label: '高端班',
        render(h: any, params: any) {
          const { highEndClass } = params.row;
          return h('span', highEndClass ? '是' : '否');
        },
      },
      {
        key: 'otherSpace',
        label: '外地班',
        render(h: any, params: any) {
          const { otherSpace } = params.row;
          return h('span', otherSpace ? '是' : '否');
        },
      },
      {
        key: 'status',
        label: '状态',
        render(h: any, params: any) {
          const { status } = params.row;
          const _list = MARKET_UP_DOWN_STATUS;
          const _arr = _list.filter((item: any) => item.id === status);
          if (_arr.length > 0) {
            return h('span', _arr[0].label);
          }
          return h('span', '-');
        },
      },
    ],
    list: [],
    selectionList: [], // 勾选的项
  }

  // 列表操作回调
  private tableOptionCallback(val: TableOptionsValue) {
    const { id } = val;
    if (id === 4) {
      this.showDetail = true;
      return;
    }
    // 子项选中列表，必须是单选
    const { selectionList } = this.tableData;
    const _len = selectionList.length;
    if (_len > 1) this.$message.warning('只能单选一项进行操作！');
    if (_len === 0) this.$message.warning('请先勾选一项，再进行操作！');
    if (_len === 1) {
      if (id === 1) {
        // 编辑
        this.jumpDetail(selectionList[0], '');
      }
      if (id === 2 || id === 3) {
        this.upDataStatusFunc(selectionList[0], id);
      }
    }
  }

  // 列表选中每一列切换回调
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  // 列表单项点击
  private jumpDetail(val: ParamsType, type: string) {
    this.isEdit = type === '1';
    // 深拷贝一份数据
    this._setFormDataFunc(val);
    this.showDetail = true;
  }

  // 上下架商品
  private upDataStatusFunc(val: ParamsType, type: number) {
    const { status } = val;
    if ((status === 1 && type === 2) || (status !== 1 && type === 3)) {
      this.$message.warning(`${type === 2 ? '当前状态已经是上架' : '当前状态已经是下架'}`);
      return;
    }
    this.$confirm(`${status === 1 ? '状态修改为下架' : '状态修改为上架'}, 是否继续?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      const sendData = JSON.parse(JSON.stringify(val));
      sendData.status = sendData.status === 1 ? 0 : 1;
      await this.putClasses(sendData);
      this.$message.success('修改成功！');
      await this.queryList();
    });
  }

  /** 列表配置 结束 */

  /** 列表分页 开始 */

  public tableSizeChange(val: number) {
    this.paginationData.pageSize = val;
    this.paginationData.current = 1;
    this.queryList();
  }

  public tableCurrentChange(val: number) {
    this.paginationData.current = val;
    this.queryList();
  }

  /** 列表分页 结束 */

  /** 新增 编辑 弹窗 开始 */
  private showDetail = false; // 展示弹窗

  private isEdit = false; // 可编辑

  private submitLoading = false; // 提交loading

  handleTypeChange() {
    this.formData.installment = false;
    this.formData.phaseOneAmount = '';
    this.formData.carModel = '';
  }

  // 重置表单
  private _resetFormFunc() {
    this.formData = {
      type: null,
      name: '',
      carModel: '',
      price: '',
      highEndClass: null,
      installment: false,
      otherSpace: null,
      phaseOneAmount: '',
      status: null,
      cityId: [],
      cityName: [],
      drivingSchoolId: '',
      id: null,
    };
  }

  // 表单配置
  private formData: ParamsType = {
    type: null, // 1:学车班别，2:散学班别
    name: '', // 名称
    carModel: '', // 车型
    price: '', // 价格
    highEndClass: null, // 是否高端班
    installment: false, // 是否可分期
    otherSpace: null, // 是否外地班
    phaseOneAmount: '', // 首期金额
    status: null, // 状态：1：上架 0：下架
    cityId: [], // 城市id
    cityName: [], // 城市名称
    drivingSchoolId: '', // 驾校id
    id: null, // id
  }

  // 表单校验
  private formRules = {
    name: [
      { required: true, message: '请输入班别名称', trigger: ['change', 'blur'] },
      // { pattern: /\b(?![0-9]+\b)[A-Z0-9]+\b/, message: '大写英文+数字组合的代码', trigger: ['change'] },
      // { pattern: NUMBER_AND_EN_REG, message: '大写英文+数字组合的代码', trigger: ['change'] },
    ],
    price: [
      { required: true, message: '请输入价格', trigger: ['change', 'blur'] },
      { pattern: REG_PRICE_OR_ZONE, message: '范围0-999999,可保留两位小数' }
    ],
    phaseOneAmount: [
      { required: true, message: '请输入首期金额', trigger: ['change', 'blur'] },
      { pattern: REG_PRICE_OR_ZONE, message: '范围0-999999,可保留两位小数', trigger: ['change'] }
    ],
    highEndClass: [{ required: true, message: '请选择是否高端班', trigger: 'change' }],
    installment: [{ required: true, message: '请选择是否可分期', trigger: 'change' }],
    otherSpace: [{ required: true, message: '请选择是否外地班', trigger: 'change' }],
    status: [{ required: true, message: '请选择状态', trigger: 'change' }],
    type: [{ required: true, message: '请选择班别类型', trigger: 'change' }],
    carModel: [{ required: true, message: '请选择车型', trigger: 'change' }],
  }

  // 请求回来处理数据
  _setFormDataFunc(val: ParamsType) {
    // 深拷贝一份
    const _data = JSON.parse(JSON.stringify(val));
    Object.keys(this.formData).forEach(key => {
      this.formData[key] = _data[key];
    });
    const { city } = _data;
    if (city) {
      const _city = JSON.parse(city);
      const _ids: string[] = [];
      const _names: string[] = [];
      _city.forEach((item: any) => {
        const { id, name } = item;
        _ids.push(id);
        _names.push(name);
      });
      this.formData.cityId = _ids;
      this.formData.cityName = _names;
    }
  }

  // 提交表单前处理数据
  _specialHandleFormData() {
    // 深拷贝一份数据
    const sendData = JSON.parse(JSON.stringify(this.formData));
    const {
      cityId, cityName, price, phaseOneAmount, otherSpace, installment
    } = sendData;
    const _cityList: ParamsType = [];
    cityId.forEach((item: string, index: number) => {
      _cityList.push({ id: item, name: cityName[index] });
    });
    if (_cityList.length > 0 && otherSpace) {
      sendData.city = JSON.stringify(_cityList);
    } else {
      sendData.city = JSON.stringify([]);
    }
    delete sendData.cityId;
    delete sendData.cityName;
    if (parseFloat(price) <= parseFloat(phaseOneAmount)) {
      this.$message.warning('首期金额应该小于价格');
      return false;
    }

    const { drivingSchoolId } = this.userInfo;
    if (drivingSchoolId === '370' && installment && parseFloat(phaseOneAmount) < 2500) {
      this.$message.warning('首期金额不可低于2500元');
      return false;
    }
    return sendData;
  }

  // 取消提交
  private balaceCancel() {
    this._resetFormFunc();
    (this.$refs.classessForm as VueComponentParent).resetFields(); // 重置表单
    this.submitLoading = false; // 重置提交
    this.isEdit = false;
    this.showDetail = false; // 收起弹窗
  }

  // 确认提交
  private balaceSubmit() {
    (this.$refs.classessForm as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        const sendData = this._specialHandleFormData();
        if (sendData === false) return;
        const { drivingSchoolId } = this.userInfo;
        this.submitLoading = true;
        if (sendData.id) {
          this.putClasses(sendData).then(() => {
            this.queryList();
            this.$message.success('修改成功');
            this.balaceCancel();
          }).finally(() => {
            this.submitLoading = false;
          });
        } else {
          delete sendData.id; // 新增删除id
          sendData.drivingSchoolId = drivingSchoolId;
          this.postClasses(sendData).then(() => {
            this.queryList();
            this.$message.success('新增成功');
            this.balaceCancel();
          }).finally(() => {
            this.submitLoading = false;
          });
        }
      }
    });
  }
  /** 新增 编辑 弹窗 结束 */

  /** 请求处理 */
  async queryList() {
    const { searchForm, paginationData } = this;
    const { cascaderList } = searchForm;
    const _data = drawSearchForm(searchForm, paginationData);
    const sendData = {
      ..._data,
      cityId: cascaderList[0].value,
    };
    const body = await this.queryClasses(sendData);
    const {
      data, current, total
    } = body;
    this.tableData.list = data;
    this.paginationData.current = current;
    this.paginationData.total = total;
    this.tableData.loading = false;
  }

  /** 生命周期函数 */
  async mounted() {
    this.tableData._this = this;
    this.optionsCity = _setCityFunc();
    this.queryList();
    const { drivingSchoolId } = this.userInfo;
    if (drivingSchoolId === '370') {
      const list = MARKET_CLASSESS_TYPE.filter((item: any) => item.id !== 2);
      this.classessTypeList = list;
      // this.searchForm.selectList[0].options = list;
    }
  }

  perm = {};

  async created() {
    const permObj = await this.$getPerm(this, this.tableData.options, this.searchForm.buttonList);
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
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
