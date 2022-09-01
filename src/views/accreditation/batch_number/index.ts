import { Action } from 'vuex-class';
import { Watch } from 'vue-property-decorator';
import Component, { mixins } from 'vue-class-component';
import {
  ParamsType, TableOptionsValue, VueComponentParent
} from '@/type';
import { BATCH_NUMBER_LIST } from '@/views/accreditation/_common/tablelabel';
import download from '@/assets/js/download';
import { deepClone, drivingSchool, timestampSizeCompare } from '@/assets/js/common';
import ctjtPaginationMixins from '@/mixins/pagination';
import { drawSearchForm } from '@/assets/js/search_table';
import accreditationSeachTableMixins from '../_mixins/seachTable';
import { templateDownloadProps, huizhouTemplateDownloadProps } from '../_common/template_download';

const name = '批次号管理';
// 办证科目-广仁
const accreditionSubject = [
  {
    label: '无纸化采集',
    id: 1,
    code: 'paperless_collect',
  },
  {
    label: '考场受理',
    id: 5,
    code: 'exam_acceptance',
  },
  {
    label: '学科培训',
    id: 10,
    code: 'subject_training',
  },
  {
    label: '考试批复',
    id: 11,
    code: 'exam_approval',
  },
  {
    label: '考试交费',
    id: 12,
    code: 'exam_fee',
  },
  {
    label: '考试结果',
    id: 13,
    code: 'exam_results',
  },
  {
    label: '成绩单',
    id: 14,
    code: 'report_card',
  },
  {
    label: '档案归档/退档',
    id: 15,
    code: 'file_filing',
  },
];
// 办证科目-惠州
const huizhouAccreditionSubject = [
  {
    label: '场点交表',
    id: 2,
    code: 'site_delivery_table',
  },
  {
    label: '牌证收表',
    id: 3,
    code: 'license_receipt_form',
  },
  {
    label: '车管所送审',
    id: 4,
    code: 'vehicle_approval',
  },
  {
    label: '考场受理',
    id: 5,
    code: 'exam_acceptance',
  },
  {
    label: '上课情况',
    id: 6,
    code: 'class_situation',
  },
  {
    label: '考试批复',
    id: 11,
    code: 'exam_approval',
  },
  {
    label: '考试交费',
    id: 12,
    code: 'exam_fee',
  },
  {
    label: '考试结果',
    id: 13,
    code: 'exam_results',
  },
  {
    label: '成绩单',
    id: 14,
    code: 'report_card',
  },
  {
    label: '档案归档/退档',
    id: 15,
    code: 'file_filing',
  },
];
@Component
export default class AccreditationBatchNumberList extends mixins(accreditationSeachTableMixins, ctjtPaginationMixins) {
  @Action('license/queryBatchNoList') private queryBatchNoList!: (data: any) => any;

  // 列表搜索项配置
  public searchForm: ParamsType = {
    selectTimeList: [
      {
        label: '',
        clearable: true,
        select: {
          key: '',
          placeholder: '',
          value: 1,
          width: 110,
          options: [
            {
              id: 1,
              label: '操作日期',
            }
          ],
        }
      },
    ],
    datePickerList: [
      {
        label: '',
        key: 'beginDate',
        value: '',
        type: 'date',
        placeholder: '开始时间',
        width: 140,
      },
      {
        label: '-',
        key: 'endDate',
        value: '',
        type: 'date',
        placeholder: '结束时间',
        width: 140,
      }
    ],
    inputList: [
      {
        label: '批次号',
        key: 'batchNo',
        type: 'text',
        value: '',
        width: 250,
        placeholder: '请输入批次号',
        clearable: true,
      },
    ],
    autocompleteList: [
      {
        label: '关键字',
        key: 'keyword',
        value: '',
        placeholder: '请输入学员姓名、证件号',
        width: 320,
        maxlength: 60,
        clearable: true,
        options: [],
      },
    ],
    selectList: [
      {
        label: '办证科目',
        key: 'subjects',
        value: '',
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        width: 150,
        options: [],
        customOptions: {
          value: 'label',
          label: 'label',
        },
      },
    ],
    checkedList: [],
    buttonList: [
      {
        label: '查询',
        key: 'search',
        type: 'primary',
        plain: false,
        path: 'btn_search'
      },
      {
        label: '重置',
        key: 'reset',
        type: '',
        plain: false,
        path: 'btn_search'
      },
    ]
  }

  /** 根据驾校id获取下拉框办证科目数据 */
  private gotAccreditionSubject(drivingSchoolId: string) {
    const { selectList } = this.searchForm;
    selectList[0].options = drivingSchool(drivingSchoolId) === 'huizhou' ? huizhouAccreditionSubject : accreditionSubject;
  }

  /**
   * @description 列表搜索 操作按钮回调
   */
  searchTableCallBack(key: string) {
    if (key === 'search') {
      this.paginationData.current = 1; // 每次查询的时候都把当前页设置成第一页
      this.queryList();
    }
    if (key === 'reset') {
      this.queryList();
    }
  }

  // 弹窗名称
  private dialogName = '';

  // 表格配置
  private downTableData: ParamsType = {
    labels: [],
    list: [],
    name,
  };

  private tableData: ParamsType = {
    _this: {},
    loading: true,
    selection: true,
    index: true,
    options: [
      {
        id: 10,
        label: '导出',
        path: 'btn_export',
      },
    ],
    labels: BATCH_NUMBER_LIST,
    list: [],
    selectionList: [],
  };

  /**
   * @description 表格操作回调
   */
  private tableOptionCallback(val: TableOptionsValue) {
    const { selectionList, labels } = this.tableData;
    const idList: Array<number> = [];
    selectionList.forEach((item: any) => {
      const _item = item;
      idList.push(_item.id);
    });
    const _len = selectionList.length;
    const { id } = val;
    if (id === 9) {
      // 数据模板下载
      this.dialogName = 'download';
      return;
    }
    // 导出
    if (id === 10) {
      if (_len >= 1) {
        this.downTableData.list = deepClone(selectionList);
        this.downTableData.labels = deepClone(labels);
      } else {
        this.$message.warning('请先勾选信息！');
      }
    }
  }

  /** 跳转详情 */
  jumpDetail(item: any) {
    const { drivingSchoolId } = this.userInfo;
    this.$router.push({
      path: '/accreditation/student/batch_number/detail',
      query: { obj: encodeURIComponent(JSON.stringify({ ...item, drivingSchoolId })) }
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

  /**
   * @description 列表选中每一列切换回调
   */
  private tableSelectionChange(val: []) {
    this.tableData.selectionList = val;
  }

  // 数据模板表格配置
  private downloadtableData: ParamsType = {
    selection: true,
    index: true,
    labels: [
      {
        key: 'label',
        label: '模板名称',
        render(h: any, params: any) {
          const { label } = params.row;
          return h('span', `${label}模板`);
        }
      },
    ],
    list: templateDownloadProps.filter(a => a.label !== '资金监管存入' && a.label !== '监管学时' && a.label !== '学科培训' && a.label !== '成绩单'),
    selectionList: [],
  };

  /** 根据驾校id获取数据模板路径 */
  private gotDownloadtableData(drivingSchoolId: string) {
    let dic = 'accreditation';
    let temp = drivingSchool(drivingSchoolId) === 'huizhou' ? huizhouTemplateDownloadProps : templateDownloadProps; // 筛选对应驾校模板文件
    temp = temp.filter(a => a.label !== '资金监管存入' && a.label !== '监管学时' && a.label !== '学科培训' && a.label !== '成绩单');
    if (drivingSchoolId) dic = drivingSchool(drivingSchoolId) === 'huizhou' ? 'huizhou_accreditation' : 'accreditation';
    const newList: any = [];
    temp.forEach((item: any) => {
      const _item = item;
      _item.url = _item.url ? _item.url.replace('{dictory}', dic) : _item.url;
      newList.push(_item);
    });
    this.downloadtableData.list = newList;
  }

  /**
   * @description 模板下载列表选中每一列切换回调
   */
  private downloadTableSelectionChange(val: []) {
    this.downloadtableData.selectionList = val;
  }

  /** 数据模板下载 */
  private downloadTemplate() {
    const { selectionList } = this.downloadtableData;
    const _len = selectionList.length;
    if (_len <= 0) this.$message.warning('请先勾选数据！');
    else download(selectionList);
  }

  private downloadCancel() {
    (this.$refs.downloadTable as VueComponentParent).clearSelection();
    this.dialogName = '';
  }

  async queryList() {
    const { searchForm, paginationData } = this;
    const sendData = drawSearchForm(searchForm, paginationData);
    const { beginDate, endDate } = sendData;
    // 判断时间
    if (beginDate && endDate && timestampSizeCompare(beginDate, endDate)) {
      this.$message.warning('开始时间不能大于结束时间');
      return;
    }
    try {
      const body = await this.queryBatchNoList(sendData);
      const { data = [], current, total } = body;
      this.tableData.list = data;
      this.paginationData.current = current;
      this.paginationData.total = total;
      this.tableData.loading = false;
    } catch (error) {
      this.tableData.loading = true;
    }
  }

  async mounted() {
    this.tableData._this = this;
    // 以下接口依赖于驾校id
    const { drivingSchoolId } = this.userInfo;
    this.queryList();
    this.gotAccreditionSubject(drivingSchoolId);
    // this.gotDownloadtableData(drivingSchoolId);
  }

  async created() {
    const permObj = await this.$getPerm(
      this,
      this.tableData.options,
      this.searchForm.buttonList
    );
    this.tableData.options = permObj.tablePerm;
    this.searchForm.buttonList = permObj.searchPerm;
  }
}
