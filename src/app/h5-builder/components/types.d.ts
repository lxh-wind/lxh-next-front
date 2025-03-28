// 组件类型接口
export interface ComponentType {
  id: string;
  type: string;
  props: {
    content?: string;
    src?: string;
    alt?: string;
    title?: string;
    description?: string;
    buttonText?: string;
    text?: string;
    style?: any;
    images?: any[];
    coupons?: any[];
    showDays?: boolean;
    showHours?: boolean;
    showMinutes?: boolean;
    showSeconds?: boolean;
    buttonType?: 'primary' | 'default' | 'dashed';
    benefits?: any[];
    questions?: any[];
    rewardText?: string;
    teamSize?: number;
    product?: { name: string; teamPrice: number; originalPrice: number };
    prizes?: Array<{
      id: string;
      name: string;
      probability: number;
      bgColor?: string;
      fontColor?: string;
    }>;
    // 轮播图属性
    autoplay?: boolean;
    interval?: number;
    // 商品列表属性
    viewMode?: 'grid' | 'list' | 'card';
    columns?: number;
    // 倒计时属性
    endTime?: string;
    // 会员专享属性
    buttonColor?: string;
    price?: string | number;
    period?: 'day' | 'week' | 'month' | 'quarter' | 'year';
    // 签到日历属性
    subtitle?: string;
    daysInMonth?: number;
    currentDay?: number;
    signedDays?: number[];
    rewards?: Array<{ day: number; reward: string }>;
    weekdayLabels?: string[];
    titleColor?: string;
    signedDayClass?: string;
    unsignedDayClass?: string;
    currentDayClass?: string;
    signedBackground?: string;
    signedColor?: string;
    rewardColor?: string;
    showSignedIcon?: boolean;
    streakText?: string;
    buttonSize?: 'large' | 'middle' | 'small';
    signedButtonText?: string;
    showRewardTips?: boolean;
    rewardTips?: string;
    // 淘宝/拼多多风格UI新增属性
    headerBackground?: string;
    headerTextColor?: string;
    buttonBgColor?: string;
  };
  icon?: React.ElementType;
  name?: string;
  defaultProps?: any;
  position?: {
    top?: number;
    left?: number;
    width?: number | string;
    height?: number | string;
    zIndex?: number;
  };
}

// 组件定义接口（不含id，用于组件库中）
export interface ComponentDefinition {
  type: string;
  name: string;
  icon: React.ElementType;
  defaultProps: any;
}

// 组件面板属性接口
export interface ComponentPanelProps {
  onAddComponent: (component: any) => void;
}

// 画布属性接口
export interface CanvasProps {
  components: ComponentType[];
  selectedComponentId?: string;
  onSelectComponent?: (component: ComponentType) => void;
  onRemoveComponent?: (id: string) => void;
  onUpdateComponentPosition?: (id: string, position: { top: number; left: number }) => void;
  onDeleteComponent?: (id: string) => void;
  onDuplicateComponent?: (id: string) => void;
  onUpdateComponentsOrder?: (startIndex: number, endIndex: number) => void;
  zoom: number;
}

// 属性面板接口
export interface PropertyPanelProps {
  selectedComponent: ComponentType | null;
  onUpdateComponent: (id: string, props: any) => void;
}

// 页面数据接口
export interface PageInfo {
  id?: string;
  title: string;
  description?: string;
  tags?: string[];
  components: ComponentType[];
  published?: boolean;
  publishUrl?: string;
  
  // 外观设置
  bgMode?: 'color' | 'image' | 'gradient';
  bgColor?: string;
  bgImage?: string | null;
  bgRepeat?: string;
  shareImage?: string | null;
  
  // 布局设置
  layoutMode?: 'auto' | 'free';
  containerPadding?: number;
  componentGap?: number;
} 