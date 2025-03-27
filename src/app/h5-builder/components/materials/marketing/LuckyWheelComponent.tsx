import React from 'react';
import dynamic from 'next/dynamic';
import { ComponentType } from '../../types';

// 动态导入抽奖转盘组件以避免SSR问题
const LuckyWheel = dynamic(() => import('../../marketing/LuckyWheel'), { ssr: false });

export function LuckyWheelComponent({ component }: { component: ComponentType }) {
  return (
    <div className="text-center" style={{ ...component.props.style }}>
      <h3 className="font-medium">{component.props.title}</h3>
      <p className="text-xs text-gray-500 mb-2">{component.props.description}</p>
      <div className="p-3 bg-gray-100 rounded-lg my-3">
        <LuckyWheel 
          prizes={(component.props as any).prizes || [
            { id: '1', name: '1元', probability: 0.1, bgColor: '#FFEECC' },
            { id: '2', name: '谢谢参与', probability: 0.4, bgColor: '#FFF4D6' },
            { id: '3', name: '5元', probability: 0.05, bgColor: '#FFEECC' },
            { id: '4', name: '谢谢参与', probability: 0.4, bgColor: '#FFF4D6' },
            { id: '5', name: '10元', probability: 0.03, bgColor: '#FFEECC' },
            { id: '6', name: '再来一次', probability: 0.02, bgColor: '#FFF4D6' },
          ]} 
          title={component.props.title}
          buttonText={component.props.buttonText}
        />
      </div>
    </div>
  );
} 