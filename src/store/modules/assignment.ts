import axios from '@/assets/js/request';

const BASE_URL = '/assignment/v1/'; // 教务微服务公共路径

const postBaseAxiosFunc = (url: string, data?: any, config?: any) => new Promise((resolve, reject) => {
  axios.post(`${BASE_URL}${url}`, data, config).then((res: any) => {
    resolve(res);
  }).catch((err) => {
    reject(err);
  });
});

const getBaseAxiosFunc = (url: string, data?: any) => new Promise((resolve, reject) => {
  axios.get(`${BASE_URL}${url}`, { params: { ...data } }).then((res: any) => {
    resolve(res);
  }).catch((err) => {
    reject(err);
  });
});

const putBaseAxiosFunc = (url: string, data?: any) => new Promise((resolve, reject) => {
  axios.put(`${BASE_URL}${url}`, data).then((res: any) => {
    resolve(res);
  }).catch((err) => {
    reject(err);
  });
});

const actions = {
  /**
   * @description 考场管理-请求车辆品牌
   */
  async getCarBrandList({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('examPlace/getCarBrandList', data);
  },
  /**
   * @description 考场管理-请求考场列表
   */
  async queryExamPlaceList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('examPlace/queryExamPlaceList', data);
  },
  /**
   * @description 考场管理-请求所有考场数据
   */
  async queryAllExamPlaceList({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('examPlace/getExamPlaceList', data);
  },
  /**
   * @description 考场管理-根据id启用禁用
   */
  async queryExamPlaceById({ commit }: { commit: any }, data: any) {
    const { flag, id } = data;
    return postBaseAxiosFunc(`examPlace/queryExamPlaceById?flag=${flag}&id=${id}`, data);
  },
  /**
   * @description 考场管理-新增修改考场
   */
  async saveOrUpdateExamPlace({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('examPlace/saveOrUpdateExamPlace', data);
  },
  /**
   * @description 考场管理-通过id查询考场详情
   */
  async queryExamPlaceDetailById({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('examPlace/queryExamPlaceById', data);
  },
  /**
   * @description 带教车型设置-查询详情
   */
  async queryTeachCarsList({ commit }: { commit: any }) {
    return getBaseAxiosFunc('teachCars');
  },
  /**
   * @description 带教车型设置-修改
   */
  async modifyTeachCars({ commit }: { commit: any }, data: any) {
    return putBaseAxiosFunc('teachCars', data);
  },
  /**
   * @description 带教类型列表查询
   */
  async queryTeachTypeList({ commit }: { commit: any }) {
    return getBaseAxiosFunc('teachType/queryTeachTypeList');
  },
  /**
   * @description 带教类型列表查询(下拉框)
   */
  async queryTeachTypePullFrame({ commit }: { commit: any }) {
    return getBaseAxiosFunc('teachType/getTeachTypePullFrame');
  },
  /**
   * @description 带教类型-根据id查询详情
   */
  async queryTeachTypeById({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('teachType/queryTeachTypeById', data);
  },
  /**
   * @description 带教类型列表-新增/修改
   */
  async saveOrUpdateTeachType({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('teachType/saveOrUpdateTeachType', data);
  },
  /**
   * @description 带教类型列表-按id启用禁用
   */
  async enableDisableById({ commit }: { commit: any }, data: any) {
    const { flag, id } = data;
    return postBaseAxiosFunc(`teachType/enableDisableById?flag=${flag}&id=${id}`);
  },
  /**
   * @description 查询教学组-列表
   */
  async queryCoachGroupsList({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('coachGroups', data);
  },
  /**
   * @description 导入教学组
   */
  async coachGroupsImportExcel({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('coachGroups/importExcel', data);
  },
  /**
   * @description 查询教学组详情
   */
  async queryCoachGroupsDetailById({ commit }: { commit: any }, data: any) {
    const { id } = data;
    return getBaseAxiosFunc(`coachGroups/${id}/details`);
  },
  /**
   * @description 查询片区教学组下未分配教练列表
   */
  async queryCoachNoCoachGroup({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('coaches/noCoachGroup', data);
  },
  /**
   * @description 查询教练星级设置列表
   */
  async queryCoachStarsList({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('stars', data);
  },
  /**
   * @description 查询教练星级设置列表
   */
  async starsImportExcel({ commit }: { commit: any }, data: any) {
    return new Promise((resolve, reject) => {
      const { quarter, year, file, } = data;
      const form = new FormData();
      form.append('file', file);
      axios.post(`${BASE_URL}stars/importExcel?quarter=${quarter}&year=${year}`, form, {
        contentType: 'multipart/form-data'
      } as any).then((res: any) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  /**
   * @description 查询教练列表
   */
  async queryCoachListPage({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('coaches/queryCoachListPage', data);
  },
  /**
   * @description 通过科目查询考场名称,1:科目二科目三 2:科目二 3:科目三
   */
  async getExamPlaceBySubjects({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('examPlace/getExamPlaceBySubjects', data);
  },
  /**
   * @description 查询学员分配记录
   */
  async queryAllotRecords({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('allotRecords', data);
  },
  /**
   * @description 查询学员分配记录详情
   */
  async queryAllotRecordsDetails({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('allotRecords/details', data);
  },
  /**
   * @description 新增教学组
   */
  async submitCoachGroups({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('coachGroups', data);
  },
  /**
   * @description 修改教学组
   */
  async editPutCoachGroups({ commit }: { commit: any }, data: any) {
    return putBaseAxiosFunc('coachGroups', data);
  },
  /**
   * @description 查询人工分配教练列表
   */
  async queryAllotCoachesList({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('allotCoaches', data);
  },
  /**
   * @description 根据批次号查看人工分配教练批次详情
   */
  async queryAllotCoachesDetails({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('allotCoaches/details', data);
  },
  /**
   * @description 查询学员能分配教练列表
   */
  async queryCoachesList({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('coaches/list', data);
  },
  /**
   * @description 查询学员能分配教练列表
   */
  async queryChangeCoachList({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('coaches/changeCoachList', data);
  },
  /**
   * @description 提交人工分配教练
   */
  async submitAllotCoachesManual({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('allotCoaches/manual', data);
  },
  /**
   * @description 根据id获取教练信息
   */
  async queryCoachesInfoById({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('coaches/getCoachInfoById', data);
  },
  /**
   * @description 保存教练信息
   */
  async saveCoachInfo({ commit }: { commit: any }, data: any) {
    return putBaseAxiosFunc('coaches/saveCoachInfo', data);
  },
  /**
   * @description 修改教练信息
   */
  async updateCoachInfo({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('coaches/updateCoachInfo', data);
  },
  /**
   * @description 查询分配教练模式设置
   */
  async queryModesData({ commit }: { commit: any }) {
    return getBaseAxiosFunc('modes');
  },
  /**
   * @description 查询分配教练模式设置
   */
  async saveModesData({ commit }: { commit: any }, data: any) {
    return putBaseAxiosFunc('modes', data);
  },
  /**
   * @description 获取车辆使用性质
   */
  async queryCoachesCarPropertyList({ commit }: { commit: any }) {
    return getBaseAxiosFunc('coaches/getCarPropertyList');
  },
  /**
   * @description 根据id列表设置教练分配状态
   */
  async allocationCoachByIds({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('coaches/allocationCoachByIds', data);
  },
  /**
   * @description 查询自动分配教练规则设置
   */
  async queryAllotRulesList({ commit }: { commit: any }) {
    return getBaseAxiosFunc('allotRules');
  },
  /**
   * @description 查询自动分配教练规则设置（详情）
   */
  async queryAllotRulesDetail({ commit }: { commit: any }, data: any) {
    const { id } = data;
    return getBaseAxiosFunc(`allotRules/${id}`);
  },
  /**
   * @description 新增自动分配教练规则设置
   */
  async saveAllotRules({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('allotRules', data);
  },
  /**
   * @description 修改自动分配教练规则设置
   */
  async updataAllotRules({ commit }: { commit: any }, data: any) {
    return putBaseAxiosFunc('allotRules', data);
  },
  /**
   * @description 教练新增/修改审批列表
   */
  async queryCoachChangeList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('coachChange/page', data);
  },
  /**
   * @description 根据申请单号获取变更信息
   */
  async queryVerifyCoachChangeDetail({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('coachChange/getVerifyCoachChange', data);
  },
  /**
   * @description 教练信息新增审核操作(是否通过)
   */
  async addCoachVerifyOperation({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('coachChange/addCoachVerifyOperation', data);
  },
  /**
   * @description 教练信息修改审核操作(是否通过)
   */
  async updateCoachVerifyOperation({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('coachChange/updateCoachVerifyOperation', data);
  },
  /**
   * @description 立即执行系统分配一次
   */
  async doSystemCoachTask({ commit }: { commit: any }) {
    return postBaseAxiosFunc('allotRules/doSystemCoachTask');
  },
  /**
   * @description 停用系统分配
   */
  async modesStopSystem({ commit }: { commit: any }) {
    return putBaseAxiosFunc('modes/stopSystem');
  },
  /**
   * @description 变更教练审批分页查询
   */
  async queryTeachCoachChangeList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('teachCoachChange/list', data);
  },
  /**
   * @description 变更教练审批详情
   */
  async queryTeachCoachByIdDetail({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('teachCoachChange/getTeachCoachById', data);
  },
  /**
   * @description 审核操作 1通过,2不通过,3.撤回
   */
  async teachCoachChangeVerify({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('teachCoachChange/verify', data);
  },
  /**
   * @description 新增带教教练变更数据申请
   */
  async saveTeachCoachChange({ commit }: { commit: any }, data: any) {
    return putBaseAxiosFunc('teachCoachChange/saveTeachCoach', data);
  },
  /**
   * @description 查询驾校下所有教学组长
   */
  async queryCoachesAllLeaders({ commit }: { commit: any }) {
    return getBaseAxiosFunc('coaches/leaders');
  },
  /**
   * @description 查询所有教练列表
   */
  async queryAllCoachList({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('coaches/all', data);
  },
  /**
   * @description 查询散学教练休假列表
   */
  async queryCoachRestList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scattered/coach/rest/findList', data);
  },
  /**
   * @description 查询散学教练列表
   */
  async queryRestTimeList({ commit }: { commit: any }, data: any) {
    const _arr: any[] = [];
    const res = await getBaseAxiosFunc('scattered/time/frame/config/findList', data);
    (res as any[]).forEach((item: any, index: number) => {
      _arr.push({
        id: index,
        label: item.name,
        ...item,
        disabled: false
      });
    });
    return _arr;
  },
  /**
   * @description 新增教练休假
   */
  async addOrUpdateCoachRest({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scattered/coach/rest/addOrUpdate', data);
  },
  /**
   * @description 取消休假
   */
  async cancelRest({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('scattered/coach/rest/cancel', data);
  },
  /**
   * @description 导出教练列表
   */
  async exportCoachList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('coaches/exportCoachList', data, { hasUseCode: true, responseType: 'arraybuffer' });
  },
  /**
   * @description 获取学员约车记录
   */
  async queryAppointLogList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scattered/scheduling/queryAppointLogList', data);
  },
  /**
   * @description 获取学员取消记录
   */
  async cancelAppointCount({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scattered/scheduling/cancelAppointCount', data);
  },
  /**
   * @description 获取排班列表
   */
  async querySchedulingList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scattered/scheduling/querySchedulingList', data);
  },
  /**
   * @description 获取约车详情列表
   */
  async queryAppointDetailList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scattered/scheduling/queryAppointDetailList', data);
  },
  /**
   * @description 获取约车详情
   */
  async queryAppointDetail({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('scattered/scheduling/queryAppointDetail', data);
  },
  /**
   * @description 预约学车
   */
  async appointLearnDriving({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scattered/scheduling/appointLearnDriving', data);
  },
  /**
   * @description 取消学车
   */
  async cancelAppoint({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scattered/scheduling/cancelAppoint', data);
  },
  /**
   * @description 修改学车接送地址
   */
  async updatePickUpAddress({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scattered/scheduling/updatePickUpAddress', data);
  },
  /**
   * @description 查询散学教练
   */
  async queryScatteredCoach({ commit }: { commit: any }, data: any) {
    return getBaseAxiosFunc('scattered/coach/info/findList', data);
  },
  /**
   * @description 导出约车记录
   */
  async exportAppointLogList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scattered/scheduling/exportAppointLogList', data, { hasUseCode: true, responseType: 'arraybuffer' });
  },
  /**
   * @description 导出教练休假
   */
  async exportCoachRestList({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scattered/coach/rest/exportList', data, { hasUseCode: true, responseType: 'arraybuffer' });
  },
  /**
   * @description 散学订单根据订单id查询约车记录列表接口
   */
  async querySchedulingAppointListByOrderId({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scattered/scheduling/queryAppointListByOrderId', data);
  },
  /**
   * @description 惠州 批量删除约车记录
   */
  async deleteSchedulingBatchAppointInfo({ commit }: { commit: any }, data: any) {
    return postBaseAxiosFunc('scattered/scheduling/batchDeleteAppointInfo', data);
  },
};
export default {
  namespaced: true,
  actions
};
