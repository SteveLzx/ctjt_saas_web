import { Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import { deepClone } from '@/assets/js/common';
import { ParamsType } from '@/type';
import { approveStatusOpts, coachPostTypeOpts, teachingStatusOpts } from '@/views/educational/_enums';
import { EDUCATIONAL_SEX, MARKET_SERVICE_STATUS, EDUCATIONAL_COACH_TYPE } from '@/enums';
import { CtjtCard, CtjtTable } from '@/components';
import clearCacheMixins from '@/mixins/clearCache';

@Component({
  components: {
    CtjtCard, CtjtTable
  },
  filters: {
    statusFilter: (val: number) => {
      const _list = MARKET_SERVICE_STATUS;
      const _item = _list.filter(item => item.id === val);
      if (_item.length === 0) return '';
      return _item[0].label;
    },
    applyStatusFilter: (value: number) => {
      const _list = approveStatusOpts.filter((item: any) => item.id === value);
      if (_list.length > 0) {
        return _list[0].label;
      }
      return '';
    },
    sexFilter: (val: number) => {
      const _list = EDUCATIONAL_SEX;
      const _item = _list.filter(item => item.id === val);
      if (_item.length === 0) return '';
      return _item[0].label;
    },
    postTypeFilter: (val: number) => {
      const _list = coachPostTypeOpts;
      const _item = _list.filter(item => item.value === val);
      if (_item.length === 0) return '';
      return _item[0].label;
    },
    teachingClassFilter: (val: string) => {
      if (!val) return '';
      const _data = JSON.parse(val);
      const _text: Array<string> = [];
      _data.forEach((item: any) => _text.push(`${item.name}-${item.carModel}`));
      return _text.join('，');
    },
    spaceTrainingPlaceFilter: (val: string) => {
      if (!val) return '';
      const _data = JSON.parse(val);
      const _text: Array<string> = [];
      _data.forEach((item: any) => _text.push(item.name));
      return _text.join('，');
    },
    arrayToString: (val: string) => {
      if (!val) return '';
      const _data = JSON.parse(val);
      return _data.join('，');
    },
    secondaryStoreFilter: (val: string) => {
      if (!val) return '';
      const _data = JSON.parse(val);
      const _text: Array<string> = [];
      _data.forEach((item: any) => _text.push(item.name));
      return _text.join('，');
    },
    typeFilter: (val: number) => {
      const list = EDUCATIONAL_COACH_TYPE;
      const _item = list.filter((item: any) => item.id === val);
      if (_item.length === 0) return '';
      return _item[0].label;
    },
    teachingStatusFilter: (val: number) => {
      const list = teachingStatusOpts;
      const _item = list.filter((item: any) => item.value === val);
      if (_item.length === 0) return '';
      return _item[0].label;
    }
  }
})
export default class EducationalCoachMgCoachModifyDetail extends mixins(clearCacheMixins) {
  @Action('assignment/queryVerifyCoachChangeDetail') private queryVerifyCoachChangeDetail!: (data: any) => ParamsType;

  @Action('assignment/updateCoachVerifyOperation') private updateCoachVerifyOperation!: (data: any) => ParamsType;

  /**
   * @description 审核操作
   * @param val 1:通过,2:不通过,3:撤回
   */
  private applySubmit(val: number) {
    if (val === 1) {
      this.$confirm('审核通过?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.submit(val, '同意');
      });
    }
    if (val === 2) {
      this.$prompt('请输入驳回理由', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{1,30}$/,
        inputErrorMessage: '输入内容长度为1-30',
      }).then((res: any) => {
        const { value } = res;
        if (value && value.length > 30) {
          //
        } else {
          this.submit(val, res.value);
        }
      });
    }
    if (val === 3) {
      this.$confirm('是否撤销?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.submit(val, '撤销');
      });
    }
  }

  private btnLoading = false;

  private async submit(code: number, verifyOpinion: string) {
    const { taskId } = this.detailData;
    const sendData = {
      taskId,
      verifyOpinion,
      code,
    };
    this.btnLoading = true;
    this.updateCoachVerifyOperation(sendData).then(() => {
      this.$message.success('操作成功!');
      this.goback();
    }).finally(() => {
      this.btnLoading = false;
    });
  }

  // 列表配置
  private tableData: ParamsType = {
    _this: {},
    loading: false,
    labels: [
      {
        key: 'verifyNode',
        label: '审批环节'
      },
      {
        key: 'verifyUser',
        label: '审核人'
      },
      {
        key: 'verifyOperation',
        label: '审核操作'
      },
      {
        key: 'verifyOpinion',
        label: '审核意见'
      },
      {
        key: 'verifyDate',
        label: '审核时间'
      }
    ],
    list: [],
  }

  private detailData: ParamsType = {}; // 教练详情

  private carInformationList: ParamsType = {};

  private changTeachingInfoData: ParamsType = {}; // 修改后

  private teachingInfoData: ParamsType = {}; // 修改前

  private async queryDetail() {
    const { id } = this.$route.query;
    const sendData = {
      id,
      flowName: 2
    };
    const body = await this.queryVerifyCoachChangeDetail(sendData);
    this.detailData = body;
    const {
      verifyRecordList, carInformation, changTeachingInfo, teachingInfo
    } = body;
    if (Array.isArray(verifyRecordList)) {
      this.tableData.list = verifyRecordList;
    }
    if (carInformation) {
      this.carInformationList = JSON.parse(carInformation);
    }
    const _changTeachingInfo = deepClone(changTeachingInfo);
    Object.keys(_changTeachingInfo).forEach(key => {
      this.changTeachingInfoData[key] = _changTeachingInfo[key].value;
    });
    const _teachingInfo = deepClone(teachingInfo);
    Object.keys(_teachingInfo).forEach(key => {
      this.teachingInfoData[key] = _teachingInfo[key].value;
    });
  }

  private goback() {
    this.clearCache();
    this.$router.push({ path: '/educational/coach_mg/coach_modify' });
  }

  perm = {};

  async activated() {
    this.queryDetail();
    const permObj = await (this as any).$getPerm(this);
    this.perm = permObj.perm;
  }
}
