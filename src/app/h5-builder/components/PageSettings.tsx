'use client';

import React, { useState, useCallback } from 'react';
import { Tabs, Form, Input, Select, Radio, Slider, Button, ColorPicker, Upload, message, Modal } from 'antd';
import { UploadOutlined, PictureOutlined, BgColorsOutlined, LayoutOutlined, InfoCircleOutlined } from '@ant-design/icons';
import type { Color } from 'antd/es/color-picker';
import type { PageInfo } from './types';
import type { UploadFile } from 'antd/es/upload/interface';
import { useAtom } from 'jotai';
import { pageInfoAtom } from '@/src/app/h5-builder/store/atoms';

const { TabPane } = Tabs;
const { Option } = Select;

type BgMode = 'color' | 'image' | 'gradient';
type LayoutMode = 'auto' | 'free';

interface PageSettingsProps {
  open: boolean;
  onClose: () => void;
}

// 整合外观设置相关状态
interface AppearanceSettings {
  bgMode: BgMode;
  bgColor: string;
  bgImage: string | null;
  bgFileList: UploadFile[];
  bgRepeat: string;
  shareImage: string | null;
  shareFileList: UploadFile[];
}

// 整合布局设置相关状态
interface LayoutSettings {
  layoutMode: LayoutMode;
  containerPadding: number;
  componentGap: number;
}

const PageSettings: React.FC<PageSettingsProps> = ({ open, onClose }) => {
  const [pageInfo, setPageInfo] = useAtom(pageInfoAtom);
  const [form] = Form.useForm();
  
  // 将相关状态整合到一个对象中
  const [appearance, setAppearance] = useState<AppearanceSettings>({
    bgMode: pageInfo.bgMode || 'color',
    bgColor: pageInfo.bgColor || '#ffffff',
    bgImage: pageInfo.bgImage || null,
    bgFileList: [],
    bgRepeat: pageInfo.bgRepeat || 'no-repeat',
    shareImage: pageInfo.shareImage || null,
    shareFileList: []
  });

  // 将布局相关状态整合到一个对象中
  const [layout, setLayout] = useState<LayoutSettings>({
    layoutMode: pageInfo.layoutMode || 'auto',
    containerPadding: pageInfo.containerPadding || 0,
    componentGap: pageInfo.componentGap || 0,
  });

  // 更新外观设置的单个属性
  const updateAppearance = (key: keyof AppearanceSettings, value: any) => {
    setAppearance(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // 更新布局设置的单个属性
  const updateLayout = (key: keyof LayoutSettings, value: any) => {
    setLayout(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // 更新页面信息
  const onUpdatePageInfo = useCallback((updates: Partial<PageInfo>) => {
    setPageInfo(prev => ({
      ...prev,
      ...updates,
    }));
  }, [setPageInfo]);

  // 更新页面信息
  const handleUpdatePageInfo = (values: any) => {
    onUpdatePageInfo({
      ...values,
      // 外观设置
      bgMode: appearance.bgMode,
      bgColor: appearance.bgColor,
      bgImage: appearance.bgImage || '',
      bgRepeat: appearance.bgRepeat,
      shareImage: appearance.shareImage || '',
      // 布局设置
      layoutMode: layout.layoutMode,
      containerPadding: layout.containerPadding,
      componentGap: layout.componentGap,
    });
    message.success('页面设置已更新');
  };

  // 处理背景图片上传
  const handleBgImageUpload = (info: any) => {
    if (info.file.status === 'done') {
      const imageUrl = info.file.response.url || URL.createObjectURL(info.file.originFileObj);
      setAppearance(prev => ({
        ...prev,
        bgImage: imageUrl,
        bgFileList: [info.file]
      }));
    }
  };

  // 处理分享图片上传
  const handleShareImageUpload = (info: any) => {
    if (info.file.status === 'done') {
      const imageUrl = info.file.response.url || URL.createObjectURL(info.file.originFileObj);
      setAppearance(prev => ({
        ...prev,
        shareImage: imageUrl,
        shareFileList: [info.file]
      }));
    }
  };

  // 处理背景色变化
  const handleColorChange = (color: Color) => {
    updateAppearance('bgColor', color.toHexString());
  };

  // 每次打开模态框时重置状态
  React.useEffect(() => {
    if (open) {
      setAppearance({
        bgMode: pageInfo.bgMode || 'color',
        bgColor: pageInfo.bgColor || '#ffffff',
        bgImage: pageInfo.bgImage || null,
        bgFileList: [],
        bgRepeat: pageInfo.bgRepeat || 'no-repeat',
        shareImage: pageInfo.shareImage || null,
        shareFileList: []
      });
      
      setLayout({
        layoutMode: pageInfo.layoutMode || 'auto',
        containerPadding: pageInfo.containerPadding || 0,
        componentGap: pageInfo.componentGap || 0,
      });
      
      form.setFieldsValue({
        title: pageInfo.title,
        description: pageInfo.description,
        tags: pageInfo.tags,
      });
    }
  }, [open, pageInfo, form]);

  // 背景设置的额外字段
  const renderBgSettings = () => {
    switch (appearance.bgMode) {
      case 'color':
        return (
          <Form.Item label="背景颜色" required>
            <ColorPicker value={appearance.bgColor} onChange={handleColorChange} />
            <span className="ml-2">{appearance.bgColor}</span>
          </Form.Item>
        );
      
      case 'image':
        return (
          <>
            <Form.Item label="背景图片" required>
              <Upload
                listType="picture-card"
                fileList={appearance.bgFileList}
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
                value={appearance.bgRepeat} 
                onChange={(value) => updateAppearance('bgRepeat', value)}
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
                  className={`h-20 rounded cursor-pointer hover:scale-105 transition-transform ${appearance.bgColor === gradient ? 'ring-2 ring-blue-500' : ''}`}
                  style={{ background: gradient }}
                  onClick={() => updateAppearance('bgColor', gradient)}
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
    <Modal
      title="页面设置"
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
    >
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
                  fileList={appearance.shareFileList}
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
                  value={appearance.bgMode} 
                  onChange={(e) => updateAppearance('bgMode', e.target.value)}
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
                      bgMode: appearance.bgMode,
                      bgColor: appearance.bgColor,
                      bgImage: appearance.bgImage || '',
                      bgRepeat: appearance.bgRepeat
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
                  value={layout.layoutMode} 
                  onChange={(e) => updateLayout('layoutMode', e.target.value)}
                  buttonStyle="solid"
                >
                  <Radio.Button value="auto">自动布局</Radio.Button>
                  <Radio.Button value="free">自由布局</Radio.Button>
                </Radio.Group>
                <div className="text-gray-500 text-sm mt-1">
                  自动布局：组件按顺序垂直排列；自由布局：组件可自由拖拽定位
                </div>
              </Form.Item>
              
              <Form.Item label="内容区内边距">
                <Slider
                  min={0}
                  max={40}
                  value={layout.containerPadding}
                  onChange={(value) => updateLayout('containerPadding', value)}
                />
                <div className="text-center">{layout.containerPadding}px</div>
              </Form.Item>
              
              <Form.Item label="组件间距">
                <Slider
                  min={0}
                  max={40}
                  value={layout.componentGap}
                  onChange={(value) => updateLayout('componentGap', value)}
                />
                <div className="text-center">{layout.componentGap}px</div>
              </Form.Item>
              
              <Form.Item>
                <Button 
                  type="primary" 
                  onClick={() => {
                    onUpdatePageInfo({
                      layoutMode: layout.layoutMode,
                      containerPadding: layout.containerPadding,
                      componentGap: layout.componentGap
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
    </Modal>
  );
};

export default PageSettings; 