import { Component, Vue } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import dayjs from 'dayjs';
import { ParamsType } from '@/type';

@Component
export default class LogRecord extends Vue {
  @Action('license/queryChangeLogRecordList') private queryChangeLogRecordList!: (data: any) => ParamsType;

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
        key: 'createdName',
        label: '申请人',
      },
      {
        key: 'createdTime',
        label: '申请日期',
        minWidth: 100,
        render(h: any, params: any) {
          const { createdTime } = params.row;
          if (!createdTime) return h('div', '');
          return h('div', dayjs(createdTime).format('YYYY-MM-DD'));
        }
      },
      {
        key: 'content',
        label: '修改内容',
        minWidth: 130,
        render(h: any, params: any) {
          const { content } = params.row;
          return h('el-popover', {
            props: {
              placement: 'top-start',
              width: '300',
              trigger: 'hover',
              content,
            },
            scopedSlots: {
              reference: () => h('p', content),
            },
          });
        }
      },
    ],
    list: [],
    selectionList: [],
  };

  async queryList() {
    const { id } = this.detailParams;
    try {
      const body = await this.queryChangeLogRecordList({ orderId: id });
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
