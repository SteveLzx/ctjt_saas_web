import { Action, State } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { deepClone, REG_PRICE_OR_ZONE } from '@/assets/js/common';
import { ParamsType, VueComponentParent } from '@/type';
import { drawSearchForm } from '@/assets/js/search_table';
import { setTableLabels, marginTableLabels } from '@/views/market/_common/common';
import { STUDY_STAGE } from '@/enums';
import { approveStatusOpts } from '@/views/market/_enums';
import ctjtPaginationMixins from '@/mixins/pagination';
import ctjttablefieldMixins from '@/mixins/tablefield';
import {
  SearchTable, CtjtTable, CtjtPagination, CtjtSetField
} from '@/components';

@Component({
  components: {
    SearchTable, CtjtTable, CtjtPagination, CtjtSetField
  }
})
export default class MarketOrderApprovalTurnClasstype extends mixins(ctjtPaginationMixins, ctjttablefieldMixins) {
  @State(state => state.base.userInfo) private userInfo: any;

  @Action('base/queryGroupMechanismData') private queryGroupMechanismData!: (data: any) => any;

  @Action('order/queryApprovesList') private queryApprovesList!: (data: any) => ParamsType;

  @Action('order/queryApprovesDetail') private queryApprovesDetail!: (data: any) => ParamsType;

  @Action('order/putNoPassApproves') private putNoPassApproves!: (data: any) => ParamsType;

  @Action('order/putPassApproves') private putPassApproves!: (data: any) => ParamsType;

  @Action('order/putUndoApproves') private putUndoApproves!: (data: any) => ParamsType;

  @Action('order/queryOrderFuzzyUsers') private queryOrderFuzzyUsers!: (data: any) => any;

  @Action('order/queryOrderPaysList') private queryOrderPaysList!: (data: any) => any;

  @Action('order/addApprovesChangeClasses') private addApprovesChangeClasses!: (data: any) => any;

  @Action('order/editApproves') private editApproves!: (data: any) => any;

  @Action('order/deleteApproves') private deleteApproves!: (data: any) => any;

  @Action('goods/queryClassesInfoList') private queryClassesInfoList!: (data: any) => any;

  // ????????????
  dialogName = '';

  /** ???????????????????????? */
  submitField(val: any) {
    // ??????????????????????????????
    this.dialogName = '';
    this.currentLabelKeyList = val;
    this.initSetTableLabel();
  }

  /**
   * @description ?????????????????????
   */
  private initSetTableLabel() {
    const { tableLabelType } = this;
    const _originalLabelList = marginTableLabels(tableLabelType);
    this.originalLabelList = _originalLabelList;
    // ???????????????????????????????????????????????????????????????????????????????????????????????????
    const _currentLabelList = setTableLabels(_originalLabelList, tableLabelType);
    this.tableData.labels = _currentLabelList;
    this.currentLabelKeyList = [];
    _currentLabelList.forEach((item: any) => {
      this.currentLabelKeyList.push(item.key);
    });
  }

  // ?????????????????????
  private searchForm: ParamsType = {
    inputList: [
      {
        label: '?????????',
        key: 'keyword',
        type: 'text',
        value: '',
        width: 280,
        placeholder: '????????????????????????????????????????????????',
        clearable: true,
      },
    ],
    datePickerList: [
      {
        label: '????????????',
        key: 'applyDate',
        value: '',
        type: 'date',
        placeholder: '?????????',
        width: 140,
      },
    ],
    selectList: [
      {
        label: '??????',
        key: 'regionId',
        value: '',
        width: 160,
        placeholder: '?????????',
        multiple: false,
        clearable: true,
        options: [],
        customOptions: {
          value: 'id',
          label: 'name'
        }
      },
      {
        label: '??????',
        key: 'storeId',
        value: '',
        width: 160,
        placeholder: '?????????',
        multiple: false,
        clearable: true,
        options: [],
        customOptions: {
          value: 'id',
          label: 'name'
        }
      },
      {
        label: '????????????',
        key: 'auditStatus',
        value: '',
        placeholder: '?????????',
        multiple: false,
        clearable: true,
        width: 160,
        options: approveStatusOpts.filter((item: any) => item.id !== 2)
      },
    ],
    checkedList: [
      {
        key: 'isMe',
        value: true,
        label: '???????????????',
      },
    ],
    buttonList: [
      {
        label: '??????',
        key: 'search',
        type: 'primary',
        path: 'btn_search'
      },
      {
        label: '??????',
        key: 'reset',
        path: 'btn_search'
      },
    ]
  }

  // ???????????? ??????????????????
  private searchTableCallBack(key: string) {
    if (key === 'search' || key === 'reset') {
      this.paginationData.current = 1;
      if (key === 'reset') {
        this.searchForm.selectList[1].options = [];
      }
      this.queryList();
    }
  }

  /** ??????????????????????????? */
  private async searchSelectChange(val: ParamsType) {
    const { value, key } = val;
    if (key === 'regionId') {
      this.searchForm.selectList[1].options = [];
      this.searchForm.selectList[1].value = '';
      if (value) {
        const data = await this.queryGroupMechanismData({ pid: value });
        this.searchForm.selectList[1].options = data;
      }
    }
  }

  // ????????????
  private tableData: ParamsType = {
    _this: {},
    loading: false,
    index: true,
    labels: [],
    list: [],
    selection: true,
    selectionList: [],
    options: [
      {
        id: 1,
        label: '??????',
        path: 'btn_add'
      },
      {
        id: 2,
        label: '??????',
        path: 'btn_delete',
        type: 'danger'
      },
    ],
  }

  // ?????????????????????????????????
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  async tableOptionCallback(val: any) {
    const { id: tabId } = val;
    if (tabId === 1) {
      this.jumpDetail();
      return;
    }
    const { selectionList } = this.tableData;
    const _len = selectionList.length;
    if (_len === 0) {
      this.$message.warning('??????????????????');
      return;
    }
    if (tabId === 2) {
      const list = selectionList.filter((item: any) => item.auditStatus !== 3);
      if (list.length > 0) {
        this.$message.warning('????????????????????????????????????????????????????????????');
      } else {
        this.$confirm(selectionList.length > 1 ? '?????????????' : '?????????????', '??????', {
          confirmButtonText: '??????',
          cancelButtonText: '??????',
          type: 'warning'
        }).then(async () => {
          const ids: string[] = [];
          selectionList.forEach((item: any) => {
            ids.push(item.id);
          });
          await this.deleteApproves(ids);
          this.$message.success('????????????');
          this.queryList();
        });
      }
    }
  }

  // ????????????
  jumpDetail(id?: string, orderId?: string, type = '0', auditStatus = '0') {
    this.$router.push({
      path: '/market/order_approval/turn_classtype/detail',
      query: {
        id, orderId, type, auditStatus
      }
    });
  }

  // ????????????
  public tableSizeChange(val: number) {
    this.paginationData.pageSize = val;
    this.paginationData.current = 1;
    this.queryList();
  }

  public tableCurrentChange(val: number) {
    this.paginationData.current = val;
    this.queryList();
  }

  private async queryList() {
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const sendData = {
      ..._data,
      type: 2
    };
    const body = await this.queryApprovesList(sendData);
    const {
      data, current, total
    } = body;
    this.tableData.list = data;
    this.paginationData.current = current;
    this.paginationData.total = total;
  }

  private async initSearch() {
    const { drivingSchoolId } = this.userInfo;
    const data = await this.queryGroupMechanismData({ pid: drivingSchoolId });
    this.searchForm.selectList[0].options = data;
  }

  async mounted() {
    this.tableData._this = this;
    this.tableLabelType = 'MARKET_ORDER_APPROVAL_TURN_CLASSTYPE_LIST_LABEL';
    // this.queryList();
    this.initSetTableLabel();
    this.initSearch();
  }

  async activated() {
    this.queryList();
  }

  perm = {};

  async created() {
    const permObj = await (this as any).$getPerm(this, this.tableData.options, this.searchForm.buttonList);
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
    this.perm = permObj.perm;
  }
}
