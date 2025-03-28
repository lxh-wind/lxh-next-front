import React from 'react';
import { ComponentType } from '../../components/types';

export function CouponComponent({ component }: { component: ComponentType }) {

  return (
    <div style={{ ...component.props.style, background: '#f5f5f5', padding: '8px' }}>
      <div className="flex flex-col gap-2">
        {component.props.coupons?.map((coupon: any, i: number) => (
          <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm relative">
            {/* 整体优惠券容器 */}
            <div className="flex">
              {/* 左侧金额与标签区域 */}
              <div className="bg-white p-4 flex flex-col justify-center items-center border-r border-dashed border-gray-200 relative w-1/3">
                <div className="text-pink-500 font-bold flex items-baseline">
                  <span className="text-lg">¥</span>
                  <span className="text-4xl">{coupon.amount}</span>
                </div>
                <div className="text-xs text-gray-500 mt-2 text-center">
                  {coupon.minSpend ? `订单金额满${coupon.minSpend}可用` : '无门槛'}
                </div>
                <div className="text-xs text-pink-500 mt-1 text-center">{coupon.shopName || '商家 | 档口红包'}</div>
              </div>
              
              {/* 右侧内容区域 */}
              <div className="flex-1 p-4 flex flex-col justify-between bg-white">
                <div>
                  <div className="text-sm font-normal text-gray-700">
                    {coupon.validPeriod || '03.28 00:53 ~ 03.31 00:53'}
                  </div>
                  <div className="w-full h-px bg-gray-100 my-3"></div>
                  <div className="text-xs text-gray-500">
                    {coupon.condition || `适用于[MSTUDIO 漫莎]档口内的所有商品`}
                  </div>
                </div>
                
                {/* 右侧按钮 */}
                <div className="flex justify-end mt-3">
                  <div
                    className='flex items-center justify-center'
                    style={{ 
                      backgroundColor: coupon.buttonColor || '#ff6cab', 
                      borderRadius: '24px', 
                      paddingLeft: '24px', 
                      paddingRight: '24px',
                      fontSize: '14px',
                      border: 'none',
                      color: 'white',
                      height: '32px',
                      lineHeight: '32px'
                    }}
                  >
                    {coupon.buttonText || '去使用'}
                  </div>
                </div>
              </div>
            </div>
            {coupon.isNew && (
              <div className="absolute top-1 left-1 bg-red-500 text-white px-2 py-1 text-xs rounded-sm">
                新人专享
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 