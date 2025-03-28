import React from 'react';
import { Button, Avatar, Image, Tag } from 'antd-mobile';
import { ComponentType } from '../../components/types';
import { ClockCircleOutline, FireFill, TeamOutline, RightOutline } from 'antd-mobile-icons';

// 扩展拼团组件属性接口来解决类型问题
interface TeamBuyingProductType {
  name: string;
  teamPrice: number;
  originalPrice: number;
  image?: string;
  tag?: string;
}

// 定义额外的拼团属性
interface TeamBuyingProps {
  teamSize?: number;
  buttonText?: string;
  title?: string;
  description?: string;
  endTime?: string;
  product?: TeamBuyingProductType;
  showProgress?: boolean;
  showTimer?: boolean;
  currentTeamCount?: number;
  productSold?: number;
  style?: any;
}

export function TeamBuyingComponent({ component }: { component: ComponentType }) {
  // 使用类型断言解决类型问题
  const props = component.props as unknown as TeamBuyingProps;
  
  const {
    title,
    description,
    product,
    teamSize,
    buttonText,
    endTime,
    style
  } = props;

  // 获取组件属性，设置默认值避免类型错误
  const showProgress = props.showProgress === undefined ? true : props.showProgress;
  const showTimer = props.showTimer === undefined ? true : props.showTimer;
  const currentTeamCount = props.currentTeamCount || 1;
  
  // 计算团购进度
  const teamProgress = Math.min(100, Math.round((currentTeamCount) / (teamSize || 3) * 100));
  
  // 格式化剩余时间 (示例值)
  const timeLeft = showTimer ? (endTime || "23:59:59") : null;

  // 增强商品数据结构，提供默认值
  const productData = {
    name: product?.name || "精选拼团商品",
    teamPrice: product?.teamPrice || 99,
    originalPrice: product?.originalPrice || 199,
    discount: Math.round((1 - (product?.teamPrice || 99) / (product?.originalPrice || 199)) * 100),
    image: product?.image || "https://gw.alicdn.com/bao/uploaded/i1/2201504893638/O1CN01XOJ8Xs1Dev5RfQZ8L_!!0-item_pic.jpg_300x300q90.jpg",
    sold: props.productSold || 1023,
    tag: product?.tag || "爆款"
  };

  return (
    <div style={{ ...style }} className="bg-white rounded-lg overflow-hidden relative mb-3">
      {/* 淘宝风格团购标签 */}
      <div className="absolute top-0 left-0 z-10 bg-red-500 text-white text-xs py-1 px-2 rounded-br-lg">
        <TeamOutline className="mr-1" />拼团
      </div>
      
      {/* 活动头部 */}
      {title && (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg m-0">{title}</h3>
            {showTimer && (
              <div className="flex items-center bg-black bg-opacity-20 rounded px-2 py-1 text-xs">
                <ClockCircleOutline className="mr-1" />
                <span>剩余 {timeLeft}</span>
              </div>
            )}
          </div>
          {description && <p className="text-xs opacity-90 m-0 mt-1">{description}</p>}
        </div>
      )}

      {/* 商品信息 - 淘宝风格布局 */}
      <div className="flex p-3 border-b border-gray-100">
        <div className="relative mr-3 flex-shrink-0">
          <Image 
            src={productData.image}
            width={100}
            height={100}
            fit="cover"
            className="rounded-md"
          />
          {productData.tag && (
            <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1">
              {productData.tag}
            </div>
          )}
        </div>
        
        <div className="flex-1 flex flex-col justify-between">
          <div className="font-medium text-sm line-clamp-2">{productData.name}</div>
          
          <div className="mt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-gray-500">拼团价</span>
              <span className="text-red-500 text-xl font-bold">¥{productData.teamPrice}</span>
              <span className="text-gray-400 text-xs line-through">¥{productData.originalPrice}</span>
              <span className="bg-red-100 text-red-500 text-xs px-1 rounded-sm">{productData.discount}%</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">已售 {productData.sold}件</div>
          </div>
        </div>
      </div>

      {/* 拼团进度和信息 */}
      <div className="p-3">
        <div className="flex justify-between items-center text-sm mb-2">
          <div className="flex items-center text-red-500">
            <FireFill fontSize={16} className="mr-1" />
            <span>需{teamSize || 3}人成团，还差{Math.max(0, (teamSize || 3) - currentTeamCount)}人</span>
          </div>
          <div className="text-gray-500 text-xs flex items-center">
            查看详情
            <RightOutline fontSize={12} />
          </div>
        </div>

        {/* 自定义团购进度条 */}
        {showProgress && (
          <div className="mb-3">
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-red-500" 
                style={{ width: `${teamProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{currentTeamCount}人已参团</span>
              <span>目标{teamSize || 3}人</span>
            </div>
          </div>
        )}
      </div>

      {/* 参团人员头像 - 淘宝风格 */}
      <div className="px-3 pb-3">
        <div className="p-2 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 mb-2">参团用户</div>
          <div className="flex items-center">
            <div className="flex -space-x-2 mr-2">
              <Avatar 
                src="https://img.alicdn.com/bao/uploaded/i4/O1CN01T1JX4u1lhWBjKNsRz_!!0-item_pic.jpg_40x40q90.jpg" 
                style={{ '--size': '28px', '--border-radius': '50%' } as React.CSSProperties}
                className="border border-white bg-orange-100"
              />
              {Array.from({ length: Math.min((teamSize || 3) - 1, 2) }).map((_, index) => (
                <Avatar 
                  key={index}
                  src={index < (currentTeamCount - 1) 
                    ? `https://img.alicdn.com/bao/uploaded/i4/O1CN01CyO6ny1IOjF2PifuS_!!0-item_pic.jpg_40x40q90.jpg` 
                    : "https://img.alicdn.com/imgextra/i4/O1CN01V5FJly1rkIiVLOUQu_!!6000000005675-2-tps-80-80.png_40x40q90.jpg"
                  }
                  style={{ '--size': '28px', '--border-radius': '50%' } as React.CSSProperties}
                  className="border border-white"
                />
              ))}
              {(teamSize || 3) > 3 && (
                <div 
                  className="flex items-center justify-center bg-gray-200 border border-white rounded-full"
                  style={{ width: '28px', height: '28px' }}
                >
                  <span className="text-xs">+{(teamSize || 3) - 3}</span>
                </div>
              )}
            </div>
            <div className="flex-1 ml-1">
              <div className="text-xs text-gray-500">
                {currentTeamCount > 1 ? `${currentTeamCount-1}人正在拼团，` : ''}
                快来加入吧!
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 按钮 - 淘宝风格 */}
      <div className="p-3 pt-0">
        <Button 
          color="danger" 
          block 
          size="middle"
          className="font-bold"
          style={{ 
            '--border-radius': '20px',
            background: 'linear-gradient(to right, #ff5000, #ff1100)'
          } as React.CSSProperties}
        >
          {buttonText || `¥${productData.teamPrice} 一键开团`}
        </Button>
      </div>
    </div>
  );
}

// 组件右侧配置面板定义
export const TeamBuyingSchema = {
  title: '拼团活动',
  type: 'object',
  properties: {
    title: {
      title: '活动标题',
      type: 'string',
      default: '限时拼团 · 好友一起买更便宜'
    },
    description: {
      title: '活动描述',
      type: 'string',
      default: '邀请好友参与拼团，享超低价格'
    },
    product: {
      title: '商品信息',
      type: 'object',
      properties: {
        name: {
          title: '商品名称',
          type: 'string',
          default: '限量版高品质商品'
        },
        image: {
          title: '商品图片',
          type: 'string',
          format: 'image',
          default: 'https://gw.alicdn.com/bao/uploaded/i1/2201504893638/O1CN01XOJ8Xs1Dev5RfQZ8L_!!0-item_pic.jpg_300x300q90.jpg'
        },
        teamPrice: {
          title: '拼团价格',
          type: 'number',
          default: 99
        },
        originalPrice: {
          title: '原价',
          type: 'number',
          default: 199
        },
        tag: {
          title: '商品标签',
          type: 'string',
          default: '爆款'
        }
      }
    },
    teamSize: {
      title: '成团人数',
      type: 'number',
      default: 3
    },
    currentTeamCount: {
      title: '当前参团人数',
      type: 'number',
      default: 1
    },
    productSold: {
      title: '已售数量',
      type: 'number',
      default: 1023
    },
    showProgress: {
      title: '显示进度条',
      type: 'boolean',
      default: true
    },
    showTimer: {
      title: '显示倒计时',
      type: 'boolean',
      default: true
    },
    endTime: {
      title: '结束时间',
      type: 'string',
      default: '23:59:59'
    },
    buttonText: {
      title: '按钮文字',
      type: 'string',
      default: '¥99 一键开团'
    },
    style: {
      title: '样式',
      type: 'object',
      properties: {
        backgroundColor: {
          title: '背景颜色',
          type: 'string',
          format: 'color',
          default: '#ffffff'
        },
        borderRadius: {
          title: '圆角',
          type: 'string',
          default: '8px'
        }
      }
    }
  }
};

// 默认属性
export const TeamBuyingDefaultProps = {
  title: '限时拼团 · 好友一起买更便宜',
  description: '邀请好友参与拼团，享超低价格',
  product: {
    name: '限量版高品质商品',
    image: 'https://gw.alicdn.com/bao/uploaded/i1/2201504893638/O1CN01XOJ8Xs1Dev5RfQZ8L_!!0-item_pic.jpg_300x300q90.jpg',
    teamPrice: 99,
    originalPrice: 199,
    tag: '爆款'
  },
  teamSize: 3,
  currentTeamCount: 1,
  productSold: 1023,
  showProgress: true,
  showTimer: true,
  endTime: '23:59:59',
  buttonText: '¥99 一键开团',
  style: {
    backgroundColor: '#ffffff',
    borderRadius: '8px'
  }
}; 