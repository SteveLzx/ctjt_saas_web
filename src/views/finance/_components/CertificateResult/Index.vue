<template>
  <div>
    <el-dialog
      :title="title"
      width="1000px"
      :visible.sync="visible"
      :before-close="handleClose"
    >
      <el-form label-width="120px">
        <el-row :gutter="8">
          <el-col :span="24" v-if="importData.batchNo">
            <el-form-item label="批次号：" class="ctjt_form_item_class">
              <span>{{ batchNoFilter(importData.batchNo) }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="24">
            <el-form-item
              :label="`${title}成功：`"
              class="ctjt_form_item_class"
            >
              <span>{{ importData.importSuccess }} 条 </span>
              <span v-if="importData.importSuccessTotalMoney"
                >，{{ importData.importSuccessTotalMoney }}</span
              >
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="24">
            <el-form-item
              :label="`${title}失败：`"
              class="ctjt_form_item_class"
            >
              <div>
                <span>{{ importData.imporError }}条</span>
                <span v-if="importData.batchNo"
                  >（失败数据不会存入系统和批次号中）</span
                >
                <span v-else>（失败数据不会存入系统）</span>
              </div>
              <div class="err-container">
                {{ importData.failLogDtoList | failLogDtoListFilter }}
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="btnClick('close')">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import {
  Prop, Vue, Component, Emit
} from 'vue-property-decorator';
import { ParamsType } from '@/type';

@Component({
  filters: {
    failLogDtoListFilter(val: Array<any>) {
      const _textArr: any = [];
      if (val) {
        val.forEach((item) => {
          _textArr.push(item);
        });
      }
      return _textArr.join(';');
    },
  },
})
export default class CtjtFinanceResultDialog extends Vue {
  @Prop({ default: false }) visible!: boolean;

  @Prop({ default: {} }) importData!: ParamsType;

  @Prop({ default: '' }) title?: string;

  @Emit('button-call')
  private btnClick(val: string) {
    return val;
  }

  @Emit('button-call')
  handleClose() {
    //
  }

  batchNoFilter(val: any) {
    const { importSuccess } = this.importData;
    const _text = Number(importSuccess) === 0 ? '' : val;
    return _text;
  }
}
</script>
<style lang="scss" scoped>
.err-container {
  // word-break: keep-all;
  max-height: 500px;
  span {
    margin-right: 10px;
  }
}
.dialog-footer {
  text-align: center;
}
::v-deep .el-form-item__label {
  font-weight: 600;
}
</style>
