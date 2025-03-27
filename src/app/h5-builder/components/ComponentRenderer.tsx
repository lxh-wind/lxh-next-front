'use client';

import React from 'react';
import { Button, Avatar } from 'antd-mobile';
import { ComponentType } from './types';
import dynamic from 'next/dynamic';
import Image from 'next/image';

// 动态导入抽奖转盘组件以避免SSR问题
const LuckyWheel = dynamic(() => import('./marketing/LuckyWheel'), { ssr: false });

// 渲染不同类型的组件内容
export function renderComponentContent(component: ComponentType) {
  switch(component.type) {
    case 'text':
      return (
        <div style={{ ...component.props.style }}>
          {component.props.content}
        </div>
      );
    
    case 'image':
      return (
        <Image 
          src={component.props.src || ''} 
          alt={component.props.alt || ''} 
          width={component.props.width}
          height={component.props.height}
          style={{ 
            ...component.props.style,
            maxWidth: '100%'
          }}
        />
      );
    
    case 'button':
      return (
        <Button 
          color={component.props.buttonType === 'primary' ? 'primary' : 'default'} 
          fill={component.props.buttonType === 'dashed' ? 'outline' : 'solid'}
          style={{ ...component.props.style }}
        >
          {component.props.text}
        </Button>
      );
    
    case 'carousel':
      return (
        <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
          轮播图组件
          <div className="text-xs text-gray-500 mt-1">
            {component.props.images?.length || 0}张图片
          </div>
        </div>
      );
    
    case 'productList':
      return (
        <div className="w-full bg-gray-200 p-2">
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map(item => (
              <div key={item} className="bg-white p-2 rounded">
                <div className="bg-gray-100 h-20 mb-2"></div>
                <div className="text-sm">商品名称</div>
                <div className="text-red-500">¥ 99.00</div>
              </div>
            ))}
          </div>
        </div>
      );
    
    case 'countdown':
      return (
        <div style={{ ...component.props.style }}>
          <div className="text-center">
            <div>{component.props.title}</div>
            <div className="flex justify-center gap-2 my-2">
              {component.props.showDays && (
                <span className="px-2 py-1 bg-red-500 text-white rounded">00</span>
              )}
              {component.props.showHours && (
                <>
                  <span>:</span>
                  <span className="px-2 py-1 bg-red-500 text-white rounded">00</span>
                </>
              )}
              {component.props.showMinutes && (
                <>
                  <span>:</span>
                  <span className="px-2 py-1 bg-red-500 text-white rounded">00</span>
                </>
              )}
              {component.props.showSeconds && (
                <>
                  <span>:</span>
                  <span className="px-2 py-1 bg-red-500 text-white rounded">00</span>
                </>
              )}
            </div>
          </div>
        </div>
      );
    
    case 'coupon':
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
    
    case 'luckyWheel':
      return (
        <div className="text-center" style={{ ...component.props.style }}>
          <h3 className="font-medium">{component.props.title}</h3>
          <p className="text-xs text-gray-500 mb-2">{component.props.description}</p>
          <div className="p-6 bg-gray-100 rounded-lg my-3">
            <div className="w-full h-60 bg-yellow-100 rounded-full flex items-center justify-center">
              模拟抽奖转盘
            </div>
          </div>
          <Button color='danger'>{component.props.buttonText}</Button>
        </div>
      );
    
    case 'checkinCalendar':
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
    
    case 'memberBenefits':
      return (
        <div style={{ ...component.props.style }}>
          <h3 className="font-medium text-center">{component.props.title}</h3>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {component.props.benefits?.map((benefit: any, i: number) => (
              <div key={i} className="bg-white p-3 rounded-lg text-center shadow-sm">
                <div className="text-2xl text-yellow-500 mb-2">{benefit.icon || '🎁'}</div>
                <div className="text-sm font-medium">{benefit.title}</div>
                <div className="text-xs text-gray-500 mt-1">{benefit.description}</div>
              </div>
            ))}
          </div>
        </div>
      );
    
    case 'surveyForm':
      return (
        <div style={{ ...component.props.style }}>
          <h3 className="font-medium">{component.props.title}</h3>
          <p className="text-xs text-gray-500 mb-3">{component.props.description}</p>
          {component.props.questions?.map((question: any, i: number) => (
            <div key={i} className="mb-3">
              <div className="text-sm font-medium mb-1">{i+1}. {question.title}</div>
              {question.type === 'radio' && (
                <div className="flex flex-col gap-1">
                  {question.options.map((option: string, j: number) => (
                    <div key={j} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border border-gray-300"></div>
                      <div className="text-sm">{option}</div>
                    </div>
                  ))}
                </div>
              )}
              {question.type === 'checkbox' && (
                <div className="flex flex-col gap-1">
                  {question.options.map((option: string, j: number) => (
                    <div key={j} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border border-gray-300"></div>
                      <div className="text-sm">{option}</div>
                    </div>
                  ))}
                </div>
              )}
              {question.type === 'text' && (
                <div className="border border-gray-300 rounded p-2 h-20 bg-white"></div>
              )}
            </div>
          ))}
          <div className="text-center mt-3">
            <Button color='primary'>{component.props.buttonText}</Button>
            <div className="text-xs text-gray-500 mt-1">{component.props.rewardText}</div>
          </div>
        </div>
      );
    
    case 'teamBuying':
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
    
    default:
      return (
        <div className="p-2 border border-gray-300 rounded text-center">
          未知组件类型: {component.type}
        </div>
      );
  }
} 