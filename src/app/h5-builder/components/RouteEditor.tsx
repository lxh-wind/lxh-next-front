'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button, Table, Input, Space, Modal, Tooltip, message, Empty } from 'antd';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  DeleteOutlined, 
  PlusOutlined, 
  EditOutlined,
  InfoCircleOutlined,
  CopyOutlined,
  ImportOutlined,
  ExportOutlined,
  RetweetOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import { parseRouteString, stringifyRoutePoints, calculateRouteDistance, RoutePoint, createClosedLoopRoute } from '../utils/mapService';
import MapComponent from './MapComponent';
import { MAP_CONFIG } from '../config/mapConfig';

interface RouteEditorProps {
  routePoints: string;
  trackColor?: string;
  trackWidth?: number;
  apiKey?: string;
  securityJsCode?: string;
  onChange: (routePoints: string) => void;
  onDistanceChange?: (distance: number) => void;
}

const RouteEditor: React.FC<RouteEditorProps> = ({
  routePoints,
  trackColor = '#2aab58',
  trackWidth = 4,
  apiKey = MAP_CONFIG.API_KEY,
  securityJsCode = MAP_CONFIG.SECURITY_JS_CODE,
  onChange,
  onDistanceChange
}) => {
  const [points, setPoints] = useState<RoutePoint[]>([]);
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);
  const [isRouteImportVisible, setIsRouteImportVisible] = useState(false);
  const [importValue, setImportValue] = useState('');
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);

  // Parse route points when component mounts or routePoints changes
  useEffect(() => {
    const parsedPoints = parseRouteString(routePoints);
    setPoints(parsedPoints);

    // Calculate and update distance if callback provided
    if (onDistanceChange && parsedPoints.length > 1) {
      const distance = calculateRouteDistance(parsedPoints);
      onDistanceChange(distance);
    }
  }, [routePoints, onDistanceChange]);

  // Handle adding a point
  const handleAddPoint = () => {
    const newPoints = [...points];
    // Create a nearby point to the last one or use default coordinates
    const lastPoint = newPoints.length > 0 ? newPoints[newPoints.length - 1] : { lat: MAP_CONFIG.DEFAULT_CENTER.lat, lng: MAP_CONFIG.DEFAULT_CENTER.lng };
    const newPoint = {
      lat: lastPoint.lat + 0.001 * (Math.random() - 0.5),
      lng: lastPoint.lng + 0.001 * (Math.random() - 0.5)
    };
    newPoints.push(newPoint);
    updatePoints(newPoints);
  };

  // Handle deleting a point
  const handleDeletePoint = (index: number) => {
    const newPoints = [...points];
    newPoints.splice(index, 1);
    updatePoints(newPoints);
    // Clear selection if the selected point was deleted
    if (selectedPointIndex === index) {
      setSelectedPointIndex(null);
    } else if (selectedPointIndex !== null && selectedPointIndex > index) {
      // Adjust selected index if we deleted a point before it
      setSelectedPointIndex(selectedPointIndex - 1);
    }
  };

  // Handle moving a point up in the list
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newPoints = [...points];
    const temp = newPoints[index];
    newPoints[index] = newPoints[index - 1];
    newPoints[index - 1] = temp;
    updatePoints(newPoints);
    // Update selection if needed
    if (selectedPointIndex === index) {
      setSelectedPointIndex(index - 1);
    } else if (selectedPointIndex === index - 1) {
      setSelectedPointIndex(index);
    }
  };

  // Handle moving a point down in the list
  const handleMoveDown = (index: number) => {
    if (index === points.length - 1) return;
    const newPoints = [...points];
    const temp = newPoints[index];
    newPoints[index] = newPoints[index + 1];
    newPoints[index + 1] = temp;
    updatePoints(newPoints);
    // Update selection if needed
    if (selectedPointIndex === index) {
      setSelectedPointIndex(index + 1);
    } else if (selectedPointIndex === index + 1) {
      setSelectedPointIndex(index);
    }
  };

  // Handle changing a point's latitude or longitude
  const handlePointChange = (index: number, key: 'lat' | 'lng', value: string) => {
    // 移除不必要的字符，只保留数字和小数点
    const cleanValue = value.replace(/[^\d.-]/g, '');
    
    // 尝试转换为数字
    const numValue = Number(cleanValue);
    
    // 检查是否是有效数字，如果无效则不更新
    if (isNaN(numValue)) return;
    
    // 验证坐标范围
    if (key === 'lat' && (numValue < -90 || numValue > 90)) return;
    if (key === 'lng' && (numValue < -180 || numValue > 180)) return;

    const newPoints = [...points];
    newPoints[index] = {
      ...newPoints[index],
      [key]: numValue
    };
    updatePoints(newPoints);
  };

  // Update the parent component with new points
  const updatePoints = (newPoints: RoutePoint[]) => {
    setPoints(newPoints);
    const routePointsStr = stringifyRoutePoints(newPoints);
    onChange(routePointsStr);

    // Calculate and update distance if callback provided
    if (onDistanceChange && newPoints.length > 1) {
      const distance = calculateRouteDistance(newPoints);
      onDistanceChange(distance);
    }
  };

  // Handle map click to add a new point
  const handleMapClick = (lat: number, lng: number) => {
    if (selectedPointIndex !== null) {
      // Update the selected point
      const newPoints = [...points];
      newPoints[selectedPointIndex] = { lat, lng };
      updatePoints(newPoints);
    } else {
      // Add a new point
      const newPoints = [...points, { lat, lng }];
      updatePoints(newPoints);
    }
  };

  // Handle route change from the map component
  const handleRouteChange = (routePointsStr: string) => {
    onChange(routePointsStr);
    const newPoints = parseRouteString(routePointsStr);
    setPoints(newPoints);
  };

  // Handle exporting route data
  const handleExportRoute = () => {
    const routeData = stringifyRoutePoints(points);
    navigator.clipboard.writeText(routeData).then(
      () => {
        message.success('路线数据已复制到剪贴板');
      },
      () => {
        message.error('复制失败，请手动复制');
      }
    );
  };

  // Handle importing route data
  const handleImportRoute = () => {
    try {
      const parsedPoints = parseRouteString(importValue);
      if (parsedPoints.length === 0) {
        message.error('路线数据无效，请检查格式');
        return;
      }
      
      if (parsedPoints.length === 1) {
        message.warning('只有一个点，无法形成路线，但已添加该点');
      } else {
        message.success('路线导入成功');
      }
      
      updatePoints(parsedPoints);
      setIsRouteImportVisible(false);
      setImportValue('');
    } catch (error) {
      message.error('路线数据格式错误');
    }
  };

  // Handle selecting a point for map editing
  const handleSelectPoint = (index: number) => {
    setSelectedPointIndex(selectedPointIndex === index ? null : index);
  };

  // Create a closed loop route
  const handleCreateClosedLoop = () => {
    if (points.length < 2) {
      message.warning('至少需要两个点才能创建闭环路线');
      return;
    }
    
    const closedLoopPoints = createClosedLoopRoute(points);
    updatePoints(closedLoopPoints);
    message.success('已创建闭环路线');
  };

  // 处理地图坐标显示格式
  const formatCoordinate = (value: number): string => {
    return value.toFixed(6);
  };

  // 添加坐标显示框
  const renderCoordinateInfo = () => {
    if (selectedPointIndex !== null && points[selectedPointIndex]) {
      const point = points[selectedPointIndex];
      return (
        <div className="p-2 bg-blue-50 rounded mb-2 text-xs">
          <div>当前选中点: <strong>{selectedPointIndex + 1}</strong></div>
          <div>纬度: <strong>{formatCoordinate(point.lat)}</strong></div>
          <div>经度: <strong>{formatCoordinate(point.lng)}</strong></div>
        </div>
      );
    }
    return null;
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      render: (_: any, __: any, index: number) => (
        <Button 
          type={selectedPointIndex === index ? 'primary' : 'text'}
          size="small"
          onClick={() => handleSelectPoint(index)}
        >
          {index + 1}
        </Button>
      )
    },
    {
      title: '纬度',
      dataIndex: 'lat',
      key: 'lat',
      render: (lat: number, _: any, index: number) => (
        <Input
          value={formatCoordinate(lat)}
          onChange={(e) => handlePointChange(index, 'lat', e.target.value)}
          onClick={() => setSelectedPointIndex(index)}
          style={{ width: '100%' }}
        />
      )
    },
    {
      title: '经度',
      dataIndex: 'lng',
      key: 'lng',
      render: (lng: number, _: any, index: number) => (
        <Input
          value={formatCoordinate(lng)}
          onChange={(e) => handlePointChange(index, 'lng', e.target.value)}
          onClick={() => setSelectedPointIndex(index)}
          style={{ width: '100%' }}
        />
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_: any, __: any, index: number) => (
        <Space size="small">
          <Button
            icon={<ArrowUpOutlined />}
            size="small"
            disabled={index === 0}
            onClick={() => handleMoveUp(index)}
          />
          <Button
            icon={<ArrowDownOutlined />}
            size="small"
            disabled={index === points.length - 1}
            onClick={() => handleMoveDown(index)}
          />
          <Button
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => handleDeletePoint(index)}
          />
        </Space>
      )
    }
  ];

  return (
    <div className="route-editor">
      <div className="mb-4">
        <Space>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAddPoint}
          >
            添加点
          </Button>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => setIsMapModalVisible(true)}
          >
            在地图上编辑
          </Button>
          <Tooltip title="导出路线数据">
            <Button
              icon={<ExportOutlined />}
              onClick={handleExportRoute}
              disabled={points.length === 0}
            />
          </Tooltip>
          <Tooltip title="导入路线数据">
            <Button
              icon={<ImportOutlined />}
              onClick={() => setIsRouteImportVisible(true)}
            />
          </Tooltip>
          <Tooltip title="创建闭环路线">
            <Button
              icon={<RetweetOutlined />}
              onClick={handleCreateClosedLoop}
              disabled={points.length < 2}
            />
          </Tooltip>
        </Space>
      </div>

      {points.length === 0 ? (
        <Empty 
          image={<EnvironmentOutlined style={{ fontSize: 48 }} />}
          description="暂无路线点，请点击添加点或在地图上编辑开始创建路线" 
        />
      ) : (
        <>
          <Table
            dataSource={points}
            columns={columns}
            rowKey={(record, index) => `${record.lat}-${record.lng}-${index}`}
            pagination={false}
            size="small"
            scroll={{ y: 300 }}
            rowClassName={(record, index) => 
              selectedPointIndex === index ? 'ant-table-row-selected' : ''
            }
          />

          {points.length > 1 && (
            <div className="mt-4 text-right">
              <div>
                总距离: <strong>{calculateRouteDistance(points).toFixed(2)}</strong> 公里
              </div>
            </div>
          )}
        </>
      )}

      <Modal
        title="地图编辑"
        open={isMapModalVisible}
        onCancel={() => {
          setIsMapModalVisible(false);
          setSelectedPointIndex(null);
        }}
        width={800}
        footer={[
          <Button key="close" onClick={() => {
            setIsMapModalVisible(false);
            setSelectedPointIndex(null);
          }}>
            关闭
          </Button>
        ]}
      >
        <div className="mb-3">
          <p className="text-sm text-gray-500">
            {selectedPointIndex !== null ? 
              `您正在编辑第 ${selectedPointIndex + 1} 个点，在地图上点击设置新位置` : 
              points.length === 0 ?
                '在地图上点击添加新的点开始创建路线' :
                '在地图上点击添加新的点，或拖动已有的点调整位置。'}
            <Tooltip title="点击表格中的序号可以选择要编辑的点">
              <InfoCircleOutlined style={{ marginLeft: '8px' }} />
            </Tooltip>
          </p>
          {renderCoordinateInfo()}
        </div>
        <div style={{ height: '500px' }}>
          <MapComponent
            routePoints={routePoints}
            trackColor={trackColor}
            trackWidth={trackWidth}
            apiKey={apiKey}
            securityJsCode={securityJsCode}
            onMapClick={handleMapClick}
            editable={true}
            onRouteChange={handleRouteChange}
            height={500}
            autoFit={points.length >= 2}
            center={selectedPointIndex !== null && points[selectedPointIndex] 
              ? { lng: points[selectedPointIndex].lng, lat: points[selectedPointIndex].lat }
              : MAP_CONFIG.DEFAULT_CENTER}
            selectedPointIndex={selectedPointIndex}
          />
        </div>
      </Modal>

      <Modal
        title="导入路线数据"
        open={isRouteImportVisible}
        onCancel={() => setIsRouteImportVisible(false)}
        onOk={handleImportRoute}
      >
        <div className="mb-3">
          <p className="text-sm text-gray-500">
            请输入路线数据，格式为：纬度,经度;纬度,经度;...
          </p>
        </div>
        <Input.TextArea
          rows={6}
          value={importValue}
          onChange={(e) => setImportValue(e.target.value)}
          placeholder="例如: 23.11054,113.32071;23.11089,113.32188;23.11146,113.32311"
        />
      </Modal>
    </div>
  );
};

export default RouteEditor; 