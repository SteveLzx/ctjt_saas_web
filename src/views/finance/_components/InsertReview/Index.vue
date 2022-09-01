<template>
  <el-drawer
    :visible="visible"
    size="1300px"
    :direction="'rtl'"
    :show-close="false"
  >
    <!--form 表单-->
    <CtjtCard :prop-data="{ title: '新增' }">
      <template slot="header">
        <span
          style="float: right"
          class="iconfont close_icon"
          @click="handleButtonClick()"
          >&#xe62b;</span
        >
      </template>
      <template slot="content">
        <CtjtForm
          ref="insert_form"
          :prop-data="commonForm"
          @form-submit="formCallBack"
          @select-change="selectChange"
          @search-select-func="searchSelectFunc"
        >
        </CtjtForm>
      </template>
    </CtjtCard>
    <CtjtTable
      :tableData="previewData"
      @option-call="tableOptionCallback"
      @selection-change="tableSelectionChange"
    >
    </CtjtTable>
  </el-drawer>
</template>
<script lang="ts">
import {
  Prop, Vue, Component, Watch
} from 'vue-property-decorator';
import { ParamsType, VueComponentParent, TableOptionsValue } from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import { CtjtTable, CtjtForm, CtjtCard } from '@/components';
import { deepClone, REG_PRICE, matchNumberList } from '@/assets/js/common';
import { FEE_TYPE } from '@/enums';
import { OTHER_FEE_MG_DETAIL_LABEL } from '@/views/finance/_common/tablelabel';
// 其他费用新增表单配置
const OTHER_FEE_MG_REVIEW_FORM: ParamsType = {
  selectList: [
    {
      label: '证件号码',
      key: 'idNo',
      value: '',
      placeholder: '请输入证件号码',
      multiple: false,
      clearable: true,
      width: 120,
      filterable: true,
      loading: true,
      options: [],
      customOptions: {
        value: 'idNo',
        label: 'idNo',
        title: 'userName',
      },
      rules: [{ required: true, message: '请输入证件号码', trigger: 'blur' }],
    },
  ],
  inputList: [
    {
      label: '姓名',
      key: 'userName',
      type: 'text',
      value: '',
      width: 200,
      clearable: true,
      disabled: true,
      rules: [{ required: true, message: '找不到学员', trigger: 'blur' }],
    },
    {
      label: '门店',
      key: 'storeName',
      type: 'text',
      value: '',
      width: 200,
      placeholder: '',
      clearable: true,
      disabled: true,
      rules: [{ required: true, message: '找不到门店', trigger: 'blur' }],
    },
    {
      label: '费用类型',
      key: 'feeType',
      type: 'text',
      value: '',
      width: 200,
      placeholder: '',
      clearable: false,
      disabled: true,
      rules: [{ required: true, message: '找不到费用类型', trigger: 'blur' }],
    },
    {
      label: '金额',
      key: 'amount',
      type: 'text',
      value: '',
      width: 200,
      placeholder: '',
      clearable: true,
      disabled: false,
      rules: [
        { required: true, message: '请输入金额', trigger: 'blur' },
        { pattern: REG_PRICE, message: '范围1-999999,可保留两位小数' },
      ],
    },
    {
      // 隐藏
      label: '',
      key: 'classesName',
      type: 'text',
      value: '',
      width: 200,
      placeholder: '',
      clearable: true,
      display: 'none',
    },
    {
      // 隐藏
      label: '',
      key: 'carModel',
      type: 'text',
      value: '',
      width: 200,
      placeholder: '',
      clearable: true,
      display: 'none',
    },
  ],
};
const OTHER_FEE_MG_REVIEW_LABELS = deepClone(OTHER_FEE_MG_DETAIL_LABEL);
@Component({
  components: {
    CtjtForm,
    CtjtTable,
    CtjtCard,
  },
})
export default class CtjtFinanceInsertReviewDrawer extends Vue {
  @Prop({ default: false }) visible!: boolean;

  @Prop({ default: {} }) insertProps!: any;

  @Watch('visible')
  watchShow(val: boolean) {
    if (val) {
      this.setFeeType();
    }
  }

  /** 设置费用类型值 */
  setFeeType() {
    const { inputList } = this.commonForm;
    const { type } = this.insertProps;
    if (Array.isArray(inputList)) {
      inputList.forEach((item: any) => {
        const _item = item;
        if (_item.key === 'feeType') {
          const list = FEE_TYPE.filter((a) => a.id === type);
          _item.value = list ? list[0].label : '';
        }
      });
    }
  }

  private previewData: ParamsType = {};

  /** form表单配置 */
  private commonForm: ParamsType = {};

  @Watch('insertProps', { immediate: true, deep: true })
  private watchinsertPropsFun(val: any) {
    const { code } = val;
    switch (code) {
      case 'other_fee_mg':
        OTHER_FEE_MG_REVIEW_LABELS.splice(7, 3);
        this.previewData.labels = OTHER_FEE_MG_REVIEW_LABELS;
        this.commonForm = OTHER_FEE_MG_REVIEW_FORM;
        break;
      default:
        break;
    }
    const _data = {
      loading: false,
      index: true,
      selection: true,
      list: [],
      options: [
        {
          id: 1,
          label: '删除',
          type: 'danger',
        },
        {
          id: 2,
          label: '保存',
          type: 'success',
        },
        {
          id: 3,
          label: '取消',
          type: 'info',
        },
      ],
    };
    const _buttonList = {
      buttonList: [
        {
          label: '添加',
          key: 'add',
          type: 'primary',
          plain: false,
        },
      ],
    };
    this.previewData = { ..._data, ...this.previewData };
    this.commonForm = { ..._buttonList, ...this.commonForm };
  }

  /** form 回调 */
  formCallBack(val: any) {
    const { key, result } = val;
    if (key === 'add' && result) {
      const { commonForm, previewData, insertProps } = this;
      const _data = drawSearchForm(commonForm);
      const sendData = {
        ..._data,
        id: previewData.list ? this._getMax(previewData.list) + 1 : 1,
        feeType: insertProps.type,
        type: insertProps.type,
      };
      this.previewData.list.push(sendData);
      this.$message.success('添加成功');
      this.resetForm();
    }
  }

  /** 获取最大的id */
  _getMax(array: []) {
    let max = 0;
    array.map((obj: any) => {
      if (obj.id > max) max = obj.id;
      return max;
    });
    return max;
  }

  resetForm() {
    (this.$refs.insert_form as VueComponentParent).resetFields();
  }

  /** 列表操作回调 */
  private tableOptionCallback(val: TableOptionsValue) {
    const { selectionList } = this.previewData;
    const idList: Array<number> = [];
    if (selectionList) {
      selectionList.forEach((item: any) => {
        const _item = item;
        idList.push(_item.id);
      });
    }
    const _len = selectionList ? selectionList.length : 0;
    const { id } = val;
    if (id === 1) {
      // 删除
      if (_len >= 1) {
        this.previewData.list = this.previewData.list.filter(
          (item: any) => !idList.includes(item.id)
        );
        this.$message.success('删除成功');
      } else {
        this.$message.warning('请先勾学员！');
      }
    }
    // 保存
    if (id === 2) {
      this.handleButtonClick('submit');
    }
    if (id === 3) {
      // 取消
      this.handleButtonClick('cancel');
    }
  }

  // 列表选中每一列切换回调
  private tableSelectionChange(val: []) {
    this.previewData.selectionList = val;
  }

  /** @description 提交新增方法 */
  async handleButtonClick(key?: string) {
    if (key === 'submit') {
      const { list } = this.previewData;
      if (list.length > 0) {
        const sendData: any = list;
        const { insertPath } = this.insertProps;
        await this.$http
          .post(insertPath, sendData, {
            hasUseCode: true,
          })
          .then((res: any) => {
            const { code, body } = res;
            if (code === 200) {
              const { description = '', failLogDtoList } = body;
              const _list: any = matchNumberList(description);
              this.$emit('on-insert', {
                ...body,
                importSuccess: (_list && _list[0]) || 0,
                imporError: (failLogDtoList && failLogDtoList.length) || 0,
              });
              this.resetForm(); // 清空form表单
              this.previewData.list = []; // 清空列表
            }
          });
      } else {
        this.$message.warning('请先添加补录数据');
      }
    } else {
      this.$emit('button-call', { key });
      this.resetForm(); // 清空form表单
      this.previewData.list = []; // 清空列表
    }
  }

  /** 搜索下拉框获取数据回调 */
  async searchSelectFunc(query: string) {
    const { selectList } = this.commonForm;
    const { idNoPath, type } = this.insertProps;
    selectList[0].loading = true;
    if (query.length >= 2) {
      const body = await this.$http.get(idNoPath, {
        params: {
          idNo: query,
        },
      });
      selectList[0].options = body;
      selectList[0].loading = false;
    }
  }

  /**
   * @param { ParamsType } val 搜索项 下拉选中返回当前对象
   * @description 搜索组件 下拉项选中回调函数
   */
  selectChange(item: any) {
    const _item = item;
    const _list = _item.options.filter((it: any) => it.idNo === _item.value);
    if (_item.key === 'idNo') {
      _item.options = []; // 清空历史数据
      // 设置根据证件号拿到的用户信息
      (this.$refs.insert_form as VueComponentParent).clearValidate();
      this._setFormDataByUserInfo(_list[0] || []);
    }
    //
  }

  /** 根据用户信息设置表单数据 */
  _setFormDataByUserInfo(val: any) {
    const {
      userName, storeName = '', classesName = '', carModel = ''
    } = val;
    const { inputList } = this.commonForm;
    const { type } = this.insertProps;
    if (Array.isArray(inputList)) {
      inputList.forEach((item: any) => {
        const _item = item;
        if (_item.key === 'userName') {
          _item.value = userName;
        }
        if (_item.key === 'storeName') {
          _item.value = storeName;
        }
        if (_item.key === 'classesName') {
          _item.value = classesName;
        }
        if (_item.key === 'carModel') {
          _item.value = carModel;
        }
        if (_item.key === 'feeType') {
          const list = FEE_TYPE.filter((a) => a.id === type);
          _item.value = list ? list[0].label : '';
        }
      });
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-drawer__header {
  margin-bottom: 0;
}
::v-deep .el-drawer__body {
  overflow: auto;
  padding: 0 20px 20px;
}
.close_icon {
  cursor: pointer;
}
</style>
