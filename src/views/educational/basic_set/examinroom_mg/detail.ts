import Component, { mixins } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { ParamsType, VueComponentParent } from '@/type';
import {
  deepClone, REG_PRICE_OR_ZONE, REG_ZERO_INTEGER
} from '@/assets/js/common';
import {
  examSubjectsOpt, examCarTypeOpt, examPlaceTypeOpt,
  examModeOpt, examDayOpt, isOftenExamPlaceOpt
} from '@/views/educational/_enums/index';
import {
  CtjtCard, CtjtSelectAddress, CtjtTable, CtjtPagination
} from '@/components';
import clearCacheMixins from '@/mixins/clearCache';

// 科目二，科目三表格单项公共模块
const publicItemForm = {
  carType: '',
  examRoadNum: 0,
  examPlaceCarNum: 0,
  dayNum: 0,
  teachingHours: 0,
  carBrand: ''
};

@Component({
  components: {
    CtjtCard, CtjtSelectAddress, CtjtTable, CtjtPagination
  }
})
export default class EducationalBasicSetExaminroomMgDetail extends mixins(clearCacheMixins) {
  @Action('assignment/getCarBrandList') private getCarBrandList!: (data: any) => ParamsType;

  @Action('assignment/saveOrUpdateExamPlace') private saveOrUpdateExamPlace!: (data: any) => ParamsType;

  @Action('assignment/queryExamPlaceDetailById') private queryExamPlaceDetailById!: (data: any) => ParamsType;

  private examSubjectsOpt = examSubjectsOpt;

  private examCarTypeOpt = examCarTypeOpt;

  private examPlaceTypeOpt = examPlaceTypeOpt;

  private examModeOpt = examModeOpt;

  private examDayOpt = examDayOpt;

  private isOftenExamPlaceOpt = isOftenExamPlaceOpt;

  // 选中地址成功回调
  addressSuccessFunc(data: any) {
    const { type, id, value } = data;
    if (type === 'prov') {
      this.baseFormData.provinceId = id;
      this.baseFormData.provinceName = value;
      // 清空
      this.baseFormData.cityId = 0;
      this.baseFormData.cityName = '';
      this.baseFormData.areaId = 0;
      this.baseFormData.areaName = '';
    }
    if (type === 'city') {
      this.baseFormData.cityId = id;
      this.baseFormData.cityName = value;
      // 清空
      this.baseFormData.areaId = 0;
      this.baseFormData.areaName = '';
    }
    if (type === 'area') {
      this.baseFormData.areaId = id;
      this.baseFormData.areaName = value;
    }
  }

  // 表单配置
  private baseFormData: ParamsType = {
    id: '',
    address: '',
    areaName: '',
    areaId: '',
    cityName: '',
    cityId: '',
    cityReferenceCarNum: null,
    createdTime: '',
    drivingSchoolId: '',
    drivingSchoolReferenceCarNum: null,
    drivingSchoolReferenceCarPercent: null,
    examCarType: [],
    examPlaceAlias: '',
    examPlaceName: '',
    examPlaceType: null,
    examSubjects: [],
    isOftenExamPlace: true,
    provinceName: '',
    provinceId: '',
    status: true,
  };

  // 表单配置规则
  private baseFormRule = {
    address: [
      { required: true, message: '请输入详细地址', trigger: ['change', 'blur'] }
    ],
    examPlaceName: [
      { required: true, message: '请输入考场名称', trigger: ['change', 'blur'] }
    ],
    areaId: [
      { required: true, message: '请选择区', trigger: ['change', 'blur'] }
    ],
    cityId: [
      { required: true, message: '请选择城市', trigger: ['change', 'blur'] }
    ],
    provinceId: [
      { required: true, message: '请选择省份', trigger: ['change', 'blur'] }
    ],
    isOftenExamPlace: [
      { required: true, message: '此项为必选项', trigger: ['change', 'blur'] }
    ],
    examPlaceType: [
      { required: true, message: '此项为必选项', trigger: ['change', 'blur'] }
    ],
    examSubjects: [
      { required: true, message: '此项为必选项', trigger: ['change', 'blur'] }
    ],
    examCarType: [
      { required: true, message: '此项为必选项', trigger: ['change', 'blur'] }
    ],
    cityReferenceCarNum: [
      { required: true, message: '请输入全市备案车辆数', trigger: ['change', 'blur'] },
      { pattern: REG_ZERO_INTEGER, message: '请输入正整数' },
      {
        type: 'number', min: 0, max: 999999999, message: '最小0, 最大999999999'
      }
    ],
    drivingSchoolReferenceCarNum: [
      { required: true, message: '请输入驾校备案车辆数', trigger: ['change', 'blur'] },
      { pattern: REG_ZERO_INTEGER, message: '请输入正整数' },
      {
        type: 'number', min: 0, max: 999999999, message: '最小0, 最大999999999'
      }
    ],
  };

  private activeNamesOne = '1';

  private activeNamesTwo = '2';

  private activeNamesThree = '3';

  private activeNamesFour = '4';

  private subOneFormData: ParamsType = {
    carTypeMsg: [],
    examCost: '',
    examMode: null,
    examDay: []
  };

  private subOneFormRules = {
    dayNum: [
      { required: true, message: '请输入日考量', trigger: ['change', 'blur'] },
      { pattern: REG_ZERO_INTEGER, message: '请输入正整数' },
      {
        type: 'number', min: 0, max: 99999, message: '最小0, 最大99999'
      }
    ],
    examCost: [
      { required: true, message: '请输入初考考试费用', trigger: ['change', 'blur'] },
      { pattern: REG_PRICE_OR_ZONE, message: '范围0-999999,可保留两位小数' }
    ],
    examMode: [
      { required: true, message: '请选择考试方式', trigger: ['change', 'blur'] }
    ],
    examDay: [
      { required: true, message: '请选择考试时间', trigger: ['change', 'blur'] }
    ]
  };

  private subTwoFormData: ParamsType = {
    carTypeMsg: [],
    examCost: '',
    examMode: null,
    examDay: []
  };

  private subTwoFormRules = {
    carTypeMsg: [
      { required: true, message: '此项为必填项' }
    ],
    examRoadNum: [
      { required: true, message: '请输入考道数量', trigger: ['change', 'blur'] },
      { pattern: REG_ZERO_INTEGER, message: '请输入正整数' },
      {
        type: 'number', min: 0, max: 99999, message: '最小0, 最大99999'
      }
    ],
    examPlaceCarNum: [
      { required: true, message: '请输入考场车辆数', trigger: ['change', 'blur'] },
      { pattern: REG_ZERO_INTEGER, message: '请输入正整数' },
      {
        type: 'number', min: 0, max: 99999, message: '最小0, 最大99999'
      }
    ],
    dayNum: [
      { required: true, message: '请输入日考量', trigger: ['change', 'blur'] },
      { pattern: REG_ZERO_INTEGER, message: '请输入正整数' },
      {
        type: 'number', min: 0, max: 99999, message: '最小0, 最大99999'
      }
    ],
    examCost: [
      { required: true, message: '请输入初考考试费用', trigger: ['change', 'blur'] },
      { pattern: REG_PRICE_OR_ZONE, message: '范围0-999999,可保留两位小数' }
    ],
    carBrand: [
      { required: true, message: '此项为必选项', trigger: ['change', 'blur'] }
    ],
    teachingHours: [
      { required: true, message: '请输入大纲教学学时', trigger: ['change', 'blur'] },
      { pattern: REG_PRICE_OR_ZONE, message: '范围0-999999,可保留两位小数' }
    ],
    examMode: [
      { required: true, message: '请选择考试方式', trigger: ['change', 'blur'] }
    ],
    examDay: [
      { required: true, message: '请选择考试时间', trigger: ['change', 'blur'] }
    ]
  };

  private subThreeFormData: ParamsType = {
    carTypeMsg: [],
    examCost: '',
    examMode: null,
    examDay: []
  };

  private subFourData: ParamsType = {
    dayNum: null,
    examCost: '',
    examMode: null,
    examDay: []
  };

  // 当前要设置车辆品牌的对象
  private carBrandData: ParamsType = {};

  /**
   * @description 选择车辆品牌
   */
  private changeCarBrand(index: number, item: any, type: number) {
    this.queryList();
    this.drawerName = true;
    // 给勾选车辆品牌数组赋值
    const { carBrand } = item;
    this.allSelectionList = carBrand ? carBrand.split(',') : [];
    this.carBrandData = {
      index,
      item,
      type
    };
  }

  // 监听数字变化，计算百分比
  @Watch('baseFormData.cityReferenceCarNum')
  private watchCityReferenceCarNumFunc() {
    this.setDrivingSchoolReferenceCarPercentFunc();
  }

  // 监听数字变化，计算百分比
  @Watch('baseFormData.drivingSchoolReferenceCarNum')
  private watchDrivingSchoolReferenceCarNumFunc() {
    this.setDrivingSchoolReferenceCarPercentFunc();
  }

  /**
   * @description 设置驾校备案车辆占比
   */
  private setDrivingSchoolReferenceCarPercentFunc() {
    const { cityReferenceCarNum, drivingSchoolReferenceCarNum } = this.baseFormData;
    if (cityReferenceCarNum > 0 && cityReferenceCarNum !== '' && drivingSchoolReferenceCarNum >= 0 && drivingSchoolReferenceCarNum !== '') {
      this.baseFormData.drivingSchoolReferenceCarPercent = Math.round(parseFloat((drivingSchoolReferenceCarNum / cityReferenceCarNum).toFixed(4)) * 10000) / 100;
    } else {
      this.baseFormData.drivingSchoolReferenceCarPercent = 0;
    }
  }

  // 展示考试车型
  private showCarItem = false;

  /**
   * @description 考试科目切换回调
   */
  @Watch('baseFormData.examSubjects', { deep: true, immediate: true })
  private watchExamSubjectsFunc(newVal: Array<any>) {
    // 科目一，科目三文明，不需要展示考试车型
    if (newVal.includes(2) || newVal.includes(3)) {
      this.showCarItem = true;
    } else {
      this.showCarItem = false;
    }
  }

  /**
   * @description 判断考试车型数组切换
   * 仅适用于新增
   */
  @Watch('baseFormData.examCarType', { deep: true })
  private watchExamCarTypeFunc(newVal: Array<any>, oldVal: Array<any>) {
    const _newLen = newVal.length;
    const _oldLen = oldVal.length;
    // 如果新数组比老数组长，表示要新增
    if (_newLen > _oldLen) {
      const _form = deepClone(publicItemForm);
      // 取最后一项，表示新增
      _form.carType = newVal[_newLen - 1];
      this.subTwoFormData.carTypeMsg.push(deepClone(_form));
      this.subThreeFormData.carTypeMsg.push(deepClone(_form));
    } else {
      // 对比差异
      const _list = newVal.concat(oldVal).filter((v, i, arr) => arr.indexOf(v) === arr.lastIndexOf(v));
      const _name = _list[0];
      this.removeCarType(_name);
    }
  }

  /**
   * @description 删除考试车型回调函数
   */
  private removeCarType(val: string) {
    // 遍历科目二、三列表
    const { subTwoFormData, subThreeFormData } = this;
    let _index = null;
    subTwoFormData.carTypeMsg.forEach((item: any, index: number) => {
      if (item.carType === val) {
        _index = index;
      }
    });
    subTwoFormData.carTypeMsg.splice(_index, 1);
    subThreeFormData.carTypeMsg.splice(_index, 1);
  }

  /**
   * @description 提交保存
   */
  private submit() {
    // 每个区域的表单都校验通过
    Promise.all(
      [this.baseSubmit(), this.oneSubmit(), this.twoSubmit(), this.threeSubmit(), this.fourSubmit()]
    ).then(res => {
      const {
        baseFormData, subOneFormData, subTwoFormData, subThreeFormData, subFourData
      } = this;
      const { examSubjects } = baseFormData;
      const sendData = {
        ...baseFormData,
        subjectFour: examSubjects.includes(4) ? subFourData : null,
        subjectOne: examSubjects.includes(1) ? subOneFormData : null,
        subjectThree: examSubjects.includes(3) ? subThreeFormData : null,
        subjectTwo: examSubjects.includes(2) ? subTwoFormData : null
      };
      this.saveOrUpdateExamPlace(sendData).then(() => {
        this.$message.success(`${this.$route.query.id ? '修改' : '新增'}成功！`);
        this.goback();
      });
    }).catch(err => {
      this.$message.warning('请按错误提示，完成必填项！');
    });
  }

  /**
   * @description 公共表单校验
   */
  private baseSubmit() {
    return new Promise((resolve, reject) => {
      (this.$refs.baseFormRef as VueComponentParent).validate((valid: boolean) => {
        if (valid) {
          resolve(true);
        } else {
          reject();
        }
      });
    });
  }

  /**
   * @description 第一个表单校验
   */
  private oneSubmit() {
    return new Promise((resolve, reject) => {
      if (!this.$refs.subOneFormRef) {
        resolve(true);
      } else {
        (this.$refs.subOneFormRef as VueComponentParent).validate((valid: boolean) => {
          if (valid) {
            resolve(true);
          } else {
            reject();
          }
        });
      }
    });
  }

  /**
   * @description 第二个表单校验
   */
  private twoSubmit() {
    return new Promise((resolve, reject) => {
      if (!this.$refs.subTwoFormRef) {
        resolve(true);
      } else {
        (this.$refs.subTwoFormRef as VueComponentParent).validate((valid: boolean) => {
          if (valid) {
            resolve(true);
          } else {
            reject();
          }
        });
      }
    });
  }

  /**
   * @description 第三个表单校验
   */
  private threeSubmit() {
    return new Promise((resolve, reject) => {
      if (!this.$refs.subThreeFormRef) {
        resolve(true);
      } else {
        (this.$refs.subThreeFormRef as VueComponentParent).validate((valid: boolean) => {
          if (valid) {
            resolve(true);
          } else {
            reject();
          }
        });
      }
    });
  }

  /**
   * @description 第四个表单校验
   */
  private fourSubmit() {
    return new Promise((resolve, reject) => {
      if (!this.$refs.subFourFormRef) {
        resolve(true);
      } else {
        (this.$refs.subFourFormRef as VueComponentParent).validate((valid: boolean) => {
          if (valid) {
            resolve(true);
          } else {
            reject();
          }
        });
      }
    });
  }

  // 抽屉
  private drawerName = false;

  /**
   * @description 抽屉关闭函数
   */
  private handleClose() {
    this.keywords = '';
    this.drawerName = false;
    this.allSelectionList = [];
  }

  // 分页列表配置
  private tableData: ParamsType = {
    selection: true,
    options: [
      {
        id: 1,
        label: '保存',
        type: 'primary'
      },
      {
        id: 2,
        label: '取消',
        type: 'info'
      },
    ],
    labels: [
      {
        key: 'name',
        label: '品牌名称'
      }
    ],
    list: [],
  }

  private allSelectionList: Array<string> = []; // 总选择的车辆品牌

  /**
   * @description 列表全选回调
   */
  private tableSelectionChange(val: []) {
    // 如果返回来的是空数组，则说明都没有勾选，把原先当前页勾选的都去掉
    // 如果返回的是整个当前页数组，则把所有数据都添加到勾选数据里面去
    const { list } = this.tableData;
    if (val.length === list.length) {
      const _list: Array<string> = [];
      list.forEach((item: any) => {
        _list.push(item.name);
      });
      const _newList = [...this.allSelectionList, ..._list].filter(res => res && res.trim());
      this.allSelectionList = Array.from(new Set(_newList));
    } else {
      list.forEach((item: any) => {
        const _index = this.allSelectionList.indexOf(item.name);
        if (_index > -1) {
          this.allSelectionList.splice(_index, 1);
        }
      });
    }
  }

  /**
   * @description 列表选中每一列切换回调
   */
  private tableSelectionClick(val: any) {
    // 判断是否在勾选数组里面，在就是要删除，否则就是添加
    const _index = this.allSelectionList.indexOf(val.name);
    if (_index > -1) {
      this.allSelectionList.splice(_index, 1);
    } else {
      this.allSelectionList.push(val.name);
    }
  }

  // 列表操作回调
  private tableOptionCallback(val: any) {
    const { id } = val;
    if (id === 1) {
      this.setCarBrandToFormTabel();
      return;
    }
    if (id === 2) {
      this.handleClose();
    }
  }

  /**
   * @description 设置考试车品牌到对应列表
   */
  private setCarBrandToFormTabel() {
    const { allSelectionList, carBrandData } = this;
    carBrandData.item.carBrand = allSelectionList.join(',');
    this.handleClose();
  }

  // 分页列表
  private paginationData = {
    pageSize: 10,
    current: 1,
    total: 0
  }

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

  private toggleRowSelectionFunc() {
    this.$nextTick(() => {
      this.tableData.list.forEach(((item: any, index: number) => {
        if (this.allSelectionList.includes(item.name)) {
          ((this.$refs.tableDataRef as VueComponentParent).$children[1] as VueComponentParent).toggleRowSelection(this.tableData.list[index], true);
        }
      }));
    });
  }

  // 搜索车辆品牌
  private searchCarBrand() {
    this.paginationData.current = 1;
    this.queryList();
  }

  private keywords = '';

  async queryList() {
    const { current, pageSize } = this.paginationData;
    const sendData = {
      carBrandName: this.keywords,
      current,
      pageSize
    };
    try {
      const body = await this.getCarBrandList(sendData);
      const {
        data, total
      } = body;
      const _list: ParamsType = [];
      data.forEach((item: string) => {
        _list.push({ name: item });
      });
      this.tableData.list = _list;
      this.paginationData.current = body.current;
      this.paginationData.total = total;
      this.toggleRowSelectionFunc();
    } catch (error) {
      //
    }
  }

  private async queryDetails(id: string) {
    this.queryExamPlaceDetailById({ id }).then((res: any) => {
      const {
        subjectOne, subjectTwo, subjectThree, subjectFour
      } = res;
      Object.keys(this.baseFormData).forEach(key => {
        this.baseFormData[key] = res[key];
      });
      this.$nextTick(() => {
        if (subjectOne) {
          this.subOneFormData = subjectOne;
        }
        if (subjectTwo) {
          this.subTwoFormData = subjectTwo;
        }
        if (subjectThree) {
          this.subThreeFormData = subjectThree;
        }
        if (subjectFour) {
          this.subFourData = subjectFour;
        }
      });
    });
  }

  private isEdit = false;

  private goback() {
    this.clearCache();
    this.$router.push({ path: '/educational/basic_set/examinroom_mg' });
  }

  // 生命周期
  perm = {};

  async activated() {
    const { id, isEdit } = this.$route.query;
    this.isEdit = isEdit === '1';
    if (typeof id === 'string' && id) {
      this.queryDetails(id);
    }
    const permObj = await (this as any).$getPerm(this);
    this.perm = permObj.perm;
  }
}
