<template>
  <el-autocomplete
    :value="value"
    :fetch-suggestions="querySearchAsync"
    placeholder="请输入内容"
    :disabled="disabled"
    :maxlength="maxlength"
    @input="handleInput"
    @focus="handleFocus"
  ></el-autocomplete>
</template>
<script lang='ts'>
import {
  Prop, Vue, Component
} from 'vue-property-decorator';

@Component
export default class CtjtAutocomplete extends Vue {
  @Prop({ default: () => [] }) list!: Array<any>;

  @Prop({ default: '' }) value!: string;

  @Prop({ default: false }) disabled!: boolean;

  @Prop({ default: {} }) input!: (value: string) => void;

  @Prop({ default: {} }) focus!: () => void;

  @Prop({ default: null }) maxlength!: number;

  /**
   * @description 表单搜索回调函数
   */
  private querySearchAsync(val: string, cb: (result: any) => void) {
    const restaurants = this.list;
    const results = val ? restaurants.filter(this.createFilter(val)) : restaurants;
    // 调用 callback 返回建议列表的数据
    cb(results);
  }

  /**
   * @description 过滤器函数
   */
  createFilter(val: string) {
    return (restaurant: any) => (restaurant.value.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  handleInput(val: string) {
    this.input(val);
  }

  handleFocus() {
    this.focus();
  }
}
</script>
