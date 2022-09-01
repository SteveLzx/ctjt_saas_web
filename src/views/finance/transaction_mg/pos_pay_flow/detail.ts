import Component, { mixins } from 'vue-class-component';
import { Action } from 'vuex-class';
import dayjs from 'dayjs';
import { ParamsType } from '@/type';
import ctjtPaginationMixins from '@/mixins/pagination';
import clearCacheMixins from '@/mixins/clearCache';

const tableLabels = [
  {
    key: 'referenceNo',
    label: '交易参考号',
  },
  {
    key: 'payTime',
    label: '交易时间',
    render(h: any, params: any) {
      const { payTime } = params.row;
      if (!payTime) return h('div', '');
      return h('div', dayjs(payTime).format('YYYY-MM-DD HH:mm:ss'));
    }
  },
  {
    key: 'bankNo',
    label: '刷卡银行卡号',
  },
  {
    key: 'bankName',
    label: '发卡银行',
  },
  {
    key: 'incomeAmount',
    label: '交易金额',
  },
];
@Component
export default class FinancePosPayFlowDetail extends mixins(ctjtPaginationMixins, clearCacheMixins) {
  @Action('finance/queryPosPayFlowDetail') private queryPosPayFlowDetail!: (data: any) => ParamsType;

  // 列表传过来单条对象数据
  private detailParams: any = {};

  // 表格配置
  private tableData: ParamsType = {
    _this: {},
    loading: false,
    selection: false,
    index: true,
    options: [],
    labels: tableLabels,
    list: [],
    selectionList: [],
  };

  // 列表分页
  public tableSizeChange(val: number) {
    this.paginationData.pageSize = val;
    this.paginationData.current = 1;
    this.queryList();
  }

  public tableCurrentChange(val: number) {
    this.paginationData.current = val;
    this.queryList();
  }

  async queryList() {
    const {
      posId, beginDate, endDate, posTerminalNo
    } = this.detailParams;
    const { paginationData } = this;
    // 处理数据
    const sendData = {
      posId,
      beginDate,
      endDate,
      posTerminalNo,
      current: paginationData.current,
      pageSize: paginationData.pageSize,
    };
    try {
      const body = await this.queryPosPayFlowDetail(sendData);
      const { data, current, total } = body;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = true;
    }
  }

  activated() {
    let { obj } = this.$route.query;
    if (typeof obj === 'string') {
      obj = decodeURIComponent(obj);
      this.detailParams = JSON.parse(obj);
      this.queryList();
    }
  }
}
