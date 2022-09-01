import { Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import dayjs from 'dayjs';
import { ParamsType } from '@/type';
import ctjtPaginationMixins from '@/mixins/pagination';
import { SUBJECT } from '@/enums';

@Component
export default class AccreditationSimulationResultsIndex extends mixins(ctjtPaginationMixins) {
  @Action('license/queryStudentByKeyword') public queryStudentByKeyword!: (data: any) => ParamsType;

  @Action('license/queryExamList') private queryExamList!: (data: any) => any;

  private subjectList = SUBJECT.filter(a => a.id === 1 || a.id === 4);

  // 搜索项表单
  private saerchFormData: ParamsType = {
    idNo: '',
    userName: '',
    userInfo: { idNo: '', userName: '' },
    subject: this.subjectList[0].id
  }

  private saerchFormDataRules = {
    userName: [
      { required: true, message: '请输入姓名/证件号码搜索学员', trigger: 'blur' }
    ],
    subject: [
      { required: true, message: '请选择考试科目', trigger: ['change', 'blur'] }
    ],
  }

  // 身份证搜索下拉配置项
  private idNoOption = {
    options: [],
    loading: false,
  };

  /**
   * @description 根据证件模糊搜索，查询可退节点信息以及学员基础信息
   */
  private async queryIdNoSearch(val: any) {
    this.idNoOption.loading = true;
    if (val.length >= 2) {
      const sendData = { keyword: val };
      const body: any = await this.queryStudentByKeyword(sendData);
      this.idNoOption.options = body;
      this.idNoOption.loading = false;
    }
  }

  /**
  * @description 搜索下拉框回调函数
  */
  async formDataSelectCallback(val: any) {
    const { options } = this.idNoOption;
    this.saerchFormData.idNo = val;
    const userInfo: any = options.filter((a: any) => a.idNo === val);
    this.saerchFormData.userInfo = userInfo?.[0];
    this.saerchFormData.userName = userInfo?.[0].userName;
    const { subject } = this.saerchFormData;
    this.queryExamList({ idNo: val, subject }).then((res: any) => {
      this.tableData.list = res;
    }).catch((res: any) => {
      this.tableData.list = [];
    }).finally(() => {
      this.idNoOption.options = [];
    });
  }

  async subjectChangeFun(val: string) {
    const { idNo } = this.saerchFormData.userInfo;
    if (idNo.length >= 2) {
      this.queryExamList({ idNo, subject: val }).then((res: any) => {
        this.tableData.list = res;
      }).catch((res: any) => {
        this.tableData.list = [];
      });
    }
  }

  // 表格配置
  private tableData: ParamsType = {
    _this: {},
    loading: false,
    selection: false,
    index: true,
    options: [],
    labels: [
      {
        key: 'userName',
        label: '学员姓名',
        minWidth: 80,
        render(h: any, params:any) {
          const _that = params._self.tableData._this;
          const { userName } = _that.saerchFormData.userInfo;
          return h('div', userName);
        }
      },
      {
        key: 'idNo',
        label: '证件号码',
        width: 170,
        render(h: any, params:any) {
          const _that = params._self.tableData._this;
          const { idNo } = _that.saerchFormData.userInfo;
          return h('div', idNo);
        }
      },
      {
        key: 'subject',
        label: '科目',
        minWidth: 100,
        render(h: any, params:any) {
          const _that = params._self.tableData._this;
          const { subject } = _that.saerchFormData;
          const _text = SUBJECT.filter(a => a.id === subject);
          return h('div', _text[0] ? _text[0].label : '');
        }
      },
      {
        key: 'examTime',
        label: '考试时间',
        minWidth: 160,
        render(h: any, params: any) {
          const { examTime } = params.row;
          if (!examTime) return h('div', '');
          return h('div', dayjs(examTime).format('YYYY-MM-DD HH:mm:ss'));
        }
      },
      {
        key: 'score',
        label: '成绩',
        minWidth: 100,
      },
    ],
    list: [],
    selectionList: [],
  };

  async mounted() {
    this.tableData._this = this;
    this.tableData.list = [];
  }
}
