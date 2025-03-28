import React from 'react';
import { Button } from 'antd-mobile';
import { ComponentType } from '../../components/types';

export function CheckinCalendarComponent({ component }: { component: ComponentType }) {
  // Calculate days in current month
  const daysInMonth = component.props.daysInMonth || 30;
  
  // Get current day for highlight
  const currentDay = component.props.currentDay || new Date().getDate();
  
  // Get signed days (array of already signed in days)
  const signedDays = component.props.signedDays || Array.from({ length: currentDay - 1 }, (_, i) => i + 1);
  
  // Get rewards for specific days
  const rewards = component.props.rewards || [
    { day: 7, reward: '10积分' },
    { day: 15, reward: '20积分' },
    { day: 21, reward: '30积分' },
    { day: 30, reward: '50积分' }
  ];

  // Get weekdays labels
  const weekdays = component.props.weekdayLabels || ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  
  return (
    <div 
      style={{ 
        ...component.props.style,
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }} 
      className="checkin-calendar-component relative overflow-hidden"
    >
      {/* 背景装饰 */}
      <div className="absolute top-0 right-0 w-20 h-20 -rotate-45 translate-x-8 -translate-y-8" 
        style={{ 
          background: 'linear-gradient(135deg, rgba(255,109,0,0.1) 0%, rgba(255,175,0,0.1) 100%)',
          borderRadius: '50%',
          zIndex: 0
        }} 
      />
      
      {/* 顶部标题部分 */}
      <div 
        className="relative px-4 pt-4 pb-3 mb-2"
        style={{ 
          background: component.props.headerBackground || 'linear-gradient(135deg, #ff9500 0%, #ff6000 100%)',
          borderRadius: '12px 12px 0 0'
        }}
      >
        <h3 
          className="font-bold text-center text-lg mb-1" 
          style={{ color: component.props.headerTextColor || '#fff' }}
        >
          {component.props.title || '每日签到'}
        </h3>
        
        {component.props.subtitle && (
          <p className="text-center text-xs opacity-80 mb-0"
            style={{ color: component.props.headerTextColor || '#fff' }}
          >
            {component.props.subtitle}
          </p>
        )}
      </div>
      
      {/* 日历主体 */}
      <div className="px-4 py-2 relative z-10">
        {/* 周几标题行 */}
        <div className="grid grid-cols-7 gap-2 mb-3">
          {weekdays.map((day: string, i: number) => (
            <div key={`weekday-${i}`} className="text-center text-xs" style={{ color: '#999' }}>
              {day}
            </div>
          ))}
        </div>
        
        {/* 日期格子 */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: daysInMonth }).map((_, i: number) => {
            const day = i + 1;
            const isSigned = signedDays.includes(day);
            const hasReward = rewards.find((r: { day: number; reward: string }) => r.day === day);
            const isCurrentDay = day === currentDay;
            
            return (
              <div 
                key={`day-${i}`} 
                className={`flex flex-col items-center justify-center rounded-lg relative
                  ${isCurrentDay ? 'scale-110 z-10' : ''}
                `}
                style={{ 
                  height: '38px',
                  transition: 'all 0.2s ease',
                  border: isCurrentDay 
                    ? '2px solid #ff6000' 
                    : isSigned 
                      ? '1px solid #e6f7ff' 
                      : '1px solid #eee',
                  background: isSigned 
                    ? (component.props.signedBackground || 'linear-gradient(135deg, #e6f7ff 0%, #d9f1ff 100%)') 
                    : (hasReward ? 'rgba(255,109,0,0.05)' : '#fff')
                }}
              >
                {/* 日期数字 */}
                <div className={`text-sm font-medium ${hasReward ? 'mb-0' : 'my-1'}`} 
                  style={{ 
                    color: isSigned 
                      ? (component.props.signedColor || '#1890ff') 
                      : (hasReward ? '#ff6000' : '#333')
                  }}
                >
                  {day}
                </div>
                
                {/* 签到标记 */}
                {isSigned && component.props.showSignedIcon && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 flex items-center justify-center rounded-full" 
                    style={{ background: '#ff6000' }}
                  >
                    <span className="text-white text-[8px]">✓</span>
                  </div>
                )}
                
                {/* 奖励标记 */}
                {hasReward && (
                  <div className="text-[10px] leading-tight px-1 py-[1px] rounded-sm" 
                    style={{ 
                      color: '#ff6000', 
                      background: 'rgba(255,109,0,0.1)'
                    }}
                  >
                    {hasReward.reward}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* 奖励提示栏 */}
      {component.props.showRewardTips && (
        <div className="mt-2 mx-4 mb-2 p-2 rounded-lg bg-orange-50 text-xs text-center" 
          style={{ color: '#ff6000' }}
        >
          {component.props.rewardTips || '提示：连续签到可获得更多奖励'}
        </div>
      )}
      
      {/* 底部状态栏 */}
      <div className="flex justify-between items-center mt-2 px-4 py-3 bg-gray-50">
        <div className="text-xs text-gray-500">
          {component.props.streakText || `已连续签到 ${signedDays.length} 天`}
        </div>
        <Button 
          style={{
            background: signedDays.includes(currentDay) 
              ? '#ccc' 
              : (component.props.buttonBgColor || 'linear-gradient(135deg, #ff9500 0%, #ff6000 100%)'),
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '14px',
            padding: '0 18px',
            borderRadius: '18px',
            border: 'none',
            height: '36px',
            lineHeight: '36px'
          }}
          disabled={signedDays.includes(currentDay)}
        >
          {signedDays.includes(currentDay) 
            ? (component.props.signedButtonText || '今日已签到') 
            : (component.props.buttonText || '立即签到')}
        </Button>
      </div>
    </div>
  );
} 