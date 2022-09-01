import { Vue } from 'vue-property-decorator';

export interface VueComponentParent extends Vue {
  validate: (callback: (valid: boolean) => boolean | void) => boolean | void;
  resetFields: () => void;
  clearFiles: () => void;
  resetField: () => void;
  clearValidate: () => void;
  uploadClearFiles: (isUpload: boolean) => void;
  uploadFiles: () => void;
  clearSelection: () => void;
  toggleRowSelection: (val: any, bol: boolean) => void;
  setCurrentRow: () => void;
  getCheckedKeys: () => string[];
  getHalfCheckedKeys: () => string[];
  offsetHeight: number;
  style: any;
  bodyWrapper: any;
  submitLoading: boolean;
  parentNode: any;
}
export type ParamsType = {
  [key: string]: any
}
export interface TableOptionsValue {
  label: string;
  btnType?: string;
  icon: string;
  color: string;
  id: number;
  optionVal: string;
  slots: string;
  upload?: boolean;
}

export type CallAddressDataType = {
  type: string,
  id: number,
  value: string
};

export type SelectOptionDataType = {
  id: number | null,
  label: string
};
export type SelectparamType = {
  id: string,
  label: string
};
export type CasderType = {
  label: string;
  id: number | null;
  children?: {
    label: string;
    id: number | null;
  }[];
};

export type StaticDataType = {
  label: string,
  value: any
};
