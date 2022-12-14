import { State, Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import clearCacheMixins from '@/mixins/clearCache';
import { CtjtCard, CtjtTable } from '@/components';
import { VueComponentParent } from '@/type';
import { deepClone, jsReduceFunc, jsAddFunc } from '@/assets/js/common';
import {
  ORDER_IDNO_TYPE, EDUCATIONAL_SEX, ORDER_INVOICE_TYPE, ORDER_OPEN_INVOICE_TYPE, ORDER_DISCOUNT_TYPE, ORDER_PAY_TYPE,
  THIRD_CHANNELS_OPTS
} from '@/enums';
import {
  detailFormData, detailFormData1, detailFormRules, detailOrderPaytableData, carModelOpts
} from './index';

@Component({
  components: { CtjtCard, CtjtTable }
})
export default class MarketSanXueOrderMgDetail extends mixins(clearCacheMixins) {
  @State((state) => state.base.userInfo) userInfo: any;

  @Action('base/queryGroupMechanismData') private queryGroupMechanismData!: (data: any) => any;

  @Action('sale/querySourceDropDownBoxList') private querySourceDropDownBoxList!: (data: any) => any;

  @Action('goods/queryClassesInfoList') private queryClassesInfoList!: (data: any) => any;

  @Action('order/queryScatteredBrandOpts') private queryScatteredBrandOpts!: () => any;

  @Action('finance/queryAllBankAccountList') private queryAllBankAccountList!: () => any;

  @Action('finance/queryAllPosTerminalNoList') private queryAllPosTerminalNoList!: (data: any) => any;

  @Action('order/queryChannelList') private queryChannelList!: () => any;

  @Action('order/addOrUpdateScatteredOrder') private addOrUpdateScatteredOrder!: (data: any) => any;

  @Action('user/queryGroupUserList') private queryGroupUserList!: (data: any) => any;

  @Action('assignment/queryScatteredCoach') private queryScatteredCoach!: () => any;

  @Action('order/queryScatteredById') private queryScatteredById!: (data: any) => any;

  @Action('order/queryScatteredFindAllClass') private queryScatteredFindAllClass!: () => any;

  @Action('sale/queryMarketListDropDownBoxList') private queryMarketListDropDownBoxList!: (data: any) => any;

  // ????????????
  idNoTypeOpts = ORDER_IDNO_TYPE;

  // ??????????????????
  handleCertificateType() {
    this.formData.idNo = '';
    this.formData.sex = 0;
  }

  // ??????
  sexOpts = EDUCATIONAL_SEX;

  // ??????json
  provCity = require('@/assets/json/prov.json');

  // ?????????
  provData: any[] = [];

  // ?????????
  cityData: any[] = [];

  // ?????????
  areaData: any[] = [];

  addressData = {
    provinceSubs: [],
    citySubs: [],
  }

  // ?????????
  setProvFunc() {
    this.provData = [];
    this.provCity.forEach((item: any) => {
      const { adcode, name } = item;
      const _obj = { adcode, name };
      this.provData.push(_obj);
    });
  }

  // ????????????
  setCityFunc() {
    const { provinceSubs } = this.addressData;
    provinceSubs.forEach((item: any) => {
      const { adcode, name } = item;
      const _obj = { adcode, name };
      this.cityData.push(_obj);
    });
  }

  // ????????????
  setAreaFunc() {
    const { citySubs } = this.addressData;
    citySubs.forEach((item: any) => {
      const { adcode, name } = item;
      const _obj = { adcode, name };
      this.areaData.push(_obj);
    });
  }

  // ??????????????????
  provChange(event: string) {
    this.formData.pickUpCity = '';
    this.formData.pickUpCityId = '';
    this.formData.pickUpArea = '';
    this.formData.pickUpAreaId = '';
    // ??????????????????????????????????????????
    this.cityData = [];
    this.areaData = [];
    this.addressData.provinceSubs = [];
    this.addressData.citySubs = [];

    this.provCity.forEach((item: any) => {
      const { adcode, name, subs } = item;
      if (adcode === event) {
        this.addressData.provinceSubs = subs;
        this.formData.pickUpProvince = name;
      }
    });
    this.setCityFunc();
  }

  // ????????????
  cityVisible(bool: boolean) {
    // ????????????????????????
    if (bool) {
      const { pickUpProvinceId } = this.formData;
      if (!pickUpProvinceId) this.$message.warning('??????????????????!');
    }
  }

  // ??????????????????
  cityChange(event: string) {
    this.formData.pickUpArea = '';
    this.formData.pickUpAreaId = '';
    // ???????????????????????????
    this.areaData = [];
    this.addressData.citySubs = [];

    const { provinceSubs } = this.addressData;
    provinceSubs.forEach((item: any) => {
      const { adcode, name, subs } = item;
      if (adcode === event) {
        this.addressData.citySubs = subs;
        this.formData.pickUpCity = name;
      }
    });
    this.setAreaFunc();
  }

  // ????????????
  areaVisible(bool: boolean) {
    // ????????????????????????
    if (bool) {
      const { pickUpCityId } = this.formData;
      if (!pickUpCityId) this.$message.warning('??????????????????!');
    }
  }

  // ????????????
  areaChange(event: string) {
    const { areaData } = this;
    areaData.forEach((item: any) => {
      const { adcode, name } = item;
      if (adcode === event) {
        this.formData.pickUpArea = name;
      }
    });
  }

  // ????????????
  invoiceTypeOpts = ORDER_INVOICE_TYPE

  // ????????????
  openIncoiceTypeOpts = ORDER_OPEN_INVOICE_TYPE

  @Watch('formData.name', { deep: true })
  handleWatchName(val: string) {
    if (this.type === 0) {
      this.formData.invoiceName = val;
    }
  }

  // ????????????
  channelOpts: any = [];

  channel2Opts: any = [];

  async handleChannelChange(val: string) {
    const list: any = this.channelOpts.filter((item: any) => item.name === val);
    const { 0: data } = list;
    const {
      followType, followTypeDrivingSchoolId, roleIds, scope
    } = data;
    this.formData.thirdRegionName = '';
    this.formData.thirdRegionId = '';
    this.formData.thirdStoreId = '';
    this.formData.thirdStoreName = '';
    this.sgRegionOpts = [];
    this.sgStoreOpts = [];
    this.formData.channel2 = '';
    const { drivingSchoolId } = this.userInfo;
    if (drivingSchoolId === '3374') {
      const { secondLevelList } = data;
      const deepSecondLevelList = deepClone(secondLevelList);
      deepSecondLevelList.forEach((item: any) => {
        const { secondLevelName } = item;
        const _item = item;
        _item.name = secondLevelName;
      });
      this.channel2Opts = deepSecondLevelList;
    } else {
      switch (followType) {
        case 1:
          this.channel2Opts = await this.queryGroupUserList({ roleIds });
          break;
        case 2:
          this.queryRegionOrStore(followTypeDrivingSchoolId, 'sgregion');
          break;
        case 3:
          this.channel2Opts = scope ? JSON.parse(scope) : [];
          break;
        default:
          break;
      }
    }
    // ??????????????????
    this.handlePeriodInput();
  }

  async queryChannelOpts() {
    const { drivingSchoolId } = this.userInfo;
    const { id } = this.$route.query;
    if (drivingSchoolId === '3374') {
      const body = await this.queryMarketListDropDownBoxList({ drivingSchoolId, status: !id ? 1 : null });
      const deepBody = deepClone(body);
      const list: any[] = [];
      Object.keys(deepBody).forEach((key: string) => {
        list.push({ name: key, secondLevelList: deepBody[key] });
      });
      this.channelOpts = list;
    } else {
      const body = await this.queryChannelList();
      this.channelOpts = body;
    }
  }

  // sg??????
  sgRegionOpts = [];

  handleSGRegionChange(val: any) {
    const list: any = this.sgRegionOpts.filter((item: any) => item.name === val);
    this.formData.thirdRegionId = list[0] ? list[0].id : null;
    if (!val) {
      this.sgStoreOpts = [];
      this.formData.thirdStoreId = '';
      this.formData.thirdStoreName = '';
    }
    this.queryRegionOrStore(this.formData.thirdRegionId, 'sgstore');
  }

  // sg??????
  sgStoreOpts = [];

  handleSGStoreChange(val: string) {
    const list: any = this.sgStoreOpts.filter((item: any) => item.name === val);
    this.formData.thirdStoreId = list[0] ? list[0].id : null;
  }

  // ????????????
  sourceOpts: any = [];

  async querySourceList() {
    const { drivingSchoolId } = this.userInfo;
    const sendData = {
      drivingSchoolId
    };
    const body = await this.querySourceDropDownBoxList(sendData);
    this.sourceOpts = body;
  }

  // ????????????
  classessOpts = [];

  handleExamClassesChange(val: string) {
    const list: any = this.classessOpts.filter((item: any) => item.name === val);
    this.formData.examClassesId = list[0] ? list[0].id : null;
    (this.$refs.period as VueComponentParent).resetField();
    // ???????????????????????????????????????
    const { drivingSchoolId } = this.userInfo;
    if (drivingSchoolId === '370') {
      const { 0: data } = list;
      if (data) {
        const { maxPeriod, minPeriod } = data;
        const _text = `${minPeriod}-${maxPeriod}??????`;
        const compare = (num: number) => num >= minPeriod && num <= maxPeriod;
        const validatePeriod = (rule: any, value: string, callback: any) => {
          if (value === '') {
            callback(new Error('???????????????'));
          } else if (!/^\+?[1-9][0-9]*$/.test(value) || !compare(Number(value))) {
            callback(new Error(`??????????????????${_text}`));
          } else {
            callback();
          }
        };
        this.formRules.period[1].message = _text ? `??????????????????${_text}` : '';
        this.periodPlaceholder = _text ? `?????????${_text}???????????????` : '?????????>0?????????';
        if (_text) {
          this.formRules.period[1] = {
            validator: validatePeriod, trigger: ['change', 'blur']
          };
        }
      }
    }
    // ??????????????????
    this.handlePeriodInput();
  }

  async queryClassessList() {
    const { drivingSchoolId } = this.userInfo;
    if (drivingSchoolId === '370') {
      const body = await this.queryScatteredFindAllClass();
      this.classessOpts = body;
    } else {
      const body = await this.queryClassesInfoList({ type: 2 });
      this.classessOpts = body;
    }
  }

  // ????????????
  carModelOpts = carModelOpts;

  // ??????????????????
  carBrandOpts = [];

  async queryCarBrand() {
    const body = await this.queryScatteredBrandOpts();
    this.carBrandOpts = body;
  }

  // ????????????
  discountTypeOpts = ORDER_DISCOUNT_TYPE;

  discountTypeChange(val: number) {
    if (val === 1 || val === 3) {
      this.formData.presentPeriod = null;
    } else if (val === 2) {
      this.formData.discountAmount = null;
    } else {
      this.formData.discountAmount = null;
      this.formData.presentPeriod = null;
    }
    this.handlePresentPeriodInput();
    this.handleDiscountAmountInput();
  }

  // ????????????
  studyCarCoachOpts = []

  async queryScatteredCoachOpts() {
    const body = await this.queryScatteredCoach();
    this.studyCarCoachOpts = body || [];
  }

  handleCoachChange(val: string) {
    const list: any = this.studyCarCoachOpts.filter((item: any) => item.name === val);
    this.formData.coachId = list[0] ? list[0].id : '';
  }

  // ????????????
  payTypeOpts = ORDER_PAY_TYPE;

  // ??????????????????
  payTypeChange(val: number) {
    let _index = 0;
    let _item: any = {};
    this.formData.payInfoList.forEach((item: any, index: number) => {
      if (index === val) {
        _index = index;
        _item = deepClone(item);
        _item.payContent = _item.payType === 6 ? '????????????' : '';
        _item.outTradeNo = '';
        _item.transactionId = '';
        _item.remark = '';
      }
    });
    this.$set(this.formData.payInfoList, _index, _item);
  }

  // ????????????
  allBankAccountOpts = [];

  // pos?????????
  allPosTerminalNoOpts = [];

  // ?????????????????????
  thirdChannelsOpts = THIRD_CHANNELS_OPTS;

  // ????????????
  orderPaytableData = detailOrderPaytableData;

  // ??????
  regionOpts = [];

  handleRegionChange(val: any) {
    const list: any = this.regionOpts.filter((item: any) => item.name === val);
    this.formData.regionId = list[0] ? list[0].id : null;
    if (!val) {
      this.storeOpts = [];
      this.formData.storeId = '';
      this.formData.storeName = '';
      return;
    }
    this.queryRegionOrStore(this.formData.regionId, 'store');
  }

  // ??????
  storeOpts = [];

  handleStoreChange(val: string) {
    const list: any = this.storeOpts.filter((item: any) => item.name === val);
    this.formData.storeId = list[0] ? list[0].id : null;
  }

  // ??????????????????
  async queryRegionOrStore(id: string, type: string) {
    const body = await this.queryGroupMechanismData({ pid: id });
    if (type === 'region') {
      this.regionOpts = body;
    }
    if (type === 'store') {
      this.storeOpts = body;
    }
    if (type === 'sgregion') {
      this.sgRegionOpts = body;
    }
    if (type === 'sgstore') {
      this.sgStoreOpts = body;
    }
  }

  // ??????????????????
  periodPlaceholder = '?????????>0?????????';

  handlePeriodInput() {
    // ???????????????????????????
    const { examClassesId } = this.formData;
    if (examClassesId) {
      // ????????????id??????????????????????????????
      const list: any = this.classessOpts.filter((item: any) => item.id === examClassesId);
      const { 0: data } = list;
      if (data) this.getPriceFunc(data);
    }
  }

  handlePresentPeriodInput() {
    const { presentPeriod, period } = this.formData;
    // ?????????
    this.formData.sumPeriod = Number(period) + Number(presentPeriod);
  }

  getPriceFunc(data: any) {
    const { drivingSchoolId } = this.userInfo;
    const {
      period, discountAmount, presentPeriod
    } = this.formData;
    const { price, amount } = data;
    let _amount = '';
    if (drivingSchoolId === '370') {
      _amount = amount;
    } else {
      _amount = price;
    }
    const _price = parseFloat(_amount) * period; // ????????????????????????
    // ??????
    this.formData.originalPrice = _price;
    // ????????????
    const dPrice = jsReduceFunc(_price, discountAmount);
    this.formData.amount = dPrice;
    // ????????????
    this.formData.practicalAmount = dPrice;
    // ?????????
    this.formData.sumPeriod = Number(period) + Number(presentPeriod);
  }

  // ??????????????????
  handleDiscountAmountInput() {
    const { originalPrice, discountAmount } = this.formData;
    // ????????????
    const dPrice = jsReduceFunc(originalPrice, discountAmount);
    this.formData.amount = dPrice;
    // ????????????
    this.formData.practicalAmount = dPrice;
  }

  // ????????????????????????
  addOrderPayVos() {
    const { payInfoList } = this.formData;
    const len = payInfoList.length;
    if (len > 9) {
      this.$message.warning('????????????????????????10???');
    } else {
      const obj = {
        amount: '',
        id: '',
        payContent: '',
        payTime: this.$dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        payType: 2,
        outTradeNo: '',
        transactionId: '',
        remark: '',
      };
      payInfoList.push(obj);
    }
  }

  // ????????????????????????
  deleteOrderPayVos(index: number) {
    const { payInfoList } = this.formData;
    payInfoList.splice(index, 1);
  }

  // formData = deepClone(detailFormData1);

  formData = deepClone(detailFormData);

  formRules = deepClone(detailFormRules);

  cancel() {
    const deepFormData = deepClone(detailFormData);
    Object.keys(this.formData).forEach(key => {
      this.formData[key] = deepFormData[key];
    });
    // (this.$refs.sxpjOrderFormRef as VueComponentParent).resetFields();
    this.clearCache();
    this.$router.push({ path: '/market/sxpj/order' });
  }

  submitLoading = false;

  submit() {
    (this.$refs.sxpjOrderFormRef as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        const { formData, type, userInfo } = this;
        const sendData = { ...formData };
        const { examDateTime, payInfoList, amount: allAmount } = sendData;
        sendData.examDateTime = this.$dayjs(examDateTime).format('YYYY-MM-DD HH:mm:ss');
        // ??????????????????
        let _orderPayListAmount = 0; // ???????????????
        payInfoList.forEach((item: any) => {
          const { payTime, id, amount } = item;
          const _item = item;
          if (!id) delete _item.id;
          _item.payTime = payTime ? this.$dayjs(payTime).format('YYYY-MM-DD HH:mm:ss') : '';
          _orderPayListAmount = jsAddFunc(_orderPayListAmount, amount);
        });
        if (allAmount !== _orderPayListAmount) {
          this.$message.warning('???????????????????????????????????????');
          return;
        }
        if (type === 2) {
          delete sendData.id;
          delete sendData.invoiceId;
        }
        // ??????????????????????????????????????????
        if (type === 3) {
          const { drivingSchoolId } = this.userInfo;
          if (drivingSchoolId === '3374') {
            this.$prompt('?????????????????????', '??????', {
              confirmButtonText: '??????',
              cancelButtonText: '??????',
              inputPattern: /^.{1,100}$/,
              inputErrorMessage: '?????????????????????1-100'
            }).then((val: any) => {
              const { value } = val;
              sendData.orderLogReq = { reason: value, updatedName: userInfo.name };
              this.submitLoading = true;
              this.addOrUpdateScatteredOrder(sendData).then(() => {
                this.$message.success('????????????');
                this.cancel();
              }).finally(() => {
                this.submitLoading = false;
              });
            }).catch(() => {
              this.$message.info('???????????????');
            });
          } else {
            sendData.orderLogReq = { reason: '??????', updatedName: userInfo.name };
            this.submitLoading = true;
            this.addOrUpdateScatteredOrder(sendData).then(() => {
              this.$message.success('????????????');
              this.cancel();
            }).finally(() => {
              this.submitLoading = false;
            });
          }
        } else {
          this.submitLoading = true;
          this.addOrUpdateScatteredOrder(sendData).then(() => {
            let text = '????????????';
            if (type === 2) text = '??????????????????';
            if (type === 4) text = '????????????';
            this.$message.success(text);
            this.cancel();
          }).finally(() => {
            this.submitLoading = false;
          });
        }
      } else {
        this.$message.warning('??????????????????????????????????????????????????????');
      }
    });
  }

  // ??????????????????????????????
  editOrderPayVos(val: number) {
    const { drivingSchoolId } = this.userInfo;
    const { payInfoList } = this.formData;
    if (drivingSchoolId === '3374') {
      // ????????????==??????????????????????????????????????????????????????????????????????????????????????????
    }
    let sendData = {};
    payInfoList.forEach((item: any, index: number) => {
      if (index === val) {
        const { id, orderId } = item;
        sendData = {
          orderId, orderType: 2, payId: id
        };
      }
    });
    this.$router.push({
      path: '/finance/transaction_mg/system_flow/detail',
      query: { obj: encodeURIComponent(JSON.stringify({ ...sendData, isDetail: false })) },
    });
  }

  type = 0 // ?????????????????? 0?????????1???????????????2???????????????3?????????4???????????????

  async init() {
    const {
      drivingSchoolId, drivingSchoolName, storeId, storeName, regionId, regionName
    } = this.userInfo;
    this.formData.drivingSchoolId = drivingSchoolId;
    this.formData.drivingSchoolName = drivingSchoolName;
    this.formData.storeId = storeId;
    this.formData.storeName = storeName;
    this.formData.regionId = regionId;
    this.formData.regionName = regionName;
    const newTime = this.$dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss');
    this.formData.examDateTime = newTime;
    this.formData.payTime = newTime;
    this.setProvFunc();
    this.querySourceList();
    this.queryClassessList();
    this.queryChannelOpts();
    this.queryScatteredCoachOpts();
    this.queryCarBrand();
    this.queryAllBankAccountList().then((res: any) => {
      this.allBankAccountOpts = res;
    });
    this.queryAllPosTerminalNoList({ type: 2 }).then((res: any) => {
      this.allPosTerminalNoOpts = res;
    });
    this.queryRegionOrStore(drivingSchoolId, 'region');
    this.queryRegionOrStore(regionId, 'store');
    const { id, type = 0 } = this.$route.query;
    this.type = Number(type);
    this.formData.examType = this.type;
    if (id) {
      this.queryScatteredById({ id }).then((res: any) => {
        const {
          pickUpProvinceId, pickUpCityId, examClasses, discountType, payInfoList, channel
        } = res;
        this.provChange(pickUpProvinceId);
        this.cityChange(pickUpCityId);
        this.handleExamClassesChange(examClasses);
        this.handleChannelChange(channel);
        Object.keys(this.formData).forEach(key => {
          this.formData[key] = res[key];
        });
        this.formData.discountType = discountType === 0 ? null : discountType;
        let _type = 1;
        if (this.type === 2) {
          this.formData.payTime = this.$dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss');
        }
        if (this.type === 3) _type = 2;
        if (this.type === 4) _type = 3;
        this.formData.updateType = _type;
        this.orderPaytableData._this = this;
        this.orderPaytableData.list = deepClone(payInfoList);
        // ???????????????????????????????????????????????????
      });
    }
    if (drivingSchoolId === '3374') {
      this.formRules.pickUpProvinceId[0].required = false;
      this.formRules.pickUpCityId[0].required = false;
      this.formRules.pickUpAreaId[0].required = false;
      this.formRules.pickUpDetail[0].required = false;
    }
    if (drivingSchoolId === '370') {
      this.formData.pickUpProvince = '?????????';
      this.formData.pickUpProvinceId = '440000';
      this.provChange('440000');
      this.formData.pickUpCity = '?????????';
      this.formData.pickUpCityId = '440300';
      this.cityChange('440300');
    }
  }

  // ??????????????????
  perm = {};

  async activated() {
    this.init();
    const permObj = await this.$getPerm(this);
    this.perm = permObj.perm;
  }
}
