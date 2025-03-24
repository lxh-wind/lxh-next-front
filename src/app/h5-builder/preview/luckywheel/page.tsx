'use client';

import React, { useState, useEffect } from 'react';
import { Button, Spin, Card, Result, message } from 'antd';
import { ArrowLeftOutlined, ReloadOutlined } from '@ant-design/icons';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// 动态导入组件以避免SSR问题
const LuckyWheel = dynamic(() => import('../../components/marketing/LuckyWheel'), { ssr: false });

export default function LuckyWheelPreview() {
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState<any>(null);
  const [messageApi, contextHolder] = message.useMessage();

  // 加载预览数据
  useEffect(() => {
    const loadPreviewData = () => {
      try {
        // 从会话存储获取预览数据
        const data = sessionStorage.getItem('h5_preview_luckywheel');
        if (data) {
          setPageData(JSON.parse(data));
        } else {
          // 使用默认数据
          setPageData({
            title: '幸运大转盘',
            buttonText: '开始抽奖',
            prizes: [
              { id: '1', name: '1元', probability: 0.1, bgColor: '#FFEECC', fontColor: '#FF5C5C' },
              { id: '2', name: '谢谢参与', probability: 0.4, bgColor: '#FFF4D6', fontColor: '#FF5C5C' },
              { id: '3', name: '5元', probability: 0.05, bgColor: '#FFEECC', fontColor: '#FF5C5C' },
              { id: '4', name: '谢谢参与', probability: 0.4, bgColor: '#FFF4D6', fontColor: '#FF5C5C' },
              { id: '5', name: '10元', probability: 0.03, bgColor: '#FFEECC', fontColor: '#FF5C5C' },
              { id: '6', name: '再来一次', probability: 0.02, bgColor: '#FFF4D6', fontColor: '#FF5C5C' },
            ],
            rotationTime: 5000
          });
        }
      } catch (error) {
        console.error('加载预览数据失败', error);
        messageApi.error('加载预览数据失败');
      } finally {
        setLoading(false);
      }
    };

    loadPreviewData();
  }, [messageApi]);

  // 处理抽奖结果
  const handlePrizeResult = (prize: any) => {
    messageApi.success(`恭喜获得：${prize.name}`);
  };

  // 预览页面内容
  const renderPreview = () => {
    if (!pageData) {
      return (
        <Result
          status="warning"
          title="未找到预览数据"
          subTitle="请返回H5构建器重新生成预览"
          extra={
            <Link href="/h5-builder">
              <Button type="primary">返回构建器</Button>
            </Link>
          }
        />
      );
    }

    return (
      <div className="luckywheel-preview">
        <div className="bg-gray-100 py-2 text-center text-sm border-b">
          <span className="bg-gray-800 text-white px-4 py-1 rounded-full inline-block">
            抽奖转盘预览模式
          </span>
        </div>
        
        <div className="p-4">
          <LuckyWheel
            title={pageData.title}
            buttonText={pageData.buttonText}
            prizes={pageData.prizes}
            rotationTime={pageData.rotationTime}
            onComplete={handlePrizeResult}
          />
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/h5-builder">
            <Button icon={<ArrowLeftOutlined />}>返回编辑</Button>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full bg-white">
      {contextHolder}
      <div className="max-w-md mx-auto h-full">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Spin size="large" tip="加载预览..." />
          </div>
        ) : (
          renderPreview()
        )}
      </div>
    </div>
  );
} 