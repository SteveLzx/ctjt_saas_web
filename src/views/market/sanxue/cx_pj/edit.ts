import { Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import { ParamsType, VueComponentParent } from '@/type';
import { CtjtRejectDialog, CtjtTable, CtjtCard } from '@/components';
import Index from './index';

@Component({
  components: {
    CtjtTable, CtjtCard, CtjtRejectDialog
  }
})
export default class MarketSanXueCxToPjMgEdit extends mixins(Index) {
  @Action('order/queryBeginnerDetail') queryBeginnerDetail!: (data: any) => ParamsType;

  @Action('order/putNoPassApproves') putNoPassApproves!: (data: any) => ParamsType;

  @Action('order/putPassApproves') putPassApproves!: (data: any) => ParamsType;

  @Action('order/updateScatteredBeginnerApprove') updateScatteredBeginnerApprove!: (data: any) => ParamsType;

  type = 0; // 1编辑

  // 驳回
  rejectShow = false;

  async rejectCallBack(val: any) {
    if (val === false) return;
    const { remark, data } = val;
    const { approveId } = this.formData;
    const sendData = { id: approveId, verifyOpinion: remark, verifyNode: data.verifyNode };
    await this.putNoPassApproves(sendData);
    this.close();
  }

  tableData: ParamsType = {
    labels: [
      {
        label: '审批环节',
        key: 'verifyNode'
      },
      {
        label: '审核人',
        key: 'createdName'
      },
      {
        label: '审核操作',
        key: 'verifyOperation'
      },
      {
        label: '审核意见',
        key: 'verifyOpinion',
        render(h: any, params: any) {
          const { verifyOpinion } = params.row;
          return h('el-popover', {
            props: {
              placement: 'top-start',
              width: '300',
              trigger: 'hover',
              content: verifyOpinion,
            },
            scopedSlots: {
              reference: () => h('p', verifyOpinion),
            },
          });
        }
      },
      {
        label: '审核时间',
        key: 'verifyDate'
      }
    ],
    list: []
  }

  submitLoading = false;

  submitForm() {
    (this.$refs.formRef as VueComponentParent).validate((valid: boolean) => {
      if (valid) {
        this.submitLoading = true;
        const sendData = {
          ...this.formData,
          pickUpProvince: this.codeToName(this.provData, this.formData.pickUpProvinceId),
          pickUpCity: this.codeToName(this.cityData, this.formData.pickUpCityId),
          pickUpArea: this.codeToName(this.areaData, this.formData.pickUpAreaId)
        };
        this.updateScatteredBeginnerApprove(sendData).then((res: any) => {
          this.$message.success('编辑成功');
          this.close();
        }).finally(() => {
          this.submitLoading = false;
        });
      } else {
        this.$message.warning('您的信息填写有误，请仔细检查并修改！');
      }
    });
  }

  close() {
    this.clearCache();
    this.$router.push({ path: '/market/sxpj/cx_pj' });
  }

  async submit(n: number) {
    const { approveId } = this.formData;
    const { data } = this.$route.query;
    switch (n) {
      case 1:
        this.rejectShow = true;
        break;
      case 2:
        this.$prompt('请输入通过理由', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^.{0,50}$/,
          inputErrorMessage: '输入内容长度为0-50'
        }).then((res: any) => {
          const { value } = res;
          if (value === null || value.length <= 50) {
            const sendData = { id: approveId, verifyOpinion: value ? `同意，${value}` : '同意' };
            this.putPassApproves(sendData).then(() => {
              this.close();
            });
          } else {
            this.$message.warning('输入内容长度为0-50');
          }
        });
        break;
      case 3:
        this.type = 1;
        break;
      default:
        break;
    }
  }

  perm = {};

  async init() {
    this.setProvFunc();
    const { data } = this.$route.query;
    if (typeof data === 'string') {
      const _data: ParamsType = JSON.parse(decodeURIComponent(data));
      Object.keys(_data).forEach(key => {
        this.formData[key] = _data[key];
      });
      // 请求详情
      const { id, remark } = _data;
      const sendData = {
        id,
        remark
      };
      this.queryBeginnerDetail(sendData).then(async (r: any) => {
        const { beginnerDo, records } = r;
        this.tableData.list = records;
        const { pickUpProvinceId, pickUpCityId, pickUpAreaId } = beginnerDo;
        await new Promise((resolve, reject) => {
          this.provChange(pickUpProvinceId);
          resolve(true);
        }).then(() => {
          this.cityChange(pickUpCityId);
        });
        const keys = [
          'carModel', 'type', 'pickUpProvinceId', 'pickUpCityId', 'pickUpAreaId', 'pickUpDetail', 'returnVisit'
        ];
        Object.keys(this.formData).forEach(key => {
          if (keys.includes(key)) {
            this.formData[key] = beginnerDo[key];
          }
        });
      });
    }
    const permObj = await (this as any).$getPerm(this);
    this.perm = permObj.perm;
  }

  activated() {
    this.init();
  }
}
