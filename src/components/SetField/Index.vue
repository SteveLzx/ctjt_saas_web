<template>
  <el-popover
    placement="right"
    width="550"
    trigger="click"
    v-model="showFieldVisable"
    style="position: absolute; right: 590px"
  >
    <el-row type="flex" justify="space-between">
      <span>显示字段</span>
      <span class="dialog_close iconfont" @click="close">&#xe62a;</span>
    </el-row>
    <section class="popover_box">
      <el-checkbox
        class="all_checkbox_wrap"
        v-model="allLabelCheck"
        :indeterminate="isIndeterminate"
        @change="allChecked">全部</el-checkbox>
      <el-checkbox-group v-model="checkKeyList">
        <el-checkbox
          v-for="(item, index) in fieldList"
          :label="item.key"
          :key="index"
          class="checkbox_wrap"
        >{{ item.label }}</el-checkbox>
      </el-checkbox-group>
      <el-row type="flex" justify="center" style="margin-top: 4px;">
        <el-button @click="fieldReset">重置</el-button>
        <el-button
          type="primary"
          style="margin-left: 32px"
          @click="fieldSubmit"
          >确定</el-button
        >
      </el-row>
    </section>
  </el-popover>
</template>
<script lang="ts">
import {
  Vue, Component, Prop, Emit, Watch
} from 'vue-property-decorator';
import { getLabelJsonSaveKeyFunc } from '@/assets/js/field_set';
import { saveStorege } from '@/assets/js/common';

@Component
export default class CtjtSetField extends Vue {
  @Prop({ default: [] }) fieldList!: []; // 所有项

  @Prop({ default: [] }) checkFieldList!: []; // 当前选中的项

  @Prop({ default: false }) showFieldVisable!: boolean; // 列表是否展示

  @Prop({ default: '' }) localstorageKey!: string; // 存对应列表字段设置到localstorage里

  @Prop({ default: '' }) localstorageService!: string; // 对应微服务名称

  isIndeterminate = true; // 是否有勾选

  allLabelCheck = false; // 是否全选

  checkKeyList: string[] = []; // 选择时选中的列表

  /**
   * @description 监听当前选中的列表，判断是否全选
   */
  @Watch('checkKeyList')
  private itemChecked(newVal: any) {
    const { fieldList } = this;
    const _len = fieldList.length; // 原始列表不可能为0
    const _checkLabelLen = newVal.length;
    this.allLabelCheck = _checkLabelLen === _len;
    this.isIndeterminate = _checkLabelLen > 0 && _checkLabelLen < _len;
  }

  /**
   * @description 父组件传过来的选中的值，给子组件赋值
   */
  @Watch('checkFieldList', { immediate: true, deep: true })
  private checkFieldListChange(newVal: string[]) {
    this.checkKeyList = newVal;
  }

  /**
   * @description 全选
   */
  allChecked() {
    // 先判断当前状态是否时全选
    const { allLabelCheck, fieldList } = this;
    this.checkKeyList = [];
    if (allLabelCheck) {
      // 全选
      fieldList.forEach((item: any) => {
        this.checkKeyList.push(item.key);
      });
    }
  }

  /**
   * @description 重置
  */
  fieldReset() {
    this.checkKeyList = [];
    this.fieldList.forEach((item: any) => {
      this.checkKeyList.push(item.key);
    });
  }

  /**
   * @description 保存
   */
  @Emit('submit-field')
  fieldSubmit() {
    // 存用户设置好的字段
    const { checkKeyList, localstorageKey, localstorageService } = this;
    const keyName = getLabelJsonSaveKeyFunc(localstorageService, localstorageKey);
    const value = JSON.stringify(checkKeyList);
    if (localstorageKey && localstorageKey.length > 0) {
      saveStorege(keyName, value);
    }
    return checkKeyList;
  }

  /**
   * @description 关闭弹框
   */
  @Emit('field-cancel')
  close() {
    //
  }
}
</script>
<style lang="scss" scoped>
.dialog_close {
  cursor: pointer;
  color: $--color-light_text;
}
.popover_box {
  border-top: 1px solid $--color-border-split;
  margin-top: 10px;
  padding: 10px 10px 0;
  max-height: 500px;
  overflow: auto;
  .all_checkbox_wrap {
    margin-bottom: 10px;
  }
  .checkbox_wrap {
    width: 33%;
    margin: 0 0 6px 0;
  }
}
</style>
