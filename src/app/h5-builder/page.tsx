'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Layout, message, Modal, Input, Button, Tooltip, Form, Card, Row, Col, Divider, Select } from 'antd';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  EyeOutlined,
  SaveOutlined,
  SendOutlined,
  FolderOutlined,
  MobileOutlined,
  ArrowLeftOutlined,
  UndoOutlined,
  RedoOutlined,
  TabletOutlined,
  LaptopOutlined,
  FileTextOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { savePage, publishPage, previewPage, previewLuckyWheel } from './utils/store';
import { ComponentType, PageInfo } from './components/types';
import CommonOperations from '@/app/components/CommonOperations';

// 使用动态导入避免SSR问题
const ComponentPanel = dynamic(() => import('./components/ComponentPanel'), { ssr: false });
const Canvas = dynamic(() => import('./components/Canvas'), { ssr: false });
const PropertyPanel = dynamic(() => import('./components/PropertyPanel'), { ssr: false });
const PageSettings = dynamic(() => import('./components/PageSettings'), { ssr: false });
const ZoomablePaneWithRulers = dynamic(() => import('./components/ZoomablePaneWithRulers'), {
  ssr: false,
});

// 预设画布尺寸
const DEVICE_SIZES = [
  { name: 'iphone6/7/8', width: 375, height: 667, icon: <MobileOutlined /> },
  { name: 'iphoneXR', width: 414, height: 896, icon: <MobileOutlined /> },
  { name: 'android', width: 360, height: 780, icon: <MobileOutlined /> },
  { name: 'ipad', width: 768, height: 1024, icon: <TabletOutlined /> },
  { name: 'PC', width: 1200, height: 764, icon: <LaptopOutlined /> },
  { name: 'A4', width: 595, height: 842, icon: <FileTextOutlined /> },
];

// 生成复杂ID的函数
const generateComplexId = (componentType: string) => {
  // 生成UUID v4
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
  
  // 生成时间戳
  const timestamp = new Date().getTime();
  
  // 生成格式化的时间字符串
  const date = new Date();
  const formattedDate = date.toISOString().replace(/[:\-\.]/g, '');
  
  return `${componentType}-${uuid}-${timestamp}-${formattedDate}`;
};

// 添加一个转换函数，将 PageData 转换为 PageInfo
const convertPageDataToPageInfo = (pageData: any): PageInfo => {
  return {
    id: pageData.id,
    title: pageData.title || '',
    description: pageData.description || '',
    components: pageData.components || [],
    published: pageData.published || false,
    publishUrl: pageData.publishedUrl || '',
    tags: pageData.tags || [],
    // 如果后端返回的数据没有这些字段，则使用默认值
    bgMode: pageData.bgMode || 'color',
    bgColor: pageData.bgColor || '#FFFFFF',
    bgImage: pageData.bgImage || null,
    bgRepeat: pageData.bgRepeat || 'no-repeat',
    shareImage: pageData.shareImage || null,
    layoutMode: pageData.layoutMode || 'auto',
    containerPadding: pageData.containerPadding || 0,
    componentGap: pageData.componentGap || 0,
    containerWidth: pageData.containerWidth || 100,
  };
};

export default function H5Builder() {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const { Content, Sider } = Layout;
  
  // 页面状态
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    title: '未命名页面',
    description: '',
    components: [],
    // 外观设置
    bgMode: 'color',
    bgColor: '#FFFFFF',
    bgImage: '',
    bgRepeat: 'no-repeat',
    shareImage: '',
    // 布局设置
    layoutMode: 'auto',
    containerPadding: 0,
    componentGap: 0,
    containerWidth: 100,
  });
  
  // 画布状态
  const [components, setComponents] = useState<ComponentType[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<ComponentType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(100);
  const [canvasSize, setCanvasSize] = useState({ width: 375, height: 667 });
  const [showCanvasSizeModal, setShowCanvasSizeModal] = useState(false);
  const [customWidth, setCustomWidth] = useState('375');
  const [customHeight, setCustomHeight] = useState('667');
  
  // 模态框状态
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
  const [isPageSettingsOpen, setIsPageSettingsOpen] = useState<boolean>(false);
  
  // 撤销重做历史记录
  const historyRef = useRef<ComponentType[][]>([]);
  const historyIndexRef = useRef<number>(-1);
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);
  
  // 添加一个临时状态用于存储对话框中选择的尺寸，但尚未应用
  const [tempCanvasSize, setTempCanvasSize] = useState({ width: 375, height: 667 });
  
  // 添加组件
  const handleAddComponent = useCallback((component: any) => {
    const newComponent = {
      id: generateComplexId(component.type),
      ...component
    };
    
    // 记录历史状态
    const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    newHistory.push([...components]);
    historyRef.current = newHistory;
    historyIndexRef.current = newHistory.length - 1;
    
    setComponents(prev => [...prev, newComponent]);
    setCanUndo(true);
    setCanRedo(false);
  }, [components]);
  
  // 选择组件
  const handleSelectComponent = useCallback((component: any) => {
    setSelectedComponent(component);
  }, []);
  
  // 删除组件
  const handleDeleteComponent = useCallback((id: string) => {
    // 记录历史状态
    const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    newHistory.push([...components]);
    historyRef.current = newHistory;
    historyIndexRef.current = newHistory.length - 1;
    
    setComponents(prev => prev.filter(comp => comp.id !== id));
    if (selectedComponent && selectedComponent.id === id) {
      setSelectedComponent(null);
    }
    setCanUndo(true);
    setCanRedo(false);
  }, [components, selectedComponent]);
  
  // 复制组件
  const handleDuplicateComponent = useCallback((id: string) => {
    const component = components.find(comp => comp.id === id);
    if (component) {
      const newComponent = {
        ...component,
        id: generateComplexId(component.type),
      };
      
      // 记录历史状态
      const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
      newHistory.push([...components]);
      historyRef.current = newHistory;
      historyIndexRef.current = newHistory.length - 1;
      
      setComponents(prev => [...prev, newComponent]);
      setCanUndo(true);
      setCanRedo(false);
    }
  }, [components]);
  
  // 更新组件属性
  const handleUpdateComponent = useCallback((id: string, props: any) => {
    // 记录历史状态（仅在不频繁更新的属性变更时）
    if (Object.keys(props).some(key => !['style.marginTop', 'style.marginBottom'].includes(key))) {
      const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
      newHistory.push([...components]);
      historyRef.current = newHistory;
      historyIndexRef.current = newHistory.length - 1;
      setCanUndo(true);
      setCanRedo(false);
    }
    
    setComponents(prev => 
      prev.map(comp => 
        comp.id === id 
          ? { ...comp, props: { ...comp.props, ...props } } 
          : comp
      )
    );
    
    // 同步更新选中的组件
    if (selectedComponent && selectedComponent.id === id) {
      setSelectedComponent(prev => 
        prev ? { ...prev, props: { ...prev.props, ...props } } : null
      );
    }
  }, [components, selectedComponent]);

  // 更新组件顺序
  const handleUpdateComponentsOrder = useCallback((startIndex: number, endIndex: number) => {
    // 记录历史状态
    const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    newHistory.push([...components]);
    historyRef.current = newHistory;
    historyIndexRef.current = newHistory.length - 1;
    
    const result = Array.from(components);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    
    setComponents(result);
    setCanUndo(true);
    setCanRedo(false);
  }, [components]);
  
  // 撤销操作
  const handleUndo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;
      setComponents(historyRef.current[historyIndexRef.current]);
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(true);
    }
  }, []);
  
  // 重做操作
  const handleRedo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current += 1;
      setComponents(historyRef.current[historyIndexRef.current]);
      setCanUndo(true);
      setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
    }
  }, []);
  
  // 同步组件到页面信息
  useEffect(() => {
    setPageInfo(prev => ({
      ...prev,
      components,
    }));
  }, [components]);
  
  // 保存页面
  const handleSave = async (values: any) => {
    setLoading(true);
    
    try {
      const pageToSave = {
        ...pageInfo,
        ...values,
        components,
      };
      
      const savedData = await savePage(pageToSave);
      setPageInfo(convertPageDataToPageInfo(savedData));
      messageApi.success('保存成功');
      setIsSaveModalOpen(false);
    } catch (error) {
      messageApi.error('保存失败');
    } finally {
      setLoading(false);
    }
  };
  
  // 发布页面
  const handlePublish = async () => {
    if (!pageInfo.id) {
      messageApi.warning('请先保存页面');
      setIsSaveModalOpen(true);
      return;
    }

    setLoading(true);
    try {
      const publishedData = await publishPage(pageInfo.id);
      setPageInfo(convertPageDataToPageInfo(publishedData));
      messageApi.success('发布成功');
      Modal.success({
        title: '页面发布成功',
        content: (
          <div>
            <p>您的H5页面已成功发布，可通过以下链接访问：</p>
            <a href={publishedData.publishedUrl} target="_blank" rel="noreferrer">
              {publishedData.publishedUrl}
            </a>
          </div>
        ),
      });
    } catch (error) {
      messageApi.error('发布失败');
    } finally {
      setLoading(false);
    }
  };
  
  // 预览页面
  const handlePreview = () => {
    const previewUrl = previewPage(pageInfo);
    window.open(previewUrl, '_blank');
  };
  
  // 预览选中组件（如果是抽奖转盘）
  const handlePreviewComponent = () => {
    if (selectedComponent && selectedComponent.type === 'luckyWheel') {
      // 直接预览抽奖转盘组件
      const previewUrl = previewLuckyWheel(selectedComponent.props);
      window.open(previewUrl, '_blank');
    }
  };
  
  // 保存模态框
  const showSaveModal = () => {
    setIsSaveModalOpen(true);
  };
  
  // 关闭保存模态框
  const handleCancelSave = () => {
    setIsSaveModalOpen(false);
  };

  // 在组件面板中添加预览按钮
  const renderComponentActions = () => {
    if (!selectedComponent) return null;

    const actions = [];

    // 对于抽奖转盘组件，添加单独预览按钮
    if (selectedComponent.type === 'luckyWheel') {
      actions.push(
        <Button 
          key="preview-component" 
          icon={<EyeOutlined />} 
          onClick={handlePreviewComponent}
          size="small"
        >
          预览转盘
        </Button>
      );
    }

    return actions.length > 0 ? (
      <div className="flex justify-end mb-4 px-4">
        {actions}
      </div>
    ) : null;
  };

  // 处理画布尺寸修改
  const handleCanvasSizeChange = (width: number, height: number) => {
    // 更新临时选中的尺寸，但不立即应用
    setTempCanvasSize({ width, height });
    // 更新自定义尺寸输入框的值
    setCustomWidth(width.toString());
    setCustomHeight(height.toString());
  };

  // 应用自定义尺寸
  const applyCustomSize = () => {
    const width = parseInt(customWidth, 10);
    const height = parseInt(customHeight, 10);
    if (width > 0 && height > 0) {
      setTempCanvasSize({ width, height });
    } else {
      messageApi.error('请输入有效的宽度和高度');
    }
  };

  // 确认并应用所选尺寸
  const confirmCanvasSize = () => {
    setCanvasSize(tempCanvasSize);
    setShowCanvasSizeModal(false);
    messageApi.success('画布尺寸已更新');
  };

  // 打开画布尺寸模态框时，确保自定义尺寸字段显示当前画布尺寸，并重置临时尺寸为当前尺寸
  const openCanvasSizeModal = () => {
    setTempCanvasSize(canvasSize);
    setCustomWidth(canvasSize.width.toString());
    setCustomHeight(canvasSize.height.toString());
    setShowCanvasSizeModal(true);
  };

  // 检查当前选择的尺寸是否为预设设备尺寸之一
  const isCustomTempSize = () => {
    return !DEVICE_SIZES.some(
      device => device.width === tempCanvasSize.width && device.height === tempCanvasSize.height
    );
  };

  // 取消时重置临时尺寸
  const handleCancelCanvasSize = () => {
    setShowCanvasSizeModal(false);
  };

  // 更新页面信息
  const handleUpdatePageInfo = (updates: Partial<PageInfo>) => {
    setPageInfo(prev => ({
      ...prev,
      ...updates
    }));
  };

  const handleBack = () => {
    router.back();
  };

  // 处理下载JSON文件
  const handleDownloadJson = useCallback(() => {
    const data = {
      pageInfo,
      components
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pageInfo.title || '未命名页面'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    messageApi.success('JSON文件下载成功');
  }, [pageInfo, components]);

  // 处理上传JSON文件
  const handleUploadJson = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const text = await file.text();
          const data = JSON.parse(text);
          if (data.pageInfo && data.components) {
            // 确保上传的数据符合PageInfo类型
            setPageInfo(convertPageDataToPageInfo(data.pageInfo));
            setComponents(data.components);
            messageApi.success('JSON文件导入成功');
          } else {
            messageApi.error('无效的JSON文件格式');
          }
        } catch (error) {
          messageApi.error('JSON文件解析失败');
        }
      }
    };
    input.click();
  }, []);

  // 处理清空画布
  const handleClearCanvas = useCallback(() => {
    Modal.confirm({
      title: '确认清空画布？',
      content: '此操作将删除画布上的所有组件，且不可恢复',
      onOk: () => {
        setComponents([]);
        setSelectedComponent(null);
        messageApi.success('画布已清空');
      }
    });
  }, []);

  // 添加一个测试函数来验证 ID 生成
  const testIdGeneration = useCallback(() => {
    const testId = generateComplexId('test');
    messageApi.info(`新生成的复杂ID: ${testId}`);
  }, []);

  return (
    <div className="h-full flex flex-col">
      {contextHolder}
      
      {/* 顶部导航栏 */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>返回</Button>
          <span className="text-xl font-medium ml-4">H5营销页面制作</span>
          <Button onClick={testIdGeneration} className="ml-4">测试ID生成</Button>
        </div>
        
        <div className="flex items-center gap-2">
          <CommonOperations
            onDownloadJson={handleDownloadJson}
            onUploadJson={handleUploadJson}
            onClearCanvas={handleClearCanvas}
          />
          <Button icon={<UndoOutlined />} disabled={!canUndo} onClick={handleUndo}>撤销</Button>
          <Button icon={<RedoOutlined />} disabled={!canRedo} onClick={handleRedo}>重做</Button>
          <Divider type="vertical" />
          
          <Button 
            icon={<SettingOutlined />}
            onClick={() => setIsPageSettingsOpen(true)}
          >
            页面设置
          </Button>
          
          <Button 
            icon={<MobileOutlined />}
            onClick={openCanvasSizeModal}
          >
            画布尺寸
          </Button>
          
          <Link href="/h5-builder/templates">
            <Button icon={<FolderOutlined />}>模板</Button>
          </Link>
          
          <Tooltip title="预览">
            <Button icon={<EyeOutlined />} onClick={handlePreview}>预览</Button>
          </Tooltip>
          
          <Tooltip title="保存">
            <Button icon={<SaveOutlined />} onClick={showSaveModal}>保存</Button>
          </Tooltip>
          
          <Tooltip title="发布">
            <Button type="primary" icon={<SendOutlined />} onClick={handlePublish}>
              发布
            </Button>
          </Tooltip>
        </div>
      </div>
      
      {/* 主要内容区域 */}
      <Layout className="flex-1">
        {/* 左侧组件面板 */}
        <Sider width={300} theme="light" className="border-r border-gray-200">
          <ComponentPanel onAddComponent={handleAddComponent} />
        </Sider>
        
        {/* 中间画布区域 */}
        <Content 
          className="overflow-auto p-0 relative"
        >
          <ZoomablePaneWithRulers 
            zoom={zoom} 
            onZoomChange={setZoom}
            isPropertyPanelOpen={!!selectedComponent}
          >
            <Canvas
              components={components}
              selectedComponentId={selectedComponent?.id}
              onSelectComponent={handleSelectComponent}
              onDeleteComponent={handleDeleteComponent}
              onDuplicateComponent={handleDuplicateComponent}
              onUpdateComponentsOrder={handleUpdateComponentsOrder}
              onAddComponent={handleAddComponent}
              zoom={zoom}
              canvasSize={canvasSize}
              containerPadding={pageInfo.containerPadding}
              componentGap={pageInfo.componentGap}
              containerWidth={pageInfo.containerWidth}
              layoutMode={pageInfo.layoutMode}
              bgMode={pageInfo.bgMode}
              bgColor={pageInfo.bgColor}
              bgImage={pageInfo.bgImage}
              bgRepeat={pageInfo.bgRepeat}
            />
          </ZoomablePaneWithRulers>
        </Content>
        
        {/* 右侧属性面板 - 根据是否选中组件决定宽度 */}
        <Sider 
          width={selectedComponent ? 300 : 0} 
          theme="light" 
          className="border-l border-gray-200 overflow-auto transition-all duration-300"
          style={{ 
            minWidth: selectedComponent ? '300px' : '0px',
            maxWidth: selectedComponent ? '300px' : '0px',
          }}
        >
          {selectedComponent && (
            <>
              {renderComponentActions()}
              <PropertyPanel
                selectedComponent={selectedComponent}
                onUpdateComponent={handleUpdateComponent}
              />
            </>
          )}
        </Sider>
      </Layout>
      
      {/* 页面设置模态框 */}
      <Modal
        title="页面设置"
        open={isPageSettingsOpen}
        onCancel={() => setIsPageSettingsOpen(false)}
        footer={null}
        width={800}
        bodyStyle={{ maxHeight: '80vh', overflow: 'auto' }}
      >
        <PageSettings 
          pageInfo={pageInfo}
          onUpdatePageInfo={handleUpdatePageInfo}
        />
      </Modal>
      
      {/* 画布尺寸设置模态框 */}
      <Modal
        title="设置画布尺寸"
        open={showCanvasSizeModal}
        onCancel={handleCancelCanvasSize}
        footer={[
          <Button key="cancel" onClick={handleCancelCanvasSize}>
            取消
          </Button>,
          <Button 
            key="confirm" 
            type="primary" 
            onClick={confirmCanvasSize}
            disabled={tempCanvasSize.width === canvasSize.width && tempCanvasSize.height === canvasSize.height}
          >
            确认更改
          </Button>
        ]}
        width={750}
      >
        <div className="mb-8">
          {/* 当前画布尺寸信息 */}
          <div className="mb-6 bg-gray-50 px-4 py-3 rounded-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium mr-2">当前尺寸:</span>
                <span className="font-mono">{canvasSize.width} × {canvasSize.height} px</span>
              </div>
              <div>
                <span className="text-gray-500 text-sm">
                  {!DEVICE_SIZES.some(
                    device => device.width === canvasSize.width && device.height === canvasSize.height
                  ) ? '自定义尺寸' : 
                    DEVICE_SIZES.find(device => 
                      device.width === canvasSize.width && device.height === canvasSize.height
                    )?.name
                  }
                </span>
              </div>
            </div>
          </div>

          {/* 选择后的尺寸预览 */}
          {(tempCanvasSize.width !== canvasSize.width || tempCanvasSize.height !== canvasSize.height) && (
            <div className="mb-6 bg-blue-50 px-4 py-3 rounded-md border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium mr-2 text-blue-600">选择的新尺寸:</span>
                  <span className="font-mono text-blue-600">{tempCanvasSize.width} × {tempCanvasSize.height} px</span>
                </div>
                <div>
                  <span className="text-blue-500 text-sm">
                    {isCustomTempSize() ? '自定义尺寸' : 
                      DEVICE_SIZES.find(device => 
                        device.width === tempCanvasSize.width && device.height === tempCanvasSize.height
                      )?.name
                    }
                  </span>
                </div>
              </div>
            </div>
          )}

          <h3 className="mb-4 font-semibold">预设设备尺寸</h3>
          <Row gutter={[16, 16]} className="mb-4">
            {DEVICE_SIZES.map((device) => {
              const isSelected = tempCanvasSize.width === device.width && tempCanvasSize.height === device.height;
              const isCurrent = canvasSize.width === device.width && canvasSize.height === device.height;
              return (
                <Col span={8} key={device.name}>
                  <Card 
                    hoverable
                    className={`transition-all duration-300 ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50 shadow-md transform scale-105' 
                        : isCurrent 
                          ? 'border-green-500 bg-green-50'
                          : 'border border-gray-200'
                    }`}
                    onClick={() => handleCanvasSizeChange(device.width, device.height)}
                  >
                    <div className="flex items-center">
                      <div className={`text-2xl mr-3 ${isSelected ? 'text-blue-500' : isCurrent ? 'text-green-500' : ''}`}>
                        {device.icon}
                      </div>
                      <div>
                        <div className={`font-medium ${isSelected ? 'text-blue-500' : isCurrent ? 'text-green-500' : ''}`}>
                          {device.name}
                        </div>
                        <div className={`${isSelected ? 'text-blue-500' : isCurrent ? 'text-green-500' : 'text-gray-500'}`}>
                          {device.width} × {device.height}
                        </div>
                      </div>
                      <div className="ml-auto">
                        {isSelected && (
                          <span className="bg-blue-500 text-white text-xs py-1 rounded flex justify-center w-[50px]">已选择</span>
                        )}
                        {isCurrent && !isSelected && (
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded w-[100px]">当前</span>
                        )}
                      </div>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>

          <Divider />

          <div className="mt-8">
            <h3 className="mb-4 font-semibold flex items-center">
              <span>自定义尺寸</span>
              {isCustomTempSize() && (
                <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded flex justify-center w-[50px]">已选择</span>
              )}
              {!DEVICE_SIZES.some(
                device => device.width === canvasSize.width && device.height === canvasSize.height
              ) && !isCustomTempSize() && (
                <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded">当前</span>
              )}
            </h3>
            <div className="flex items-center gap-2">
              <span>宽:</span>
              <Input 
                type="number" 
                value={customWidth}
                onChange={(e) => setCustomWidth(e.target.value)}
                style={{ width: 120 }}
                addonAfter="px"
                className={isCustomTempSize() ? "border-blue-300" : ""}
              />
              <span>高:</span>
              <Input 
                type="number" 
                value={customHeight}
                onChange={(e) => setCustomHeight(e.target.value)}
                style={{ width: 120 }}
                addonAfter="px"
                className={isCustomTempSize() ? "border-blue-300" : ""}
              />
              <Button 
                type="primary" 
                onClick={applyCustomSize}
              >
                使用此尺寸
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      
      {/* 保存模态框 */}
      <Modal
        title="保存页面"
        open={isSaveModalOpen}
        onCancel={handleCancelSave}
        footer={null}
      >
        <Form
          name="saveForm"
          onFinish={handleSave}
          initialValues={{
            title: pageInfo.title,
            description: pageInfo.description,
            tags: pageInfo.tags,
          }}
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
          
          <Form.Item>
            <div className="flex justify-end gap-2">
              <Button onClick={handleCancelSave}>取消</Button>
              <Button type="primary" htmlType="submit" loading={loading}>保存</Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
} 