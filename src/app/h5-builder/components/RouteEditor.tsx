'use client';

import React, { useState, useEffect } from 'react';
import { Button, Table, Input, Space, Modal } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, DeleteOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { parseRouteString, stringifyRoutePoints, calculateRouteDistance, RoutePoint } from '../utils/mapService';
import MapComponent from './MapComponent';

interface RouteEditorProps {
  routePoints: string;
  trackColor?: string;
  trackWidth?: number;
  apiKey?: string;
  onChange: (routePoints: string) => void;
  onDistanceChange?: (distance: number) => void;
}

const RouteEditor: React.FC<RouteEditorProps> = ({
  routePoints,
  trackColor = '#2aab58',
  trackWidth = 4,
  apiKey = '',
  onChange,
  onDistanceChange
}) => {
  const [points, setPoints] = useState<RoutePoint[]>([]);
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);

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
    const lastPoint = newPoints.length > 0 ? newPoints[newPoints.length - 1] : { lat: 31.2304, lng: 121.4737 };
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
  };

  // Handle moving a point up in the list
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newPoints = [...points];
    const temp = newPoints[index];
    newPoints[index] = newPoints[index - 1];
    newPoints[index - 1] = temp;
    updatePoints(newPoints);
  };

  // Handle moving a point down in the list
  const handleMoveDown = (index: number) => {
    if (index === points.length - 1) return;
    const newPoints = [...points];
    const temp = newPoints[index];
    newPoints[index] = newPoints[index + 1];
    newPoints[index + 1] = temp;
    updatePoints(newPoints);
  };

  // Handle changing a point's latitude or longitude
  const handlePointChange = (index: number, key: 'lat' | 'lng', value: string) => {
    const numValue = Number(value);
    if (isNaN(numValue)) return;

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
    const newPoints = [...points, { lat, lng }];
    updatePoints(newPoints);
  };

  // Handle route change from the map component
  const handleRouteChange = (routePointsStr: string) => {
    onChange(routePointsStr);
    const newPoints = parseRouteString(routePointsStr);
    setPoints(newPoints);
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      render: (_: any, __: any, index: number) => index + 1
    },
    {
      title: '纬度',
      dataIndex: 'lat',
      key: 'lat',
      render: (lat: number, _: any, index: number) => (
        <Input
          value={lat}
          onChange={(e) => handlePointChange(index, 'lat', e.target.value)}
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
          value={lng}
          onChange={(e) => handlePointChange(index, 'lng', e.target.value)}
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
        </Space>
      </div>

      <Table
        dataSource={points}
        columns={columns}
        rowKey={(record, index) => `${record.lat}-${record.lng}-${index}`}
        pagination={false}
        size="small"
        scroll={{ y: 300 }}
      />

      {points.length > 1 && (
        <div className="mt-4 text-right">
          <div>
            总距离: <strong>{calculateRouteDistance(points).toFixed(2)}</strong> 公里
          </div>
        </div>
      )}

      <Modal
        title="地图编辑"
        open={isMapModalVisible}
        onCancel={() => setIsMapModalVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setIsMapModalVisible(false)}>
            关闭
          </Button>
        ]}
      >
        <div className="mb-3">
          <p className="text-sm text-gray-500">在地图上点击添加新的点，或拖动已有的点调整位置。</p>
        </div>
        <div style={{ height: '500px' }}>
          <MapComponent
            apiKey={apiKey}
            routePoints={routePoints}
            trackColor={trackColor}
            trackWidth={trackWidth}
            height="500px"
            editable={true}
            onMapClick={handleMapClick}
            onRouteChange={handleRouteChange}
          />
        </div>
      </Modal>
    </div>
  );
};

export default RouteEditor; 