import { modifyFormatJsonToObject } from '@/assets/js/common';
import {
  MARKET_SERVICE_STATUS, MARKET_COACH_TYPE
} from '@/enums';
import {
  canTeachTypeOpts, teachingStatusOpts, approveStatusOpts, allowScopeOpts, examSubjectsOpt, distributionModeOpts
} from '@/views/educational/_enums/index';

// 教练列表
const COACH_MG_COACH_LIST_LABEL = [
  {
    key: 'drivingSchoolName',
    label: '所属驾校',
    showOverflowTooltip: true
  },
  {
    key: 'regionName',
    label: '所属片区',
    showOverflowTooltip: true
  },
  {
    key: 'leaderName',
    label: '教学组长',
  },
  {
    key: 'userName',
    label: '教练姓名',
    render(h: any, params: any) {
      const { userName, id } = params.row;
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
      userName);
    }
  },
  {
    key: 'number',
    label: '教练车',
    render(h: any, params: any) {
      const { number, carId } = params.row;
      return h('el-link', {
        props: {
          type: 'primary',
          underline: false
        },
        on: {
          click: () => {
            params._self.tableData._this.$router.push({ path: '/vehicle/info_mg/basis_info/detail', query: { id: carId } });
          }
        }
      },
      number);
    }
  },
  {
    key: 'carType',
    label: '车型',
  },
  {
    key: 'carBrand',
    label: '车辆品牌',
    showOverflowTooltip: true
  },
  {
    key: 'property',
    label: '车辆使用性质',
    width: 110
  },
  {
    key: 'type',
    label: '教练类型',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { type } = params.row;
      const _list = MARKET_COACH_TYPE;
      const _item = _list.filter(item => item.id === type);
      if (type === 0 || _item.length === 0) {
        return h('div', '');
      }
      return h('div', `${_item[0].label}`);
    }
  },
  {
    key: 'teachingSubjects',
    label: '带教类型',
    showOverflowTooltip: true,
  },
  {
    key: 'teachCar',
    label: '带教车型',
  },
  {
    key: 'mobile',
    label: '手机号',
  },
  {
    key: 'teachingClass',
    label: '带教班别',
    render(h: any, params: any) {
      const { teachingClass } = params.row;
      const _data = teachingClass ? modifyFormatJsonToObject(teachingClass) : [];
      const _text = _data.join('，');
      return h('el-popover', {
        props: {
          placement: 'top-start',
          width: '300',
          trigger: 'hover',
          content: _text,
        },
        scopedSlots: {
          reference: () => h('p', _text),
        },
      });
    }
  },
  {
    key: 'storeName',
    label: '主要门店',
    showOverflowTooltip: true,
  },
  {
    key: 'secondaryStore',
    label: '次要门店',
    showOverflowTooltip: true,
    render(h: any, params: any) {
      const { secondaryStore } = params.row;
      const _data = secondaryStore ? modifyFormatJsonToObject(secondaryStore) : [];
      if (_data.length > 0) {
        const _list: string[] = [];
        _data.forEach((item: any) => _list.push(item.name));
        const _text = _list.join('，');
        return h('el-popover', {
          props: {
            placement: 'top-start',
            width: '300',
            trigger: 'hover',
            content: _text,
          },
          scopedSlots: {
            reference: () => h('p', _text),
          },
        });
      }
      return h('div', '');
    }
  },
  {
    key: 'subjectTwoExamPlace',
    label: '科目二考场',
    width: 100,
    render(h: any, params: any) {
      const { subjectTwoExamPlace } = params.row;
      const _data = subjectTwoExamPlace ? modifyFormatJsonToObject(subjectTwoExamPlace) : [];
      const _text = _data.join('，');
      return h('el-popover', {
        props: {
          placement: 'top-start',
          width: '300',
          trigger: 'hover',
          content: _text,
        },
        scopedSlots: {
          reference: () => h('p', _text),
        },
      });
    }
  },
  {
    key: 'subjectThreeExamPlace',
    label: '科目三考场',
    width: 100,
    render(h: any, params: any) {
      const { subjectThreeExamPlace } = params.row;
      const _data = subjectThreeExamPlace ? modifyFormatJsonToObject(subjectThreeExamPlace) : [];
      const _text = _data.join('，');
      return h('el-popover', {
        props: {
          placement: 'top-start',
          width: '300',
          trigger: 'hover',
          content: _text,
        },
        scopedSlots: {
          reference: () => h('p', _text),
        },
      });
    }
  },
  {
    key: 'loadStudent',
    label: '总负荷',
  },
  {
    key: 'unsolvedTwo',
    label: '科二负荷',
  },
  {
    key: 'unsolvedThree',
    label: '科三负荷',
  },
  {
    key: 'status',
    label: '供职状态',
    render(h: any, params: any) {
      const { status } = params.row;
      const _list = MARKET_SERVICE_STATUS;
      const _item = _list.filter(item => item.id === status);
      if (status === 0 || _item.length === 0) {
        return h('div', '-');
      }
      return h('div', `${_item[0].label}`);
    }
  },
  {
    key: 'isIntelligentCar',
    label: '是否机器人教练',
    width: 120,
    render(h: any, params: any) {
      const { isIntelligentCar } = params.row;
      return h('div', isIntelligentCar === 1 ? '是' : '否');
    }
  },
  {
    key: 'teachingStatus',
    label: '带教状态',
    render(h: any, params: any) {
      const { teachingStatus } = params.row;
      const _list = teachingStatusOpts.filter((item: any) => item.value === teachingStatus);
      return h('div', _list[0] && _list[0].label);
    }
  },
];

// 教学组管理
const COACH_MG_TEACH_GROUP_MG_LABEL = [
  {
    key: 'regionName',
    label: '片区',
  },
  {
    key: 'name',
    label: '教学组名',
    render(h: any, params: any) {
      const { name, id } = params.row;
      return h('el-link', {
        props: {
          type: 'primary',
          underline: false
        },
        on: {
          click: () => {
            params._self.tableData._this.openDrawerDetail(id);
          }
        }
      }, name);
    }
  },
  {
    key: 'leaderName',
    label: '教学组长',
    render(h: any, params: any) {
      const { leaderName, leaderId } = params.row;
      return h('el-link', {
        props: {
          type: 'primary',
          underline: false
        },
        on: {
          click: () => {
            params._self.tableData._this.$router.push({ path: '/educational/coach_mg/coach_list/detail', query: { id: leaderId, isEdit: '1' } });
          }
        }
      }, leaderName);
    }
  },
  {
    key: 'coachNumber',
    label: '管辖教练',
  },
  {
    key: 'coachCarNumber',
    label: '管辖教练车',
  },
  {
    key: 'noGroupCoachNumber',
    label: '片区未分组教练',
    render(h: any, params: any) {
      const { noGroupCoachNumber, regionId } = params.row;
      if (noGroupCoachNumber > 0) {
        return h('el-link', {
          props: {
            type: 'primary',
            underline: false
          },
          on: {
            click: () => {
              params._self.tableData._this.openDrawerNoGrouping(regionId);
            }
          }
        }, noGroupCoachNumber);
      }
      return h('div', noGroupCoachNumber);
    }
  },
  {
    key: 'createdName',
    label: '添加人',
  },
];

// 分配教练
const COACH_MG_COACH_DISTRIBUTE_LABEL = [
  {
    key: 'batchNo',
    label: '批次号',
    render(h: any, params: any) {
      const { batchNo } = params.row;
      return h('el-link', {
        props: {
          type: 'primary',
          underline: false
        },
        on: {
          click: () => {
            params._self.tableData._this.jumpDetail(batchNo);
          }
        }
      },
      batchNo);
    }
  },
  {
    key: 'number',
    label: '数量',
  },
  {
    key: 'createdName',
    label: '申请人',
  },
  {
    key: 'createdTime',
    label: '申请日期',
  }
];

// 教练修改审批
const COACH_MG_COACH_MODIFY_LABEL = [
  {
    key: 'regionName',
    label: '片区',
  },
  {
    key: 'applyNo',
    label: '申请单据',
    render(h: any, params: any) {
      const { id, applyNo } = params.row;
      return h('el-link', {
        props: {
          type: 'primary',
          underline: false
        },
        on: {
          click: () => {
            params._self.tableData._this.jumpDetail(id);
          }
        }
      },
      applyNo);
    }
  },
  {
    key: 'userName',
    label: '教练姓名',
  },
  {
    key: 'createdTime',
    label: '申请时间',
  },
  {
    key: 'status',
    label: '审批状态',
    render(h: any, params: any) {
      const { status } = params.row;
      const _list = approveStatusOpts.filter((item: any) => item.id === status);
      return h('div', _list[0] && _list[0].label);
    }
  },
  {
    key: 'nextNode',
    label: '当前审批环节',
  },
  {
    key: 'approver',
    label: '审核人',
  },
  {
    key: 'createdName',
    label: '申请人',
  }
];

// 教练新增审批
const COACH_MG_COACH_APPLY_LABEL = [
  {
    key: 'regionName',
    label: '片区',
  },
  {
    key: 'applyNo',
    label: '申请单据',
    render(h: any, params: any) {
      const { applyNo, id } = params.row;
      return h('el-link', {
        props: {
          type: 'primary',
          underline: false
        },
        on: {
          click: () => {
            params._self.tableData._this.jumpDetail(id);
          }
        }
      },
      applyNo);
    }
  },
  {
    key: 'userName',
    label: '教练姓名',
  },
  {
    key: 'createdTime',
    label: '申请时间',
  },
  {
    key: 'status',
    label: '审批状态',
    render(h: any, params: any) {
      const { status } = params.row;
      const _list = approveStatusOpts.filter((item: any) => item.id === status);
      return h('div', _list[0] && _list[0].label);
    }
  },
  {
    key: 'nextNode',
    label: '当前审批环节',
  },
  {
    key: 'approver',
    label: '审核人',
  },
  {
    key: 'createdName',
    label: '申请人',
  }
];

// 学员分配记录
const TEACH_MG_STUDENT_DISTRIBUTION_LABEL = [
  {
    key: 'regionName',
    label: '片区',
  },
  {
    key: 'coachName',
    label: '教练姓名',
  },
  {
    key: 'teachType',
    label: '带教类型',
  },
  {
    key: 'mode',
    label: '分配方式',
    render(h: any, params: any) {
      const { mode } = params.row;
      const _list = distributionModeOpts.filter((item: any) => item.value === mode);
      return h('div', _list[0] && _list[0].label);
    }
  },
  {
    key: 'createdTime',
    label: '分配日期',
  },
  {
    key: 'total',
    label: '分配学员数量',
    render(h: any, params: any) {
      const {
        total, coachId, coachName, mode
      } = params.row;
      return h('el-link', {
        props: {
          type: 'primary',
          underline: false
        },
        on: {
          click: () => {
            params._self.tableData._this.jumpDetail(coachId, coachName, mode);
          }
        }
      },
      total);
    }
  },
  {
    key: 'teachCar',
    label: '带教车型',
  }
];

// 学员恢复学车申请
const TEACH_MG_STUDENT_LEARN_APPLY_LABEL = [
  {
    key: '',
    label: '片区'
  },
  {
    key: '',
    label: '门店'
  },
  {
    key: '',
    label: '审批单号'
  },
  {
    key: '',
    label: '学员姓名'
  },
  {
    key: '',
    label: '联系电话'
  },
  {
    key: '',
    label: '证件号码'
  },
  {
    key: '',
    label: '学车状态'
  },
  {
    key: '',
    label: '审批状态'
  },
  {
    key: '',
    label: '当前审核环节'
  },
  {
    key: '',
    label: '当前处理人'
  },
  {
    key: '',
    label: '申请人'
  },
  {
    key: '',
    label: '申请时间'
  }
];

// 学员暂停学车申请
const TEACH_MG_STUDENT_LEARN_APPLY_STOP_LABEL = [
  {
    key: '',
    label: '片区'
  },
  {
    key: '',
    label: '门店'
  },
  {
    key: '',
    label: '审批单号'
  },
  {
    key: '',
    label: '学员姓名'
  },
  {
    key: '',
    label: '联系电话'
  },
  {
    key: '',
    label: '证件号码'
  },
  {
    key: '',
    label: '学车状态'
  },
  {
    key: '',
    label: '审批状态'
  },
  {
    key: '',
    label: '当前审核环节'
  },
  {
    key: '',
    label: '当前处理人'
  },
  {
    key: '',
    label: '申请人'
  },
  {
    key: '',
    label: '申请时间'
  }
];

// 变更教练审批（已批复）
const TEACH_MG_COACH_CHANGE_APPROVE_LABEL = [
  {
    key: 'applyNo',
    label: '申请单号',
  },
  {
    key: 'regionName',
    label: '片区'
  },
  {
    key: 'storeName',
    label: '门店'
  },
  {
    key: 'userName',
    label: '学员姓名'
  },
  {
    key: 'idNo',
    label: '证件号码',
  },
  {
    key: 'mobile',
    label: '手机号',
  },
  {
    key: 'originalCoachName',
    label: '教练'
  },
  {
    key: 'newCoachName',
    label: '转入教练'
  },
  {
    key: 'isReply',
    label: '是否批复',
    render(h: any, params: any) {
      const { isReply } = params.row;
      if (isReply === 1) {
        return h('div', '是');
      }
      if (isReply === 0) {
        return h('div', '否');
      }
      return h('div', '');
    }
  },
  {
    key: 'examDate',
    label: '考试时间',
  },
  {
    key: 'examSubjects',
    label: '科目',
    render(h: any, params: any) {
      const { examSubjects } = params.row;
      const _list = examSubjectsOpt.filter((item: any) => item.value === Number(examSubjects));
      if (_list.length > 0) {
        return h('div', _list[0].label);
      }
      return h('div', '');
    }
  },
  {
    key: 'status',
    label: '审核状态',
    render(h: any, params: any) {
      const { id, status } = params.row;
      const _list = approveStatusOpts.filter((item: any) => item.id === status);
      const _text = _list[0] && _list[0].label;
      return h('el-link', {
        props: {
          type: 'primary',
          underline: false
        },
        on: {
          click: () => {
            params._self.tableData._this.jumpDetail(id);
          }
        }
      },
      _text);
    }
  },
  {
    key: 'nextNode',
    label: '审批环节'
  },
  {
    key: 'approver',
    label: '审核人'
  },
  {
    key: 'createdName',
    label: '申请人'
  },
  {
    key: 'createdTime',
    label: '申请日期',
  },
  {
    key: 'duration',
    label: '耗时(h)'
  }
];

// 带教类型设置
const BASIC_SET_COACH_TEACH_TYPE_SET_LABEL = [
  {
    key: 'name',
    label: '带教类型',
    render(h: any, params: any) {
      const { name, id } = params.row;
      return h('el-link', {
        props: {
          type: 'primary',
          underline: false
        },
        on: {
          click: () => {
            params._self.tableData._this.jumpDetail(id, '2');
          }
        }
      },
      name);
    }
  },
  {
    key: 'property',
    label: '带教属性',
    render(h: any, params: any) {
      const { property } = params.row;
      return h('div', property === 1 ? '有' : '无');
    },
  },
  {
    key: 'subject',
    label: '可带教科目',
    render(h: any, params: any) {
      const { subject } = params.row;
      return h('div', subject ? subject.join(',') : '');
    },
  },
  {
    key: 'model',
    label: '可带教模式',
    render(h: any, params: any) {
      const { model } = params.row;
      const arrList = canTeachTypeOpts.filter(item => item.value === model);
      return h('div', arrList[0] ? arrList[0].label : '');
    },
  },
  {
    key: 'createdTime',
    label: '添加时间'
  },
  {
    key: 'createdName',
    label: '添加人'
  },
  {
    key: 'status',
    label: '状态',
    render(h: any, params: any) {
      const { status } = params.row;
      return h('div', status === 1 ? '启用' : '停用');
    },
  },
  {
    key: 'remarks',
    label: '备注'
  },
];

// 自动分配教练规则设置
const BASIC_SET_COACH_DISTRIBUTION_AUTO_SET_LABEL = [
  {
    key: 'name',
    label: '分配规则',
    render(h: any, params: any) {
      const { name, id } = params.row;
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
      name);
    }
  },
  {
    key: 'classesInfo',
    label: '目标班别',
    render(h: any, params: any) {
      const { classesInfo } = params.row;
      const _list: string[] = [];
      classesInfo.forEach((item: any) => {
        _list.push(`${item.name}-${item.carModel}`);
      });
      const _text = _list.join('，');
      return h('el-popover', {
        props: {
          placement: 'top-start',
          width: '300',
          trigger: 'hover',
          content: _text,
        },
        scopedSlots: {
          reference: () => h('p', _text),
        },
      });
    }
  },
  {
    key: 'subjectAccess',
    label: '入库条件',
  },
  {
    key: 'subjectOut',
    label: '出库条件',
  },
  {
    key: 'subjectTeach',
    label: '可分配带教类型',
    render(h: any, params: any) {
      const { subjectTeach } = params.row;
      const _text: string[] = [];
      subjectTeach.forEach((item: any) => {
        _text.push(`${item.name}`);
      });
      return h('div', _text.join(', '));
    }
  },
  {
    key: 'allowScope',
    label: '可分配教练范围',
    render(h: any, params: any) {
      const { allowScope } = params.row;
      const _text = allowScopeOpts.filter(item => item.value === allowScope);
      if (_text.length > 0) return h('div', _text[0].label);
      return h('div', '');
    }
  }
];

export {
  COACH_MG_COACH_LIST_LABEL,
  COACH_MG_TEACH_GROUP_MG_LABEL,
  COACH_MG_COACH_DISTRIBUTE_LABEL,
  COACH_MG_COACH_MODIFY_LABEL,
  TEACH_MG_STUDENT_DISTRIBUTION_LABEL,
  TEACH_MG_STUDENT_LEARN_APPLY_LABEL,
  TEACH_MG_STUDENT_LEARN_APPLY_STOP_LABEL,
  TEACH_MG_COACH_CHANGE_APPROVE_LABEL,
  BASIC_SET_COACH_TEACH_TYPE_SET_LABEL,
  BASIC_SET_COACH_DISTRIBUTION_AUTO_SET_LABEL,
  COACH_MG_COACH_APPLY_LABEL
};
