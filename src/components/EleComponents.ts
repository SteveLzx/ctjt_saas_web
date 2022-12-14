import {
  Button,
  Select,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  MenuItem,
  MenuItemGroup,
  Footer,
  Submenu,
  Badge,
  Avatar,
  Form,
  FormItem,
  Input,
  InputNumber,
  Option,
  DatePicker,
  TimePicker,
  TimeSelect,
  Card,
  Table,
  TableColumn,
  Pagination,
  Radio,
  RadioGroup,
  RadioButton,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  CheckboxGroup,
  Checkbox,
  Row,
  Col,
  Upload,
  Drawer,
  Image,
  Dialog,
  Popconfirm,
  Loading,
  Divider,
  Tooltip,
  Cascader,
  OptionGroup,
  Progress,
  Link,
  Calendar,
  Popover,
  Switch,
  Tag,
  Autocomplete,
  Tabs,
  TabPane,
  Collapse,
  CollapseItem,
  Tree
} from 'element-ui';

const components = [
  Button,
  Select,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  MenuItem,
  MenuItemGroup,
  Footer,
  Submenu,
  Badge,
  Avatar,
  Form,
  FormItem,
  Input,
  InputNumber,
  Option,
  DatePicker,
  TimePicker,
  TimeSelect,
  Card,
  Table,
  TableColumn,
  Pagination,
  Radio,
  RadioGroup,
  RadioButton,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  CheckboxGroup,
  Checkbox,
  Row,
  Col,
  Upload,
  Drawer,
  Image,
  Dialog,
  Popconfirm,
  Loading,
  Divider,
  Tooltip,
  Cascader,
  OptionGroup,
  Progress,
  Link,
  Calendar,
  Popover,
  Switch,
  Tag,
  Autocomplete,
  Tabs,
  TabPane,
  Collapse,
  CollapseItem,
  Tree
];

const install = (app: any): void => {
  components.forEach((com) => {
    app.use(com);
  });
};
export default install;
