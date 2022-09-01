import Component, { mixins } from 'vue-class-component';
import { Action, State } from 'vuex-class';
import { modifyFormatJsonToObject, queryUnionData, deepClone } from '@/assets/js/common';
import { ParamsType, VueComponentParent } from '@/type';
import {
  CtjtTable, CtjtPagination, CtjtCard
} from '@/components';
import ctjtPaginationMixins from '@/mixins/pagination';
import clearCacheMixins from '@/mixins/clearCache';

const labelOpts = [
  {
    key: 'userName',
    label: '教练姓名',
    render(h: any, params: any) {
      const { userName, id } = params.row;
      return h('el-link', {
        props: {
          type: 'primary',
          underline: false
        },
        on: {
          click: () => {
            const that = params._self.tableData._this;
            that.$router.push({ path: '/educational/coach_mg/coach_list/detail', query: { id, isEdit: '1' } });
            that.drawerChoiceLeader = false;
          }
        }
      }, userName);
    }
  },
  {
    key: 'mobile',
    label: '手机号'
  },
  {
    key: 'carInformation',
    label: '教练车车牌',
    render(h: any, params: any) {
      const { carInformation } = params.row;
      const _list = carInformation ? modifyFormatJsonToObject(carInformation) : [];
      const _text: Array<string> = [];
      _list.forEach((item: any) => _text.push(item.number));
      return h('div', _text.join(', '));
    }
  },
  {
    key: 'regionName',
    label: '片区'
  },
  {
    key: 'teachingSubjects',
    label: '带教类型'
  }
];

@Component({
  components: {
    CtjtTable, CtjtPagination, CtjtCard
  }
})
export default class EducationalCoachMgTeachGroupMgDetail extends mixins(ctjtPaginationMixins, clearCacheMixins) {
  @Action('base/queryGroupMechanismData') private queryGroupMechanismData!: (data: any) => any;

  @Action('assignment/queryCoachNoCoachGroup') private queryCoachNoCoachGroup!: (data: any) => Array<any>;

  @Action('assignment/submitCoachGroups') private submitCoachGroups!: (data: any) => ParamsType;

  @Action('assignment/queryCoachGroupsDetailById') private queryCoachGroupsDetailById!: (data: any) => ParamsType;

  @Action('assignment/editPutCoachGroups') private editPutCoachGroups!: (data: any) => ParamsType;

  @State(state => state.base.userInfo) userInfo!: ParamsType;

  // 片区列表
  private regionList: Array<any> = [];

  private formData: ParamsType = {
    regionId: '',
    regionName: '',
    leaderId: '',
    leaderName: '',
    name: '',
    id: '',
  }

  private formRules = {
    regionId: [
      { required: true, message: '请选择片区', trigger: ['change', 'blur'] }
    ],
    name: [
      { required: true, message: '请输入教学组名', trigger: ['change', 'blur'] }
    ],
    leaderName: [
      { required: true, message: '请选择教学组长', trigger: ['change', 'blur'] }
    ]
  }

  // 分页列表配置
  private tableData: ParamsType = {
    _this: {},
    loading: false,
    selection: true,
    index: true,
    options: [
      {
        id: 1,
        label: '解绑所选管辖教练',
        type: 'warning',
        path: 'btn_removejl'
      },
      {
        id: 2,
        label: '添加管辖教练',
        type: 'primary',
        path: 'btn_addjl'
      },
      {
        id: 3,
        label: '取消',
        type: 'info',
        path: 'btn_submit'
      },
      {
        id: 4,
        label: '保存',
        type: 'success',
        path: 'btn_submit'
      }
    ],
    labels: labelOpts,
    list: [],
    selectionList: []
  }

  /**
   * @description 分页列表操作项回调函数
   */
  private async tableOptionCallback(val: any) {
    const { id } = val;
    if (id === 2) {
      // 添加教练
      const { regionId } = this.formData;
      if (!regionId) {
        this.$message.warning('请先选择片区!');
      } else {
        this.drawerName = '添加管辖教练';
        const _body = await this.queryCoachNoCoachGroup({ regionId });
        this.drawerTableData.list = _body;
        this.drawerTableData.deepList = _body;
        this.drawerChoiceLeader = true;
      }
      return;
    }
    if (id === 3) {
      // 取消
      this.goback();
      return;
    }
    if (id === 4) {
      const { list } = this.tableData;
      if (list.length === 0) {
        this.$message.warning('请先添加管辖教练!');
      } else {
        this.submit();
      }
      return;
    }
    const { selectionList } = this.tableData;
    if (id === 1) {
      // 解绑教练
      const _len = selectionList.length;
      if (_len >= 1) {
        this.$confirm('是否解绑教练?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteFunc(selectionList);
        });
      } else {
        this.$message.warning('请勾选需要解绑的教练！');
      }
    }
  }

  /**
   * @description 解绑教练
   */
  private deleteFunc(val: Array<any>) {
    const { list } = this.tableData;
    const _deepList = deepClone(list);
    const _delList: any = [];
    val.forEach(item => _delList.push(item.id));
    const _newList: any = [];
    _deepList.forEach((item: any) => {
      if (!_delList.includes(item.id)) _newList.push(item);
    });
    this.tableData.list = _newList;
  }

  /**
   * @description 添加管辖教练到本地列表
   */
  private setTableListFunc(val: Array<any>) {
    // 去重
    const { list } = this.tableData;
    const _newList = queryUnionData(list, val, 'id');
    this.tableData.list = _newList;
  }

  /**
   * @description 提交保存
   */
  private submit() {
    (this.$refs.drawerFormRef as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        // 判断教学教练列表是否为空
        const { formData, tableData } = this;
        const _coachIds: Array<string> = [];
        tableData.list.forEach((item: any) => _coachIds.push(item.id));
        const sendData = {
          ...formData,
          coachIds: _coachIds
        };
        if (Number(formData.id) > 0) {
          this.editPutCoachGroups(sendData).then(() => {
            this.$message.success('修改成功！');
            this.goback();
          });
        } else {
          this.submitCoachGroups(sendData).then(() => {
            this.$message.success('新增成功！');
            this.goback();
          });
        }
      } else {
        this.$message.warning('您的信息填写有误，请仔细检查并修改！');
      }
    });
  }

  /**
   * @description 分页列表勾选回调函数
   */
  private tableSelectionChange(val: Array<any>) {
    this.tableData.selectionList = val;
  }

  // 抽屉-选择教学组长
  private drawerChoiceLeader = false;

  private keyword = '';

  private searchDrawerTableData() {
    const { keyword } = this;
    const { deepList } = this.drawerTableData;
    if (!keyword) {
      this.drawerTableData.list = deepList;
      return;
    }
    this.drawerTableData.list = deepList.filter((item: any) => item.userName === keyword || item.mobile === keyword);
  }

  private handleClose() {
    this.drawerTableData.list = [];
    this.drawerTableData.deepList = [];
    this.drawerChoiceLeader = false;
  }

  private drawerTableData: ParamsType = {
    _this: {},
    loading: false,
    index: true,
    selection: true,
    options: [
      {
        id: 1,
        label: '取消',
        type: 'info'
      },
      {
        id: 2,
        label: '确定',
        type: 'primary',
      },
    ],
    labels: labelOpts,
    list: [],
    deepList: [],
    selectionList: []
  };

  /**
   * @description 分页列表操作项回调函数
   */
  private choiceLeaderTableOptionCallback(val: any) {
    const { id } = val;
    if (id === 1) {
      this.handleClose();
      return;
    }
    if (id === 2) {
      const { selectionList } = this.drawerTableData;
      const _len = selectionList.length;
      if (_len === 0) {
        this.$message.warning('请勾选列表项!');
      }
      // 如果是添加教练,支持多选
      if (this.drawerName === '添加管辖教练') {
        this.setTableListFunc(selectionList);
        this.handleClose();
      } else {
        if (_len === 1) {
          const { userName, id: _id } = selectionList[0];
          this.formData.leaderName = userName;
          this.formData.leaderId = _id;
          this.handleClose();
        }
        if (_len > 1) {
          this.$message.warning('仅支持单项操作!');
        }
      }
    }
  }

  private choiceLeaderTableSelectionChange(val: Array<any>) {
    this.drawerTableData.selectionList = val;
  }

  /**
   * @description 分页组件每页请求数量切换
   */
  private tableSizeChange(val: number) {
    this.paginationData.pageSize = val;
    this.paginationData.current = 1;
  }

  /**
   * @description 分页组件页数切换
   */
  private tableCurrentChange(val: number) {
    this.paginationData.current = val;
  }

  private async queryRegionList(id: string) {
    const data = await this.queryGroupMechanismData({ pid: id });
    this.regionList = data;
  }

  /**
   * @description 片区选择切换
   */
  private regionChanged(id: string) {
    const _list = this.regionList.filter(item => item.id === id);
    this.formData.regionName = _list[0].name;
    // 重置教学组长信息
    this.formData.leaderName = '';
    this.formData.leaderId = '';
  }

  /**
   * @description 选择教学组长
   */
  private async chooseLeaderFunc() {
    // 先判断选择了片区
    const { regionId } = this.formData;
    if (!regionId) {
      this.$message.warning('请先选择片区');
      return;
    }
    this.drawerName = '选择教学组长';
    const sendData = { regionId, isLeader: true };
    const body = await this.queryCoachNoCoachGroup(sendData);
    this.drawerTableData.list = body;
    this.drawerTableData.deepList = body;
    this.drawerChoiceLeader = true;
  }

  // 抽屉-未分配教练列表
  private drawerName = '选择教学组长';

  private queryDetail(id: string) {
    this.queryCoachGroupsDetailById({ id }).then((res: any) => {
      const { coaches } = res;
      this.tableData.list = coaches;
      Object.keys(this.formData).forEach(key => {
        this.formData[key] = res[key];
      });
    });
  }

  private goback() {
    this.clearCache();
    this.$router.push({ path: '/educational/coach_mg/teach_group_mg' });
  }

  perm = {};

  async activated() {
    this.tableData._this = this;
    this.drawerTableData._this = this;

    const { drivingSchoolId } = this.userInfo;
    this.queryRegionList(drivingSchoolId);
    const { id } = this.$route.query;
    if (typeof id === 'string' && id) this.queryDetail(id);
    const permObj = await (this as any).$getPerm(this, this.tableData.options);
    this.tableData.options = permObj.tablePerm;
    this.perm = permObj.perm;
  }
}
