'use client';

import React, { useState, useCallback } from 'react';
import { Tabs, Form, Input, Select, Radio, Slider, Button, ColorPicker, Upload, message } from 'antd';
import { UploadOutlined, PictureOutlined, BgColorsOutlined, LayoutOutlined, InfoCircleOutlined } from '@ant-design/icons';
import type { Color } from 'antd/es/color-picker';
import type { PageInfo } from './types';
import type { UploadFile } from 'antd/es/upload/interface';
import { useAtom } from 'jotai';
import {
  pageInfoAtom
} from '@/src/app/h5-builder/store/atoms';

const { TabPane } = Tabs;
const { Option } = Select;

type BgMode = 'color' | 'image' | 'gradient';
type LayoutMode = 'auto' | 'free';

const PageSettings: React.FC<{}> = () => {

  const [pageInfo, setPageInfo] = useAtom(pageInfoAtom);

  // 初始化外观设置状态
  const [bgMode, setBgMode] = useState<BgMode>(pageInfo.bgMode || 'color');
  const [bgColor, setBgColor] = useState<string>(pageInfo.bgColor || '#ffffff');
  const [bgImage, setBgImage] = useState<string | null>(pageInfo.bgImage || null);
  const [bgFileList, setBgFileList] = useState<UploadFile[]>([]);
  const [bgRepeat, setBgRepeat] = useState<string>(pageInfo.bgRepeat || 'no-repeat');
  const [shareImage, setShareImage] = useState<string | null>(pageInfo.shareImage || null);
  const [shareFileList, setShareFileList] = useState<UploadFile[]>([]);

  // 初始化布局设置状态
  const [layoutMode, setLayoutMode] = useState<LayoutMode>(pageInfo.layoutMode || 'auto');
  const [containerPadding, setContainerPadding] = useState<number>(pageInfo.containerPadding || 16);
  const [componentGap, setComponentGap] = useState<number>(pageInfo.componentGap || 16);
  const [containerWidth, setContainerWidth] = useState<number>(pageInfo.containerWidth || 100);
  
  // 表单实例
  const [form] = Form.useForm();

  // 更新页面信息
  const onUpdatePageInfo = useCallback((updates: Partial<PageInfo>) => {
    setPageInfo(prev => ({
      ...prev,
      ...updates,
    }));
  }, []);

  // 更新页面信息
  const handleUpdatePageInfo = (values: any) => {
    onUpdatePageInfo({
      ...values,
      // 外观设置
      bgMode,
      bgColor,
      bgImage: bgImage || '',
      bgRepeat,
      shareImage: shareImage || '',
      // 布局设置
      layoutMode,
      containerPadding,
      componentGap,
      containerWidth,
    });
    message.success('页面设置已更新');
  };

  // 处理图片上传
  const handleBgImageUpload = (info: any) => {
    if (info.file.status === 'done') {
      // 假设上传成功后服务器返回了图片URL
      const imageUrl = info.file.response.url || URL.createObjectURL(info.file.originFileObj);
      setBgImage(imageUrl);
      setBgFileList([info.file]);
    }
  };

  const handleShareImageUpload = (info: any) => {
    if (info.file.status === 'done') {
      const imageUrl = info.file.response.url || URL.createObjectURL(info.file.originFileObj);
      setShareImage(imageUrl);
      setShareFileList([info.file]);
    }
  };

  // 处理背景色变化
  const handleColorChange = (color: Color) => {
    setBgColor(color.toHexString());
  };

  // 背景设置的额外字段
  const renderBgSettings = () => {
    switch (bgMode) {
      case 'color':
        return (
          <Form.Item label="背景颜色" required>
            <ColorPicker value={bgColor} onChange={handleColorChange} />
            <span className="ml-2">{bgColor}</span>
          </Form.Item>
        );
      
      case 'image':
        return (
          <>
            <Form.Item label="背景图片" required>
              <Upload
                listType="picture-card"
                fileList={bgFileList}
                onChange={handleBgImageUpload}
                maxCount={1}
                accept="image/*"
              >
                <div>
                  <PictureOutlined />
                  <div style={{ marginTop: 8 }}>上传图片</div>
                </div>
              </Upload>
            </Form.Item>
            <Form.Item label="背景重复">
              <Select 
                value={bgRepeat} 
                onChange={(value) => setBgRepeat(value)}
                style={{ width: '100%' }}
              >
                <Option value="no-repeat">不重复</Option>
                <Option value="repeat">平铺重复</Option>
                <Option value="repeat-x">水平重复</Option>
                <Option value="repeat-y">垂直重复</Option>
              </Select>
            </Form.Item>
          </>
        );
      
      case 'gradient':
        return (
          <Form.Item label="渐变设置">
            <div className="text-gray-500">
              暂不支持自定义渐变，请使用预设渐变
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {['linear-gradient(to bottom, #ff9a9e, #fad0c4)', 
                'linear-gradient(to bottom, #a1c4fd, #c2e9fb)',
                'linear-gradient(to bottom, #ffecd2, #fcb69f)',
                'linear-gradient(to bottom, #d4fc79, #96e6a1)',
                'linear-gradient(to bottom, #84fab0, #8fd3f4)',
                'linear-gradient(to bottom, #cfd9df, #e2ebf0)'].map((gradient, index) => (
                <div 
                  key={index}
                  className={`h-20 rounded cursor-pointer hover:scale-105 transition-transform ${bgColor === gradient ? 'ring-2 ring-blue-500' : ''}`}
                  style={{ background: gradient }}
                  onClick={() => setBgColor(gradient)}
                />
              ))}
            </div>
          </Form.Item>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="page-settings p-4">
      <Tabs defaultActiveKey="basic">
        <TabPane 
          tab={
            <span>
              <InfoCircleOutlined />
              基础信息
            </span>
          } 
          key="basic"
        >
          <Form
            layout="vertical"
            initialValues={{
              title: pageInfo.title,
              description: pageInfo.description,
              tags: pageInfo.tags,
            }}
            onFinish={handleUpdatePageInfo}
            form={form}
          >
            <Form.Item 
              name="title" 
              label="页面标题" 
              rules={[{ required: true, message: '请输入页面标题' }]}
            >
              <Input placeholder="给页面起个名字" />
            </Form.Item>
            
            <Form.Item 
              name="description" 
              label="页面描述"
            >
              <Input.TextArea placeholder="简单描述一下页面内容" rows={4} />
            </Form.Item>
            
            <Form.Item 
              name="tags" 
              label="标签"
            >
              <Select
                mode="tags"
                placeholder="添加标签"
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item label="分享图片">
              <Upload
                listType="picture-card"
                fileList={shareFileList}
                onChange={handleShareImageUpload}
                maxCount={1}
                accept="image/*"
              >
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>上传分享图</div>
                </div>
              </Upload>
              <div className="text-gray-500 text-sm mt-1">
                建议尺寸 750x400 像素，用于分享时显示
              </div>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                保存设置
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <BgColorsOutlined />
              外观设置
            </span>
          } 
          key="appearance"
        >
          <Form layout="vertical">
            <Form.Item label="背景类型">
              <Radio.Group 
                value={bgMode} 
                onChange={(e) => setBgMode(e.target.value)}
                buttonStyle="solid"
              >
                <Radio.Button value="color">纯色背景</Radio.Button>
                <Radio.Button value="image">图片背景</Radio.Button>
                <Radio.Button value="gradient">渐变背景</Radio.Button>
              </Radio.Group>
            </Form.Item>
            
            {renderBgSettings()}
            
            <Form.Item>
              <Button 
                type="primary" 
                onClick={() => {
                  onUpdatePageInfo({
                    bgMode,
                    bgColor,
                    bgImage: bgImage || '',
                    bgRepeat
                  });
                  message.success('外观设置已更新');
                }}
              >
                应用外观设置
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <LayoutOutlined />
              布局设置
            </span>
          } 
          key="layout"
        >
          <Form layout="vertical">
            <Form.Item label="布局模式">
              <Radio.Group 
                value={layoutMode} 
                onChange={(e) => setLayoutMode(e.target.value)}
                buttonStyle="solid"
              >
                <Radio.Button value="auto">自动布局</Radio.Button>
                <Radio.Button value="free">自由布局</Radio.Button>
              </Radio.Group>
              <div className="text-gray-500 text-sm mt-1">
                自动布局：组件按顺序垂直排列；自由布局：组件可自由拖拽定位
              </div>
            </Form.Item>
            
            <Form.Item label="内容区宽度">
              <Slider
                min={60}
                max={100}
                value={containerWidth}
                onChange={setContainerWidth}
                tipFormatter={(value) => `${value}%`}
              />
              <div className="text-center">{containerWidth}%</div>
            </Form.Item>
            
            <Form.Item label="内容区内边距">
              <Slider
                min={0}
                max={40}
                value={containerPadding}
                onChange={setContainerPadding}
              />
              <div className="text-center">{containerPadding}px</div>
            </Form.Item>
            
            <Form.Item label="组件间距">
              <Slider
                min={0}
                max={40}
                value={componentGap}
                onChange={setComponentGap}
              />
              <div className="text-center">{componentGap}px</div>
            </Form.Item>
            
            <Form.Item>
              <Button 
                type="primary" 
                onClick={() => {
                  onUpdatePageInfo({
                    layoutMode,
                    containerPadding,
                    componentGap,
                    containerWidth
                  });
                  message.success('布局设置已更新');
                }}
              >
                应用布局设置
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default PageSettings; 