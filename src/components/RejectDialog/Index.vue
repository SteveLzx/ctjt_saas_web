<template>
  <el-dialog
    title="驳回"
    :visible.sync="dialogVisible"
    width="35%"
    :before-close="handleClose">
    <el-form>
      <el-form-item label="驳回至："></el-form-item>
      <el-table
        class="rejectTable"
        ref="rejectTableRef"
        :data="tableData"
        border
        highlight-current-row
        @selection-change="handleSelectionChange"
        style="width: 100%">
      <el-table-column type="selection" :align="'center'" width="50" :selectable="disableSelectable"></el-table-column>
        <el-table-column prop="verifyNode" label="审批环节" :align="'center'"></el-table-column>
        <el-table-column  prop="verifyUser" label="审核人" :align="'center'" width="180"></el-table-column>
        <el-table-column prop="status" label="审核操作" :align="'center'" width="180" :formatter="verifyOperationFormatter"></el-table-column>
      </el-table>
      <el-form-item label="驳回原因：" prop="remark">
        <el-input type="textarea" v-model.trim="remark" maxlength="50" placeholder="限制50字以内"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="handleClose()">取 消</el-button>
      <el-button type="primary" @click="handleSubmit()">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script lang='ts'>
import { Action } from 'vuex-class';
import {
  Prop, Vue, Component, Emit, Watch
} from 'vue-property-decorator';

@Component
export default class CtjtRejectDialog extends Vue {
  @Action('order/querygetRejectNodeById') private querygetRejectNodeById!: (data: any) => any;

  @Action('order/queryRejectNodes') private queryRejectNodes!: (data: any) => any;

  @Action('order/queryRefundRejectNodesById') private queryRefundRejectNodesById!: (data: any) => any;

  @Action('license/queryToHistoryApproveRejectNodes') private queryToHistoryApproveRejectNodes!: (data: any) => any;

  @Action('order/queryRejectNodeById') private queryRejectNodeById!: (data: any) => any;

  @Prop({ default: '' }) id!: string;

  @Prop({ default: 0 }) type!: number; // 1订单退费申请，2转车型、转班型、订单修改审批;4转历史

  @Prop({ default: false })
  dialogVisible!: boolean;

  @Watch('dialogVisible')
  async handleWatchDialogVisible(val: boolean) {
    if (val) {
      const { id, type } = this;
      switch (type) {
        case 1:
          this.tableData = await this.querygetRejectNodeById({ id });
          break;
        case 2:
          this.tableData = await this.queryRejectNodes({ id });
          break;
        case 3:
          this.tableData = await this.queryRefundRejectNodesById({ id });
          break;
        case 4:
          this.tableData = await this.queryToHistoryApproveRejectNodes({ id });
          break;
        case 5:
          this.tableData = await this.queryRejectNodeById({ id });
          break;
        default:
          break;
      }
    } else {
      this.tableData = [];
      this.remark = '';
    }
  }

  tableData = []

  disableSelectable(row: any, index: number) {
    const { status } = row;
    if (status === 0) {
      return false;
    }
    return true;
  }

  verifyOperationFormatter(row: any) {
    const { status } = row;
    return status === 1 ? '通过' : '';
  }

  remark = ''

  selectionList: any[] = []

  handleSelectionChange(val: any[]) {
    if (val.length > 1) {
      this.$message.warning('请单选一个驳回节点');
      (this.$refs.rejectTableRef as any).clearSelection();
    }
    this.selectionList = val.length === 1 ? val : [];
  }

  handleClose() {
    this.$emit('update:dialog-visible', false);
  }

  @Emit('on-submit')
  handleSubmit() {
    const { selectionList, remark } = this;
    if (selectionList.length === 0) {
      this.$message.warning('请单选一个驳回节点');
      return false;
    }
    if (remark === '') {
      this.$message.warning('请输入驳回原因');
      return false;
    }
    const data = {
      data: selectionList[0],
      remark
    };
    this.handleClose();
    return data;
  }
}
</script>
<style lang="scss" scoped>
  ::v-deep .rejectTable .el-table__header-wrapper {
    th:first-child{
      .cell{
        width: 50px;
        .el-checkbox{
          display:none
        }
        &:after{
          content:'操作'
        }
      }
    }
  }

</style>
