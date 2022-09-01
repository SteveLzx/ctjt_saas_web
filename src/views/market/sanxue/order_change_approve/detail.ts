import { State, Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import clearCacheMixins from '@/mixins/clearCache';
import { deepClone, mapDataExChange } from '@/assets/js/common';
import {
  ORDER_IDNO_TYPE, EDUCATIONAL_SEX, ORDER_INVOICE_TYPE,
  ORDER_OPEN_INVOICE_TYPE, ORDER_PAY_TYPE, ORDER_DISCOUNT_TYPE
} from '@/enums';
import { approveStatusOpts } from '@/views/market/_enums';
import { CtjtCard, CtjtTable, CtjtRejectDialog } from '@/components';
import { detailChangeInfoTableData, detailApproveTableData } from './index';

@Component({
  components: { CtjtCard, CtjtTable, CtjtRejectDialog },
  filters: {
    auditStatusFilter(val: number): string {
      const _item = approveStatusOpts.filter((item: any) => item.id === val);
      if (_item.length === 0) {
        return '';
      }
      return _item[0].label;
    },
    certificateTypeFilter(val: number): string {
      const _item = ORDER_IDNO_TYPE.filter((item: any) => item.id === val);
      if (_item.length === 0) {
        return '';
      }
      return _item[0].label;
    },
    sexFilter(val: number): string {
      const _item = EDUCATIONAL_SEX.filter((item: any) => item.id === val);
      if (_item.length === 0) {
        return '';
      }
      return _item[0].label;
    },
    invoiceVoTypeFilter(val: number): string {
      const _item = ORDER_INVOICE_TYPE.filter((item: any) => item.id === val);
      if (_item.length === 0) {
        return '';
      }
      return _item[0].label;
    },
    invoiceVoModeFilter(val: number): string {
      const _item = ORDER_OPEN_INVOICE_TYPE.filter((item: any) => item.id === val);
      if (_item.length === 0) {
        return '';
      }
      return _item[0].label;
    },
    discountTypeFilter(val: number): string {
      const _item = ORDER_DISCOUNT_TYPE.filter((item: any) => item.id === val);
      if (_item.length === 0) {
        return '';
      }
      return _item[0].label;
    },
    payTypeFilter(val: number): string {
      const _item = ORDER_PAY_TYPE.filter((item: any) => item.id === val);
      if (_item.length === 0) {
        return '';
      }
      return _item[0].label;
    }
  }
})
export default class MarketSanXueOrderChangeApproveDetail extends mixins(clearCacheMixins) {
  @State((state) => state.base.userInfo) userInfo: any;

  @Action('order/queryApprovesDetail') private queryApprovesDetail!: (data: any) => any;

  @Action('order/putNoPassApproves') private putNoPassApproves!: (data: any) => any;

  @Action('order/putPassApproves') private putPassApproves!: (data: any) => any;

  @Action('order/putUndoApproves') private putUndoApproves!: (data: any) => any;

  auditStatus = 0;

  formData: any = {}

  // 变更内容
  tableData1 = detailChangeInfoTableData

  // 流程审核记录
  tableData2 = detailApproveTableData

  cancel() {
    this.clearCache();
    this.$router.push({ path: '/market/sxpj/order/change/approve' });
  }

  submit(type: number) {
    const { id } = this.$route.query;
    if (type === 1) {
      this.$confirm('审核撤销?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const sendData = { id };
        this.putUndoApproves(sendData).then(() => {
          this.$message.success('操作成功');
          this.cancel();
        });
      });
    }
    if (type === 2) {
      this.rejectShow = true;
    }
    if (type === 3) {
      this.$prompt('请输入通过理由', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{0,50}$/,
        inputErrorMessage: '输入内容长度为0-50'
      }).then((res: any) => {
        const { value } = res;
        if (value === null || value.length <= 50) {
          const sendData = { id, verifyOpinion: value ? `同意，${value}` : '同意' };
          this.putPassApproves(sendData).then(() => {
            this.$message.success('操作成功');
            this.cancel();
          });
        } else {
          this.$message.warning('输入内容长度为0-50');
        }
      });
    }
  }

  rejectShow = false;

  rejectCallBack(val: any) {
    if (val === false) return;
    const { remark, data } = val;
    const { id } = this.$route.query;
    const sendData = { id, verifyOpinion: remark, verifyNode: data.verifyNode };
    this.putNoPassApproves(sendData).then(() => {
      this.$message.success('操作成功');
      this.cancel();
    });
  }

  // 生命周期
  perm = {};

  async activated() {
    this.tableData1._this = this;
    const { id, orderId, auditStatus } = this.$route.query;
    this.auditStatus = Number(auditStatus);
    if (id) {
      this.queryApprovesDetail({ id, orderId, type: 4 }).then((res: any) => {
        const { scatteredDto, records } = res;
        this.tableData2.list = records;
        this.formData = scatteredDto;
        // 订单修改列表
        const _list = mapDataExChange(scatteredDto.orderLogDtoMap);
        this.tableData1.list = _list[0].options;
        this.formData.reason = _list[0].options[0] ? _list[0].options[0].reason : '';
      });
    }
    const permObj = await (this as any).$getPerm(this);
    this.perm = permObj.perm;
  }
}
