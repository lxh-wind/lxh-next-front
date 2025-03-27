export interface ComponentType {
  id: string;
  type: 'text' | 'image' | 'button' | 'carousel' | 'productList' | 'luckyWheel' | 'countdown' | 'coupon' | 'seckill' | 'qrcode' | 'floatMenu' | 'checkinCalendar' | 'memberBenefits' | 'surveyForm' | 'teamBuying' | 'container';
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
      paddingBottom?: number;
      color?: string;
      fontSize?: number;
      textAlign?: 'left' | 'center' | 'right';
    };
    
    // 优惠券组件特有属性
    coupons?: Array<{
      id: string;
      name: string;
      discount: string | number;
      condition: string;
      amount?: number;
      title?: string;
      buttonText?: string;
    }>;
    
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
    
    // 商品列表特有属性
    productIds?: string[];
    columns?: number;
    showPrice?: boolean;
    
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
    }>;
    
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