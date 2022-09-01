/**
 * @author zhixiao
 * @description 列表分页混入，所有列表都需要用到，所以作此mixin
 */
import { Vue, Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { ParamsType } from '@/type';

@Component
export default class ctjtPaginationMixins extends Vue {
  @Action('assignment/queryAllCoachList') private queryAllCoachList!: (data: any) => ParamsType;

  @Action('assignment/queryAllExamPlaceList') private queryAllExamPlaceList!: () => ParamsType;

  // 列表分页配置对象
  public paginationData = {
    current: 1,
    pageSize: 10,
    total: 0,
  };

  // 回车键搜索列表
  activated() {
    window.addEventListener('keydown', this.enterKeysSearch);
  }

  deactivated() {
    window.removeEventListener('keydown', this.enterKeysSearch, false);
  }

  public enterKeysSearch(event: any) {
    if (event.keyCode === 13) {
      (this as any).queryList();
    }
  }

  /**
   *
   * @description 获取所有的考试地点list
   * @returns 考试地点list
   */
  async queryAllsExamPlaceList() {
    const _arr: Array<any> = [];
    await this.queryAllExamPlaceList().then((res: Array<any>) => {
      res.forEach((item: any) => {
        _arr.push({
          id: item.id, label: item.examPlaceName
        });
      });
    });
    return _arr;
  }

  /**
   *
   * @description 获取教练集合
   * @param step 科目id
   * @returns 教练list
   */
  public async queryAllsCoachList(step?: any) {
    const _arr: Array<any> = [];
    this.queryAllCoachList({ step }).then((res: Array<any>) => {
      res.forEach((item: any) => {
        _arr.push({
          id: item.id, label: item.userName
        });
      });
    });
    return _arr;
  }
}
