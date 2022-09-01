import Component, { mixins } from 'vue-class-component';
import { ParamsType, VueComponentParent } from '@/type';
import Index from './index';

@Component
export default class MarketSanXueCxToPjMgAdd extends mixins(Index) {
  submitLoading = false;

  close() {
    this.clearCache();
    this.$router.push({ path: '/market/sxpj/cx_pj' });
  }

  submit() {
    (this.$refs.formRef as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        this.submitLoading = true;
        const sendData = {
          ...this.formData,
          pickUpProvince: this.codeToName(this.provData, this.formData.pickUpProvinceId),
          pickUpCity: this.codeToName(this.cityData, this.formData.pickUpCityId),
          pickUpArea: this.codeToName(this.areaData, this.formData.pickUpAreaId)
        };
        this.reviewBeginner(sendData).then((res: any) => {
          this.$message.success('转陪驾申请成功');
          this.close();
        }).finally(() => {
          this.submitLoading = false;
        });
      } else {
        this.$message.warning('您的信息填写有误，请仔细检查并修改！');
      }
    });
  }

  init() {
    this.setProvFunc();
    const { data } = this.$route.query;
    if (typeof data === 'string') {
      const _data: ParamsType = JSON.parse(decodeURIComponent(data));
      Object.keys(_data).forEach(key => {
        this.formData[key] = _data[key];
      });
    }
  }

  activated() {
    this.init();
  }
}
