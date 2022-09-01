import { OSS_BASEURL } from '@/assets/js/common';

export const tableData = {
  _this: {},
  loading: true,
  selection: true,
  index: true,
  options: [
    {
      id: 4,
      label: '导出',
      path: 'btn_export'
    }
  ],
  labels: [
    {
      key: 'appointDate',
      label: '学车日期'
    }, {
      key: 'coachName',
      label: '教练'
    }, {
      key: 'studentName',
      label: '学员姓名'
    }, {
      key: 'studentIdNo',
      label: '证件号码'
    }, {
      key: 'studentMobile',
      label: '联系电话'
    }, {
      key: 'timeFrameName',
      label: '约车时段'
    }, {
      key: 'period',
      label: '学时数'
    }, {
      key: 'cancelCause',
      label: '取消原因'
    }, {
      key: 'operatorBy',
      label: '操作人'
    }, {
      key: '',
      label: '附件',
      minWidth: 165,
      render(h: any, params: any) {
        const { cancelAccessory } = params.row;
        const newList = cancelAccessory.map((item: any) => `${OSS_BASEURL}${item}`);
        return h('div', newList.map((item: any) => h('el-image', {
          props: {
            src: item,
            lazy: true,
            previewSrcList: newList
          },
          style: {
            width: '30px',
            height: '30px',
            marginRight: '2px'
          }
        })));
      }
    },
  ],
  list: [],
  selectionList: [], // 选中的子项数组
};

export const searchForm = {
  datePickerList: [
    {
      label: '学车日期',
      key: 'startDate',
      value: '',
      placeholder: '开始时间',
      type: 'date',
      width: 140,
      clearable: true
    },
    {
      label: '-',
      key: 'endDate',
      value: '',
      placeholder: '结束时间',
      type: 'date',
      width: 140,
      clearable: true
    },
  ],
  selectList: [
    {
      label: '教练',
      key: 'coachId',
      value: '',
      placeholder: '请选择教练',
      multiple: false,
      clearable: true,
      width: 130,
      filterable: true,
      options: [],
      customOptions: {
        value: 'id',
        label: 'name'
      }
    }
  ],
  inputList: [
    {
      label: '关键字',
      key: 'keyword',
      type: 'text',
      value: '',
      width: 310,
      placeholder: '请输入学员姓名、手机号、证件号码',
      clearable: true,
    }
  ],
  buttonList: [
    {
      label: '查询',
      key: 'search',
      type: 'primary',
      plain: false,
      path: 'btn_search'
    },
    {
      label: '重置',
      key: 'reset',
      type: '',
      plain: false,
      path: 'btn_search'
    }
  ]
};
