import { Vue, Component } from 'vue-property-decorator';
import LoadStudentList from './load_student_list.vue';
import StudentExaminationDetail from './student_examination_detail.vue';
import StudentRegistrationDetail from './student_registration_detail.vue';

@Component({
  components: {
    LoadStudentList, StudentRegistrationDetail, StudentExaminationDetail
  }
})
export default class LoadStudent extends Vue {
  private tableData = {
    list: [{
      unsolvedFour: 0,
      unsolvedOne: 0,
      unsolvedThree: 0,
      unsolvedTwo: 0,
      unsolvedAll: 0
    }],
    labels: [
      {
        key: 'unsolvedAll',
        label: '负荷学员人数'
      },
      {
        key: 'unsolvedOne',
        label: '未科目一'
      },
      {
        key: 'unsolvedTwo',
        label: '未科目二'
      },
      {
        key: 'unsolvedThree',
        label: '未科目三'
      },
      {
        key: 'unsolvedFour',
        label: '未科目四'
      }
    ],
  };

  private activeName = 'first'; // 当前展示子组件tab-name
}
