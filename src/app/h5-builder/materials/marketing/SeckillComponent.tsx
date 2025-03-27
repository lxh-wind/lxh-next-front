import React from 'react';
import { Button } from 'antd-mobile';
import { ComponentType } from '../../components/types';

export function SeckillComponent({ component }: { component: ComponentType }) {
  return (
    <div style={{ ...component.props.style }} className="p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg">
      <div className="text-lg font-medium text-center mb-2">{component.props.title || '限时秒杀'}</div>
      <div className="bg-white rounded-lg p-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-24 h-24 bg-gray-100 rounded-md flex-shrink-0"></div>
          <div className="flex-grow">
            <div className="font-medium mb-1">{component.props.description || '限时特惠商品'}</div>
            <div className="flex items-end gap-2">
              <div className="text-red-500 text-lg font-bold">¥ 9.9</div>
              <div className="text-gray-400 line-through text-xs">¥ 99</div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <div className="text-xs text-gray-500">
                <span className="bg-red-100 text-red-500 px-1 py-0.5 rounded">剩余</span>
                <span className="mx-1 px-1 py-0.5 bg-red-500 text-white rounded">01</span>:
                <span className="mx-1 px-1 py-0.5 bg-red-500 text-white rounded">45</span>:
                <span className="mx-1 px-1 py-0.5 bg-red-500 text-white rounded">37</span>
              </div>
              <Button size="mini" color="danger">{component.props.buttonText || '立即抢购'}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 