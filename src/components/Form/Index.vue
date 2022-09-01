<template>
  <el-form
    ref="commonForm"
    :model="propData"
    :inline="formInline"
    class="form_wrap"
  >
    <slot name="autocomplete"></slot>
    <!--选择下拉框-->
    <el-form-item
      class="form_item_wrap"
      v-for="(item, index) in propData.selectList"
      :key="`select-${index}`"
      :label="item.label"
      :label-width="`${item.labelWidth + 'px' || 'auto'}`"
      :prop="'selectList.' + index + '.value'"
      :rules="item.rules"
    >
      <template v-if="item.filterable">
        <!--搜索选择下拉框-->
        <el-select
          class="c_select"
          v-model="item.value"
          filterable
          remote
          :remote-method="handleQuerySearchFunc"
          :placeholder="item.placeholder"
          :loading="item.loading"
          :multiple-limit="1"
          :popper-append-to-body="false"
          @change="handleSelectChange(item)"
        >
          <el-option
            v-for="(tip, i) in item.options"
            :key="`select-option-${i}`"
            :value="item.customOptions ? tip[item.customOptions.value] : tip.id"
            :label="
              item.customOptions ? tip[item.customOptions.label] : tip.label
            "
          >
            <template>
              <div class="c_div">
                <div class="c_label">{{ tip[item.customOptions.title] }}</div>
                <div class="c_value">{{ tip[item.customOptions.value] }}</div>
              </div>
            </template>
          </el-option>
        </el-select>
      </template>
      <template v-else>
        <!-- 普通选择下拉框 -->
        <el-select
          v-model="item.value"
          class="search-select"
          :placeholder="item.placeholder || '请选择'"
          :multiple="item.multiple"
          :clearable="item.clearable"
          :style="{ width: `${item.width}px` }"
          :disabled="item.disabled"
          @change="handleSelectChange(item)"
        >
          <el-option
            v-for="(tip, i) in item.options"
            :key="`select-option-${i}`"
            :value="item.customOptions ? tip[item.customOptions.value] : tip.id"
            :label="
              item.customOptions ? tip[item.customOptions.label] : tip.label
            "
            :disabled="tip.disabled"
          />
        </el-select>
      </template>
    </el-form-item>
    <!-- 输入框 -->
    <el-form-item
      class="form_item_wrap"
      v-for="(item, index) in propData.inputList"
      :key="`input-${index}`"
      :label="item.label"
      :label-width="`${item.labelWidth + 'px' || 'auto'}`"
      :prop="'inputList.' + index + '.value'"
      :rules="item.rules"
    >
      <template v-if="item.type != 'number'">
        <!-- 文本输入框 -->
        <el-input
          v-model.trim="item.value"
          :clearable="item.clearable"
          :type="item.type || 'text'"
          :maxlength="item.maxl"
          :placeholder="item.placeholder || '请输入'"
          :style="{ width: `${item.width}px`, display: `${item.display}` }"
          :disabled="item.disabled"
          @blur="inputBlurFunc(item)"
        ></el-input>
      </template>
      <template v-else>
        <!-- 数字输入框 -->
        <el-input
          v-model.number="item.value"
          :placeholder="item.placeholder || '请输入'"
          :style="{ width: `${item.width}px` }"
          :disabled="item.disabled"
          @blur="inputBlurFunc(item)"
        ></el-input>
      </template>
    </el-form-item>
    <!--多级联动下拉框-->
    <el-form-item
      class="form_item_wrap"
      v-for="(item, index) in propData.cascaderList"
      :key="`cascader-${index}`"
      :label="item.label"
      :label-width="`${item.labelWidth + 'px' || 'auto'}`"
      :prop="'cascaderList.' + index + '.value'"
      :rules="item.rules"
    >
      <el-cascader
        :show-all-levels="item.optionProps.showAllLevels || false"
        :clearable="item.clearable"
        v-model="item.value"
        :options="item.options"
        :props="item.optionProps"
        :style="{ width: `${item.width}px` }"
        :disabled="item.disabled"
        :collapse-tags="item.optionProps.collapseTags"
      ></el-cascader>
    </el-form-item>
    <!-- 日期时间选择器 -->
    <el-form-item
      class="form_item_wrap"
      v-for="(item, index) in propData.datePickerList"
      :key="`data-picker-${index}`"
      :label="item.label"
      :label-width="`${item.labelWidth + 'px' || 'auto'}`"
      :prop="'datePickerList.' + index + '.value'"
      :rules="item.rules"
    >
      <!--时间选择器-->
      <template v-if="item.type === 'time'">
        <el-time-picker
          class="search-picker"
          align="right"
          v-model="item.value"
          :type="item.type"
          :placeholder="item.placeholder"
          :value-format="item.formatType"
          :format="item.formatType"
          :disabled="item.disabled"
          :style="{ width: `${item.width}px`, display: `${item.display}` }"
        ></el-time-picker>
      </template>
      <!--日期控件-->
      <template v-else>
        <el-date-picker
          class="search-picker"
          v-model="item.value"
          :type="item.type"
          :placeholder="item.placeholder"
          :range-separator="item.rangeSeparator || '至'"
          :start-placeholder="item.startPlaceholder || '开始时间'"
          :end-placeholder="item.endPlaceholder || '结束时间'"
          :disabled="item.disabled"
          :picker-options="
            item.dateDisabled ? pickerDisabledOptions : pickerOptions
          "
          :style="{ width: `${item.width}px`, display: `${item.display}` }"
        >
        </el-date-picker>
      </template>
    </el-form-item>
    <!-- 按钮 -->
    <el-form-item>
      <el-button
        v-for="(item, index) in propData.buttonList"
        :key="`button-${index}`"
        :type="item.type || 'default'"
        :plain="item.plain"
        @click="propClick(item.key)"
        >{{ item.label }}</el-button
      >
    </el-form-item>
    <slot></slot>
  </el-form>
</template>
<script lang="ts">
import {
  Prop, Vue, Component, Emit, Watch
} from 'vue-property-decorator';
import { VueComponentParent } from '@/type';

interface InputListValue {
  label: string;
  key: string;
  type: string;
  maxl?: number;
  min?: number;
  max?: number;
  step?: number;
  value: string;
  placeholder: string;
  labelWidth?: number;
  width?: number;
  clearable?: boolean;
}

interface OptionsValue {
  id: number;
  label: string;
}

interface OptionsCustomValue {
  value: string;
  label: string;
}

interface CascaderOptionsValue {
  value: string;
  label: string;
  children: [
    {
      value: string;
      label: string;
      children: [
        {
          value: string;
          label: string;
        }
      ];
    }
  ];
}

interface CascaderOptionProps {
  showAllLevels?: boolean;
  checkStrictly: boolean;
  emitPath: boolean;
  value: string;
  label: string;
  children: string;
}

interface SelectListValue {
  label: string;
  key: string;
  value: string;
  placeholder: string;
  labelWidth?: number;
  multiple: boolean;
  clearable: boolean;
  options: OptionsValue;
  width?: number;
  customOptions?: OptionsCustomValue;
}

interface SelectTimeValue extends SelectListValue {
  keyArr: string[];
}

interface CascaderListValue {
  label: string;
  key: string;
  value: string;
  placeholder: string;
  labelWidth?: number;
  multiple: boolean;
  clearable: boolean;
  options: CascaderOptionsValue;
  width?: number;
  optionProps: CascaderOptionProps;
}

interface DatePickerValue {
  label: string;
  key?: string;
  keyArr?: string[];
  value: string;
  placeholder: string;
  labelWidth?: number;
  type: string;
  format: string;
  rangeSeparator: string;
  startPlaceholder: string;
  endPlaceholder: string;
}

interface ButtonList {
  label: string;
  type: string;
  plain: boolean;
}

interface SelectTimeListValue {
  label: string;
  labelWidth?: number;
  select: SelectTimeValue;
  time: DatePickerValue;
}

interface CheckedListValue {
  label: string;
  value: string;
  key: string;
}

interface PropValue {
  selectTimeList: SelectTimeListValue[];
  inputList: InputListValue[];
  selectList: SelectListValue[];
  cascaderList: CascaderListValue[];
  datePickerList: DatePickerValue[];
  buttonList: ButtonList[];
  checkedList: CheckedListValue[];
}

@Component
export default class CtjtForm extends Vue {
  @Prop({
    default: {},
  })
  propData!: PropValue;

  @Prop({
    default: true,
  })
  formInline?: boolean;

  private pickerDisabledOptions = {
    disabledDate(time: any) {
      return time.getTime() > Date.now();
    },
  };

  private pickerOptions = {
    disabledDate(time: any) {
      return false;
    },
  };

  @Emit('form-submit')
  propClick(key: string) {
    let result = false;
    if (key !== 'close') {
      (this.$refs.commonForm as VueComponentParent).validate((valid: boolean) => {
        if (valid) {
          result = true;
        } else {
          this.$message.warning('您的信息填写有误，请仔细检查并修改！');
        }
      });
    }
    return { key, result };
  }

  // 重置form
  resetFields() {
    (this.$refs.commonForm as VueComponentParent).resetFields();
  }

  clearValidate() {
    (this.$refs.commonForm as VueComponentParent).clearValidate();
  }

  @Emit('select-change')
  handleSelectChange(val: any) {
    return val;
  }

  @Emit('search-select-func')
  handleQuerySearchFunc(query: any) {
    return query;
  }

  @Emit('input-blur')
  inputBlurFunc(query: any) {
    return query;
  }

  @Watch('propData', { immediate: true, deep: true })
  watchpropData(val: PropValue) {
    return val;
  }
}
</script>
<style lang="scss" scoped>
.form_wrap .form_item_wrap {
  ::v-deep .el-form-item__label {
    font-weight: bold;
  }
}
.c_select {
  ::v-deep .el-select-dropdown__item {
    height: 64px !important;
  }
}
.c_label {
  font-size: 12px;
}
.c_value {
  font-size: 12px;
  color: #999;
}
</style>
