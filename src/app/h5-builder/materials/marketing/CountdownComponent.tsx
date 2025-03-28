import React, { useEffect, useState } from 'react';
import { ComponentType } from '../../components/types';

// Helper function to calculate remaining time
function useRemainingTime(component: ComponentType) {
  const [remainingTime, setRemainingTime] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // 处理剩余时长模式
    if (component.props.timeMode === 'duration') {
      let days = component.props.remainingDays || 0;
      let hours = component.props.remainingHours || 0;
      let minutes = component.props.remainingMinutes || 0;
      let seconds = component.props.remainingSeconds || 0;
      
      // 根据显示设置调整时间单位
      if (!component.props.showDays) {
        hours += days * 24;
        days = 0;
      }
      
      if (!component.props.showHours) {
        minutes += hours * 60;
        hours = 0;
      }
      
      if (!component.props.showMinutes) {
        seconds += minutes * 60;
        minutes = 0;
      }
      
      // 直接使用调整后的时长
      setRemainingTime({ days, hours, minutes, seconds });
      return;
    }
    
    // 处理结束时间模式
    const endTimeStr = component.props.endTime;
    if (!endTimeStr) {
      // 如果没有设置结束时间，默认倒计时15分钟（用于预览）
      const defaultTime = new Date();
      defaultTime.setMinutes(defaultTime.getMinutes() + 15);
      const endTime = defaultTime.getTime();
      
      const updateTimer = () => {
        const now = new Date().getTime();
        const difference = Math.max(0, endTime - now);
        
        if (difference <= 0) {
          setRemainingTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          return;
        }
        
        // 计算原始时间值
        const totalSeconds = Math.floor(difference / 1000);
        let days = Math.floor(totalSeconds / (60 * 60 * 24));
        let hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
        let minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
        let seconds = Math.floor(totalSeconds % 60);
        
        // 根据显示设置调整数值
        if (!component.props.showDays) {
          hours += days * 24;
          days = 0;
        }
        
        if (!component.props.showHours) {
          minutes += hours * 60;
          hours = 0;
        }
        
        if (!component.props.showMinutes) {
          seconds += minutes * 60;
          minutes = 0;
        }
        
        setRemainingTime({ days, hours, minutes, seconds });
      };
      
      updateTimer();
      const timerId = setInterval(updateTimer, 1000);
      
      return () => clearInterval(timerId);
    }

    // 使用用户设置的结束时间
    const endTime = new Date(endTimeStr).getTime();
    
    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = Math.max(0, endTime - now);
      
      if (difference <= 0) {
        setRemainingTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      // 计算原始时间值
      const totalSeconds = Math.floor(difference / 1000);
      let days = Math.floor(totalSeconds / (60 * 60 * 24));
      let hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
      let minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
      let seconds = Math.floor(totalSeconds % 60);
      
      // 根据显示设置调整数值
      if (!component.props.showDays) {
        hours += days * 24;
        days = 0;
      }
      
      if (!component.props.showHours) {
        minutes += hours * 60;
        hours = 0;
      }
      
      if (!component.props.showMinutes) {
        seconds += minutes * 60;
        minutes = 0;
      }
      
      setRemainingTime({ days, hours, minutes, seconds });
    };
    
    // 立即执行一次更新
    updateTimer();
    const timerId = setInterval(updateTimer, 1000);
    
    return () => clearInterval(timerId);
  }, [component.props.endTime, component.props.timeMode, 
      component.props.remainingDays, component.props.remainingHours, 
      component.props.remainingMinutes, component.props.remainingSeconds,
      component.props.showDays, component.props.showHours, 
      component.props.showMinutes, component.props.showSeconds]);
  
  return remainingTime;
}

// Format number to always have two digits
function formatDigit(num: number): string {
  return num.toString().padStart(2, '0');
}

// Modern style (previously Basic style but enhanced)
function ModernStyle({ component, remainingTime }: { component: ComponentType, remainingTime: any }) {
  return (
    <div className="text-center">
      <h3 className="text-xl font-semibold text-gray-800 mb-3">{component.props.title || '限时活动'}</h3>
      <div className="flex justify-center gap-3 my-4">
        {component.props.showDays && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-lg shadow-md text-xl">
              {formatDigit(remainingTime.days)}
            </div>
            <div className="text-sm text-gray-600 mt-2 font-medium">天</div>
          </div>
        )}
        {component.props.showHours && (
          <>
            {component.props.showDays && (
              <div className="self-center text-rose-500 text-2xl font-light">:</div>
            )}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-lg shadow-md text-xl">
                {formatDigit(remainingTime.hours)}
              </div>
              <div className="text-sm text-gray-600 mt-2 font-medium">时</div>
            </div>
            {(component.props.showMinutes || component.props.showSeconds) && (
              <div className="self-center text-rose-500 text-2xl font-light">:</div>
            )}
          </>
        )}
        {component.props.showMinutes && (
          <>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-lg shadow-md text-xl">
                {formatDigit(remainingTime.minutes)}
              </div>
              <div className="text-sm text-gray-600 mt-2 font-medium">分</div>
            </div>
            {component.props.showSeconds && (
              <div className="self-center text-rose-500 text-2xl font-light">:</div>
            )}
          </>
        )}
        {component.props.showSeconds && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-lg shadow-md text-xl">
              {formatDigit(remainingTime.seconds)}
            </div>
            <div className="text-sm text-gray-600 mt-2 font-medium">秒</div>
          </div>
        )}
      </div>
      
      {component.props.description && (
        <div className="text-sm text-gray-600 mt-3 px-4 py-2 bg-rose-50 inline-block rounded-full font-medium">{component.props.description}</div>
      )}
    </div>
  );
}

// Enhanced Taobao-inspired style
function TaobaoStyle({ component, remainingTime }: { component: ComponentType, remainingTime: any }) {
  return (
    <div className="text-center">
      <div className="py-2 px-3 bg-gradient-to-r from-orange-600 to-red-500 text-white text-lg font-bold rounded-t-lg shadow-sm -mx-3 -mt-3">
        {component.props.title || '限时秒杀'}
      </div>
      
      <div className="my-4 flex justify-center items-center">
        <div className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full">
          距结束
        </div>
      </div>
      
      <div className="flex justify-center gap-2 my-3">
        {component.props.showDays && (
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-black text-white font-bold rounded-sm text-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/10"></div>
              {formatDigit(remainingTime.days)}
            </div>
            <div className="text-sm text-gray-700 mx-1 font-medium">天</div>
          </div>
        )}
        {component.props.showHours && (
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-black text-white font-bold rounded-sm text-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/10"></div>
              {formatDigit(remainingTime.hours)}
            </div>
            <div className="text-sm text-gray-700 mx-1 font-medium">时</div>
          </div>
        )}
        {component.props.showMinutes && (
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-black text-white font-bold rounded-sm text-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/10"></div>
              {formatDigit(remainingTime.minutes)}
            </div>
            <div className="text-sm text-gray-700 mx-1 font-medium">分</div>
          </div>
        )}
        {component.props.showSeconds && (
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-black text-white font-bold rounded-sm text-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/10"></div>
              {formatDigit(remainingTime.seconds)}
            </div>
            <div className="text-sm text-gray-700 mx-1 font-medium">秒</div>
          </div>
        )}
      </div>
      
      {component.props.description && (
        <div className="text-sm text-orange-600 mt-3 font-bold px-6 py-2 border-t border-orange-200 pt-3">{component.props.description}</div>
      )}
    </div>
  );
}

// Enhanced Pinduoduo-inspired style
function PinduoduoStyle({ component, remainingTime }: { component: ComponentType, remainingTime: any }) {
  return (
    <div className="text-center relative">
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
        <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
          {component.props.title || '限时拼团'}
        </span>
      </div>
      
      <div className="pt-6 pb-2">
        <div className="flex justify-center items-center gap-2 my-2">
          <div className="bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
            <span className="text-sm text-red-600 font-medium">距结束仅剩</span>
          </div>
        </div>
        
        <div className="flex justify-center items-center mt-3 mx-auto">
          {component.props.showDays && (
            <>
              <div className="flex flex-col items-center bg-gradient-to-b from-red-50 to-white p-1 rounded-md shadow-sm border border-red-100">
                <span className="inline-block w-8 h-9 flex items-center justify-center bg-red-600 text-white text-sm font-bold rounded-sm">
                  {formatDigit(remainingTime.days)}
                </span>
                <span className="text-xs text-red-500 mt-1">天</span>
              </div>
              <span className="text-red-300 mx-1">:</span>
            </>
          )}
          {component.props.showHours && (
            <>
              <div className="flex flex-col items-center bg-gradient-to-b from-red-50 to-white p-1 rounded-md shadow-sm border border-red-100">
                <span className="inline-block w-8 h-9 flex items-center justify-center bg-red-600 text-white text-sm font-bold rounded-sm">
                  {formatDigit(remainingTime.hours)}
                </span>
                <span className="text-xs text-red-500 mt-1">时</span>
              </div>
              <span className="text-red-300 mx-1">:</span>
            </>
          )}
          {component.props.showMinutes && (
            <>
              <div className="flex flex-col items-center bg-gradient-to-b from-red-50 to-white p-1 rounded-md shadow-sm border border-red-100">
                <span className="inline-block w-8 h-9 flex items-center justify-center bg-red-600 text-white text-sm font-bold rounded-sm">
                  {formatDigit(remainingTime.minutes)}
                </span>
                <span className="text-xs text-red-500 mt-1">分</span>
              </div>
              <span className="text-red-300 mx-1">:</span>
            </>
          )}
          {component.props.showSeconds && (
            <div className="flex flex-col items-center bg-gradient-to-b from-red-50 to-white p-1 rounded-md shadow-sm border border-red-100">
              <span className="inline-block w-8 h-9 flex items-center justify-center bg-red-600 text-white text-sm font-bold rounded-sm">
                {formatDigit(remainingTime.seconds)}
              </span>
              <span className="text-xs text-red-500 mt-1">秒</span>
            </div>
          )}
        </div>
      </div>
      
      {component.props.description && (
        <div className="text-sm text-red-500 mt-3 font-medium px-4 py-2 bg-red-50 rounded-b-lg border-t border-red-100">
          {component.props.description}
        </div>
      )}
    </div>
  );
}

// Elegant dark mode style
function ElegantStyle({ component, remainingTime }: { component: ComponentType, remainingTime: any }) {
  return (
    <div className="text-center bg-gradient-to-b from-gray-800 to-gray-900 -m-3 p-4 rounded-lg">
      <h3 className="text-xl font-bold text-white mb-3">{component.props.title || '限时优惠'}</h3>
      
      <div className="flex justify-center gap-4 my-4">
        {component.props.showDays && (
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 flex items-center justify-center bg-transparent border-2 border-indigo-400 text-white font-medium rounded-lg text-xl relative">
              <div className="absolute inset-1 bg-black/30 rounded-md"></div>
              <span className="relative z-10">{formatDigit(remainingTime.days)}</span>
            </div>
            <div className="text-xs text-indigo-300 mt-2">天</div>
          </div>
        )}
        {component.props.showHours && (
          <>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 flex items-center justify-center bg-transparent border-2 border-indigo-400 text-white font-medium rounded-lg text-xl relative">
                <div className="absolute inset-1 bg-black/30 rounded-md"></div>
                <span className="relative z-10">{formatDigit(remainingTime.hours)}</span>
              </div>
              <div className="text-xs text-indigo-300 mt-2">时</div>
            </div>
          </>
        )}
        {component.props.showMinutes && (
          <>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 flex items-center justify-center bg-transparent border-2 border-indigo-400 text-white font-medium rounded-lg text-xl relative">
                <div className="absolute inset-1 bg-black/30 rounded-md"></div>
                <span className="relative z-10">{formatDigit(remainingTime.minutes)}</span>
              </div>
              <div className="text-xs text-indigo-300 mt-2">分</div>
            </div>
          </>
        )}
        {component.props.showSeconds && (
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 flex items-center justify-center bg-transparent border-2 border-indigo-400 text-white font-medium rounded-lg text-xl relative">
              <div className="absolute inset-1 bg-black/30 rounded-md"></div>
              <span className="relative z-10">{formatDigit(remainingTime.seconds)}</span>
            </div>
            <div className="text-xs text-indigo-300 mt-2">秒</div>
          </div>
        )}
      </div>
      
      {component.props.description && (
        <div className="text-sm text-indigo-200 mt-3 px-4 py-2 bg-indigo-900/50 inline-block rounded-md">
          {component.props.description}
        </div>
      )}
    </div>
  );
}

export function CountdownComponent({ component }: { component: ComponentType }) {
  const remainingTime = useRemainingTime(component);
  const styleType = component.props.styleType || 'modern';
  const isTimeUp = remainingTime.days === 0 && remainingTime.hours === 0 && 
                  remainingTime.minutes === 0 && remainingTime.seconds === 0;
  
  const getBgClass = () => {
    switch(styleType) {
      case 'taobao':
        return 'bg-gradient-to-r from-orange-50 to-white';
      case 'pinduoduo':
        return 'bg-white border border-red-200 rounded-lg shadow-sm';
      case 'elegant':
        return 'bg-transparent';
      default:
        return 'bg-gradient-to-r from-rose-50 to-pink-50 shadow-sm';
    }
  };
  
  // 时间结束后的展示内容（仅在endTime模式下才显示结束状态）
  if (isTimeUp && component.props.endTime && component.props.timeMode !== 'duration') {
    return (
      <div style={{ ...component.props.style }} className={`p-3 rounded-lg ${getBgClass()}`}>
        <div className="text-center py-4">
          <h3 className={`text-xl font-bold ${styleType === 'elegant' ? 'text-white' : 'text-gray-700'} mb-2`}>
            {component.props.title || '活动已结束'}
          </h3>
          <div className={`text-sm ${styleType === 'elegant' ? 'text-indigo-200' : 'text-gray-500'} mt-2`}>
            {component.props.timeUpText || '活动已结束，请关注下一场活动'}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div style={{ ...component.props.style }} className={`p-3 rounded-lg ${getBgClass()}`}>
      {styleType === 'taobao' && (
        <TaobaoStyle component={component} remainingTime={remainingTime} />
      )}
      {styleType === 'pinduoduo' && (
        <PinduoduoStyle component={component} remainingTime={remainingTime} />
      )}
      {styleType === 'elegant' && (
        <ElegantStyle component={component} remainingTime={remainingTime} />
      )}
      {styleType === 'modern' && (
        <ModernStyle component={component} remainingTime={remainingTime} />
      )}
    </div>
  );
} 