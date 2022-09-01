<template>
  <el-row>
    <el-form
      :class="{ 'hidden-form': !showFormAll }"
      inline
      ref="searchComComponentRef"
    >
      <!-- 时间选择 -->
      <el-form-item
        v-for="(item, index) in propData.selectTimeList"
        :key="`select-time-${index}`"
        :label="item.label"
        :label-width="`${item.labelWidth + 'px' || 'auto'}`"
        class="date-option-select"
      >
        <el-select
          size="mini"
          v-model="item.select.value"
          :placeholder="item.select.placeholder || '请选择'"
          :style="{ width: `${item.select.width}px` }"
          @change="handleSelectChange(item.select)"
        >
          <el-option
            v-for="(i, i_index) in item.select.options"
            :key="`select-time-option-${i_index}`"
            :label="i.label"
            :value="i.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 时间选择器 -->
      <el-form-item
        v-for="(item, index) in propData.datePickerList"
        :key="`data-picker-${index}`"
        :label="item.label"
        :label-width="`${item.labelWidth + 'px' || 'auto'}`"
      >
        <el-date-picker
          size="mini"
          class="search-picker"
          v-model="item.value"
          :editable="item.editable"
          :style="{ width: `${item.width}px` }"
          :type="item.type"
          :placeholder="item.placeholder"
          :clearable="item.clearable"
          :range-separator="item.rangeSeparator || '至'"
          :start-placeholder="item.startPlaceholder || '开始时间'"
          :end-placeholder="item.endPlaceholder || '结束时间'"
        >
        </el-date-picker>
      </el-form-item>
      <!-- 选中类型 搜索 -->
      <el-form-item
        v-for="(item, index) in propData.selectInputList"
        :key="`select-input-${index}`"
        :label="item.label"
      >
        <el-row type="flex">
          <el-select
            size="mini"
            v-model="item.select.value"
            :placeholder="item.select.placeholder || '请选择'"
            :style="{ width: `${item.select.width}px` }"
            @change="handleSelectChange(item.select)"
          >
            <el-option
              v-for="(i, i_index) in item.select.options"
              :key="`select-input-option-${i_index}`"
              :label="i.label"
              :value="i.id"
            >
            </el-option>
          </el-select>
          <el-input
            size="mini"
            v-model.trim="item.input.value"
            :clearable="item.input.clearable"
            :type="item.input.type || 'text'"
            :maxlength="item.maxl"
            :placeholder="item.input.placeholder || '请输入'"
            :style="{ width: `${item.input.width}px` }"
          ></el-input>
        </el-row>
      </el-form-item>
      <!-- 输入下拉搜索框 -->
      <slot name="autocomplete"></slot>
      <!-- 输入框 -->
      <el-form-item
        v-for="(item, index) in propData.inputList"
        :key="`input-${index}`"
        :label="item.label"
        :label-width="`${item.labelWidth + 'px' || 'auto'}`"
      >
        <template v-if="item.type != 'number'">
          <!-- 文本输入框 -->
          <el-input
            size="mini"
            v-model.trim="item.value"
            :clearable="item.clearable"
            :type="item.type || 'text'"
            :maxlength="item.maxl"
            :placeholder="item.placeholder || '请输入'"
            :style="{ width: `${item.width}px` }"
          ></el-input>
        </template>
        <template v-else>
          <!-- 数字输入框 -->
          <el-input-number
            size="mini"
            v-model.trim="item.value"
            :placeholder="item.placeholder || '请输入'"
            :min="item.min || 0"
            :max="item.max"
            :step="item.step"
            controls-position="right"
            :controls="item.controls"
            :style="{ width: `${item.width}px` }"
          ></el-input-number>
        </template>
      </el-form-item>
      <!-- 选择框 -->
      <el-form-item
        v-for="(item, index) in propData.selectList"
        :key="`select-${index}`"
        :label="item.label"
        :label-width="`${item.labelWidth + 'px' || 'auto'}`"
        :style="{ display: `${item.display}` }"
      >
        <el-select
          size="mini"
          v-model="item.value"
          class="search-select"
          :disabled="item.disabled"
          :placeholder="item.placeholder || '请选择'"
          :multiple="item.multiple"
          :clearable="item.clearable"
          :style="{ width: `${item.width}px` }"
          @change="handleSelectChange(item)"
          @visible-change="handleSelectVisibleChange(item)"
          :filterable="item.filterable"
        >
          <el-option
            v-for="(tip, i) in item.options"
            :key="`select-option-${i}`"
            :value="item.customOptions ? tip[item.customOptions.value] : tip.id"
            :label="
              item.customOptions ? tip[item.customOptions.label] : tip.label
            "
          />
        </el-select>
      </el-form-item>
      <!--多级联动下拉框-->
      <el-form-item
        v-for="(item, index) in propData.cascaderList"
        :key="`cascader-${index}`"
        :label="item.label"
        :label-width="`${item.labelWidth + 'px' || 'auto'}`"
      >
        <el-cascader
          size="mini"
          :show-all-levels="item.optionProps.showAllLevels || false"
          :clearable="item.clearable"
          v-model="item.value"
          :placeholder="item.placeholder || '请选择'"
          :options="item.options"
          :props="item.optionProps"
          :style="{ width: `${item.width}px` }"
          :collapse-tags="item.optionProps.collapseTags"
        ></el-cascader>
      </el-form-item>
      <!-- 勾选框 -->
      <el-form-item>
        <el-checkbox
          size="mini"
          v-for="(item, index) in propData.checkedList"
          :key="`data-picker-${index}`"
          v-model="item.value"
          >{{ item.label }}</el-checkbox
        >
      </el-form-item>
      <el-form-item>
        <!-- 按钮 -->
        <el-button
          size="mini"
          :icon="!showFormAll ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"
          @click="showFormAll = !showFormAll"
          v-if="showOpenBtn"
          >{{ !showFormAll ? '展开' : '收起' }}</el-button
        >
        <el-button
          size="mini"
          v-for="(item, index) in propData.buttonList"
          :key="`button-${index}`"
          :type="item.type || 'default'"
          :plain="item.plain"
          @click="propClick(item.key)"
          >{{ item.label }}</el-button
        >
      </el-form-item>
    </el-form>
    <div style="margin-top: 10px" v-show="!showFormAll">
      <!-- 按钮 -->
      <el-button
        size="mini"
        :icon="!showFormAll ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"
        @click="showFormAll = !showFormAll"
        v-if="showOpenBtn"
        >{{ !showFormAll ? '展开' : '收起' }}</el-button
      >
      <el-button
        size="mini"
        v-for="(item, index) in propData.buttonList"
        :key="`button-${index}`"
        :type="item.type || 'default'"
        :plain="item.plain"
        @click="propClick(item.key)"
        >{{ item.label }}</el-button
      >
    </div>
  </el-row>
</template>
<script lang="ts">
import {
  Prop, Vue, Component, Emit
} from 'vue-property-decorator';
import { deepClone } from '@/assets/js/common';
import { resetSearchForm } from '@/assets/js/search_table';

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
  collapseTags?: boolean;
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
  selectInputList: any[];
}

interface VueComponentParent extends Vue {
  searchTableCallBack: (val: string) => void;
  setChangeValueCallBack: (val: string, value: []) => void;
}

@Component
export default class SearchTable extends Vue {
  @Prop({ default: {} })
  propData!: PropValue;

  showFormAll = true;

  showOpenBtn = false;

  propClick(key: string) {
    // 重置，需要先重置请求参数，在调用父组件函数
    if (key === 'reset') {
      // 深拷贝一份数据
      const _data = deepClone(this.propData);
      const _resetData = resetSearchForm(_data);
      this.$emit('update:prop-data', _resetData);
    }
    if (
      typeof (this.$parent as VueComponentParent).searchTableCallBack
      === 'function'
    ) {
      (this.$parent as VueComponentParent).searchTableCallBack(key);
    }
    this.$emit('search-call', key);
  }

  @Emit('select-change')
  handleSelectChange(val: any) {
    return val;
  }

  @Emit('select-visible-change')
  handleSelectVisibleChange(val: any) {
    return val;
  }

  mounted() {
    this.$nextTick(() => {
      const height = (this.$refs.searchComComponentRef as any).$el.offsetHeight;
      this.showOpenBtn = height > 55;
    });
  }
}
</script>

<style lang="scss" scoped>
.date-option-select .el-form-item__content .el-select {
  padding: 0 8px;
  top: -1px;
}
.hidden-form {
  max-height: 30px;
  overflow: hidden;
}
.el-form-item{
  margin-bottom: 8px;
}
</style>
