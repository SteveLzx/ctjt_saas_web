<template>
  <div>
    <el-dialog
      :title="`${title}办证数据`"
      width="1000px"
      :visible.sync="certificateResultVisible"
      :before-close="handleClose"
    >
      <el-form label-width="120px">
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item label="办证科目：" class="ctjt_form_item_class">
              <span>{{ importData.type }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="importData.type !== '划拨监管学时' && importData.type !== '转出'">
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
              <span>{{ importData.importSuccess }} 条</span>
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
                <span>（失败数据不会存入系统和批次号中）</span>
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
        <!-- <div
          class="batch_wrap"
          v-if="
            importData.type !== '资金监管存入' && importData.type !== '监管学时'
          "
        >
          所有批次号信息均可在【批次号管理】中增删改查
        </div> -->
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
export default class CtjtCertificateResultDialog extends Vue {
  @Prop({ default: false }) certificateResultVisible!: boolean;

  @Prop({ default: {} }) importData!: ParamsType;

  @Prop({ default: '' }) title?: string;

  @Emit('button-call')
  private btnClick(val: string) {
    return val;
  }

  @Emit('button-call')
  handleClose() {
    return 'close';
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
  max-height: 500px;
  span {
    margin-right: 10px;
  }
}
.dialog-footer {
  text-align: center;
  .batch_wrap {
    color: $--color-warning-text;
    padding: 15px 0;
  }
}
::v-deep .el-form-item__label {
  font-weight: 600;
}
</style>
