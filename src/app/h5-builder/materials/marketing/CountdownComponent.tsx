import React from 'react';
import { ComponentType } from '../../components/types';

export function CountdownComponent({ component }: { component: ComponentType }) {
  return (
    <div style={{ ...component.props.style }} className="p-3 bg-gradient-to-r from-rose-100 to-rose-50 rounded-lg">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-800">{component.props.title || '限时活动'}</h3>
        <div className="flex justify-center gap-2 my-3">
          {component.props.showDays && (
            <div className="flex flex-col items-center">
              <div className="px-3 py-2 bg-rose-500 text-white font-medium rounded-md shadow-sm">00</div>
              <div className="text-xs text-gray-500 mt-1">天</div>
            </div>
          )}
          {component.props.showHours && (
            <>
              <div className="flex flex-col items-center">
                <div className="px-3 py-2 bg-rose-500 text-white font-medium rounded-md shadow-sm">00</div>
                <div className="text-xs text-gray-500 mt-1">时</div>
              </div>
              {(component.props.showMinutes || component.props.showSeconds) && (
                <div className="self-center text-lg font-medium text-rose-500">:</div>
              )}
            </>
          )}
          {component.props.showMinutes && (
            <>
              <div className="flex flex-col items-center">
                <div className="px-3 py-2 bg-rose-500 text-white font-medium rounded-md shadow-sm">00</div>
                <div className="text-xs text-gray-500 mt-1">分</div>
              </div>
              {component.props.showSeconds && (
                <div className="self-center text-lg font-medium text-rose-500">:</div>
              )}
            </>
          )}
          {component.props.showSeconds && (
            <div className="flex flex-col items-center">
              <div className="px-3 py-2 bg-rose-500 text-white font-medium rounded-md shadow-sm">00</div>
              <div className="text-xs text-gray-500 mt-1">秒</div>
            </div>
          )}
        </div>
        
        {component.props.description && (
          <div className="text-sm text-gray-600 mt-2">{component.props.description}</div>
        )}
      </div>
    </div>
  );
} 