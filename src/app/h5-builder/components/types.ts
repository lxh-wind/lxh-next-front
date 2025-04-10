export interface ComponentType {
  id: string;
  type: 'text' | 'image' | 'video' | 'button' | 'carousel' | 'productList' | 'luckyWheel' | 'countdown' | 'coupon' | 'seckill' | 'qrcode' | 'checkinCalendar' | 'memberBenefits' | 'surveyForm' | 'teamBuying' | 'container' | 'socialShare' | 'workoutResult';
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
    statusBarTime?: string;
    
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
    
    // 秒杀组件特有属性
    originalPrice?: string;
    salePrice?: string;
    hours?: string;
    minutes?: string; 
    seconds?: string;
    uiStyle?: 'jd' | 'taobao' | 'pdd';
    layoutType?: 'horizontal' | 'vertical';
    showDiscountPercent?: boolean;
    showSavedAmount?: boolean;
    buttonSize?: 'mini' | 'small' | 'normal';
    customButtonColor?: boolean;
    buttonColorHex?: string;
    showBadges?: boolean;
    badgeText?: string;
    showStockInfo?: boolean;
    stockInfo?: string;
    soldCount?: string;
    headerBackground?: string;
    headerTextColor?: string;
    buttonBgColor?: string;
    buttonColor?: string;
    
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
    
    // 运动结果组件特有属性
    distance?: number;
    unit?: string;
    duration?: string;
    pace?: string;
    calories?: number;
    caloriesUnit?: string;
    heartRate?: number;
    heartRateUnit?: string;
    steps?: number;
    stepsUnit?: string;
    stride?: number;
    strideUnit?: string;
    elevation?: number;
    elevationUnit?: string;
    areaName?: string;
    extraText?: string;
    mapTrackColor?: string;
    mapTrackWidth?: number;
    mapImage?: string;
    showBadge?: boolean;
    badgeNumber?: number;
    badgePosition?: 'left' | 'right';
    shareButtonText?: string;
    avatar?: string;
    username?: string;
    isPrivate?: boolean;
    routePoints?: string; // 格式: "lat1,lng1;lat2,lng2;lat3,lng3..."
    useGoogleMaps?: boolean;
    googleMapsApiKey?: string;
    mapZoom?: number;
    
    // 签到日历组件特有属性
    subtitle?: string;
    titleColor?: string;
    streakText?: string;
    showRewardTips?: boolean;
    rewardTips?: string;
    daysInMonth?: number;
    currentDay?: number;
    showSignedIcon?: boolean;
    signedDays?: number[];
    rewards?: Array<{ day: number; reward: string }>;
    weekdayLabels?: string[];
    signedDayClass?: string;
    unsignedDayClass?: string;
    currentDayClass?: string;
    signedBackground?: string;
    signedColor?: string;
    rewardColor?: string;
    signedButtonText?: string;
    signButtonSize?: 'large' | 'middle' | 'small';
    
    // 运动结果组件特有属性
    time?: number;
    energy?: number;
    badgeType?: 'medal' | 'christmas' | 'newyear' | 'custom';
    customBadgeImage?: string;
    
    // WorkoutStats related props
    trainingTime?: string;
    totalTime?: string;
    avgPace?: string;
    avgHeartRate?: number;
    elevationGain?: number;
    avgStepFrequency?: number;
    avgStepLength?: number;
    showStats?: boolean;
    badgeStyle?: 'gold' | 'silver' | 'bronze';
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
  
  // WorkoutStats related props
  trainingTime?: string;
  totalTime?: string;
  avgPace?: string;
  avgHeartRate?: number;
  calories?: number;
  elevationGain?: number;
  avgStepFrequency?: number;
  avgStepLength?: number;
  showStats?: boolean;
  badgeNumber?: number;
  badgeStyle?: 'gold' | 'silver' | 'bronze';
  statusBarTime?: string;
} 