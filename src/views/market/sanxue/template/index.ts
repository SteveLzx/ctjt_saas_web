export const tableData = {
  _this: {},
  loading: true,
  selection: true,
  index: true,
  height: 300,
  options: [
    {
      id: 4,
      label: '导出',
      path: 'btn_export'
    }
  ],
  labels: [
    {
      key: 'storeName',
      label: '门店',
      width: 80,
      showOverflowTooltip: true
    },
    {
      key: 'regionName',
      label: '片区',
      width: 80,
      showOverflowTooltip: true
    },
    {
      key: 'drivingSchoolName',
      label: '驾校',
      width: 80,
      showOverflowTooltip: true
    },
    {
      key: 'seq',
      label: '订单号',
      width: 190,
      render(h: any, params: any) {
        const { seq, id } = params.row;
        return h('el-link', {
          props: {
            type: 'primary',
            underline: false
          },
          on: {
            click: () => {
              params._self.tableData._this.jumpDetail(id, '1');
            }
          }
        },
        seq);
      }
    },
    {
      key: 'userName',
      label: '学员姓名',
      width: 80,
    },
    {
      key: 'mobile',
      label: '手机号',
      width: 120,
    },
    {
      key: 'idNo',
      label: '证件号码',
      width: 170,
    },
    {
      key: 'productName',
      label: '商品标题',
      width: 120,
      showOverflowTooltip: true
    },
    {
      key: 'className',
      label: '班别',
      width: 80,
    },
    {
      key: 'carModel',
      label: '车型',
      width: 80,
    },
    {
      key: 'learnType',
      label: '学车类型',
      width: 80,
      render(h: any, params: any) {
        const { learnType } = params.row;
        const _learnType = JSON.parse(learnType);
        if (!_learnType) return h('div', '-');
        return h('div', `${_learnType.label}`);
      }
    },
    {
      key: 'createTime',
      label: '报名时间',
      width: 160,
    },
    {
      key: 'activityName',
      label: '营销活动',
      width: 120,
      showOverflowTooltip: true
    },
    {
      key: 'discountAmount',
      label: '优惠总金额',
    },
    {
      key: 'marketingChannel',
      label: '营销渠道',
      width: 120,
      showOverflowTooltip: true
    },
    {
      key: 'status',
      label: '是否退费',
      render(h: any, params: any) {
        const { status } = params.row;
        if (status === 1) return h('div', '已退费');
        if (status === 0) return h('div', '未退费');
        return h('div', '-');
      }
    },
    {
      key: 'syncFlag',
      label: '是否转牌证',
      render(h: any, params: any) {
        const { syncFlag } = params.row;
        if (syncFlag === 1) return h('div', '是');
        return h('div', '否');
      }
    },
    {
      key: 'referrerName',
      label: '推荐人',
      width: 80,
    },
    {
      key: 'salePrice',
      label: '订单金额',
      width: 80,
    },
    {
      key: 'amount',
      label: '实收金额',
      width: 80,
    },
    {
      key: 'balance',
      label: '待收金额',
      width: 80,
      render(h: any, params: any) {
        const { balance } = params.row;
        return h('div', balance || 0);
      }
    },
    {
      key: 'balance',
      label: '是否欠费',
      width: 80,
      render(h: any, params: any) {
        const { balance } = params.row;
        return h('div', balance > 0 ? '是' : '否');
      }
    }
  ],
  list: [],
  selectionList: [], // 选中的子项数组
};

export const searchForm = {
  datePickerList: [
    {
      label: '排班日期',
      key: 'registrationBeginTime',
      value: '',
      placeholder: '开始时间',
      type: 'date',
      width: 140,
    },
    {
      label: '-',
      key: 'registrationEndTime',
      value: '',
      placeholder: '结束时间',
      type: 'date',
      width: 140,
    },
  ],
  selectList: [
    {
      label: '片区门店',
      key: 'regionId',
      value: '',
      placeholder: '请选择片区',
      multiple: false,
      clearable: true,
      width: 130,
      options: [],
    },
    {
      label: '',
      key: 'storeId',
      value: '',
      placeholder: '请选择门店',
      multiple: false,
      clearable: true,
      width: 130,
      options: [],
    },
    {
      label: '教练',
      key: 'coachId',
      value: '',
      placeholder: '请选择教练',
      multiple: false,
      clearable: true,
      width: 130,
      options: [],
    },
    {
      label: '班别明细',
      key: 'coachId',
      value: 3,
      placeholder: '',
      multiple: false,
      clearable: true,
      width: 130,
      options: [{
        label: '2小时班',
        id: 2
      }, {
        label: '3小时班',
        id: 3
      }],
    },
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
