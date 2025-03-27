import React from 'react';
import dynamic from 'next/dynamic';
import { ComponentType } from '../../components/types';

// 动态导入抽奖转盘组件以避免SSR问题
const LuckyWheel = dynamic(() => import('../../materials/layout/LuckyWheel'), { ssr: false });

export interface PrizeType {
  id: string;
  name: string;
  probability: number;
  bgColor: string;
}

export function LuckyWheelComponent({ component }: { component: ComponentType }) {
  // Default prizes in Taobao style colors if none are provided
  const defaultPrizes: PrizeType[] = [
    { id: '1', name: '1元红包', probability: 0.1, bgColor: '#FFEECC' },
    { id: '2', name: '谢谢参与', probability: 0.4, bgColor: '#FFF4D6' },
    { id: '3', name: '5元红包', probability: 0.05, bgColor: '#FFEECC' },
    { id: '4', name: '谢谢参与', probability: 0.4, bgColor: '#FFF4D6' },
    { id: '5', name: '10元红包', probability: 0.03, bgColor: '#FFEECC' },
    { id: '6', name: '再来一次', probability: 0.02, bgColor: '#FFF4D6' },
  ];
  
  return (
    <div className="text-center" style={{ ...component.props.style }}>
      <h3 className="font-medium text-orange-500">{component.props.title || '幸运大转盘'}</h3>
      <p className="text-xs text-gray-500 mb-2">{component.props.description || '转动大转盘赢取豪礼'}</p>
      <div className="p-3 bg-orange-50 rounded-lg my-3 border-2 border-orange-100">
        <LuckyWheel 
          prizes={(component.props as any).prizes || defaultPrizes} 
          title={component.props.title}
          buttonText={component.props.buttonText || '抽奖'}
        />
      </div>
    </div>
  );
} 