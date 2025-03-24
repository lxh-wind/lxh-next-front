import { 
  FontSizeOutlined, 
  PictureOutlined, 
  BorderOutlined,
  PlayCircleOutlined,
  AppstoreOutlined,
  ClockCircleOutlined,
  TagOutlined,
  EyeOutlined,
  CheckSquareOutlined,
  CalendarOutlined,
  CrownOutlined,
  FormOutlined,
  TeamOutlined,
  GiftOutlined
} from '@ant-design/icons';
import { ComponentDefinition } from '../components/types';

// 基础组件
const basicComponents: ComponentDefinition[] = [
  {
    name: '文本',
    type: 'text',
    icon: FontSizeOutlined,
    defaultProps: {
      content: '点击编辑文本内容',
      style: {
        fontSize: 16,
        color: '#333333',
        textAlign: 'left',
        padding: 10,
        marginTop: 10,
        marginBottom: 10
      }
    }
  },
  {
    name: '图片',
    type: 'image',
    icon: PictureOutlined,
    defaultProps: {
      src: 'https://via.placeholder.com/350x150',
      alt: '图片描述',
      style: {
        width: '100%',
        borderRadius: 0,
        marginTop: 10,
        marginBottom: 10
      }
    }
  },
  {
    name: '按钮',
    type: 'button',
    icon: BorderOutlined,
    defaultProps: {
      text: '按钮文本',
      type: 'primary',
      link: '',
      style: {
        width: '80%',
        marginTop: 10,
        marginBottom: 10
      }
    }
  },
  {
    name: '轮播图',
    type: 'carousel',
    icon: PlayCircleOutlined,
    defaultProps: {
      autoplay: true,
      interval: 3000,
      images: [],
      style: {
        marginTop: 10,
        marginBottom: 10
      }
    }
  }
];

// 营销组件
const marketingComponents: ComponentDefinition[] = [
  {
    name: '商品列表',
    type: 'productList',
    icon: AppstoreOutlined,
    defaultProps: {
      productIds: [],
      columns: 2,
      showPrice: true,
      style: {
        marginTop: 10,
        marginBottom: 10
      }
    }
  },
  {
    name: '倒计时',
    type: 'countdown',
    icon: ClockCircleOutlined,
    defaultProps: {
      title: '距离活动结束',
      endTime: new Date(Date.now() + 86400000 * 3).toISOString(), // 3天后
      showDays: true,
      showHours: true,
      showMinutes: true,
      showSeconds: true,
      style: {
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center'
      }
    }
  },
  {
    name: '优惠券',
    type: 'coupon',
    icon: TagOutlined,
    defaultProps: {
      title: '优惠券领取',
      coupons: [
        { id: '1', name: '满100减10', discount: 10, condition: '满100元可用' },
        { id: '2', name: '满200减30', discount: 30, condition: '满200元可用' }
      ],
      style: {
        marginTop: 10,
        marginBottom: 10
      }
    }
  },
  {
    name: '抽奖转盘',
    type: 'luckyWheel',
    icon: GiftOutlined,
    defaultProps: {
      title: '幸运大转盘',
      description: '赢取幸运大奖',
      buttonText: '开始抽奖',
      rotationTime: 5000,
      prizes: [
        { id: '1', name: '1元', probability: 0.1, bgColor: '#FFEECC', fontColor: '#FF5C5C' },
        { id: '2', name: '谢谢参与', probability: 0.4, bgColor: '#FFF4D6', fontColor: '#FF5C5C' },
        { id: '3', name: '5元', probability: 0.05, bgColor: '#FFEECC', fontColor: '#FF5C5C' },
        { id: '4', name: '谢谢参与', probability: 0.4, bgColor: '#FFF4D6', fontColor: '#FF5C5C' },
        { id: '5', name: '10元', probability: 0.03, bgColor: '#FFEECC', fontColor: '#FF5C5C' },
        { id: '6', name: '再来一次', probability: 0.02, bgColor: '#FFF4D6', fontColor: '#FF5C5C' }
      ],
      style: {
        marginTop: 10,
        marginBottom: 10,
        padding: 15,
        backgroundColor: '#FFFFFF'
      }
    }
  },
  {
    name: '签到日历',
    type: 'checkinCalendar',
    icon: CalendarOutlined,
    defaultProps: {
      title: '每日签到',
      subtitle: '连续签到得好礼',
      buttonText: '立即签到',
      rewards: [
        { day: 7, name: '7天礼包' },
        { day: 15, name: '15天礼包' },
        { day: 30, name: '30天礼包' }
      ],
      style: {
        marginTop: 10,
        marginBottom: 10,
        padding: 15,
        backgroundColor: '#e6f7ff'
      }
    }
  },
  {
    name: '会员福利',
    type: 'memberBenefits',
    icon: CrownOutlined,
    defaultProps: {
      title: '会员专享特权',
      description: '开通会员享受多重福利',
      price: 39,
      period: '月',
      buttonText: '立即开通',
      benefits: [
        { name: '商品折扣', description: '专享商品9折' },
        { name: '包邮特权', description: '全场包邮' },
        { name: '专属客服', description: 'VIP客服通道' },
        { name: '生日礼包', description: '生日当月送礼包' }
      ],
      style: {
        marginTop: 10,
        marginBottom: 10,
        padding: 15,
        backgroundColor: '#fcf2ff'
      }
    }
  },
  {
    name: '问卷调查',
    type: 'surveyForm',
    icon: FormOutlined,
    defaultProps: {
      title: '用户调查问卷',
      description: '完成问卷获得优惠券',
      buttonText: '提交问卷',
      rewardText: '提交后获得10元优惠券',
      questions: [
        { 
          title: '您的性别是？', 
          type: 'radio', 
          options: ['男', '女'] 
        },
        { 
          title: '您了解我们产品的渠道是？', 
          type: 'checkbox', 
          options: ['朋友推荐', '广告', '搜索引擎', '社交媒体'] 
        },
        { 
          title: '您对我们的产品有什么建议？', 
          type: 'text'
        }
      ],
      style: {
        marginTop: 10,
        marginBottom: 10,
        padding: 15,
        backgroundColor: '#ffffff'
      }
    }
  },
  {
    name: '拼团购买',
    type: 'teamBuying',
    icon: TeamOutlined,
    defaultProps: {
      title: '邀请好友拼团',
      description: '人数凑齐享超低价',
      teamSize: 3,
      duration: 24, // 小时
      buttonText: '发起拼团',
      product: {
        name: '限量版商品',
        originalPrice: 199,
        teamPrice: 99,
        image: 'https://via.placeholder.com/300x200'
      },
      style: {
        marginTop: 10,
        marginBottom: 10,
        padding: 15,
        backgroundColor: '#fff2f0'
      }
    }
  }
];

// 高级组件
const advancedComponents: ComponentDefinition[] = [
  // 可以添加更高级的组件，如自定义表单、视频播放器、3D展示等
];

// 获取所有组件
export const getAllComponents = (): ComponentDefinition[] => {
  return [...basicComponents, ...marketingComponents, ...advancedComponents];
};

// 按分类获取组件
export const getComponentsByCategory = (category: string): ComponentDefinition[] => {
  switch (category) {
    case 'basic':
      return basicComponents;
    case 'marketing':
      return marketingComponents;
    case 'advanced':
      return advancedComponents;
    default:
      return [];
  }
};

export { basicComponents, marketingComponents, advancedComponents }; 