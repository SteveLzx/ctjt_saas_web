/**
 * @author zhixiao
 * @description 列表字段设置，列表都需要用到，所以作此mixin
 */
import { Vue, Component } from 'vue-property-decorator';
import { ParamsType } from '@/type';

@Component
export default class ctjttablefieldMixins extends Vue {
  // 列表分页配置对象

  public tableLabelType = ''; // 节点列表key名

  public originalLabelList: ParamsType = []; // 全部的列表字段数组

  public currentLabelKeyList: string[] = []; // 当前选中的label,key数组
}
