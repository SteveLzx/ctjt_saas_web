import { Component, Vue } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { ParamsType } from '@/type';
import { mapDataExChange } from '@/assets/js/common';
import {
  EDUCATIONAL_SEX, MARKET_MAKE_UP_EXAM, OLD_DRIVER_LICENSE,
  ORDER_IDNO_TYPE, ORDER_INVOICE_TYPE, ORDER_IS_INSTALLMENT,
  ORDER_OPEN_INVOICE_TYPE, ORDER_PAY_TYPE
} from '@/enums';

@Component({
  filters: {
    updatedData: (val: any) => {
      const { reason, updatedName, updatedTime } = val;
      return `修改原因：客服${updatedName}：${reason}；修改时间：${updatedTime}`;
    }
  }
})
export default class OrderLogRecord extends Vue {
  @Action('order/queryOrderChangeLogs') private queryOrderChangeLogs!: (data: any) => ParamsType;

  // 列表传过来单条对象数据
  private detailParams: any = {};

  // 订单修改记录表格设置
  private modifyTableList = [];

  async queryList() {
    const { id } = this.detailParams;
    try {
      const body: any = await this.queryOrderChangeLogs(id);
      const _list = body ? mapDataExChange(body) : [];
      this.modifyTableList = _list;
    } catch (error) {
      this.modifyTableList = [];
    }
  }

  private orderField = require('@/assets/json/order_field.json');

  // 省数组
  private provCity = require('@/assets/json/prov.json');

  // 证件类型
  private idNoTypeList = ORDER_IDNO_TYPE;

  // 原驾驶证类型
  private driveTypelList = OLD_DRIVER_LICENSE;

  // 发票类型
  private invoiceTypeList = ORDER_INVOICE_TYPE;

  // 开票方式
  private openIncoiceTypeList = ORDER_OPEN_INVOICE_TYPE;

  // 是否包含考试费/是否包含缺考费
  private booleanList = ORDER_IS_INSTALLMENT;

  // 补考次数
  private upExamList = MARKET_MAKE_UP_EXAM;

  // 支付方式
  private payTypeList = ORDER_PAY_TYPE;

  // 性别
  private sexList = EDUCATIONAL_SEX;

  /** 根据字段转换中文 */
  formUpdateField(row: any) {
    const { updateField } = row;
    const _text = this.orderField[updateField];
    if (!_text) return updateField;
    return _text;
  }

  /** 变更后字段匹配 */
  private formUpdateAfter(row: any) {
    const { updateField, afterField } = row;
    let _textArr = [];
    switch (updateField) {
      case 'mode':
        _textArr = this.openIncoiceTypeList.filter(item => item.id === parseFloat(afterField));
        if (_textArr.length > 0) {
          return _textArr[0].label;
        }
        return '-';
      case 'type':
        _textArr = this.invoiceTypeList.filter(item => item.id === parseFloat(afterField));
        if (_textArr.length > 0) {
          return _textArr[0].label;
        }
        return '-';
      case 'isResitCost':
        _textArr = this.booleanList.filter(item => item.id === parseFloat(afterField));
        if (_textArr.length > 0) {
          return _textArr[0].label;
        }
        return '-';
      case 'isMissExamCost':
        _textArr = this.booleanList.filter(item => item.id === parseFloat(afterField));
        if (_textArr.length > 0) {
          return _textArr[0].label;
        }
        return '-';
      case 'resitCount':
        _textArr = this.upExamList.filter(item => item.id === parseFloat(afterField));
        if (_textArr.length > 0) {
          return _textArr[0].label;
        }
        return '-';
      case 'certificateType':
        _textArr = this.idNoTypeList.filter(item => item.id === parseFloat(afterField));
        if (_textArr.length > 0) {
          return _textArr[0].label;
        }
        return '-';
      case 'driveType':
        _textArr = this.driveTypelList.filter(item => item.id === parseFloat(afterField));
        if (_textArr.length > 0) {
          return _textArr[0].label;
        }
        return '-';
      case 'isStudent':
        _textArr = this.booleanList.filter(item => item.id === parseFloat(afterField));
        if (_textArr.length > 0) {
          return _textArr[0].label;
        }
        return '-';
      case 'sex':
        _textArr = this.sexList.filter(item => item.id === parseFloat(afterField));
        if (_textArr.length > 0) {
          return _textArr[0].label;
        }
        return '-';
      case 'payType':
        _textArr = this.payTypeList.filter(item => item.id === parseFloat(afterField));
        if (_textArr.length > 0) {
          return _textArr[0].label;
        }
        return '-';
      case 'payTime':
        if (afterField) {
          return this.$dayjs(afterField).format('YYYY-MM-DD HH:mm:ss');
        }
        return '-';
      case 'dwellProvinceId':
        if (afterField) {
          let _text = '';
          this.provCity.forEach((item: any) => {
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
          this.provCity.forEach((item: any) => {
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
          this.provCity.forEach((item: any) => {
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
      case 'presentPeriod':
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

  /** 变更前字段匹配 */
  private formUpdateBefore(row: any) {
    const { updateField, beforeField } = row;
    let _textArr = [];
    switch (updateField) {
      case 'mode':
        _textArr = this.openIncoiceTypeList.filter(item => item.id === parseFloat(beforeField));
        if (_textArr.length > 0) {
          return _textArr[0].label;
        }
        return '-';
      case 'type':
        _textArr = this.invoiceTypeList.filter(item => item.id === parseFloat(beforeField));
        if (_textArr.length > 0) {
          return _textArr[0].label;
        }
        return '-';
      case 'isResitCost':
        _textArr = this.booleanList.filter(item => item.id === parseFloat(beforeField));
        if (_textArr.length > 0) {
          return _textArr[0].label;
        }
        return '-';
      case 'isMissExamCost':
        _textArr = this.booleanList.filter(item => item.id === parseFloat(beforeField));
        if (_textArr.length > 0) {
          return _textArr[0].label;
        }
        return '-';
      case 'resitCount':
        _textArr = this.upExamList.filter(item => item.id === parseFloat(beforeField));
        if (_textArr.length > 0) {
          return _textArr[0].label;
        }
        return '-';
      case 'certificateType':
        _textArr = this.idNoTypeList.filter(item => item.id === parseFloat(beforeField));
        if (_textArr.length > 0) {
          return _textArr[0].label;
        }
        return '-';
      case 'driveType':
        _textArr = this.driveTypelList.filter(item => item.id === parseFloat(beforeField));
        if (_textArr.length > 0) {
          return _textArr[0].label;
        }
        return '-';
      case 'isStudent':
        _textArr = this.booleanList.filter(item => item.id === parseFloat(beforeField));
        if (_textArr.length > 0) {
          return _textArr[0].label;
        }
        return '-';
      case 'sex':
        _textArr = this.sexList.filter(item => item.id === parseFloat(beforeField));
        if (_textArr.length > 0) {
          return _textArr[0].label;
        }
        return '-';
      case 'payType':
        _textArr = this.payTypeList.filter(item => item.id === parseFloat(beforeField));
        if (_textArr.length > 0) {
          return _textArr[0].label;
        }
        return '-';
      case 'payTime':
        if (beforeField) {
          return this.$dayjs(beforeField).format('YYYY-MM-DD HH:mm:ss');
        }
        return '-';
      case 'dwellProvinceId':
        if (beforeField) {
          let _text = '';
          this.provCity.forEach((item: any) => {
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
          this.provCity.forEach((item: any) => {
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
          this.provCity.forEach((item: any) => {
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
      case 'presentPeriod':
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

  mounted() {
    let { obj } = this.$route.query;
    if (typeof obj === 'string') {
      obj = decodeURIComponent(obj);
      this.detailParams = JSON.parse(obj);
      this.queryList();
    }
  }
}
