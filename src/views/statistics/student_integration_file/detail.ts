import Component, { mixins } from 'vue-class-component';
import { Action, State } from 'vuex-class';
import { ParamsType } from '@/type';
import { drivingSchool } from '@/assets/js/common';
import clearCacheMixins from '@/mixins/clearCache';

@Component
export default class StatisticsStudentIntegrationFileDetail extends mixins(clearCacheMixins) {
  @State(state => state.base.userInfo) userInfo: any;

  // 列表传过来单条对象数据
  private detailParams: any = {};

  private componentName = 'CertificateRecord';

  /** 判断是否是惠州深港 */
  isHuiZhouSchool() {
    const { drivingSchoolId } = this.userInfo;
    return drivingSchool(drivingSchoolId) === 'huizhou';
  }

  perm = {};

  private historyParams: any = '';

  async activated() {
    let { obj } = this.$route.query;
    const { historyParams } = this;
    if (obj !== historyParams) {
      this.componentName = 'CertificateRecord';
    }
    this.historyParams = obj;
    if (typeof obj === 'string') {
      obj = decodeURIComponent(obj);
      this.detailParams = JSON.parse(obj);
    }
    const permObj = await this.$getPerm(this);
    this.perm = permObj.perm;
  }
}
