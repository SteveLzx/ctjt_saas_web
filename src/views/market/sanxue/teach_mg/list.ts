import { State, Action } from 'vuex-class';
import { Watch } from 'vue-property-decorator';
import Component, { mixins } from 'vue-class-component';
import {
  SearchTable, CtjtTable, CtjtPagination, CtjtCard
} from '@/components';
import { deepClone, timestampSizeCompare } from '@/assets/js/common';
import { drawSearchForm } from '@/assets/js/search_table';
import { VueComponentParent } from '@/type';
import ctjtPaginationMixins from '@/mixins/pagination';
import {
  listSearchForm, listTableData, listFormData, listFormRules
} from './index';

@Component({
  components: {
    SearchTable,
    CtjtTable,
    CtjtPagination,
    CtjtCard
  }
})
export default class MarketSanXueTeachMg extends mixins(ctjtPaginationMixins) {
  @State(state => state.base.userInfo) private userInfo: any;

  @Action('base/queryGroupMechanismData') private queryGroupMechanismData!: (data: any) => any;

  @Action('assignment/queryScatteredCoach') private queryScatteredCoach!: () => any;

  @Action('assignment/queryAppointLogList') private queryAppointLogList!: (data: any) => any;

  @Action('order/queryScatteredOrderByKeyword') private queryScatteredOrderByKeyword!: (data: any) => any;

  @Action('order/queryFuzzySearchStudentNameList') private queryFuzzySearchStudentNameList!: (data: any) => any;

  @Action('assignment/appointLearnDriving') private appointLearnDriving!: (data: any) => any;

  @Action('assignment/deleteSchedulingBatchAppointInfo') private deleteSchedulingBatchAppointInfo!: (data: any) => any;

  @Action('order/queryScatteredCheckOrderIsRefund') private queryScatteredCheckOrderIsRefund!: (data: any) => any;

  // 搜索
  searchForm = deepClone(listSearchForm)

  // 搜索下拉框筛选
  private _setFormSelectFunc(type: string, data: any) {
    if (data && data.length > 0) {
      const _data = deepClone(data);
      _data.forEach((item: any) => {
        const _item = item;
        _item.label = _item.name;
      });
      if (type === 'region') {
        this.searchForm.selectList[0].options = _data;
      }
      if (type === 'store') {
        this.searchForm.selectList[1].options = _data;
      }
    }
  }

  // 搜索筛选框选择回调
  searchSelectChange(val: any) {
    const { value, key } = val;
    if (key === 'regionId') {
      this.searchForm.selectList[1].options = [];
      this.searchForm.selectList[1].value = '';
      if (value) {
        this.selectFunc('store', value);
      }
    }
  }

  // 下拉框请求参数处理
  private async selectFunc(type: string, id: string) {
    const data = await this.queryGroupMechanismData({ pid: id });
    this._setFormSelectFunc(type, data);
  }

  // 列表搜索 操作按钮回调
  public searchTableCallBack(key: string) {
    if (key === 'search' || key === 'reset') {
      this.paginationData.current = 1;
      this.queryList();
    }
  }

  // 列表
  tableData = deepClone(listTableData)

  // 列表操作回调
  tableOptionCallback(val: any) {
    const { id } = val;
    const { selectionList } = this.tableData;
    const _len = selectionList.length;
    if (id === 1) {
      this.teachLogsDrawer = true;
      return;
    }
    if (_len === 0) {
      this.$message.warning('请先勾选数据！');
      return;
    }
    if (id === 2) {
      // 删除
      const list: any[] = [];
      const ids: string[] = [];
      selectionList.forEach((item: any) => {
        const {
          id: iid, orderId, seq, studentName
        } = item;
        list.push({ orderId, seq, studentName });
        ids.push(iid);
      });
      this.queryScatteredCheckOrderIsRefund(list).then((res: any) => {
        if (res === undefined) {
          this.$confirm('确定将学员带教记录删除?', '删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(async () => {
            await this.deleteSchedulingBatchAppointInfo(ids);
            this.$message.success('删除成功');
            this.queryList();
          });
        } else {
          const textObj: any = {};
          const textList: string[] = [];
          res.forEach((item: any) => {
            const { orderId } = item;
            if (!(orderId in textObj)) {
              textObj[orderId] = item;
            }
          });
          Object.keys(textObj).forEach(key => {
            const { seq, studentName } = textObj[key];
            textList.push(`${studentName}：${seq}`);
          });
          this.$confirm(`${textList.join('；')}存在退费单，请先撤回或不通过退费单，再删除！`, '提示');
        }
      });
    }
  }

  tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  // 排序参数对象
  sortSearchFormDeep: any = {
    sortByAppointDate: 0, // 类型排序
  }

  sortSearchForm = deepClone(this.sortSearchFormDeep);

  // 列表排序回调
  tableSortChange(data: any) {
    const { prop, order } = data;
    const returnStatusFunc = (res: any) => {
      if (res === 'ascending') return 1;
      if (res === 'descending') return 2;
      return 0;
    };
    this.sortSearchForm = deepClone(this.sortSearchFormDeep);
    switch (prop) {
      case 'appointDate':
        this.sortSearchForm.sortByAppointDate = returnStatusFunc(order);
        break;
      default:
        break;
    }
    this.queryList();
  }

  // 列表数据查询
  async queryList() {
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    const { startDate, endDate } = _data;
    // 判断时间
    if (startDate && endDate && timestampSizeCompare(startDate, endDate)) {
      this.$message.warning('开始时间不能大于结束时间');
      return;
    }
    if (new Date(endDate).getTime() - new Date(startDate).getTime() > 30 * 24 * 60 * 60 * 1000) {
      this.$message.warning('最长支持搜索30天');
      return;
    }
    const sendData = {
      ..._data,
      ...this.sortSearchForm
    };
    this.tableData.loading = true;
    this.queryAppointLogList(sendData).then((res: any) => {
      const {
        data, current, total
      } = res;
      this.tableData.list = data || [];
      this.paginationData.current = current;
      this.paginationData.total = total;
    }).finally(() => {
      this.tableData.loading = false;
    });
  }

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

  // 新增带教记录b================================================================
  teachLogsDrawer = false;

  keyword = ''

  orderList: any[] = []

  // 列表选中单条回调
  chooseOrder(data: any) {
    Object.keys(data).forEach((key: string) => {
      this.formData[key] = data[key];
    });
    const {
      name, idNo, mobile, id
    } = data;
    this.formData.studentIdNo = idNo; // 学员证件号码
    this.formData.studentMobile = mobile; // 学员手机号
    this.formData.studentName = name; // 学员姓名
    this.formData.orderId = id; // 订单id
  }

  // 搜索学员姓名
  async queryCarNumberSearch(val: string, cb: any) {
    if (!val) {
      cb([]);
      return;
    }
    const body = await this.queryFuzzySearchStudentNameList({ keyword: val });
    cb(body);
  }

  hanldCarNumberSelect(val: any) {
    const { idNo } = val;
    this.queryScatteredOrderByKeyword({ keyword: idNo }).then((res: any) => {
      this.orderList = res || [];
    });
  }

  // 计算当前学时
  get currentPeriod() {
    if (Number(this.formData.classesType) !== 1) {
      return this.formData.classesType;
    }
    const { startTime, endTime } = this.formData;
    if (startTime && endTime) {
      return endTime.split(':')[0] - startTime.split(':')[0];
    }
    return '';
  }

  @Watch('formData.endTime')
  endTimeChange() {
    const {
      startTime,
      endTime
    } = this.formData;
    if (!endTime || !startTime) return;
    const start = startTime.split(':');
    const end = endTime.split(':');
    if (start[1] !== end[1]) {
      this.$message.warning('必须以1小时为最小单位进行选择');
    }
  }

  assignCoachOpts = []

  hanldChangeCoachName(val: string) {
    const list: any = this.assignCoachOpts.filter((item: any) => item.name === val);
    this.formData.coachId = list[0] ? list[0].id : null;
  }

  formData = deepClone(listFormData)

  formRules = listFormRules

  handleCloseTeachLogs() {
    this.$confirm('弹窗关闭数据不会保留，确定关闭?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      this.resetForm();
    });
  }

  submitLoading= false;

  handleSubmitAdd() {
    (this.$refs.teachLogsFormRef as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        const sendData = deepClone(this.formData);
        const { startTime, endTime } = sendData;
        const start = startTime.split(':');
        const end = endTime.split(':');
        if (start[1] !== end[1]) {
          this.$message.warning('必须以1小时为最小单位进行选择');
          return;
        }
        sendData.appointDate = this.$dayjs(sendData.appointDate).format('YYYY-MM-DD');
        delete sendData.id;
        this.submitLoading = true;
        this.appointLearnDriving(sendData).then(() => {
          this.$message.success('添加成功');
          this.queryList();
          this.resetForm();
        }).finally(() => {
          this.submitLoading = false;
        });
      }
    });
  }

  resetForm() {
    (this.$refs.teachLogsFormRef as any).resetFields();
    const deepFormData = deepClone(listFormData);
    Object.keys(this.formData).forEach((key: string) => {
      this.formData[key] = deepFormData[key];
    });
    this.keyword = '';
    this.orderList = [];
    this.teachLogsDrawer = false;
  }

  // 新增带教记录end==============================================================

  init() {
    const { drivingSchoolId } = this.userInfo;
    this.selectFunc('region', drivingSchoolId);
    this.queryList();
    // 学车教练
    this.queryScatteredCoach().then((res: any) => {
      this.searchForm.selectList[2].options = res;
      this.assignCoachOpts = res;
    });
  }

  async mounted() {
    this.init();
  }

  async created() {
    const permObj = await this.$getPerm(this, this.tableData.options, this.searchForm.buttonList);
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
  }
}
