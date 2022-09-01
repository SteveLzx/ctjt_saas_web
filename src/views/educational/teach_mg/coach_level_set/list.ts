import Component, { mixins } from 'vue-class-component';
import { Action, State } from 'vuex-class';
import { ParamsType, VueComponentParent } from '@/type';
import { deepClone, FILTER_EXCEL_TYPE } from '@/assets/js/common';
import { drawSearchForm } from '@/assets/js/search_table';
import { getTemplateDownloadProps } from '@/views/educational/_common/common';
import { quarterOpts } from '@/views/educational/_enums';
import {
  SearchTable, CtjtPagination, CtjtAutoUpload, CtjtUpload
} from '@/components';
import download from '@/assets/js/download';
import ctjtPaginationMixins from '@/mixins/pagination';

@Component({
  components: {
    SearchTable,
    CtjtPagination,
    CtjtAutoUpload,
    CtjtUpload
  }
})
export default class EducationalTeachMgCoachLevelSet extends mixins(ctjtPaginationMixins) {
  @Action('base/queryGroupMechanismData') private queryGroupMechanismData!: (data: any) => any;

  @Action('assignment/queryTeachTypeList') private queryTeachTypeList!: () => ParamsType;

  @Action('assignment/queryTeachCarsList') private queryTeachCarsList!: () => ParamsType;

  @Action('assignment/queryCoachStarsList') private queryCoachStarsList!: (data: any) => ParamsType;

  @Action('assignment/starsImportExcel') private starsImportExcel!: (data: any) => ParamsType;

  @Action('assignment/queryCoachNoCoachGroup') private queryCoachNoCoachGroup!: (data: any) => ParamsType;

  @Action('assignment/queryCoachesAllLeaders') private queryCoachesAllLeaders!: () => ParamsType;

  @State(state => state.base.userInfo) userInfo!: ParamsType;

  // 列表搜索项
  private searchForm: ParamsType = {
    datePickerList: [
      {
        label: '年份',
        key: 'year',
        formatType: 'YYYY',
        value: '',
        width: 160,
        placeholder: '请选择',
        type: 'year',
        clearable: false,
      },
    ],
    inputList: [
      {
        label: '教练姓名',
        key: 'coachName',
        type: 'text',
        value: '',
        width: 160,
        clearable: true,
        placeholder: '请输入教练姓名',
      }
    ],
    selectList: [
      {
        label: '片区',
        key: 'regionId',
        value: '',
        width: 200,
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: [],
        customOptions: {
          value: 'id',
          label: 'name'
        }
      },
      {
        label: '季度',
        key: 'quarter',
        value: '',
        width: 200,
        placeholder: '请选择',
        multiple: false,
        options: quarterOpts,
        customOptions: {
          value: 'value',
          label: 'label'
        }
      },
      {
        label: '带教类型',
        key: 'teachType',
        value: '',
        width: 200,
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: [],
        customOptions: {
          value: 'name',
          label: 'name'
        }
      },
      {
        label: '带教车型',
        key: 'teachCar',
        value: '',
        width: 200,
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: []
      },
      {
        label: '教学组长',
        key: 'leaderId',
        value: '',
        width: 200,
        placeholder: '请选择',
        multiple: false,
        clearable: true,
        options: [],
        customOptions: {
          value: 'id',
          label: 'userName'
        }
      }
    ],
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
        plain: false,
        path: 'btn_search'
      },
    ]
  }

  /**
   * @description 列表搜索项下拉回调函数
   */
  private searchSelectChange(val: ParamsType) {
    const { value, key } = val;
  }

  /**
   * @description 搜索项回调
   */
  public searchTableCallBack(key: string) {
    if (key === 'reset') {
      this.setQuarter();
    }
    this.queryList();
  }

  /**
   * @description 下载模板
   */
  private downloadImport() {
    download(getTemplateDownloadProps('coach_level_set'));
  }

  // 抽屉
  private drawer = false;

  private handleClose() {
    (this.$refs.drawerFormRef as VueComponentParent).resetFields();
    (this.$refs.fileUpload as VueComponentParent).uploadClearFiles(true);
    this.drawer = false;
  }

  private _clearData() {
    this.formData.file = null;
  }

  private quarterOpts = quarterOpts;

  // 表单配置
  private formData = {
    quarter: '',
    year: '',
    file: null,
  }

  private formRules = {
    year: [
      { required: true, message: '请选择年份', trigger: ['change', 'blur'] }
    ],
    quarter: [
      { required: true, message: '请选择季度', trigger: ['change', 'blur'] }
    ],
    file: [
      { required: true, message: '请选择文件', trigger: ['change', 'blur'] }
    ]
  }

  private submit() {
    (this.$refs.drawerFormRef as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        const { file } = this.formData;
        if (file) {
          const sendData = { ...this.formData };
          sendData.year = this.$dayjs(sendData.year).format('YYYY');
          this.starsImportExcel(sendData).then(() => {
            this.queryList();
            this.$message.success('导入成功!');
            this.handleClose();
          });
        } else {
          this.$message.warning('请选择文件!');
        }
      } else {
        this.$message.warning('请按错误提示修改!');
      }
    });
  }

  // 导入上传配置
  uploadConfig = {
    multiple: false,
    accept: '',
    limit: 1,
    autoUpload: false,
    disabled: false,
    tips: '',
    business: 'accreditation',
  };

  fileAccept = FILTER_EXCEL_TYPE; // 限制上传文件格式

  /**
   * @description 文件选择回调函数，判断文件类型，大小
   */
  fileChoose(val: any) {
    const _file = val.fileList[0];
    if (_file) {
      this.formData.file = _file.raw;
    }
  }

  // 列表数组
  private tableData: ParamsType = [];

  private levelFormatter(row: any) {
    const { level } = row;
    if (level === 1) return '一星';
    if (level === 2) return '二星';
    if (level === 3) return '三星';
    if (level === 4) return '四星';
    if (level === 5) return '五星';
    return '';
  }

  // 列表表头配置
  private tableDataLabels: ParamsType = {
    examMonthOne: 1,
    examMonthTwo: 2,
    examMonthThree: 3,
    levelOne: 4,
    levelTwo: 5,
    levelThree: 6,
  };

  /**
   * @description 分页组件每页请求数量切换
   */
  private tableSizeChange(val: number) {
    this.paginationData.pageSize = val;
    this.paginationData.current = 1;
    this.queryList();
  }

  /**
   * @description 分页组件页数切换
   */
  private tableCurrentChange(val: number) {
    this.paginationData.current = val;
    this.queryList();
  }

  async queryList() {
    const { searchForm, paginationData } = this;
    const _data = drawSearchForm(searchForm, paginationData);
    _data.year = this.$dayjs(_data.year).format('YYYY');
    const sendData = { ..._data };
    const body = await this.queryCoachStarsList(sendData);
    const {
      data, current, total
    } = body;
    this.tableData = data;
    this.paginationData.current = current;
    this.paginationData.total = total;
    this.getMonthByExamFunc();
    this.getMonthByLevelFunc();
  }

  private async queryRegionList(id: string) {
    const data = await this.queryGroupMechanismData({ pid: id });
    this.searchForm.selectList[0].options = data;
  }

  private getMonthByExamFunc() {
    // 获取当前季度
    const { value } = this.searchForm.selectList[1];
    const list = [1, 2, 3];
    list.forEach(item => {
      if (item === 1) {
        this.tableDataLabels.examMonthOne = (value - 1) * 3 + item;
      }
      if (item === 2) {
        this.tableDataLabels.examMonthTwo = (value - 1) * 3 + item;
      }
      if (item === 3) {
        this.tableDataLabels.examMonthThree = (value - 1) * 3 + item;
      }
    });
  }

  private getMonthByLevelFunc() {
    // 获取当前季度
    const { value } = this.searchForm.selectList[1];
    let _m = value;
    if (value > 3) {
      _m = 0;
    }
    const list = [1, 2, 3];
    list.forEach(item => {
      if (item === 1) {
        this.tableDataLabels.levelOne = _m * 3 + item;
      }
      if (item === 2) {
        this.tableDataLabels.levelTwo = _m * 3 + item;
      }
      if (item === 3) {
        this.tableDataLabels.levelThree = _m * 3 + item;
      }
    });
  }

  /**
   * @description 搜索项配置
   */
  private initSearch() {
    const { drivingSchoolId } = this.userInfo;
    this.queryRegionList(drivingSchoolId);
    this.queryTeachTypeList().then((res: any) => {
      this.searchForm.selectList[2].options = res;
    });
    this.queryTeachCarsList().then((res: any) => {
      const _list = deepClone(res);
      const _res: any = [];
      _list.forEach((item: any) => {
        _res.push({ id: item, label: item });
      });
      this.searchForm.selectList[3].options = _res;
    });
    this.queryCoachesAllLeaders().then((res: any) => {
      this.searchForm.selectList[4].options = res;
    });
    this.setQuarter();
  }

  private setQuarter() {
    // 获取当前时间,设置季度,年份
    const _date = new Date();
    const currYear = _date.getFullYear();
    const currMonth = _date.getMonth() + 1;
    const currQuarter = Math.floor((currMonth % 3 === 0 ? (currMonth / 3) : (currMonth / 3 + 1)));
    this.searchForm.datePickerList[0].value = String(currYear);
    this.searchForm.selectList[1].value = currQuarter;
  }

  async mounted() {
    this.initSearch();
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
