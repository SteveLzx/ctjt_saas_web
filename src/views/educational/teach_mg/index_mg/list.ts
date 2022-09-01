import { Component, Vue } from 'vue-property-decorator';
import educationalTeachMgIndexMgDetail from './detail.vue';

@Component({
  components: {
    educationalTeachMgIndexMgDetail
  }
})
export default class EducationalTeachMgIndexMg extends Vue {
  // 当前切换tab值
  private activeName = 'first';
}
