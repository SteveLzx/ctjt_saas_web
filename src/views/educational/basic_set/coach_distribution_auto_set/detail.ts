import { Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { deepClone, REG_INTEGER } from '@/assets/js/common';
import { ParamsType, VueComponentParent } from '@/type';
import {
  allowScopeOpts, loadRuleOpts, subjectOutAndOnAccessOpts
} from '@/views/educational/_enums/index';
import { CtjtCard } from '@/components';
import clearCacheMixins from '@/mixins/clearCache';

@Component({
  components: {
    CtjtCard
  }
})
export default class EducationalBasicSetCoachDistributionAutoSetDetail extends mixins(clearCacheMixins) {
  @Action('goods/queryClassesList') private queryClassesList!: (data: any) => ParamsType;

  @Action('assignment/queryTeachTypePullFrame') private queryTeachTypePullFrame!: () => ParamsType;

  @Action('assignment/saveAllotRules') private saveAllotRules!: (data: any) => ParamsType;

  @Action('assignment/updataAllotRules') private updataAllotRules!: (data: any) => ParamsType;

  @Action('assignment/queryAllotRulesDetail') private queryAllotRulesDetail!: (data: any) => ParamsType;

  private formData: ParamsType = {
    allowScope: null,
    capacity: null,
    capacityPeriod: null,
    classes: null,
    classesInfo: [],
    coachOwn: false,
    id: null,
    loadRule: [],
    name: '',
    qualified: null,
    qualifiedPeriod: null,
    score: 0,
    status: true,
    subjectThreeAccess: null,
    subjectThreeAccessStatus: null,
    subjectThreeOut: null,
    subjectThreeOutStatus: null,
    subjectThreeTeach: [],
    subjectTwoAccess: null,
    subjectTwoAccessStatus: null,
    subjectTwoOut: null,
    subjectTwoOutStatus: null,
    subjectTwoTeach: [],
    teachCar: null,
    capacityFlag: false,
  };

  private formRules = {
    name: [
      { required: true, message: '请输入分配规则名称', trigger: ['change', 'blur'] }
    ],
    classesInfo: [
      { required: true, message: '必选项', trigger: ['blur'] }
    ],
    subjectTwoAccess: [
      { required: true, message: '必选项', trigger: ['blur'] }
    ],
    subjectTwoAccessStatus: [
      { required: true, message: '必选项', trigger: ['blur'] }
    ],
    subjectTwoOut: [
      { required: true, message: '必选项', trigger: ['blur'] }
    ],
    subjectTwoOutStatus: [
      { required: true, message: '必选项', trigger: ['blur'] }
    ],
    subjectTwoTeach: [
      { required: true, message: '必选项', trigger: ['blur'] }
    ],
    subjectThreeAccess: [
      { required: true, message: '必选项', trigger: ['blur'] }
    ],
    subjectThreeAccessStatus: [
      { required: true, message: '必选项', trigger: ['blur'] }
    ],
    subjectThreeOut: [
      { required: true, message: '必选项', trigger: ['blur'] }
    ],
    subjectThreeOutStatus: [
      { required: true, message: '必选项', trigger: ['blur'] }
    ],
    subjectThreeTeach: [
      { required: true, message: '必选项', trigger: ['blur'] }
    ],
    allowScope: [
      { required: true, message: '必选项', trigger: ['blur'] }
    ],
    teachCar: [
      { required: true, message: '必选项', trigger: ['blur'] }
    ],
    classes: [
      { required: true, message: '必选项', trigger: ['blur'] }
    ],
    coachOwn: [
      { required: true, message: '必选项', trigger: ['blur'] }
    ],
    loadRule: [
      { required: true, message: '必选项', trigger: ['blur'] }
    ],
    capacity: [
      { required: true, message: '必选项', trigger: ['blur'] }
    ],
    qualified: [
      { required: true, message: '必选项', trigger: ['blur'] }
    ],
    capacityPeriod: [
      { required: true, message: '必选项', trigger: ['blur'] }
    ],
    qualifiedPeriod: [
      { required: true, message: '必选项', trigger: ['blur'] }
    ],
  }

  private classesOpts = [];

  private classesMapOpts: any = [];

  private allowScopeOpts = allowScopeOpts;

  private loadRuleOpts = loadRuleOpts;

  private subjectOutAndOnAccessOpts = subjectOutAndOnAccessOpts;

  private subjectThreeAccessOpts: ParamsType = [];

  private subjectThreeOutOpts: ParamsType = [];

  private subjectTwoTeachOpts: ParamsType = [];

  private subjectThreeTeachOpts: ParamsType = [];

  private subjectTwoAccessOpts: ParamsType = [];

  private subjectTwoOutOpts: ParamsType = [];

  private subjectTwoAccessStatusOpts: ParamsType = [];

  private subjectTwoOutStatusOpts: ParamsType = [];

  private subjectThreeAccessStatusOpts: ParamsType = [];

  private subjectThreeOutStatusOpts: ParamsType = [];

  @Watch('formData.subjectTwoAccess')
  private handleWatchSubjectTwoAccess(val: number) {
    const _list = subjectOutAndOnAccessOpts.filter(item => item.id === val);
    if (_list.length === 0) {
      this.subjectTwoAccessStatusOpts = [];
    } else {
      this.subjectTwoAccessStatusOpts = _list[0].children;
    }
  }

  private changeSubjectTwoAccess() {
    this.formData.subjectTwoAccessStatus = null;
  }

  @Watch('formData.subjectTwoOut')
  private handleWatchSubjectTwoOut(val: number) {
    const _list = subjectOutAndOnAccessOpts.filter(item => item.id === val);
    if (_list.length === 0) {
      this.subjectTwoOutStatusOpts = [];
    } else {
      this.subjectTwoOutStatusOpts = _list[0].children;
    }
  }

  private changeSubjectTwoOut() {
    this.formData.subjectTwoOutStatus = null;
  }

  @Watch('formData.subjectThreeAccess', { deep: true, immediate: true })
  private handleWatchSubjectThreeAccess(val: number) {
    const _list = subjectOutAndOnAccessOpts.filter(item => item.id === val);
    if (_list.length === 0) {
      this.subjectThreeAccessStatusOpts = [];
    } else {
      this.subjectThreeAccessStatusOpts = _list[0].children;
    }
  }

  private changeSubjectThreeAccess() {
    this.formData.subjectThreeAccessStatus = null;
  }

  @Watch('formData.subjectThreeOut')
  private handleWatchSubjectThreeOut(val: number) {
    const _list = subjectOutAndOnAccessOpts.filter(item => item.id === val);
    if (_list.length === 0) {
      this.subjectThreeOutStatusOpts = [];
    } else {
      this.subjectThreeOutStatusOpts = _list[0].children;
    }
  }

  private changeSubjectThreeOut() {
    this.formData.subjectThreeOutStatus = null;
  }

  @Watch('formData.loadRule', { deep: true, immediate: true })
  private watchLoadRule(val: ParamsType) {
    const _flag = this.formData.capacityFlag;
    const _len = val.length > 0;
    this.formRules.capacity[0].required = !_len;
    this.formRules.capacityPeriod[0].required = !_len;
    this.formRules.qualified[0].required = !_len;
    this.formRules.qualifiedPeriod[0].required = !_len;
    this.formRules.loadRule[0].required = !_flag;
  }

  @Watch('formData.capacityFlag', { deep: true, immediate: true })
  private watchCapacityFlag(val: ParamsType) {
    const _flag = this.formData.loadRule.length > 0;
    this.formRules.capacity[0].required = !_flag;
    this.formRules.capacityPeriod[0].required = !_flag;
    this.formRules.qualified[0].required = !_flag;
    this.formRules.qualifiedPeriod[0].required = !_flag;
    this.formRules.loadRule[0].required = !val;
  }

  private handleChangeLoadRule(val: ParamsType) {
    if (val) {
      this.formData.capacityFlag = false;
      this.formData.capacity = null;
      this.formData.capacityPeriod = null;
      this.formData.qualified = null;
      this.formData.qualifiedPeriod = null;
    }
  }

  private handleChangeCapacityFlag(val: any) {
    if (val) {
      this.formData.loadRule = [];
    } else {
      this.formData.capacity = null;
      this.formData.capacityPeriod = null;
      this.formData.qualified = null;
      this.formData.qualifiedPeriod = null;
    }
  }

  private handleChangeSubjectTwoTeach() {
    const { subjectTwoTeachOpts } = this;
    const _list = subjectTwoTeachOpts.filter((item: any) => item.check);
    this.formData.subjectTwoTeach = [];
    if (_list.length > 0) {
      _list.forEach((item: any) => {
        const { load, teachType } = item;
        this.formData.subjectTwoTeach.push({
          load, teachType
        });
      });
    }
  }

  private handleChangeSubjectThreeTeach() {
    const { subjectThreeTeachOpts } = this;
    const _list = subjectThreeTeachOpts.filter((item: any) => item.check);
    this.formData.subjectThreeTeach = [];
    if (_list.length > 0) {
      _list.forEach((item: any) => {
        const { load, teachType } = item;
        this.formData.subjectThreeTeach.push({
          load, teachType
        });
      });
    }
  }

  private subjectTwoTeachKeyup(index: number) {
    const { load } = this.subjectTwoTeachOpts[index];
    if (!REG_INTEGER.test(load)) {
      this.subjectTwoTeachOpts[index].load = '';
    }
    if (load > 999999) {
      this.subjectTwoTeachOpts[index].load = 999999;
    }
  }

  private subjectThreeTeachKeyup(index: number) {
    const { load } = this.subjectThreeTeachOpts[index];
    if (!REG_INTEGER.test(load)) {
      this.subjectThreeTeachOpts[index].load = '';
    }
    if (load > 999999) {
      this.subjectThreeTeachOpts[index].load = 999999;
    }
  }

  private handleChangeCapacity() {
    const { capacity } = this.formData;
    if (capacity === '') {
      this.formData.qualified = '';
      return;
    }
    let _num = Number(capacity);
    if (String(_num) === 'NaN') this.formData.capacity = 0;
    if (_num > 100) {
      _num = 100;
      this.formData.capacity = _num;
    }
    this.formData.qualified = 100 - (String(_num) === 'NaN' ? 0 : _num);
  }

  private handleChangeQualified() {
    const { qualified } = this.formData;
    if (qualified === '') {
      this.formData.capacity = '';
      return;
    }
    let _num = Number(qualified);
    if (String(_num) === 'NaN') this.formData.qualified = 0;
    if (_num > 100) {
      _num = 100;
      this.formData.qualified = _num;
    }
    this.formData.capacity = 100 - (String(_num) === 'NaN' ? 0 : _num);
  }

  private submitLoading = false;

  private submit() {
    (this.$refs.formDetailRef as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        if (this._validateFunc()) {
          // 处理提交数据
          const sendData = this._setFormFunc();
          const { id } = sendData;
          this.submitLoading = true;
          if (id) {
            this.updataAllotRules(sendData).then(() => {
              this.$message.success('修改成功');
              this.goback();
            }).finally(() => {
              this.submitLoading = false;
            });
          } else {
            delete sendData.id;
            this.saveAllotRules(sendData).then(() => {
              this.$message.success('新增成功');
              this.goback();
            }).finally(() => {
              this.submitLoading = false;
            });
          }
        }
      } else {
        this.$message.warning('请按错误提示修改!');
      }
    });
  }

  private _validateFunc() {
    const { subjectTwoTeachOpts, subjectThreeTeachOpts } = this;
    const _twolist = subjectTwoTeachOpts.filter((item: any) => item.check && (item.load === '' || item.load === null));
    const _threelist = subjectThreeTeachOpts.filter((item: any) => item.check && (item.load === '' || item.load === null));
    if (_twolist.length > 0) {
      this.$message.warning('请输入科目二停止分配负荷');
      return false;
    }
    if (_threelist.length > 0) {
      this.$message.warning('请输入科目三停止分配负荷');
      return false;
    }
    return true;
  }

  private _setFormFunc() {
    const _data = deepClone(this.formData);
    const {
      classesInfo, loadRule, status
    } = _data;
    // 处理带教类型
    const { subjectTwoTeachOpts, subjectThreeTeachOpts } = this;
    const _subjectTwoTeachOpts = deepClone(subjectTwoTeachOpts);
    const _subjectThreeTeachOpts = deepClone(subjectThreeTeachOpts);
    const _subjectTwoTeachOptsList: ParamsType = [];
    const __subjectThreeTeachOptsList: ParamsType = [];
    _subjectTwoTeachOpts.forEach((item: any) => {
      if (item.check) {
        const _item = item;
        delete _item.check;
        delete _item.id;
        _subjectTwoTeachOptsList.push(item);
      }
    });
    _data.subjectTwoTeach = JSON.stringify(_subjectTwoTeachOptsList);
    _subjectThreeTeachOpts.forEach((item: any) => {
      if (item.check) {
        const _item = item;
        delete _item.check;
        delete _item.id;
        __subjectThreeTeachOptsList.push(item);
      }
    });
    _data.subjectThreeTeach = JSON.stringify(__subjectThreeTeachOptsList);
    // 处理班别
    const _classesInfo: ParamsType = [];
    this.classesOpts.forEach((item: any) => {
      if (classesInfo.includes(item.id)) {
        _classesInfo.push(item);
      }
    });
    _data.classesInfo = JSON.stringify(_classesInfo);
    // 处理规则
    _data.loadRule = JSON.stringify(loadRule);
    // 处理状态
    _data.status = status ? 1 : 0;
    return _data;
  }

  private async initLabels() {
    // 处理科目二，科目三入库出库筛选项
    subjectOutAndOnAccessOpts.forEach((item: any) => {
      const { id } = item;
      if (id === 1) {
        this.subjectTwoAccessOpts.push(deepClone(item));
      }
      if (id === 2) {
        this.subjectTwoAccessOpts.push(deepClone(item));
        this.subjectThreeAccessOpts.push(deepClone(item));
      }
      if (id === 3) {
        this.subjectTwoOutOpts.push(deepClone(item));
        this.subjectThreeAccessOpts.push(deepClone(item));
      }
      if (id === 4) {
        this.subjectTwoOutOpts.push(deepClone(item));
        this.subjectThreeOutOpts.push(deepClone(item));
      }
    });

    await this.queryClassesList({ type: 1 }).then((res: any) => {
      // 这里以车型为区分把C1的班别车型放一起，C2班别车型的另起一行行一起 产品垃圾需求
      if (res && res.length > 0) {
        // 获取所有车型
        const _mapList = new Map();
        res.forEach((item: any) => {
          const { carModel } = item;
          if (!_mapList.has(carModel)) {
            _mapList.set(carModel, [item]);
          } else {
            const _list = deepClone(_mapList.get(carModel));
            _mapList.set(carModel, [..._list, item]);
          }
        });
        _mapList.forEach((item: any) => {
          this.classesMapOpts.push(item);
        });
        this.classesOpts = res;
      }
    });
    await this.queryTeachTypePullFrame().then((res: any) => {
      const _list: ParamsType = [];
      res.forEach((item: any) => {
        _list.push({
          ...item, teachType: item.id, load: '', check: false
        });
      });
      this.subjectTwoTeachOpts = deepClone(_list);
      this.subjectThreeTeachOpts = deepClone(_list);
    });
    const { id, isEdit } = this.$route.query;
    this.isEdit = !!isEdit;
    if (typeof id === 'string' && id) {
      await this.queryAllotRulesDetail({ id }).then((res: any) => {
        this._setFormDataFunc(res);
      });
    }
  }

  private _setFormDataFunc(val: ParamsType) {
    const _data = deepClone(val);
    Object.keys(this.formData).forEach((key: string) => {
      if (key === 'loadRule') {
        this.formData[key] = JSON.parse(_data[key]);
      } else if (key === 'status') {
        this.formData[key] = _data[key] === 1;
      } else if (key === 'classesInfo') {
        const _list = JSON.parse(_data[key]);
        const _ids: string[] = [];
        _list.forEach((item: any) => {
          _ids.push(item.id);
        });
        this.formData[key] = _ids;
      } else if (key === 'subjectTwoTeach') {
        this.formData[key] = JSON.parse(_data[key]);
        this.subjectTwoTeachOpts.forEach((item: any) => {
          const _item = item;
          this.formData[key].forEach((i: any) => {
            const { load, teachType } = i;
            if (_item.teachType === teachType) {
              _item.load = load;
              _item.check = true;
            }
          });
        });
      } else if (key === 'subjectThreeTeach') {
        this.formData[key] = JSON.parse(_data[key]);
        this.subjectThreeTeachOpts.forEach((item: any) => {
          const _item = item;
          this.formData[key].forEach((i: any) => {
            const { load, teachType } = i;
            if (_item.teachType === teachType) {
              _item.load = load;
              _item.check = true;
            }
          });
        });
      } else {
        this.formData[key] = _data[key];
        if (key === 'capacityFlag') {
          this.formData.capacityFlag = !!_data.capacity;
        }
      }
    });
  }

  private isEdit = false;

  private goback() {
    this.clearCache();
    this.$router.push({ path: '/educational/basic_set/coach_distribution_auto_set' });
  }

  activated() {
    this.initLabels();
  }
}
