import React, { useEffect, useState } from 'react';
import { Button } from 'antd-mobile';
import { ComponentType } from '../../components/types';

// 商品图片占位符样式
const ProductPlaceholder = ({ style }: { style: any }) => (
  <div className={`${style.placeholderBg} rounded-md flex-shrink-0 relative overflow-hidden flex items-center justify-center h-full w-full shadow-inner`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
    <div className={`text-4xl ${style.placeholderIcon} opacity-20`}>🛍️</div>
  </div>
);

// 倒计时逻辑
function useCountdown(hours: string, minutes: string, seconds: string) {
  const [remainingTime, setRemainingTime] = useState({
    hours: parseInt(hours || '1', 10),
    minutes: parseInt(minutes || '0', 10),
    seconds: parseInt(seconds || '0', 10)
  });

  useEffect(() => {
    // 更新初始时间
    setRemainingTime({
      hours: parseInt(hours || '1', 10),
      minutes: parseInt(minutes || '0', 10),
      seconds: parseInt(seconds || '0', 10)
    });
  }, [hours, minutes, seconds]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime(prev => {
        let newSeconds = prev.seconds - 1;
        let newMinutes = prev.minutes;
        let newHours = prev.hours;

        if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes -= 1;
        }

        if (newMinutes < 0) {
          newMinutes = 59;
          newHours -= 1;
        }

        if (newHours < 0) {
          clearInterval(interval);
          return { hours: 0, minutes: 0, seconds: 0 };
        }

        return { hours: newHours, minutes: newMinutes, seconds: newSeconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return remainingTime;
}

// 格式化数字为两位数
function formatTime(num: number): string {
  return num.toString().padStart(2, '0');
}

// 不同商城的样式配置
const STYLES = {
  taobao: {
    gradientFrom: 'from-orange-50',
    gradientTo: 'to-orange-100',
    primaryColor: 'text-orange-500',
    primaryBg: 'bg-orange-100',
    buttonColor: 'orange',
    timerBg: 'bg-orange-500',
    placeholderBg: 'bg-orange-100',
    placeholderIcon: 'text-orange-500',
    priceColor: 'text-orange-600',
    badge: 'bg-orange-500 text-white',
    header: 'bg-gradient-to-r from-orange-500 to-orange-400'
  },
  jd: {
    gradientFrom: 'from-red-50',
    gradientTo: 'to-red-100',
    primaryColor: 'text-red-500',
    primaryBg: 'bg-red-100',
    buttonColor: 'danger',
    timerBg: 'bg-red-500',
    placeholderBg: 'bg-red-100',
    placeholderIcon: 'text-red-500',
    priceColor: 'text-red-600',
    badge: 'bg-red-500 text-white',
    header: 'bg-gradient-to-r from-red-500 to-red-400'
  },
  pdd: {
    gradientFrom: 'from-pink-50',
    gradientTo: 'to-pink-100',
    primaryColor: 'text-pink-500',
    primaryBg: 'bg-pink-100',
    buttonColor: 'default',
    timerBg: 'bg-pink-500',
    placeholderBg: 'bg-pink-100',
    placeholderIcon: 'text-pink-500',
    priceColor: 'text-pink-600',
    badge: 'bg-pink-500 text-white',
    header: 'bg-gradient-to-r from-pink-500 to-pink-400'
  }

};

export function SeckillComponent({ component }: { component: ComponentType }) {
  const {
    title = '限时秒杀',
    description = '限时特惠商品',
    originalPrice = '99',
    salePrice = '9.9',
    buttonText = '立即抢购',
    hours = '01',
    minutes = '45',
    seconds = '37',
    uiStyle = 'jd',
    layoutType = 'horizontal',
    showDiscountPercent = true,
    showSavedAmount = true,
    buttonSize = 'mini',
    customButtonColor = false,
    buttonColorHex = '#ff4d4f',
    showBadges = true,
    badgeText = '秒杀',
    showStockInfo = false,
    stockInfo = '100',
    soldCount = '45'
  } = component.props;

  const style = STYLES[uiStyle as keyof typeof STYLES] || STYLES.jd;
  const countdown = useCountdown(hours, minutes, seconds);
  
  // 计算折扣率和优惠金额
  const originalPriceNum = parseFloat(originalPrice || '0');
  const salePriceNum = parseFloat(salePrice || '0');
  const discountPercent = originalPriceNum > 0 ? Math.round((salePriceNum / originalPriceNum) * 100) : 0;
  const savedAmount = Math.max(0, originalPriceNum - salePriceNum).toFixed(2);
  
  // 获取按钮大小
  const getButtonSize = () => {
    switch(buttonSize) {
      case 'normal': return '';
      case 'small': return 'small';
      default: return 'mini';
    }
  };
  
  // 获取按钮颜色
  const getButtonColor = () => {
    if (customButtonColor) {
      return {
        '--background-color': buttonColorHex,
        '--text-color': '#ffffff'
      } as any;
    }
    return undefined;
  };
  
  // 渲染库存信息
  const renderStockInfo = () => {
    if (!showStockInfo) return null;
    
    const stockNum = parseInt(stockInfo || '0', 10);
    const soldNum = parseInt(soldCount || '0', 10);
    const remainingPercent = stockNum > 0 ? Math.min(100, Math.max(0, Math.round((soldNum / stockNum) * 100))) : 0;
    
    return (
      <div className="text-xs bg-gray-50 text-gray-500 px-1 py-0.5 rounded-full">
        已抢{remainingPercent}% | 剩余{stockNum - soldNum}件
      </div>
    );
  };
  
  // 水平布局 - 京东风格
  const JDHorizontalLayout = () => (
    <div style={{ ...component.props.style, maxWidth: "100%", overflowX: "hidden" }} className={`p-3 bg-gradient-to-r ${style.gradientFrom} ${style.gradientTo} rounded-lg shadow-sm`}>
      <div className={`-mx-3 -mt-3 py-2 px-3 ${style.header} text-white text-center font-bold text-lg rounded-t-lg shadow-sm mb-3`}>{title}</div>
      <div className="bg-white rounded-lg p-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-20 h-20 relative shadow-sm rounded-md overflow-hidden flex-shrink-0">
            <ProductPlaceholder style={style} />
            {showBadges && (
              <div className="absolute top-0 left-0 bg-red-500 text-white px-1 py-0.5 text-xs font-bold">{badgeText}</div>
            )}
          </div>
          <div className="flex-grow">
            <div className="font-medium mb-1">{description}</div>
            <div className="flex items-end gap-2">
              <div className={`${style.priceColor} text-lg font-bold`}>¥ {salePrice}</div>
              <div className="text-gray-400 line-through text-xs">¥ {originalPrice}</div>
              {showDiscountPercent && discountPercent > 0 && discountPercent < 100 && (
                <div className={`${style.primaryBg} ${style.primaryColor} text-xs px-1 rounded`}>{discountPercent}折</div>
              )}
            </div>
            {showSavedAmount && (
              <div className="text-xs text-gray-500 mt-1">立省¥{savedAmount}</div>
            )}
            <div className="flex justify-between items-center mt-2">
              <div className="text-xs text-gray-500">
                <span className={`${style.primaryBg} ${style.primaryColor} px-1 py-0.5 rounded`}>剩余</span>
                <span className={`mx-1 px-1 py-0.5 ${style.timerBg} text-white rounded`}>{formatTime(countdown.hours)}</span>:
                <span className={`mx-1 px-1 py-0.5 ${style.timerBg} text-white rounded`}>{formatTime(countdown.minutes)}</span>:
                <span className={`mx-1 px-1 py-0.5 ${style.timerBg} text-white rounded`}>{formatTime(countdown.seconds)}</span>
              </div>
              <Button size={getButtonSize() as any} color={customButtonColor ? undefined : style.buttonColor as any} style={getButtonColor()}>{buttonText}</Button>
            </div>
            {renderStockInfo()}
          </div>
        </div>
      </div>
    </div>
  );
  
  // 垂直布局 - 京东风格
  const JDVerticalLayout = () => (
    <div style={{ ...component.props.style, maxWidth: "100%", overflowX: "hidden" }} className={`p-3 bg-gradient-to-r ${style.gradientFrom} ${style.gradientTo} rounded-lg shadow-sm`}>
      <div className={`-mx-3 -mt-3 py-2 px-3 ${style.header} text-white text-center font-bold text-lg rounded-t-lg shadow-sm mb-3`}>{title}</div>
      <div className="bg-white rounded-lg p-3 shadow-sm">
        <div className="flex flex-col items-center">
          <div className="w-full h-32 mb-3 relative shadow-sm rounded-md overflow-hidden">
            <ProductPlaceholder style={style} />
            {showBadges && (
              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">{badgeText}</div>
            )}
          </div>
          <div className="w-full">
            <div className="font-medium mb-1 text-center">{description}</div>
            <div className="flex justify-center items-end gap-2 mb-1">
              <div className={`${style.priceColor} text-lg font-bold`}>¥ {salePrice}</div>
              <div className="text-gray-400 line-through text-xs">¥ {originalPrice}</div>
              {showDiscountPercent && discountPercent > 0 && discountPercent < 100 && (
                <div className={`${style.primaryBg} ${style.primaryColor} text-xs px-1 rounded`}>{discountPercent}折</div>
              )}
            </div>
            {showSavedAmount && (
              <div className="text-xs text-gray-500 text-center mt-1 mb-2">立省¥{savedAmount}</div>
            )}
            <div className="flex justify-center mb-3">
              <div className="text-xs text-gray-500">
                <span className={`${style.primaryBg} ${style.primaryColor} px-1 py-0.5 rounded`}>剩余</span>
                <span className={`mx-1 px-1 py-0.5 ${style.timerBg} text-white rounded`}>{formatTime(countdown.hours)}</span>:
                <span className={`mx-1 px-1 py-0.5 ${style.timerBg} text-white rounded`}>{formatTime(countdown.minutes)}</span>:
                <span className={`mx-1 px-1 py-0.5 ${style.timerBg} text-white rounded`}>{formatTime(countdown.seconds)}</span>
              </div>
            </div>
            {renderStockInfo() && (
              <div className="flex justify-center mb-2">
                {renderStockInfo()}
              </div>
            )}
            <Button block color={customButtonColor ? undefined : style.buttonColor as any} size={getButtonSize() as any} style={getButtonColor()}>{buttonText}</Button>
          </div>
        </div>
      </div>
    </div>
  );
  
  // 水平布局 - 淘宝风格
  const TaobaoHorizontalLayout = () => (
    <div style={{ ...component.props.style, maxWidth: "100%", overflowX: "hidden" }} className="p-3 bg-white rounded-lg border border-orange-200 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        {showBadges && (
          <div className={`px-2 py-1 ${style.badge} text-xs font-medium rounded-full`}>{badgeText}</div>
        )}
        <div className="text-xs text-orange-500 font-medium">更多秒杀 &gt;</div>
      </div>
      
      <div className={`text-lg font-bold text-center mb-3 text-orange-600`}>{title}</div>
      
      <div className="flex items-center gap-3">
        <div className="w-20 h-20 relative shadow-sm rounded-md overflow-hidden flex-shrink-0">
          <ProductPlaceholder style={style} />
          {showBadges && (
            <div className="absolute top-0 left-0 bg-orange-500 text-white px-1 py-0.5 text-xs font-bold">{badgeText}</div>
          )}
        </div>
        
        <div className="flex-grow">
          <div className="font-medium mb-2">{description}</div>
          
          <div className="flex items-baseline gap-2 mb-1">
            <div className="text-xl font-bold text-orange-600">¥{salePrice}</div>
            <div className="text-gray-400 line-through text-xs">¥{originalPrice}</div>
            {showSavedAmount && (
              <div className="bg-orange-100 text-orange-500 text-xs px-1 rounded">省¥{savedAmount}</div>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="text-xs text-orange-500 font-bold mr-1">倒计时:</div>
              <div className="flex items-center text-xs">
                <span className="bg-black text-white px-1 py-0.5 rounded-sm">{formatTime(countdown.hours)}</span>
                <span className="mx-px text-gray-500">:</span>
                <span className="bg-black text-white px-1 py-0.5 rounded-sm">{formatTime(countdown.minutes)}</span>
                <span className="mx-px text-gray-500">:</span>
                <span className="bg-black text-white px-1 py-0.5 rounded-sm">{formatTime(countdown.seconds)}</span>
              </div>
            </div>
            <Button size={getButtonSize() as any} color={customButtonColor ? undefined : "warning"} style={getButtonColor()}>{buttonText}</Button>
          </div>
          {renderStockInfo()}
        </div>
      </div>
    </div>
  );
  
  // 垂直布局 - 淘宝风格
  const TaobaoVerticalLayout = () => (
    <div style={{ ...component.props.style, maxWidth: "100%", overflowX: "hidden" }} className="p-3 bg-white rounded-lg border border-orange-200 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        {showBadges && (
          <div className={`px-2 py-1 ${style.badge} text-xs font-medium rounded-full`}>{badgeText}</div>
        )}
        <div className="flex items-center text-xs">
          <span className="text-orange-500 font-medium mr-1">距结束</span>
          <span className="bg-black text-white px-1 py-0.5 rounded-sm">{formatTime(countdown.hours)}</span>
          <span className="mx-px text-gray-500">:</span>
          <span className="bg-black text-white px-1 py-0.5 rounded-sm">{formatTime(countdown.minutes)}</span>
          <span className="mx-px text-gray-500">:</span>
          <span className="bg-black text-white px-1 py-0.5 rounded-sm">{formatTime(countdown.seconds)}</span>
        </div>
      </div>
      
      <div className="w-full h-40 relative mb-3 shadow-sm rounded-md overflow-hidden">
        <ProductPlaceholder style={style} />
        {showBadges && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 text-xs font-bold rounded">{badgeText}</div>
        )}
      </div>
      
      <div className="text-center mb-3">{description}</div>
      
      <div className="flex justify-center items-baseline gap-2 mb-1">
        <div className="text-xl font-bold text-orange-600">¥{salePrice}</div>
        <div className="text-gray-400 line-through text-xs">¥{originalPrice}</div>
        {showDiscountPercent && discountPercent > 0 && discountPercent < 100 && (
          <div className="bg-orange-100 text-orange-500 text-xs px-1 rounded">{discountPercent}折</div>
        )}
      </div>
      
      {showSavedAmount && (
        <div className="text-xs text-orange-500 text-center mb-2">立省¥{savedAmount}</div>
      )}
      
      {renderStockInfo() && (
        <div className="flex justify-center mb-2">
          {renderStockInfo()}
        </div>
      )}
      
      <Button block color={customButtonColor ? undefined : "warning"} size={getButtonSize() as any} style={getButtonColor()}>{buttonText}</Button>
    </div>
  );
  
  // 水平布局 - 拼多多风格
  const PddHorizontalLayout = () => (
    <div style={{ ...component.props.style, maxWidth: "100%", overflowX: "hidden" }} className="p-3 bg-white rounded-lg border border-pink-200 shadow-sm">
      <div className={`-mx-3 -mt-3 py-2 px-3 bg-gradient-to-r from-pink-400 to-purple-500 text-white text-center font-bold text-lg rounded-t-lg shadow-sm mb-3`}>
        {title}
        <div className="text-xs font-normal mt-1">距离结束 {formatTime(countdown.hours)}:{formatTime(countdown.minutes)}:{formatTime(countdown.seconds)}</div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="w-20 h-20 relative border border-pink-100 rounded-md overflow-hidden shadow-sm">
          <ProductPlaceholder style={style} />
          {showBadges && (
            <div className="absolute top-0 right-0 bg-pink-500 text-white px-1 text-xs transform rotate-12 font-bold">{badgeText}</div>
          )}
        </div>
        
        <div className="flex-grow">
          <div className="font-medium mb-2 text-gray-800">{description}</div>
          
          <div className="flex items-center mb-1">
            <div className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full mr-1">拼购价</div>
            <div className="text-lg font-bold text-pink-600">¥{salePrice}</div>
            <div className="text-gray-400 line-through text-xs ml-2">¥{originalPrice}</div>
            {showDiscountPercent && discountPercent > 0 && discountPercent < 100 && (
              <div className="ml-1 bg-pink-100 text-pink-500 text-xs px-1 rounded">{discountPercent}折</div>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            {showStockInfo ? (
              <div className="text-xs bg-pink-50 text-pink-500 px-1 py-0.5 rounded-full whitespace-nowrap">
                已抢{Math.floor(parseInt(soldCount, 10) / parseInt(stockInfo, 10) * 100)}%
              </div>
            ) : (
              <div className="text-xs bg-pink-50 text-pink-500 px-1 py-0.5 rounded-full">
                已抢{Math.floor(Math.random() * 100)}%
              </div>
            )}
            <Button size={getButtonSize() as any} style={customButtonColor ? getButtonColor() : {
              '--background-color': '#e91e63',
              '--text-color': '#ffffff'
            } as any}>
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
  
  // 垂直布局 - 拼多多风格
  const PddVerticalLayout = () => (
    <div style={{ ...component.props.style, maxWidth: "100%", overflowX: "hidden" }} className="p-3 bg-gradient-to-b from-pink-50 to-purple-50 rounded-lg shadow-sm">
      <div className="bg-white rounded-lg p-3 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            {showBadges && (
              <div className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">{badgeText}</div>
            )}
            <div className="text-pink-600 text-xs font-medium">限时优惠</div>
          </div>
          <div className="text-xs text-gray-500">
            <span>{formatTime(countdown.hours)}</span>:
            <span>{formatTime(countdown.minutes)}</span>:
            <span>{formatTime(countdown.seconds)}</span>
          </div>
        </div>
        
        <div className="w-full h-36 relative mb-2 shadow-sm rounded-md overflow-hidden">
          <ProductPlaceholder style={style} />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
            <div className="text-white text-xs font-medium">{description}</div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-baseline gap-1">
            <div className="text-lg font-bold text-pink-600">¥{salePrice}</div>
            <div className="text-gray-400 line-through text-xs">¥{originalPrice}</div>
          </div>
          {showDiscountPercent && discountPercent > 0 && discountPercent < 100 && (
            <div className="bg-pink-100 text-pink-500 text-xs px-1 rounded">{discountPercent}折</div>
          )}
        </div>
        
        {showSavedAmount && (
          <div className="text-xs text-pink-500 mb-2">立省¥{savedAmount}</div>
        )}
        
        {renderStockInfo() && (
          <div className="mb-2">
            {renderStockInfo()}
          </div>
        )}
        
        <Button block size={getButtonSize() as any} style={customButtonColor ? getButtonColor() : {
          '--background-color': '#e91e63',
          '--text-color': '#ffffff'
        } as any}>
          {buttonText}
        </Button>
      </div>
    </div>
  );

  // 根据UI风格和布局类型渲染对应组件
  if (uiStyle === 'taobao') {
    return layoutType === 'horizontal' ? <TaobaoHorizontalLayout /> : <TaobaoVerticalLayout />;
  } else if (uiStyle === 'pdd') {
    return layoutType === 'horizontal' ? <PddHorizontalLayout /> : <PddVerticalLayout />;
  } else {
    return layoutType === 'horizontal' ? <JDHorizontalLayout /> : <JDVerticalLayout />;
  }
}

// 右侧属性面板配置
export const SeckillComponentPanel = {
  key: 'seckill',
  name: '秒杀组件',
  props: [
    {
      group: '基础设置',
      items: [
        {
          key: 'title',
          name: '标题',
          type: 'string',
          default: '限时秒杀'
        },
        {
          key: 'description',
          name: '商品描述',
          type: 'string',
          default: '限时特惠商品'
        },
        {
          key: 'uiStyle',
          name: 'UI风格',
          type: 'select',
          options: [
            { label: '京东风格', value: 'jd' },
            { label: '淘宝风格', value: 'taobao' },
            { label: '拼多多风格', value: 'pdd' }
          ],
          default: 'jd'
        },
        {
          key: 'layoutType',
          name: '布局方式',
          type: 'select',
          options: [
            { label: '水平布局', value: 'horizontal' },
            { label: '垂直布局', value: 'vertical' }
          ],
          default: 'horizontal'
        }
      ]
    },
    {
      group: '商品价格',
      items: [
        {
          key: 'salePrice',
          name: '促销价',
          type: 'string',
          default: '9.9'
        },
        {
          key: 'originalPrice',
          name: '原价',
          type: 'string',
          default: '99'
        },
        {
          key: 'showDiscountPercent',
          name: '显示折扣率',
          type: 'boolean',
          default: true
        },
        {
          key: 'showSavedAmount',
          name: '显示优惠金额',
          type: 'boolean',
          default: true
        }
      ]
    },
    {
      group: '倒计时设置',
      items: [
        {
          key: 'hours',
          name: '剩余小时',
          type: 'string',
          default: '01'
        },
        {
          key: 'minutes',
          name: '剩余分钟',
          type: 'string',
          default: '45'
        },
        {
          key: 'seconds',
          name: '剩余秒数',
          type: 'string',
          default: '37'
        },
        {
          key: 'timerPresets',
          name: '快速设置',
          type: 'buttonGroup',
          options: [
            { label: '15分钟', value: { hours: '00', minutes: '15', seconds: '00' } },
            { label: '30分钟', value: { hours: '00', minutes: '30', seconds: '00' } },
            { label: '1小时', value: { hours: '01', minutes: '00', seconds: '00' } },
            { label: '24小时', value: { hours: '24', minutes: '00', seconds: '00' } }
          ]
        }
      ]
    },
    {
      group: '按钮设置',
      items: [
        {
          key: 'buttonText',
          name: '按钮文字',
          type: 'string',
          default: '立即抢购'
        },
        {
          key: 'buttonSize',
          name: '按钮大小',
          type: 'select',
          options: [
            { label: '小', value: 'mini' },
            { label: '中', value: 'small' },
            { label: '大', value: 'normal' }
          ],
          default: 'mini'
        },
        {
          key: 'customButtonColor',
          name: '自定义按钮颜色',
          type: 'boolean',
          default: false
        },
        {
          key: 'buttonColorHex',
          name: '按钮颜色',
          type: 'color',
          default: '#ff4d4f',
          showWhen: { key: 'customButtonColor', value: true }
        }
      ]
    },
    {
      group: '高级设置',
      items: [
        {
          key: 'showBadges',
          name: '显示角标',
          type: 'boolean',
          default: true
        },
        {
          key: 'badgeText',
          name: '角标文本',
          type: 'string',
          default: '秒杀',
          showWhen: { key: 'showBadges', value: true }
        },
        {
          key: 'showStockInfo',
          name: '显示库存信息',
          type: 'boolean',
          default: false
        },
        {
          key: 'stockInfo',
          name: '库存量',
          type: 'string',
          default: '100',
          showWhen: { key: 'showStockInfo', value: true }
        },
        {
          key: 'soldCount',
          name: '已售量',
          type: 'string',
          default: '45',
          showWhen: { key: 'showStockInfo', value: true }
        },
        {
          key: 'style',
          name: '样式设置',
          type: 'style'
        }
      ]
    }
  ]
}; 