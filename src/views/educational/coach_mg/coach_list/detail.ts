import Component, { mixins } from 'vue-class-component';
import clearCacheMixins from '@/mixins/clearCache';
import CoachDetail from './_components/coach_detail.vue';
import LoadStudent from './_components/load_student.vue';
import ModifyLogs from './_components/modify_logs.vue';

@Component({
  components: {
    CoachDetail,
    LoadStudent,
    ModifyLogs
  }
})
export default class EducationalCoachDetail extends mixins(clearCacheMixins) {
  private componentName = 'CoachDetail';

  public goback() {
    this.clearCache();
  }
}
