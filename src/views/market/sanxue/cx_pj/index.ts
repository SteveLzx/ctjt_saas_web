import { Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import { ParamsType } from '@/type';
import { REG_TWO_FLOAT_NUMBER } from '@/assets/js/common';
import clearCacheMixins from '@/mixins/clearCache';

const form: ParamsType = {
  id: '', // 订单id
  seq: '', // 招生订单
  userName: '',
  idNo: '',
  classesName: '', // 班别
  activityName: '', // 优惠活动
  storeName: '', // 门店
  registerTime: null, // 报名日期
  graduationTime: null, // 毕业日期
  type: '', // 转入类型
  presentPeriod: null, // 赠送学时
  carModel: '', // 散学车型
  // 接送地址
  pickUpProvinceId: '', // 省份
  pickUpCityId: '', // 城市
  pickUpAreaId: '', // 区域
  pickUpDetail: '', // 详细地址
  returnVisit: '', // 回访情况
};

@Component
export default class Index extends mixins(clearCacheMixins) {
  @Action('order/reviewBeginner') reviewBeginner!: (data: any) => any;

  sanxueCarType = [
    { id: 1, label: 'C1' },
    { id: 2, label: 'C2' },
  ];

  formData = { ...form };

  formDataRules = {
    type: [
      { required: true, message: '请选择转入类型', trigger: ['change', 'blur'] }
    ],
    presentPeriod: [
      { required: true, message: '请输入赠送学时', trigger: ['change', 'blur'] },
      { pattern: REG_TWO_FLOAT_NUMBER, message: '请输入最多保留两位小数的数值' },
    ],
    carModel: [
      { required: true, message: '请选择散学车型', trigger: ['change', 'blur'] }
    ],
    pickUpProvinceId: [
      { required: true, message: '请选择省份', trigger: 'blur' }
    ],
    pickUpCityId: [
      { required: true, message: '请选择城市', trigger: 'blur' }
    ],
  };

  // 省数组
  provCity = require('@/assets/json/prov.json');

  // 省数组
  provData: any[] = [];

  // 市数组
  cityData: any[] = [];

  // 区数组
  areaData: any[] = [];

  // 设置省
  setProvFunc() {
    this.provData = [];
    this.provCity.forEach((item: any) => {
      const { adcode, name } = item;
      const _obj = { adcode, name };
      this.provData.push(_obj);
    });
  }

  // 省份切换选择
  provChange(val: string) {
    // 省份切换，清空城市，区域数组
    this.cityData = [];
    this.areaData = [];
    this.formData.pickUpCityId = '';
    this.formData.pickUpAreaId = '';
    this.provCity.forEach((item: any) => {
      const { adcode, subs } = item;
      if (adcode === val) {
        this.cityData = subs;
      }
    });
  }

  // 城市展开
  cityVisible(bool: boolean) {
    // 判断省份是否选中
    if (bool) {
      const { pickUpProvinceId } = this.formData;
      if (!pickUpProvinceId) this.$message.warning('请先选中省份!');
    }
  }

  // 城市切换选择
  cityChange(val: string) {
    // 城市切换，区域数组
    this.areaData = [];
    this.formData.pickUpAreaId = '';
    this.cityData.forEach((item: any) => {
      const { adcode, subs } = item;
      if (adcode === val) {
        this.areaData = subs;
      }
    });
  }

  // 区域展开
  areaVisible(bool: boolean) {
    // 判断省份是否选中
    if (bool) {
      const { pickUpCityId } = this.formData;
      if (!pickUpCityId) this.$message.warning('请先选中城市!');
    }
  }

  codeToName(list: Array<any>, codeVal: string, code = 'adcode', name = 'name') {
    const filterItem = list.filter((item) => item[code] === codeVal);
    return filterItem && filterItem.length > 0 ? filterItem[0][name] : '';
  }
}
