import { State, Action } from 'vuex-class';
import Component from 'vue-class-component';
import { Vue } from 'vue-property-decorator';
import { ParamsType } from '@/type';
import { searchForm } from './index';

@Component
export default class List extends Vue {
  @State(state => state.base.userInfo) private userInfo: any;

  @Action('base/queryGroupMechanismData') private queryGroupMechanismData!: (data: any) => any;

  searchForm = searchForm;

  searchTableCallBack(key: string) {
    if (key === 'search' || key === 'reset') {
      if (key === 'reset') {
        this.searchForm.selectList[1].value = '';
        this.searchForm.selectList[1].options = [];
      }
      this.$nextTick(() => {
        if (this.activeName === 'poster') (this.$refs.posterRef as any)[0].parentSearchCall();
        if (this.activeName === 'certificate') (this.$refs.certificateRef as any)[0].parentSearchCall();
      });
    }
  }

  searchSelectChange(val: ParamsType) {
    const { value, key } = val;
    if (key === 'regionId') {
      this.searchForm.selectList[1].options = [];
      this.searchForm.selectList[1].value = '';
      if (value) this.querySearchRegionAndStore('store', value);
    }
  }

  // 列表切换
  activeName = 'poster';

  activeOpts = [
    { label: '海报列表', name: 'poster' },
    { label: '荣誉证书', name: 'certificate' }
  ]

  querySearchRegionAndStore(key: string, pid: string) {
    this.queryGroupMechanismData({ pid }).then((data: any) => {
      if (key === 'region') {
        this.searchForm.selectList[0].options = data;
      }
      if (key === 'store') {
        this.searchForm.selectList[1].options = data;
      }
    });
  }

  init() {
    const { drivingSchoolId } = this.userInfo;
    this.querySearchRegionAndStore('region', drivingSchoolId);
  }

  mounted() {
    this.init();
  }
}
