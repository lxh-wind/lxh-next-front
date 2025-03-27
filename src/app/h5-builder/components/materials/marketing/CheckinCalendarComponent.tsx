import React from 'react';
import { Button } from 'antd-mobile';
import { ComponentType } from '../../types';

export function CheckinCalendarComponent({ component }: { component: ComponentType }) {
  return (
    <div style={{ ...component.props.style }}>
      <h3 className="font-medium text-center">{component.props.title}</h3>
      <div className="grid grid-cols-7 gap-2 mt-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="text-center text-xs text-gray-500">
            {['周一', '周二', '周三', '周四', '周五', '周六', '周日'][i]}
          </div>
        ))}
        {Array.from({ length: 30 }).map((_, i) => (
          <div 
            key={i} 
            className={`text-center py-1 rounded ${
              i < 5 ? 'bg-green-100 text-green-600' : ''
            }`}
          >
            {i + 1}
          </div>
        ))}
      </div>
      <div className="text-center mt-3">
        <Button color='primary'>{component.props.buttonText}</Button>
      </div>
    </div>
  );
} 