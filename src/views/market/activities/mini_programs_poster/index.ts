import dayjs from 'dayjs';
import { ParamsType } from '@/type';
import { OSS_BASEURL } from '@/assets/js/common';

export const statusOpts = [
  { label: '启用', value: 1 },
  { label: '停用', value: 0 }
];

export const searchForm: ParamsType = {
  datePickerList: [
    {
      label: '海报发布时间',
      key: 'beginDate',
      value: '',
      placeholder: '请输入时间',
      type: 'date',
      width: 140,
    }
  ],
  inputList: [
    {
      label: '海报名称',
      key: 'posterName',
      type: 'text',
      value: '',
      width: 160,
      clearable: true,
      placeholder: '请输入',
    },
    {
      label: '创建人/更新人',
      key: 'userName',
      type: 'text',
      value: '',
      width: 160,
      clearable: true,
      placeholder: '请输入员工姓名',
    }
  ],
  selectList: [
    {
      label: '片区/门店',
      key: 'regionId',
      value: '',
      placeholder: '请选择片区',
      clearable: true,
      width: 140,
      options: [],
      customOptions: {
        value: 'id',
        label: 'name'
      }
    },
    {
      label: '',
      key: 'storeId',
      width: 140,
      value: '',
      placeholder: '请选择门店',
      clearable: true,
      options: [],
      customOptions: {
        value: 'id',
        label: 'name'
      }
    },
    {
      label: '海报状态',
      key: 'posterState',
      width: 100,
      value: '',
      placeholder: '请选择',
      clearable: true,
      options: statusOpts,
      customOptions: {
        value: 'value',
        label: 'label'
      }
    }
  ],
  buttonList: [
    {
      label: '查询',
      key: 'search',
      type: 'primary',
      path: 'btn_search'
    },
    {
      label: '重置',
      key: 'reset',
      path: 'btn_search'
    }
  ]
};

// 列表配置(海报)
export const posterTableData: ParamsType = {
  _this: {},
  loading: false,
  index: true,
  selection: true,
  selectionList: [],
  list: [],
  options: [
    {
      id: 1,
      label: '新增海报',
      path: 'btn_add'
    },
    {
      id: 2,
      label: '编辑',
      path: 'btn_edit'
    },
    {
      id: 3,
      label: '停用',
      path: 'btn_stop',
      type: 'warning'
    },
    {
      id: 4,
      label: '启用',
      path: 'btn_open',
      type: 'primary'
    },
  ],
  labels: [
    {
      key: '',
      label: '缩略图',
      width: 60,
      render(h: any, params: any) {
        const { url } = params.row;
        const coverUrl = `${OSS_BASEURL}${url}`;
        return h('el-image', {
          props: {
            src: coverUrl,
            fit: 'fill',
            'preview-src-list': [coverUrl]
          }
        });
      }
    },
    {
      key: 'posterName',
      label: '海报名称',
    },
    {
      key: 'regionName',
      label: '片区',
    },
    {
      key: 'storeName',
      label: '门店',
    },
    {
      key: 'accessNumber',
      label: '访问人数',
      isPrice: true
    },
    {
      key: 'accessCount',
      label: '访问次数',
      isPrice: true
    },
    {
      key: 'downloadShareNum',
      label: '下载/分享人数',
      isPrice: true
    },
    {
      key: '',
      label: '海报发布时间',
      render(h: any, params: any) {
        const { beginDate, endDate } = params.row;
        return h('div', [
          h('p', `${dayjs(beginDate).format('YYYY-MM-DD HH:mm')}/`),
          h('p', dayjs(endDate).format('YYYY-MM-DD HH:mm'))
        ]);
      }
    },
    {
      key: 'posterState',
      label: '海报状态',
      render(h: any, params: any) {
        const { posterState } = params.row;
        const list = statusOpts.filter((item: any) => item.value === posterState);
        return h('span', list[0]?.label || '');
      }
    },
    {
      key: 'createdName',
      label: '创建人',
    },
    {
      key: 'createdTime',
      label: '创建时间',
      render(h: any, params: any) {
        const { createdTime } = params.row;
        return h('span', dayjs(createdTime).format('YYYY-MM-DD HH:mm'));
      }
    },
    {
      key: 'updatedName',
      label: '更新人',
    },
    {
      key: 'updatedTime',
      label: '更新时间',
      render(h: any, params: any) {
        const { createdTime } = params.row;
        return h('span', createdTime ? dayjs(createdTime).format('YYYY-MM-DD HH:mm') : '');
      }
    },
  ]
};

// 列表配置(证书)
export const certificateTableData: ParamsType = {
  _this: {},
  loading: false,
  index: true,
  list: [],
  labels: [
    {
      key: '',
      label: '缩略图',
      minWidth: 60,
      render(h: any, params: any) {
        const { url } = params.row;
        const coverUrl = `${OSS_BASEURL}${url}`;
        return h('el-image', {
          props: {
            src: coverUrl,
            fit: 'fill',
            'preview-src-list': [coverUrl]
          }
        });
      }
    },
    {
      key: 'posterName',
      label: '海报名称',
    },
    {
      key: 'regionName',
      label: '片区',
    },
    {
      key: 'accessNumber',
      label: '访问人数',
      isPrice: true
    },
    {
      key: 'accessCount',
      label: '访问次数',
      isPrice: true
    },
    {
      key: 'downloadShareNum',
      label: '下载/分享人数',
      isPrice: true
    },
    {
      key: '',
      label: '海报发布时间',
      render(h: any, params: any) {
        const { beginDate, endDate } = params.row;
        return h('div', [
          h('p', `${beginDate}/`),
          h('p', endDate)
        ]);
      }
    },
    {
      key: 'posterState',
      label: '海报状态',
      render(h: any, params: any) {
        const { posterState } = params.row;
        const list = statusOpts.filter((item: any) => item.value === posterState);
        return h('span', list[0]?.label || '');
      }
    },
    {
      key: 'createdName',
      label: '创建人',
    },
    {
      key: 'createdTime',
      label: '创建时间',
    },
    {
      key: 'updatedName',
      label: '更新人',
    },
    {
      key: 'updatedTime',
      label: '更新时间',
    },
  ]
};

export const form = {
  beginDate: '',
  url: '',
  endDate: '',
  id: 0,
  posterName: '',
  posterState: 0,
  storeListDtoList: [],
  posterNum: '',
};

export const rules = {
  beginDate: [
    { required: true, message: '请选择开始时间', trigger: ['change', 'blur'] }
  ],
  endDate: [
    { required: true, message: '请选择结束时间', trigger: ['change', 'blur'] }
  ],
  posterName: [
    { required: true, message: '请输入海报名称', trigger: ['change', 'blur'] }
  ],
  storeListDtoList: [
    { required: true, message: '请选择参与区域', trigger: ['change', 'blur'] }
  ],
  url: [
    { required: true, message: '请上传海报', trigger: ['change', 'blur'] }
  ],
};
