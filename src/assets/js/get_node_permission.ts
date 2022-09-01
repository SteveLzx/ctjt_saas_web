import store from '@/store/index';
import $http from '@/assets/js/request';
// import { API_AUTH_V1_AUTH_AUTHTHREE } from '@/api/index';
import { ParamsType } from '@/type';
/**
 *
 *
 * @export
 * @param {*} id
 * @param {*} [tableOptions=[]] // table表格上端按钮
 * @param {*} [searchOptions=[]] // 搜索栏按钮
 * @return {*}
 */
const getNodePermission = async (com: any, tableOptions = [], searchOptions = []) => {
  const { fullPath, meta } = com.$route; // 当前路由信息
  const { nodePermission } = store.state.base; // 获取保存的权限
  let perm: ParamsType = {}; // 页面按钮权限
  if (nodePermission[fullPath]) {
    perm = nodePermission[fullPath];
  } else { // 无缓存的权限则用当前页面ID去请求
    // "type":必传 查询截止类型，1:系统 -> 2:菜单 -> 3:页面 -> 4:按钮
    const btnPermission = await store.dispatch('auth/queryCarInfoByIdNo', { id: meta.id, type: 4 });
    if (!btnPermission || !(btnPermission as any).children) {
      return {
        perm: {},
        tablePerm: [],
        searchPerm: []
      };
    }
    (btnPermission as any).children.forEach((btn: ParamsType) => {
      if (btn.action === 1) perm[btn.path] = true;
    });
    // 处理后缓存下来
    store.commit('base/ADD_NODE_PERMISSION', { [fullPath]: perm });
  }
  // 获取table顶端按钮权限
  let tablePerm: any[] = [];
  if (tableOptions) {
    tablePerm = tableOptions.filter((option: ParamsType) => perm[option.path]);
  }
  // 获取搜索栏按钮权限
  let searchPerm: any[] = [];
  if (searchOptions) {
    searchPerm = searchOptions.filter((option: ParamsType) => perm[option.path]);
  }
  return {
    perm,
    tablePerm,
    searchPerm
  };
};

export default getNodePermission;
