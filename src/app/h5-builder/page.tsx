'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Layout, message, Modal, Button, Tooltip, Divider } from 'antd';
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
  SettingOutlined
} from '@ant-design/icons';
import { publishPage, previewPage } from './utils/store';
import { PageInfo } from './components/types';
import CommonOperations from '@/components/CommonOperations';
import { useAtom } from 'jotai';
import {
  pageInfoAtom,
  componentsAtom,
  selectedComponentAtom,
  canvasSizeAtom,
  historyAtom,
  historyIndexAtom,
  canUndoAtom,
  canRedoAtom,
} from '@/src/app/h5-builder/store/atoms';
import PageSettings from './components/PageSettings';
import CanvasSizeSettings from './components/CanvasSizeSettings';
import SaveModal from './components/SaveModal';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// 使用动态导入避免SSR问题
const ComponentPanel = dynamic(() => import('./components/ComponentPanel'), { ssr: false });
const Canvas = dynamic(() => import('./components/Canvas'), { ssr: false });
const PropertyPanel = dynamic(() => import('./components/PropertyPanel'), { ssr: false });
const ZoomablePaneWithRulers = dynamic(() => import('./components/ZoomablePaneWithRulers'), {
  ssr: false,
});

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
  
  // 使用 Jotai atoms
  const [pageInfo, setPageInfo] = useAtom(pageInfoAtom);
  const [components, setComponents] = useAtom(componentsAtom);
  const [selectedComponent, setSelectedComponent] = useAtom(selectedComponentAtom);
  const [canvasSize, setCanvasSize] = useAtom(canvasSizeAtom);
  const [history, setHistory] = useAtom(historyAtom);
  const [historyIndex, setHistoryIndex] = useAtom(historyIndexAtom);
  const [canUndo, setCanUndo] = useAtom(canUndoAtom);
  const [canRedo, setCanRedo] = useAtom(canRedoAtom);
  
  // 本地状态
  const [showCanvasSizeModal, setShowCanvasSizeModal] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
  const [isPageSettingsOpen, setIsPageSettingsOpen] = useState<boolean>(false);
  
  // 撤销操作
  const handleUndo = useCallback(() => {
    console.log('Undo called', {
      historyIndex,
      pastLength: history.past.length,
      canUndo,
      componentsLength: components.length
    });

    if (history.past.length > 0) {
      // 获取当前历史记录的上一个状态
      const prevState = history.past[history.past.length - 1];
      console.log('Previous state:', prevState);
      
      // 新的past数组，移除最后一个
      const newPast = history.past.slice(0, -1);
      
      setHistory(prev => ({
        past: newPast,
        present: prevState,  // 使用上一个状态作为当前状态
        future: [prev.present, ...prev.future],
      }));
      
      setHistoryIndex(prev => prev - 1);
      // 撤销后，只要newPast数组中还有元素，就可以继续撤销
      setCanUndo(newPast.length > 0);
      setCanRedo(true);
      
      // 更新组件到上一个状态
      setComponents(prevState);
      
      console.log('After undo', {
        newPastLength: newPast.length,
        newCanUndo: newPast.length > 0,
        newComponentsLength: prevState.length
      });
    }
  }, [history, historyIndex, setComponents, setHistory, setHistoryIndex, setCanUndo, setCanRedo, components.length, canUndo]);
  
  // 重做操作
  const handleRedo = useCallback(() => {
    if (history.future.length > 0) {
      const newPast = [...history.past, history.present];
      const newFuture = history.future.slice(1);
      
      setHistory(prev => ({
        past: newPast,
        present: prev.future[0],
        future: newFuture,
      }));
      
      setHistoryIndex(prev => prev + 1);
      // 只要past中有记录就可以撤销
      setCanUndo(newPast.length > 0);
      // 只要future中还有记录就可以重做
      setCanRedo(newFuture.length > 0);
      
      setComponents(history.future[0]);
    }
  }, [history, setComponents, setHistory, setHistoryIndex, setCanUndo, setCanRedo]);
  
  // 初始化布局相关方法
  useEffect(() => {
    // TODO: 从服务器加载页面数据
  }, []);
  
  // 发布页面
  const handlePublish = async () => {
    if (!pageInfo.id) {
      messageApi.warning('请先保存页面');
      return;
    }

    try {
      const publishedData = await publishPage(pageInfo.id);
      messageApi.success('发布成功');
      setPageInfo(prev => ({
        ...prev,
        published: true,
        publishUrl: publishedData.publishedUrl,
      }));
    } catch (error) {
      messageApi.error('发布失败');
    }
  };
  
  // 预览页面
  const handlePreview = () => {
    if (!pageInfo.id) {
      messageApi.warning('请先保存页面');
      return;
    }
    previewPage(pageInfo.id);
  };
  
  // 显示保存模态框
  const showSaveModal = () => {
    setIsSaveModalOpen(true);
  };
  
  // 取消保存
  const handleCancelSave = () => {
    setIsSaveModalOpen(false);
  };

  // 渲染组件操作按钮
  const renderComponentActions = () => {
    return (
      <div className="component-actions flex items-center gap-2">
        <Tooltip title="撤销">
          <Button
            icon={<UndoOutlined />}
            onClick={handleUndo}
            disabled={!canUndo}
          >
            撤销
          </Button>
        </Tooltip>
        <Tooltip title="重做">
          <Button
            icon={<RedoOutlined />}
            onClick={handleRedo}
            disabled={!canRedo}
          >
            重做
          </Button>
        </Tooltip>
        <Tooltip title="保存">
          <Button
            icon={<SaveOutlined />}
            onClick={showSaveModal}
          >
            保存
          </Button>
        </Tooltip>
        <Tooltip title="预览">
          <Button
            icon={<EyeOutlined />}
            onClick={handlePreview}
          >
            预览
          </Button>
        </Tooltip>
        <Tooltip title="发布">
          <Button
            icon={<SendOutlined />}
            onClick={handlePublish}
          />
        </Tooltip>
        <Tooltip title="页面设置">
          <Button
            icon={<SettingOutlined />}
            onClick={() => setIsPageSettingsOpen(true)}
          />
        </Tooltip>
      </div>
    );
  };

  // 取消画布尺寸设置
  const handleCancelCanvasSize = () => {
    setShowCanvasSizeModal(false);
  };
  
  // 打开画布尺寸模态框
  const openCanvasSizeModal = () => {
    setShowCanvasSizeModal(true);
  };

  // 返回上一页
  const handleBack = () => {
    router.push('/h5-list');
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
        // 在清空前保存当前状态到历史
        if (components.length > 0) {
          const newPast = [...history.past, components];
          setHistory({
            past: newPast,
            present: [],
            future: [],
          });
          setHistoryIndex(historyIndex + 1);
          setCanUndo(true);  // 清空后可以撤销
          setCanRedo(false);
        }
        
        setComponents([]);
        setSelectedComponent(null);
        messageApi.success('画布已清空');
      }
    });
  }, [components, history, historyIndex, setComponents, setHistory, setHistoryIndex, setCanUndo, setCanRedo, messageApi, setSelectedComponent]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full flex flex-col">
        {contextHolder}
        
        {/* 顶部导航栏 */}
        <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center">
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>返回</Button>
            <span className="text-xl font-medium ml-4">H5营销页面制作</span>
          </div>
          
          <div className="flex items-center gap-2">
            <CommonOperations
              onDownloadJson={handleDownloadJson}
              onUploadJson={handleUploadJson}
              onClearCanvas={handleClearCanvas}
            />
            {renderComponentActions()}
            <Divider type="vertical" />
            
            <Button 
              icon={<MobileOutlined />}
              onClick={openCanvasSizeModal}
            >
              画布尺寸
            </Button>
            
            <Link href="/h5-builder/templates">
              <Button icon={<FolderOutlined />}>模板</Button>
            </Link>
          </div>
        </div>
        
        {/* 主要内容区域 */}
        <Layout className="flex-1">
          {/* 左侧组件面板 */}
          <Sider width={300} theme="light" className="border-r border-gray-200">
            <ComponentPanel />
          </Sider>
          
          {/* 中间画布区域 */}
          <Content 
            className="overflow-auto p-0 relative"
          >
            <ZoomablePaneWithRulers isPropertyPanelOpen={!!selectedComponent}>
              <Canvas />
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
              <PropertyPanel />
            )}
          </Sider>
        </Layout>
        
        {/* 页面设置模态框 */}
        <PageSettings
          open={isPageSettingsOpen}
          onClose={() => setIsPageSettingsOpen(false)}
        />
        
        {/* 使用抽离的画布尺寸设置组件 */}
        <CanvasSizeSettings
          open={showCanvasSizeModal}
          onClose={handleCancelCanvasSize}
          canvasSize={canvasSize}
          onConfirm={(width, height) => {
            setCanvasSize({ width, height });
          }}
        />
        
        {/* 使用抽离的保存设置组件 */}
        <SaveModal
          open={isSaveModalOpen}
          onClose={handleCancelSave}
        />
      </div>
    </DndProvider>
  );
} 