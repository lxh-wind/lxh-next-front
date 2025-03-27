import React from 'react';
import { Button } from 'antd-mobile';
import { ComponentType } from '../../components/types';

export function CouponComponent({ component }: { component: ComponentType }) {
  return (
    <div style={{ ...component.props.style }}>
      <h3 className="font-medium mb-2">{component.props.title}</h3>
      <div className="flex flex-col gap-2">
        {component.props.coupons?.map((coupon: any, i: number) => (
          <div key={i} className="bg-white border border-red-500 rounded-md p-3">
            <div className="flex justify-between items-center">
              <div className="text-red-500 text-lg font-bold">¥{coupon.amount}</div>
              <div className="text-xs bg-red-500 text-white px-2 py-1 rounded">
                {coupon.title}
              </div>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
              <div>{coupon.condition}</div>
              <Button size='mini' color='danger'>{coupon.buttonText}</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 