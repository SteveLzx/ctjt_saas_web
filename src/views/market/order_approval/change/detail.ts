import { Action } from 'vuex-class';
import Component, { mixins } from 'vue-class-component';
import { ParamsType } from '@/type';
import { mapDataExChange } from '@/assets/js/common';
import { approveStatusOpts } from '@/views/market/_enums';
import {
  ORDER_IDNO_TYPE, EDUCATIONAL_SEX, ORDER_INVOICE_TYPE, ORDER_OPEN_INVOICE_TYPE, ORDER_PAY_TYPE, ORDER_IS_INSTALLMENT,
  MARKET_MAKE_UP_EXAM, OLD_DRIVER_LICENSE
} from '@/enums';
import { CtjtTable, CtjtCard, CtjtRejectDialog } from '@/components';
import ctjtPaginationMixins from '@/mixins/pagination';
import clearCacheMixins from '@/mixins/clearCache';

@Component({
  components: {
    CtjtTable, CtjtCard, CtjtRejectDialog
  },
  filters: {
    auditStatusFilter(val: number): string {
      const _item = approveStatusOpts.filter((item: any) => item.id === val);
      if (_item.length === 0) {
        return '';
      }
      return _item[0].label;
    },
    certificateTypeFilter(val: number): string {
      const _item = ORDER_IDNO_TYPE.filter((item: any) => item.id === val);
      if (_item.length === 0) {
        return '';
      }
      return _item[0].label;
    },
    sexFilter(val: number): string {
      const _item = EDUCATIONAL_SEX.filter((item: any) => item.id === val);
      if (_item.length === 0) {
        return '';
      }
      return _item[0].label;
    },
    invoiceVoTypeFilter(val: number): string {
      const _item = ORDER_INVOICE_TYPE.filter((item: any) => item.id === val);
      if (_item.length === 0) {
        return '';
      }
      return _item[0].label;
    },
    invoiceVoModeFilter(val: number): string {
      const _item = ORDER_OPEN_INVOICE_TYPE.filter((item: any) => item.id === val);
      if (_item.length === 0) {
        return '';
      }
      return _item[0].label;
    },
    payTypeFilter(val: number): string {
      const _item = ORDER_PAY_TYPE.filter((item: any) => item.id === val);
      if (_item.length === 0) {
        return '';
      }
      return _item[0].label;
    },
    learnTypeFilter(val: any): string {
      if (val) {
        const _val = JSON.parse(val);
        return _val.label;
      }
      return '';
    }
  }
})
export default class MarketOrderApprovalChangeDetail extends mixins(ctjtPaginationMixins, clearCacheMixins) {
  @Action('order/queryApprovesDetail') private queryApprovesDetail!: (data: any) => ParamsType;

  @Action('order/putNoPassApproves') private putNoPassApproves!: (data: any) => ParamsType;

  @Action('order/putPassApproves') private putPassApproves!: (data: any) => ParamsType;

  @Action('order/putUndoApproves') private putUndoApproves!: (data: any) => ParamsType;

  private orderField = require('@/assets/json/order_field.json');

  // 拉取省市区json

  // 省数组
  private provCity = require('@/assets/json/prov.json');

  studentVoAddressFilter(val: any): string {
    const {
      address = '', dwellProvinceId = '', dwellCityId = '', dwellAreaId = ''
    } = val;
    let _text = '';
    if (dwellProvinceId > 0) {
      this.provCity.forEach((item: any) => {
        const { adcode, name, subs } = item;
        if (Number(adcode) === dwellProvinceId) {
          _text += name;
          subs.forEach((i: any) => {
            const { adcode: _adcode, name: _name, subs: _subs } = i;
            if (Number(_adcode) === dwellCityId) {
              _text += _name;
              _subs.forEach((j: any) => {
                const { adcode: jadcode, name: jname } = j;
                if (Number(jadcode) === dwellAreaId) {
                  _text += jname;
                }
              });
            }
          });
        }
      });
    }
    _text += address;
    return _text;
  }

  private changeTableData: ParamsType = {
    _this: {},
    index: true,
    labels: [
      {
        label: '字段',
        key: 'updateField',
        render(h: any, params: any) {
          const { updateField } = params.row;
          const that = params._self.tableData._this;
          const _text = that.orderField[updateField];
          if (!_text) return updateField;
          return _text;
        }
      },
      {
        label: '变更前',
        key: 'afterField',
        render(h: any, params: any) {
          const { updateField, afterField } = params.row;
          let _textArr = [];
          const that = params._self.tableData._this;
          switch (updateField) {
            case 'mode':
              _textArr = ORDER_OPEN_INVOICE_TYPE.filter((item: any) => item.id === parseFloat(afterField));
              if (_textArr.length > 0) {
                return _textArr[0].label;
              }
              return '-';
            case 'type':
              _textArr = ORDER_INVOICE_TYPE.filter((item: any) => item.id === parseFloat(afterField));
              if (_textArr.length > 0) {
                return _textArr[0].label;
              }
              return '-';
            case 'isResitCost':
              _textArr = ORDER_IS_INSTALLMENT.filter((item: any) => item.id === parseFloat(afterField));
              if (_textArr.length > 0) {
                return _textArr[0].label;
              }
              return '-';
            case 'isMissExamCost':
              _textArr = ORDER_IS_INSTALLMENT.filter((item: any) => item.id === parseFloat(afterField));
              if (_textArr.length > 0) {
                return _textArr[0].label;
              }
              return '-';
            case 'resitCount':
              _textArr = MARKET_MAKE_UP_EXAM.filter((item: any) => item.id === parseFloat(afterField));
              if (_textArr.length > 0) {
                return _textArr[0].label;
              }
              return '-';
            case 'certificateType':
              _textArr = ORDER_IDNO_TYPE.filter((item: any) => item.id === parseFloat(afterField));
              if (_textArr.length > 0) {
                return _textArr[0].label;
              }
              return '-';
            case 'driveType':
              _textArr = OLD_DRIVER_LICENSE.filter((item: any) => item.id === parseFloat(afterField));
              if (_textArr.length > 0) {
                return _textArr[0].label;
              }
              return '-';
            case 'isStudent':
              _textArr = ORDER_IS_INSTALLMENT.filter((item: any) => item.id === parseFloat(afterField));
              if (_textArr.length > 0) {
                return _textArr[0].label;
              }
              return '-';
            case 'sex':
              _textArr = EDUCATIONAL_SEX.filter((item: any) => item.id === parseFloat(afterField));
              if (_textArr.length > 0) {
                return _textArr[0].label;
              }
              return '-';
            case 'payType':
              _textArr = ORDER_PAY_TYPE.filter((item: any) => item.id === parseFloat(afterField));
              if (_textArr.length > 0) {
                return _textArr[0].label;
              }
              return '-';
            case 'payTime':
              if (afterField) {
                return that.$dayjs(afterField).format('YYYY-MM-DD HH:mm:ss');
              }
              return '-';
            case 'dwellProvinceId':
              if (afterField) {
                let _text = '';
                that.provCity.forEach((item: any) => {
                  const { adcode, name } = item;
                  if (adcode === afterField) {
                    _text = name;
                  }
                });
                return _text;
              }
              return '-';
            case 'dwellCityId':
              if (afterField) {
                let _text = '';
                let _arr: any = [];
                that.provCity.forEach((item: any) => {
                  const { subs } = item;
                  _arr = [..._arr, item, ...subs];
                });
                _arr.forEach((item: any) => {
                  const { adcode, name } = item;
                  if (adcode === afterField) {
                    _text = name;
                  }
                });
                return _text;
              }
              return '-';
            case 'dwellAreaId':
              if (afterField) {
                let _text = '';
                let _arr: any = [];
                that.provCity.forEach((item: any) => {
                  const { subs } = item;
                  _arr = [..._arr, item, ...subs];
                  subs.forEach((i: any) => {
                    const { subs: _subs } = i;
                    _arr = [..._arr, ..._subs];
                  });
                });
                _arr.forEach((item: any) => {
                  const { adcode, name } = item;
                  if (adcode === afterField) {
                    _text = name;
                  }
                });
                return _text;
              }
              return '-';
            case 'channelAmount':
            case 'activityAmount':
            case 'discountAmount':
            case 'otherDiscounts':
              if (afterField) {
                return afterField;
              }
              return '0';
            default:
              return afterField || '-';
          }
        }
      },
      {
        label: '变更后',
        key: 'beforeField',
        render(h: any, params: any) {
          const { updateField, beforeField } = params.row;
          let _textArr = [];
          const that = params._self.tableData._this;
          switch (updateField) {
            case 'mode':
              _textArr = ORDER_OPEN_INVOICE_TYPE.filter((item: any) => item.id === parseFloat(beforeField));
              if (_textArr.length > 0) {
                return _textArr[0].label;
              }
              return '-';
            case 'type':
              _textArr = ORDER_INVOICE_TYPE.filter((item: any) => item.id === parseFloat(beforeField));
              if (_textArr.length > 0) {
                return _textArr[0].label;
              }
              return '-';
            case 'isResitCost':
              _textArr = ORDER_IS_INSTALLMENT.filter((item: any) => item.id === parseFloat(beforeField));
              if (_textArr.length > 0) {
                return _textArr[0].label;
              }
              return '-';
            case 'isMissExamCost':
              _textArr = ORDER_IS_INSTALLMENT.filter((item: any) => item.id === parseFloat(beforeField));
              if (_textArr.length > 0) {
                return _textArr[0].label;
              }
              return '-';
            case 'resitCount':
              _textArr = MARKET_MAKE_UP_EXAM.filter((item: any) => item.id === parseFloat(beforeField));
              if (_textArr.length > 0) {
                return _textArr[0].label;
              }
              return '-';
            case 'certificateType':
              _textArr = ORDER_IDNO_TYPE.filter((item: any) => item.id === parseFloat(beforeField));
              if (_textArr.length > 0) {
                return _textArr[0].label;
              }
              return '-';
            case 'driveType':
              _textArr = OLD_DRIVER_LICENSE.filter((item: any) => item.id === parseFloat(beforeField));
              if (_textArr.length > 0) {
                return _textArr[0].label;
              }
              return '-';
            case 'isStudent':
              _textArr = ORDER_IS_INSTALLMENT.filter((item: any) => item.id === parseFloat(beforeField));
              if (_textArr.length > 0) {
                return _textArr[0].label;
              }
              return '-';
            case 'sex':
              _textArr = EDUCATIONAL_SEX.filter((item: any) => item.id === parseFloat(beforeField));
              if (_textArr.length > 0) {
                return _textArr[0].label;
              }
              return '-';
            case 'payType':
              _textArr = ORDER_PAY_TYPE.filter((item: any) => item.id === parseFloat(beforeField));
              if (_textArr.length > 0) {
                return _textArr[0].label;
              }
              return '-';
            case 'payTime':
              if (beforeField) {
                return that.$dayjs(beforeField).format('YYYY-MM-DD HH:mm:ss');
              }
              return '-';
            case 'dwellProvinceId':
              if (beforeField) {
                let _text = '';
                that.provCity.forEach((item: any) => {
                  const { adcode, name } = item;
                  if (adcode === beforeField) {
                    _text = name;
                  }
                });
                return _text;
              }
              return '-';
            case 'dwellCityId':
              if (beforeField) {
                let _text = '';
                let _arr: any = [];
                that.provCity.forEach((item: any) => {
                  const { subs } = item;
                  _arr = [..._arr, item, ...subs];
                });
                _arr.forEach((item: any) => {
                  const { adcode, name } = item;
                  if (adcode === beforeField) {
                    _text = name;
                  }
                });
                return _text;
              }
              return '-';
            case 'dwellAreaId':
              if (beforeField) {
                let _text = '';
                let _arr: any = [];
                that.provCity.forEach((item: any) => {
                  const { subs } = item;
                  _arr = [..._arr, item, ...subs];
                  subs.forEach((i: any) => {
                    const { subs: _subs } = i;
                    _arr = [..._arr, ..._subs];
                  });
                });
                _arr.forEach((item: any) => {
                  const { adcode, name } = item;
                  if (adcode === beforeField) {
                    _text = name;
                  }
                });
                return _text;
              }
              return '-';
            case 'channelAmount':
            case 'activityAmount':
            case 'discountAmount':
            case 'otherDiscounts':
              if (beforeField) {
                return beforeField;
              }
              return '0';
            default:
              return beforeField || '-';
          }
        }
      }
    ],
    list: [],
  }

  private examineTableData: ParamsType = {
    _this: {},
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
    list: [],
  }

  private resetFunc() {
    this.$message.success('操作成功！');
    this.goback();
  }

  // 操作按钮函数
  private btnSubmit(val: number) {
    const { id } = this.$route.query;
    if (val === 1) {
      this.$prompt('请输入通过理由', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{0,50}$/,
        inputErrorMessage: '输入内容长度为0-50'
      }).then((res: any) => {
        const { value } = res;
        if (value === null || value.length <= 50) {
          const sendData = { id, verifyOpinion: value ? `同意，${value}` : '同意' };
          this.putPassApproves(sendData).then(() => {
            this.resetFunc();
          });
        } else {
          this.$message.warning('输入内容长度为1-50');
        }
      });
    }
    if (val === 2) {
      this.rejectShow = true;
    }
    if (val === 3) {
      this.$confirm('审核撤销?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const sendData = { id };
        this.putUndoApproves(sendData).then(() => {
          this.resetFunc();
        });
      });
    }
  }

  rejectShow = false;

  rejectCallBack(val: any) {
    if (val === false) return;
    const { remark, data } = val;
    const { id } = this.$route.query;
    const sendData = { id, verifyOpinion: remark, verifyNode: data.verifyNode };
    this.putNoPassApproves(sendData).then(() => {
      this.resetFunc();
    });
  }

  private goback() {
    this.clearCache();
    this.$router.push({ path: '/market/order_approval/change' });
  }

  private formData: ParamsType = {};

  private studentVo: ParamsType = {};

  private invoiceVo: ParamsType = {};

  private auditStatus = 0;

  // 生命周期
  perm = {};

  async activated() {
    this.changeTableData._this = this;
    const { id, orderId, auditStatus } = this.$route.query;
    this.auditStatus = Number(auditStatus);
    if (id) {
      this.queryApprovesDetail({ id, orderId, type: 3 }).then((res: any) => {
        const { orderDto, records } = res;
        this.examineTableData.list = records;
        this.formData = orderDto;
        this.studentVo = orderDto.studentVo;
        this.invoiceVo = orderDto.invoiceVo;
        // 订单修改列表
        const _list = mapDataExChange(orderDto.orderLogDtoMap);
        this.changeTableData.list = _list[0].options;
      });
    }
    const permObj = await (this as any).$getPerm(this);
    this.perm = permObj.perm;
  }
}
