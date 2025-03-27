'use client';

import React, { useState } from 'react';
import { Modal, Button, Card, Row, Col, Input, Divider } from 'antd';
import { MobileOutlined, TabletOutlined, LaptopOutlined, FileTextOutlined } from '@ant-design/icons';

// 预设画布尺寸
const DEVICE_SIZES = [
  { name: 'iphone6/7/8', width: 375, height: 667, icon: <MobileOutlined /> },
  { name: 'iphoneXR', width: 414, height: 896, icon: <MobileOutlined /> },
  { name: 'android', width: 360, height: 780, icon: <MobileOutlined /> },
  { name: 'ipad', width: 768, height: 1024, icon: <TabletOutlined /> },
  { name: 'PC', width: 1200, height: 764, icon: <LaptopOutlined /> },
  { name: 'A4', width: 595, height: 842, icon: <FileTextOutlined /> },
];

interface CanvasSizeSettingsProps {
  open: boolean;
  onClose: () => void;
  canvasSize: { width: number; height: number };
  onConfirm: (width: number, height: number) => void;
}

const CanvasSizeSettings: React.FC<CanvasSizeSettingsProps> = ({
  open,
  onClose,
  canvasSize,
  onConfirm,
}) => {
  const [tempCanvasSize, setTempCanvasSize] = useState({ width: canvasSize.width, height: canvasSize.height });
  const [customWidth, setCustomWidth] = useState(canvasSize.width.toString());
  const [customHeight, setCustomHeight] = useState(canvasSize.height.toString());

  // 处理画布尺寸变更
  const handleCanvasSizeChange = (width: number, height: number) => {
    setTempCanvasSize({ width, height });
  };

  // 应用自定义尺寸
  const applyCustomSize = () => {
    const width = parseInt(customWidth);
    const height = parseInt(customHeight);
    if (width && height) {
      setTempCanvasSize({ width, height });
    }
  };

  // 确认画布尺寸
  const confirmCanvasSize = () => {
    onConfirm(tempCanvasSize.width, tempCanvasSize.height);
    onClose();
  };

  // 检查是否为自定义尺寸
  const isCustomTempSize = () => {
    return !DEVICE_SIZES.some(
      size => size.width === tempCanvasSize.width && size.height === tempCanvasSize.height
    );
  };

  // 每次打开模态框时重置状态
  React.useEffect(() => {
    if (open) {
      setTempCanvasSize(canvasSize);
      setCustomWidth(canvasSize.width.toString());
      setCustomHeight(canvasSize.height.toString());
    }
  }, [open, canvasSize]);

  return (
    <Modal
      title="设置画布尺寸"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
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
  );
};

export default CanvasSizeSettings; 