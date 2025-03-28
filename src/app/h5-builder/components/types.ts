export interface ComponentType {
  id: string;
  type: 'text' | 'image' | 'video' | 'button' | 'carousel' | 'productList' | 'luckyWheel' | 'countdown' | 'coupon' | 'seckill' | 'qrcode' | 'checkinCalendar' | 'memberBenefits' | 'surveyForm' | 'teamBuying' | 'container' | 'socialShare';
  name: string;
  // 添加位置信息，用于自由布局模式
  position?: {
    top?: number;
    left?: number;
    width?: string | number;
    height?: string | number;
    zIndex?: number;
  };
  props: {
    // 通用属性
    content?: string;
    src?: string;
    alt?: string;
    title?: string;
    description?: string;
    buttonText?: string;
    
    // 视频组件特有属性
    poster?: string;
    
    // 按钮特有属性
    text?: string;
    buttonType?: 'link' | 'text' | 'primary' | 'default' | 'dashed'; 
    link?: string;

    width?: number;
    height?: number;
    
    // 样式属性
    style?: {
      width?: number;
      height?: number;
      backgroundColor?: string;
      borderWidth?: string;
      borderRadius?: number;
      marginTop?: number;
      marginBottom?: number;
      padding?: number;
      paddingTop?: number;
      paddingRight?: number;
      paddingBottom?: number;
      paddingLeft?: number;
      color?: string;
      fontSize?: number;
      textAlign?: 'left' | 'center' | 'right';
    };
    
    // 优惠券组件特有属性
    coupons?: Coupon[];
    
    // 轮播图特有属性
    images?: string[];
    autoplay?: boolean;
    interval?: number;
    
    // 倒计时特有属性
    endTime?: string;
    showDays?: boolean;
    showHours?: boolean;
    showMinutes?: boolean;
    showSeconds?: boolean;
    styleType?: 'basic' | 'taobao' | 'pinduoduo' | 'modern' | 'elegant';
    timeMode?: 'endTime' | 'duration';
    remainingDays?: number;
    remainingHours?: number;
    remainingMinutes?: number;
    remainingSeconds?: number;
    timeUpText?: string;
    
    // 商品列表特有属性
    productIds?: string[];
    columns?: number;
    showPrice?: boolean;
    viewMode?: 'grid' | 'list' | 'card';
    
    // 问卷调查组件特有属性
    questions?: Array<{
      id: string;
      title: string;
      type: string;
      options?: string[];
    }>;
    
    // 会员福利特有属性
    benefits?: Array<{
      icon?: string;
      title: string;
      description?: string;
      iconColor?: string;
      bgColor?: string;
    }>;
    buttonColor?: string;
    price?: string | number;
    period?: 'day' | 'week' | 'month' | 'quarter' | 'year';
    
    // 团购组件特有属性
    rewardText?: string;
    teamSize?: number;
    product?: {
      name: string;
      teamPrice: number;
      originalPrice: number;
    };
  };
}

export interface PropertyPanelProps {
  selectedComponent: ComponentType;
  onUpdateComponent: (id: string, props: any) => void;
}

export interface PageInfo {
  id: string;
  title: string;
  description?: string;
  components: ComponentType[];
  bgMode?: 'color' | 'image' | 'gradient';
  bgColor?: string;
  bgImage?: string | null;
  bgRepeat?: string;
  shareImage?: string | null;
  layoutMode?: 'auto' | 'free';
  containerPadding?: number;
  componentGap?: number;
  canvasHeight?: number;
  published?: boolean;
  publishUrl?: string;
  tags?: string[];
}

// 组件面板属性接口
export interface ComponentPanelProps {
  onAddComponent: (component: any) => void;
}

// 组件定义接口（用于组件库）
export interface ComponentDefinition {
  name: string;
  type: string;
  icon: React.ElementType;
  defaultProps: any;
}

// 优惠券类型
export interface Coupon {
  id?: string;
  name?: string;
  title?: string;
  discount?: string | number;
  amount: number;
  minSpend?: number;
  condition: string;
  validPeriod?: string;
  buttonText?: string;
  shopName?: string;
  tag?: string;
  isNew?: boolean;
  buttonColor?: string;
}

// 组件属性接口
export interface ComponentProps {
  coupons?: Coupon[];
  // ... 其他属性
} 