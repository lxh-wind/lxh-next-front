import React from 'react';
import { Button, Avatar } from 'antd-mobile';
import { ComponentType } from '../../types';

export function TeamBuyingComponent({ component }: { component: ComponentType }) {
  return (
    <div style={{ ...component.props.style }} className="text-center">
      <h3 className="font-medium">{component.props.title}</h3>
      <p className="text-xs text-gray-500 mb-2">{component.props.description}</p>
      <div className="bg-white rounded p-3 mb-3">
        <div className="w-full h-24 bg-gray-100 mb-2"></div>
        <div className="text-left">
          <div className="font-medium">{component.props.product?.name}</div>
          <div className="flex items-end gap-2 mt-1">
            <div className="text-red-500 text-lg font-bold">¥{component.props.product?.teamPrice}</div>
            <div className="text-gray-500 text-xs line-through">¥{component.props.product?.originalPrice}</div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 mb-3">
        <div className="text-sm">需 {component.props.teamSize} 人成团</div>
        <div className="text-sm">剩余时间: 23:59:59</div>
      </div>
      <div className="flex justify-center mb-3">
        <div className="flex">
          <Avatar className="mr-1" src="https://avatars.githubusercontent.com/u/1" style={{ '--border-radius': '50%' }}/>
          <Avatar className="mr-1" src="https://placeholder.pics/svg/30/DEDEDE/555555/?" style={{ '--border-radius': '50%' }}/>
          <Avatar src="https://placeholder.pics/svg/30/DEDEDE/555555/?" style={{ '--border-radius': '50%' }}/>
        </div>
      </div>
      <Button color='danger'>{component.props.buttonText}</Button>
    </div>
  );
} 