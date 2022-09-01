<template>
  <el-dialog
    :title="title"
    :visible.sync="selectDialogVisible"
    width="450px"
    :before-close="handleButtonClick"
  >
    <el-form label-width="120px">
      <el-form-item :label="accreLabel">
        <el-select
          v-model="selectOptions"
          placeholder="请选择"
          value-key="id"
          @change="selectChange"
        >
          <el-option
            v-for="item in selectList"
            :key="item.id"
            :label="item.label"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="accreSecondLabel" v-if="selectOptions.children">
        <el-select v-model="childrenId" placeholder="请选择">
          <el-option
            v-for="item in selectOptions.children"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="text-align: center">
      <el-button type="primary" @click="handleButtonClick('submit')"
        >下一步</el-button
      >
    </div>
  </el-dialog>
</template>
<script lang="ts">
import {
  Prop, Vue, Component, Emit, Watch
} from 'vue-property-decorator';
import { deepClone } from '@/assets/js/common';

@Component
export default class CtjtSelectDialog extends Vue {
  @Prop({ default: {} }) selectList!: any;

  @Prop({ default: false }) selectDialogVisible?: boolean;

  @Prop({ default: '' }) title?: string;

  @Prop({ default: '' }) accreLabel?: string;

  @Prop({ default: '' }) accreSecondLabel?: string;

  private selectOptions: any = {};

  private childrenId = null;

  @Emit('button-call')
  handleButtonClick(key?: string) {
    const options = deepClone(this.selectOptions);
    this.selectOptions = this.selectList.length > 0 ? this.selectList[0] : null;
    if (key && typeof key === 'string') {
      const { id, label } = options;
      return {
        key: 'submit',
        id,
        label,
        childId: this.childrenId,
      };
    }
    return { key: 'close', id: null };
  }

  selectChange(val: any) {
    if (val.children) {
      this.childrenId = val.children[0].id;
    }
  }

  @Watch('selectList', { deep: true, immediate: true })
  selectListChange(val: any) {
    this.selectOptions = val.length > 0 ? val[0] : [];
    return val;
  }
}
</script>
