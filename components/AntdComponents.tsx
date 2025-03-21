"use client";

/**
 * Ant Design v5 组件导入示例文件
 * 此文件仅作为参考，展示如何从 antd 和 @ant-design/icons 导入各种组件
 * 文档：https://ant.design/components/overview-cn/
 */

// 布局组件
import {
  Layout,
  Space,
  Divider,
  Row,
  Col,
  Grid,
  Flex,
} from 'antd';

// 导航组件
import {
  Menu,
  Pagination,
  Steps,
  Dropdown,
  Breadcrumb,
  Affix,
} from 'antd';

// 数据录入组件
import {
  AutoComplete,
  Checkbox,
  Cascader,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Mentions,
  Radio,
  Rate,
  Select,
  Slider,
  Switch,
  TimePicker,
  Transfer,
  TreeSelect,
  Upload,
} from 'antd';

// 数据展示组件
import {
  Avatar,
  Badge,
  Calendar,
  Card,
  Carousel,
  Collapse,
  Descriptions,
  Empty,
  Image,
  List,
  Popover,
  Statistic,
  Table,
  Tabs,
  Tag,
  Timeline,
  Tooltip,
  Tree,
} from 'antd';

// 反馈组件
import {
  Alert,
  Drawer,
  Modal,
  Popconfirm,
  Progress,
  Result,
  Skeleton,
  Spin,
} from 'antd';

// 消息组件 - 这些是方法而不是组件
import { message, notification } from 'antd';

// 其他工具组件
import {
  Anchor,
  BackTop,
  ConfigProvider,
  Typography,
  FloatButton,
  App,
  QRCode,
  Watermark,
  Tour,
} from 'antd';

// 常用图标
import {
  HomeOutlined,
  LoadingOutlined,
  SettingOutlined, 
  SmileOutlined,
  SyncOutlined,
  UserOutlined,
  SearchOutlined,
  DownOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  MenuOutlined,
  LeftOutlined,
  RightOutlined,
  UpOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  MinusOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';

// 子组件和常用解构
const { Header, Footer, Sider, Content } = Layout;
const { Title, Text, Link, Paragraph } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Meta } = Card;
const { SubMenu } = Menu;
const { Group: RadioGroup } = Radio;
const { Group: CheckboxGroup } = Checkbox;
const { Item: FormItem } = Form;
const { Item: MenuItem } = Menu;
const { Password: InputPassword } = Input;
const { TextArea } = Input;

/**
 * 这是一个示例组件，展示如何使用 Ant Design v5 的组件
 * 仅作参考，实际使用时请根据需要导入所需组件
 */
export default function AntDesignExample() {
  return (
    <div>
      <Typography>
        <Title>Ant Design 组件示例</Title>
        <Paragraph>
          这个文件展示了如何导入和使用 Ant Design v5 的组件。
          请参考 <Link href="https://ant.design/components/overview-cn/" target="_blank">Ant Design 文档</Link> 获取更多信息。
        </Paragraph>
      </Typography>
    </div>
  );
} 