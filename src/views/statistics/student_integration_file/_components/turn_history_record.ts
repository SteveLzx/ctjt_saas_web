import { Component, Vue } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import dayjs from 'dayjs';
import { ParamsType } from '@/type';

@Component
export default class TurnHistoryRecord extends Vue {
  @Action('license/queryTurnHistoryRecord') private queryTurnHistoryRecord!: (data: any) => ParamsType;

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
        key: 'operate',
        label: '操作',
      },
      {
        key: 'reason',
        label: '原因',
        minWidth: 110,
      },
      {
        key: 'remark',
        label: '备注',
        minWidth: 130,
        render(h: any, params: any) {
          const { remark } = params.row;
          return h('el-popover', {
            props: {
              placement: 'top-start',
              width: '300',
              trigger: 'hover',
              remark,
            },
            scopedSlots: {
              reference: () => h('p', remark),
            },
          });
        }
      },
      {
        key: 'createdTime',
        label: '操作时间',
        minWidth: 100,
        render(h: any, params: any) {
          const { createdTime } = params.row;
          if (!createdTime) return h('div', '');
          return h('div', dayjs(createdTime).format('YYYY-MM-DD HH:mm:ss'));
        }
      },
      {
        key: 'operationName',
        label: '操作人',
      },
    ],
    list: [],
    selectionList: [],
  };

  async queryList() {
    const { id } = this.detailParams;
    try {
      const body = await this.queryTurnHistoryRecord({ orderId: id });
      this.tableData.list = body;
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = true;
    }
  }

  mounted() {
    let { obj } = this.$route.query;
    if (typeof obj === 'string') {
      obj = decodeURIComponent(obj);
      this.detailParams = JSON.parse(obj);
      this.queryList();
    }
  }
}
