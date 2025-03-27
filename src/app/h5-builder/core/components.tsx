'use client';

import { 
  FontSizeOutlined, 
  PictureOutlined, 
  PlayCircleOutlined, 
  ShoppingOutlined, 
  FormOutlined, 
  BarcodeOutlined, 
  CreditCardOutlined, 
  AppstoreOutlined,
  ClockCircleOutlined,
  BellOutlined,
  GiftOutlined,
  CalendarOutlined,
  CrownOutlined,
  LikeOutlined,
  TeamOutlined
} from '@ant-design/icons';

// 组件类型定义
export interface ComponentType {
  // 组件类型标识
  type: string;
  // 组件名称
  name: string;
  // 组件图标
  icon: any;
  // 组件分类: basic - 基础组件, marketing - 营销组件, advanced - 高级营销组件
  category: 'basic' | 'marketing' | 'advanced';
  // 默认属性
  defaultProps: any;
}

// 组件列表
export const marketingComponents: ComponentType[] = [
  // 基础组件
  {
    type: 'text',
    name: '文本',
    icon: FontSizeOutlined,
    category: 'basic',
    defaultProps: {
      content: '请输入文本内容',
      style: {
        color: '#333333',
        fontSize: 14,
        fontWeight: 'normal',
        textAlign: 'left',
        paddingTop: 10,
        paddingRight: 0,
        paddingBottom: 10,
        paddingLeft: 0,
        backgroundColor: 'transparent'
      }
    }
  },
  {
    type: 'image',
    name: '图片',
    icon: PictureOutlined,
    category: 'basic',
    defaultProps: {
      src: 'https://placeholder.pics/svg/300x150',
      alt: '图片',
      width: 100,
      height: 100,
      style: {
        width: 100,
        borderRadius: 0,
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        backgroundColor: 'transparent'
      }
    }
  },
  {
    type: 'button',
    name: '按钮',
    icon: FormOutlined,
    category: 'basic',
    defaultProps: {
      text: '按钮',
      type: 'primary',
      link: '',
      style: {
        width: 80,
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        backgroundColor: 'transparent'
      }
    }
  },
  
  // 营销组件
  {
    type: 'carousel',
    name: '轮播图',
    icon: PlayCircleOutlined,
    category: 'marketing',
    defaultProps: {
      autoplay: true,
      interval: 3000,
      images: [
        'https://placeholder.pics/svg/375x200/DEDEDE/555555/轮播图1',
        'https://placeholder.pics/svg/375x200/DEDEDE/555555/轮播图2',
        'https://placeholder.pics/svg/375x200/DEDEDE/555555/轮播图3',
      ],
      style: {
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        backgroundColor: 'transparent'
      },
      animation: '',
      animationDuration: 500
    }
  },
  {
    type: 'productList',
    name: '商品列表',
    icon: ShoppingOutlined,
    category: 'marketing',
    defaultProps: {
      productIds: [],
      columns: 2,
      showPrice: true,
      style: {
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        backgroundColor: '#f5f5f5'
      }
    }
  },
  {
    type: 'countdown',
    name: '倒计时',
    icon: ClockCircleOutlined,
    category: 'marketing',
    defaultProps: {
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24小时后
      title: '距离活动结束还剩',
      showDays: true,
      showHours: true,
      showMinutes: true,
      showSeconds: true,
      style: {
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        color: '#ff4d4f',
        backgroundColor: 'transparent',
        textAlign: 'center'
      }
    }
  },
  {
    type: 'coupon',
    name: '优惠券',
    icon: CreditCardOutlined,
    category: 'marketing',
    defaultProps: {
      title: '限时优惠券',
      coupons: [
        { 
          id: '1', 
          name: '满100减10', 
          discount: '10', 
          condition: '满100元可用' 
        },
        { 
          id: '2', 
          name: '满200减30', 
          discount: '30',
          condition: '满200元可用' 
        }
      ],
      style: {
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        backgroundColor: '#fff1f0'
      }
    }
  },
  {
    type: 'seckill',
    name: '秒杀',
    icon: BellOutlined,
    category: 'marketing',
    defaultProps: {
      title: '限时秒杀',
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2小时后
      products: [
        {
          id: '1',
          name: '秒杀商品1',
          originalPrice: '199.00',
          seckillPrice: '99.00',
          image: 'https://placeholder.pics/svg/100x100'
        },
        {
          id: '2',
          name: '秒杀商品2', 
          originalPrice: '299.00',
          seckillPrice: '199.00',
          image: 'https://placeholder.pics/svg/100x100'
        }
      ],
      style: {
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        backgroundColor: '#fff1f0'
      }
    }
  },
  {
    type: 'qrcode',
    name: '二维码',
    icon: BarcodeOutlined,
    category: 'marketing',
    defaultProps: {
      content: 'https://example.com',
      size: 150,
      title: '扫码关注',
      description: '扫描二维码，关注公众号',
      style: {
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        backgroundColor: 'transparent',
        textAlign: 'center'
      }
    }
  },
  {
    type: 'floatMenu',
    name: '悬浮菜单',
    icon: AppstoreOutlined,
    category: 'marketing',
    defaultProps: {
      items: [
        {
          icon: 'home',
          text: '首页',
          link: '/'
        },
        {
          icon: 'cart',
          text: '购物车',
          link: '/cart'
        },
        {
          icon: 'user',
          text: '我的',
          link: '/user'
        }
      ],
      position: 'bottom',
      style: {
        backgroundColor: '#ffffff',
        color: '#333333'
      }
    }
  },
  
  // 高级营销组件
  {
    type: 'luckyWheel',
    name: '幸运大转盘',
    icon: GiftOutlined,
    category: 'advanced',
    defaultProps: {
      title: '幸运大转盘',
      description: '转动大转盘，赢取惊喜好礼',
      buttonText: '点击抽奖',
      prizes: [
        {
          id: '1',
          name: '一等奖',
          probability: 0.01,
          type: 'physical',
          image: 'https://placeholder.pics/svg/60x60/DEDEDE/555555/奖品1'
        },
        {
          id: '2',
          name: '二等奖',
          probability: 0.05,
          type: 'coupon',
          image: 'https://placeholder.pics/svg/60x60/DEDEDE/555555/奖品2'
        },
        {
          id: '3',
          name: '三等奖',
          probability: 0.1,
          type: 'points',
          image: 'https://placeholder.pics/svg/60x60/DEDEDE/555555/奖品3'
        },
        {
          id: '4',
          name: '谢谢参与',
          probability: 0.84,
          type: 'none',
          image: 'https://placeholder.pics/svg/60x60/DEDEDE/555555/谢谢参与'
        }
      ],
      maxChances: 3,
      style: {
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        backgroundColor: '#fff8e8',
        textAlign: 'center'
      }
    }
  },
  {
    type: 'checkinCalendar',
    name: '签到日历',
    icon: CalendarOutlined,
    category: 'advanced',
    defaultProps: {
      title: '每日签到',
      subtitle: '连续签到得好礼',
      rewards: [
        { day: 1, reward: '5积分' },
        { day: 3, reward: '10积分' },
        { day: 7, reward: '20积分' },
        { day: 15, reward: '50积分' },
        { day: 30, reward: '100积分' }
      ],
      buttonText: '立即签到',
      style: {
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        backgroundColor: '#f0f7ff',
        textAlign: 'center'
      }
    }
  },
  {
    type: 'memberBenefits',
    name: '会员专享',
    icon: CrownOutlined,
    category: 'advanced',
    defaultProps: {
      title: '会员专享礼遇',
      description: '开通会员即可享受多种特权',
      benefits: [
        { icon: 'discount', name: '专属折扣', description: '会员专享8.5折起' },
        { icon: 'gift', name: '生日礼品', description: '生日当月送惊喜礼品' },
        { icon: 'priority', name: '优先购买', description: '新品抢先体验' },
        { icon: 'service', name: '专属客服', description: '会员专线客服' }
      ],
      buttonText: '立即开通',
      price: '30.00',
      period: 'month',
      style: {
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        backgroundColor: '#f9f0ff',
        textAlign: 'center'
      }
    }
  },
  {
    type: 'surveyForm',
    name: '投票调查',
    icon: LikeOutlined,
    category: 'advanced',
    defaultProps: {
      title: '用户调查',
      description: '参与调查有机会获得抽奖资格',
      questions: [
        {
          type: 'radio',
          title: '您的性别是？',
          options: ['男', '女', '保密']
        },
        {
          type: 'checkbox',
          title: '您平时喜欢哪些类型的产品？（可多选）',
          options: ['服装', '数码', '美妆', '食品', '家居']
        },
        {
          type: 'text',
          title: '您对我们的产品有什么建议？'
        }
      ],
      buttonText: '提交',
      rewardText: '提交后可获得抽奖机会',
      style: {
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        backgroundColor: '#f5f5f5',
        textAlign: 'left'
      }
    }
  },
  {
    type: 'teamBuying',
    name: '拼团活动',
    icon: TeamOutlined,
    category: 'advanced',
    defaultProps: {
      title: '拼团优惠',
      description: '邀请好友一起拼团，享受超低价格',
      product: {
        id: '1',
        name: '拼团商品',
        originalPrice: '199.00',
        teamPrice: '99.00',
        image: 'https://placeholder.pics/svg/200x200'
      },
      teamSize: 3,
      timeLimit: 24, // 小时
      expireTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      buttonText: '发起拼团',
      style: {
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        backgroundColor: '#fff1f0',
        textAlign: 'center'
      }
    }
  }
];

// 获取所有组件
export const getAllComponents = () => marketingComponents;

// 根据分类获取组件
export const getComponentsByCategory = (category: string) => {
  return marketingComponents.filter(component => component.category === category);
};

// 根据类型获取组件
export const getComponentByType = (type: string) => {
  return marketingComponents.find(component => component.type === type);
}; 