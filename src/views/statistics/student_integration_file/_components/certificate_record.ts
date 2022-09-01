import { Component, Vue } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import dayjs from 'dayjs';
import { ParamsType } from '@/type';

@Component
export default class CertificateRecord extends Vue {
  @Action('license/queryCertificateRecordList') private queryCertificateRecordList!: (data: any) => ParamsType;

  // 列表传过来单条对象数据
  private detailParams: any = {};

  // 表格配置
  private tableData: ParamsType = {
    _this: {},
    loading: false,
    selection: false,
    index: true,
    options: [],
    labels: [
      {
        key: 'applyDate',
        label: '办证日期',
        minWidth: 100,
        sortable: true,
        render(h: any, params: any) {
          const { applyDate } = params.row;
          if (!applyDate) return h('div', '');
          return h('div', dayjs(applyDate).format('YYYY-MM-DD'));
        }
      },
      {
        key: 'regionName',
        label: '片区',
        minWidth: 110,
      },
      {
        key: 'storeName',
        label: '门店',
        minWidth: 110,
      },
      {
        key: 'batchNo',
        label: '批次号',
        minWidth: 120,
      },
      {
        key: 'subject',
        label: '办证科目',
        minWidth: 100,
      },
      {
        key: 'status',
        label: '办证状态',
        minWidth: 80,
      },
      {
        key: 'remark',
        label: '备注',
        minWidth: 130,
        render(h: any, params: any) {
          const {
            remark, deletedReason, operationName, deletedTime
          } = params.row;
          let _text = remark;
          if (deletedReason) _text = `已删除：${deletedReason} ${dayjs(deletedTime).format('YYYYMMDD')} ${operationName}`;
          return h('el-popover', {
            props: {
              placement: 'top-start',
              width: '300',
              trigger: 'hover',
              content: _text,
            },
            scopedSlots: {
              reference: () => h('p', _text),
            },
          });
        }
      },
      {
        key: 'operationName',
        label: '操作人',
      },
      {
        key: 'operationDate',
        label: '操作时间',
        minWidth: 150,
        sortable: true,
        render(h: any, params: any) {
          const { operationDate } = params.row;
          if (!operationDate) return h('div', '');
          return h('div', dayjs(operationDate).format('YYYY-MM-DD HH:mm:ss'));
        }
      },
    ],
    list: [],
    selectionList: [],
    setCellClassName: (val: any) => {
      const { status } = val.row;
      return (status === '不合格' || status === '缺考') ? 'td_text_red' : '';
    }
  };

  async queryList() {
    const { id } = this.detailParams;
    try {
      const body = await this.queryCertificateRecordList({ orderId: id });
      this.tableData.list = body;
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = true;
    }
  }

  private init() {
    let { obj } = this.$route.query;
    if (typeof obj === 'string') {
      obj = decodeURIComponent(obj);
      this.detailParams = JSON.parse(obj);
      this.queryList();
    }
  }

  activated() {
    this.init();
  }

  mounted() {
    this.init();
  }
}
