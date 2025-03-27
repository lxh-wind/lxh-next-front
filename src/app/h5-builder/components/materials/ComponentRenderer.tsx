'use client';

import React from 'react';
import { ComponentType } from '../types';

// Basic components
import { TextComponent } from './basic/TextComponent';
import { ImageComponent } from './basic/ImageComponent';
import { VideoComponent } from './basic/VideoComponent';
import { ButtonComponent } from './basic/ButtonComponent';
import { QRCodeComponent } from './basic/QRCodeComponent';

// Layout components
import { CarouselComponent } from './layout/CarouselComponent';
import { ProductListComponent } from './layout/ProductListComponent';
import { ContainerComponent } from './layout/ContainerComponent';

// Marketing components
import { CountdownComponent } from './marketing/CountdownComponent';
import { CouponComponent } from './marketing/CouponComponent';
import { LuckyWheelComponent } from './marketing/LuckyWheelComponent';
import { CheckinCalendarComponent } from './marketing/CheckinCalendarComponent';
import { MemberBenefitsComponent } from './marketing/MemberBenefitsComponent';
import { SurveyFormComponent } from './marketing/SurveyFormComponent';
import { TeamBuyingComponent } from './marketing/TeamBuyingComponent';
import { SeckillComponent } from './marketing/SeckillComponent';
import { SocialShareComponent } from './marketing/SocialShareComponent';

/**
 * 渲染不同类型的组件内容
 * 支持的组件类型:
 * - text: 文本组件
 * - image: 图片组件
 * - video: 视频组件
 * - button: 按钮组件
 * - carousel: 轮播图组件
 * - productList: 商品列表组件 (支持grid/list/card三种模式)
 * - countdown: 倒计时组件
 * - coupon: 优惠券组件
 * - luckyWheel: 抽奖转盘组件
 * - checkinCalendar: 签到日历组件
 * - memberBenefits: 会员福利组件
 * - surveyForm: 调查表单组件
 * - teamBuying: 团购组件
 * - seckill: 秒杀组件
 * - qrcode: 二维码组件
 * - container: 容器组件
 * - socialShare: 社交分享组件
 */
export function renderComponentContent(component: ComponentType) {
  switch(component.type) {
    case 'text':
      return <TextComponent component={component} />;
    
    case 'image':
      return <ImageComponent component={component} />;
    
    case 'video':
      return <VideoComponent component={component} />;
    
    case 'button':
      return <ButtonComponent component={component} />;
    
    case 'carousel':
      return <CarouselComponent component={component} />;
    
    case 'productList':
      return <ProductListComponent component={component} />;
    
    case 'countdown':
      return <CountdownComponent component={component} />;
    
    case 'coupon':
      return <CouponComponent component={component} />;
    
    case 'luckyWheel':
      return <LuckyWheelComponent component={component} />;
    
    case 'checkinCalendar':
      return <CheckinCalendarComponent component={component} />;
    
    case 'memberBenefits':
      return <MemberBenefitsComponent component={component} />;
    
    case 'surveyForm':
      return <SurveyFormComponent component={component} />;
    
    case 'teamBuying':
      return <TeamBuyingComponent component={component} />;
    
    case 'seckill':
      return <SeckillComponent component={component} />;
    
    case 'qrcode':
      return <QRCodeComponent component={component} />;
    
    case 'container':
      return <ContainerComponent component={component} />;
    
    case 'socialShare':
      return <SocialShareComponent component={component} />;
    
    default:
      return (
        <div className="p-2 border border-gray-300 rounded text-center">
          未知组件类型: {component.type}
        </div>
      );
  }
} 