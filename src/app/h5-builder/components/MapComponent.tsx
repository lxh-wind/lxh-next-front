'use client';

import React, { useEffect, useRef, useState } from 'react';
import { parseRouteString, stringifyRoutePoints, getRouteBounds } from '../utils/mapService';
import AMapLoader from '@amap/amap-jsapi-loader';
import { MAP_CONFIG } from '../config/mapConfig';

declare global {
  interface Window {
    AMap: any;
    _AMapSecurityConfig: {
      securityJsCode: string;
    };
  }
}

interface MapComponentProps {
  apiKey?: string;
  securityJsCode?: string;
  routePoints: string;
  trackColor?: string;
  trackWidth?: number;
  zoom?: number;
  width?: string | number;
  height?: string | number;
  onMapClick?: (lat: number, lng: number) => void;
  editable?: boolean;
  onRouteChange?: (routePoints: string) => void;
  center?: { lng: number; lat: number };
  showDecoration?: boolean;
  decorationType?: string;
  autoFit?: boolean;
  selectedPointIndex?: number | null;
}

const MapComponent: React.FC<MapComponentProps> = ({
  apiKey = MAP_CONFIG.API_KEY,
  securityJsCode = MAP_CONFIG.SECURITY_JS_CODE,
  routePoints = '',
  trackColor = '#2aab58',
  trackWidth = 4,
  zoom = MAP_CONFIG.DEFAULT_ZOOM,
  width = '100%',
  height = '100%',
  onMapClick,
  editable = false,
  onRouteChange,
  center = MAP_CONFIG.DEFAULT_CENTER,
  showDecoration = false,
  decorationType = 'christmas',
  autoFit = false,
  selectedPointIndex
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const AMapRef = useRef<any>(null);
  const [isAMapLoaded, setIsAMapLoaded] = useState(false);
  const [hoverCoordinates, setHoverCoordinates] = useState<{lat: string, lng: string} | null>(null);

  // 加载AMap JS API
  useEffect(() => {
    if (!apiKey) {
      setError('需要高德地图 API Key');
      return;
    }

    if (isAMapLoaded) return;

    // 设置安全密钥
    if (securityJsCode) {
      window._AMapSecurityConfig = {
        securityJsCode: securityJsCode
      };
    }

    // 加载高德地图API
    AMapLoader.load({
      key: apiKey,
      version: '2.0',
      plugins: ['AMap.ToolBar', 'AMap.Scale']
    }).then(AMap => {
      AMapRef.current = AMap;
      setIsAMapLoaded(true);
      console.log("高德地图API加载成功");
    }).catch(e => {
      console.error('加载高德地图失败:', e);
      setError('加载高德地图API失败');
    });

    // 组件卸载时清理
    return () => {
      // 只清理AMap引用，不销毁地图实例
      // 地图实例在其他useEffect中销毁
    };
  }, [apiKey, securityJsCode]);

  // 初始化或重新初始化地图
  useEffect(() => {
    if (!isAMapLoaded || !AMapRef.current || !mapRef.current) return;

    console.log("初始化地图，中心点:", center.lng, center.lat, "缩放级别:", zoom);

    // 销毁旧实例
    if (mapInstance.current) {
      console.log("销毁旧地图实例");
      mapInstance.current.destroy();
      mapInstance.current = null;
      setMapLoaded(false);
    }

    try {
      // 创建新地图实例 - 使用固定的初始值，后面再设置实际值
      const map = new AMapRef.current.Map(mapRef.current, {
        viewMode: '2D',
        resizeEnable: true,
        center: new AMapRef.current.LngLat(center.lng, center.lat),
        zoom: zoom
      });

      // 添加控件
      map.addControl(new AMapRef.current.ToolBar());
      map.addControl(new AMapRef.current.Scale());

      // 地图点击事件
      if (onMapClick) {
        map.on('click', (event: any) => {
          const lngLat = event.lnglat;
          onMapClick(lngLat.getLat(), lngLat.getLng());
        });
      }

      // 添加鼠标移动事件，显示坐标
      if (editable) {
        map.on('mousemove', (event: any) => {
          const lngLat = event.lnglat;
          setHoverCoordinates({
            lat: lngLat.getLat().toFixed(6),
            lng: lngLat.getLng().toFixed(6)
          });
        });
        
        map.on('mouseout', () => {
          setHoverCoordinates(null);
        });
      }

      // 保存地图实例引用
      mapInstance.current = map;
      setMapLoaded(true);
      console.log("地图初始化完成，已设置中心点:", center.lng, center.lat, "缩放级别:", zoom);
    } catch (e) {
      console.error('初始化地图实例失败:', e);
      setError('初始化地图失败');
    }

    // 组件卸载时清理
    return () => {
      if (mapInstance.current) {
        console.log("销毁地图实例");
        mapInstance.current.destroy();
        mapInstance.current = null;
      }
    };
  }, [isAMapLoaded]); // 只在AMap加载完成时初始化地图，不再依赖center和zoom

  // 当center或zoom变化时更新地图视图，而不是重新创建
  useEffect(() => {
    if (!mapLoaded || !mapInstance.current) return;
    
    try {
      // 仅更新地图中心点和缩放级别，不会刷新整个地图
      mapInstance.current.setCenter([center.lng, center.lat]);
      mapInstance.current.setZoom(zoom);
      console.log("更新地图中心点:", center.lng, center.lat, "缩放级别:", zoom);
    } catch (e) {
      console.error('更新地图视图失败:', e);
    }
  }, [center.lng, center.lat, zoom, mapLoaded]);

  // 当地图点击和编辑状态变化时，更新事件监听
  useEffect(() => {
    if (!mapLoaded || !mapInstance.current) return;
    
    // 清除所有相关事件
    mapInstance.current.clearEvents('click');
    mapInstance.current.clearEvents('mousemove');
    mapInstance.current.clearEvents('mouseout');
    
    // 重新添加点击事件
    if (onMapClick) {
      mapInstance.current.on('click', (event: any) => {
        const lngLat = event.lnglat;
        onMapClick(lngLat.getLat(), lngLat.getLng());
      });
    }
    
    // 添加鼠标移动事件，显示坐标
    if (editable) {
      mapInstance.current.on('mousemove', (event: any) => {
        const lngLat = event.lnglat;
        setHoverCoordinates({
          lat: lngLat.getLat().toFixed(6),
          lng: lngLat.getLng().toFixed(6)
        });
      });
      
      mapInstance.current.on('mouseout', () => {
        setHoverCoordinates(null);
      });
    } else {
      setHoverCoordinates(null);
    }
    
    console.log("已更新地图事件处理函数");
  }, [onMapClick, editable, mapLoaded]);

  // 监听路线相关属性变化，更新路线
  useEffect(() => {
    if (!mapLoaded || !mapInstance.current) return;
    console.log("更新路线");
    updateMapRoute();
  }, [routePoints, trackColor, trackWidth, editable, showDecoration, decorationType, selectedPointIndex, mapLoaded]);

  // Add midpoint markers for drag and drop if editable
  useEffect(() => {
    if (!mapLoaded || !mapInstance.current || !AMapRef.current || !editable) return;
    
    // Function to add midpoint markers runs as part of updateMapRoute
  }, [mapLoaded, editable]);

  // 创建或更新地图上的路线和标记
  const updateMapRoute = () => {
    if (!mapInstance.current || !AMapRef.current) {
      console.log("无法更新路线：地图实例或AMap引用不存在");
      return;
    }

    // 清理之前的叠加物，但保持地图视图不变
    mapInstance.current.clearMap();
    console.log("正在更新路线:", routePoints);

    // 解析路径点
    const points = parseRouteString(routePoints);
    
    // 如果没有路径点或只有一个点，只显示地图不显示路线
    if (points.length < 2) {
      // 只有一个点时，可以添加一个标记
      if (points.length === 1) {
        const marker = new AMapRef.current.Marker({
          position: new AMapRef.current.LngLat(points[0].lng, points[0].lat),
          title: '位置点',
          icon: new AMapRef.current.Icon({
            size: new AMapRef.current.Size(16, 16),
            image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
            imageSize: new AMapRef.current.Size(16, 16)
          }),
          offset: new AMapRef.current.Pixel(-8, -8),
          draggable: editable,
          zIndex: 100,
          label: {
            content: "1",
            direction: 'top'
          }
        });
        
        if (editable) {
          marker.on('dragend', function(event: { target: any }) {
            const position = event.target.getPosition();
            const newPoints = [{
              lat: position.getLat(),
              lng: position.getLng()
            }];
            
            if (onRouteChange) {
              onRouteChange(stringifyRoutePoints(newPoints));
            }
          });
        }
        
        mapInstance.current.add(marker);
      }
      return;
    }

    // 计算路径
    const path = points.map((point) => {
      return new AMapRef.current.LngLat(point.lng, point.lat);
    });

    // 创建折线
    const polyline = new AMapRef.current.Polyline({
      path: path,
      strokeColor: trackColor,
      strokeWeight: trackWidth,
      strokeStyle: 'solid',
      strokeOpacity: 1,
      zIndex: 50,
      showDir: false,
      lineJoin: 'round',
      lineCap: 'round'
    });

    // 将折线添加到地图
    mapInstance.current.add(polyline);

    // 添加节日装饰(如果需要)
    if (showDecoration && decorationType) {
      console.log("添加装饰，类型:", decorationType);
      try {
        // 从路径点中挑选一些关键点添加装饰
        const decorationPoints = [
          points[0], // 起点
          points[Math.floor(points.length / 4)], // 路线1/4处
          points[Math.floor(points.length / 2)], // 路线中点
          points[Math.floor(points.length * 3 / 4)], // 路线3/4处
          points[points.length - 1] // 终点
        ];
        
        // 添加装饰图标
        decorationPoints.forEach((point, index) => {
          // 根据decorationType选择图标
          let iconUrl = '';
          if (decorationType === 'christmas') {
            // 交替使用圣诞树和雪人图标
            iconUrl = index % 2 === 0 
              ? 'https://a.amap.com/jsapi_demos/static/demo-center/icons/christmas-tree.png' 
              : 'https://a.amap.com/jsapi_demos/static/demo-center/icons/snowman.png';
          } else if (decorationType === 'newyear') {
            iconUrl = 'https://a.amap.com/jsapi_demos/static/demo-center/icons/gift.png';
          }
          
          console.log(`添加装饰图标 ${index+1}/${decorationPoints.length}:`, iconUrl);
          
          if (iconUrl) {
            const icon = new AMapRef.current.Icon({
              size: new AMapRef.current.Size(32, 32),
              image: iconUrl,
              imageSize: new AMapRef.current.Size(32, 32)
            });
            
            const decorationMarker = new AMapRef.current.Marker({
              position: new AMapRef.current.LngLat(point.lng, point.lat),
              icon: icon,
              offset: new AMapRef.current.Pixel(-16, -16),
              zIndex: 110
            });
            
            mapInstance.current.add(decorationMarker);
          }
        });
      } catch (e) {
        console.error("添加装饰失败:", e);
      }
    }

    // 添加路径上的所有点的标记
    if (editable) {
      // 为所有点创建可拖拽标记
      points.forEach((point, index) => {
        const isSelectedPoint = selectedPointIndex === index;
        
        // 选择合适的图标
        let icon;
        if (isSelectedPoint) {
          // 选中的点使用特殊图标
          icon = new AMapRef.current.Icon({
            size: new AMapRef.current.Size(24, 24),
            image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_bs.png',
            imageSize: new AMapRef.current.Size(24, 24)
          });
        } else {
          // 普通标记点
          icon = new AMapRef.current.Icon({
            size: new AMapRef.current.Size(16, 16),
            image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
            imageSize: new AMapRef.current.Size(16, 16)
          });
        }
        
        // 创建标记
        const marker = new AMapRef.current.Marker({
          position: new AMapRef.current.LngLat(point.lng, point.lat),
          icon: icon,
          offset: isSelectedPoint 
            ? new AMapRef.current.Pixel(-12, -12) 
            : new AMapRef.current.Pixel(-8, -8),
          draggable: true,
          cursor: 'move',
          zIndex: isSelectedPoint ? 200 : 100,
          label: {
            content: `${index + 1}`,
            direction: 'top'
          },
          animation: isSelectedPoint ? 'AMAP_ANIMATION_BOUNCE' : undefined
        });
        
        // 添加拖拽事件
        marker.on('dragend', function(event: { target: any }) {
          const position = event.target.getPosition();
          const newPoints = [...points];
          newPoints[index] = { 
            lat: position.getLat(), 
            lng: position.getLng() 
          };
          
          // 更新路线
          if (onRouteChange) {
            onRouteChange(stringifyRoutePoints(newPoints));
          }
        });
        
        mapInstance.current.add(marker);
      });
      
      // 如果点数量>=2，添加中间点（允许在两点之间添加新点）
      if (points.length >= 2) {
        for (let i = 0; i < points.length - 1; i++) {
          const startPoint = points[i];
          const endPoint = points[i + 1];
          
          // 计算中间点位置
          const midLat = (startPoint.lat + endPoint.lat) / 2;
          const midLng = (startPoint.lng + endPoint.lng) / 2;
          
          // 为中间点创建标记
          const midIcon = new AMapRef.current.Icon({
            size: new AMapRef.current.Size(12, 12),
            image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png',
            imageSize: new AMapRef.current.Size(12, 12)
          });
          
          const midMarker = new AMapRef.current.Marker({
            position: new AMapRef.current.LngLat(midLng, midLat),
            icon: midIcon,
            offset: new AMapRef.current.Pixel(-6, -6),
            draggable: true,
            cursor: 'pointer',
            zIndex: 90
          });
          
          // 添加拖拽事件 - 插入新点
          midMarker.on('dragend', function(event: { target: any }) {
            const position = event.target.getPosition();
            const newPoints = [...points];
            
            // 在i和i+1之间插入新点
            newPoints.splice(i + 1, 0, { 
              lat: position.getLat(), 
              lng: position.getLng() 
            });
            
            // 更新路线
            if (onRouteChange) {
              onRouteChange(stringifyRoutePoints(newPoints));
            }
          });
          
          mapInstance.current.add(midMarker);
        }
      }
    } else {
      // 非编辑模式下，只添加路线，不添加起点和终点标记
      // 路线已经在之前添加了，这里不需要再添加额外的标记
    }

    // 在处理完路线和标记后，仅在autoFit为true时才自动调整视图
    if (autoFit && points.length >= 2) {
      try {
        // 创建边界对象
        const bounds = getRouteBounds(points);
        // 使用边界进行视图适配
        mapInstance.current.setBounds([
          new AMapRef.current.LngLat(bounds.west, bounds.south),
          new AMapRef.current.LngLat(bounds.east, bounds.north)
        ], false, [50, 50, 50, 50]); // 添加内边距
        console.log("已自动适配路线视图");
      } catch (e) {
        console.error("自动适配视图失败:", e);
      }
    }
  };

  return (
    <div style={{ width, height, position: 'relative' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
      {hoverCoordinates && editable && (
        <div style={{ 
          position: 'absolute', 
          bottom: 10, 
          left: 10, 
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'monospace',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
          zIndex: 1000
        }}>
          纬度: {hoverCoordinates.lat}, 经度: {hoverCoordinates.lng}
        </div>
      )}
      {error && (
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          color: '#f5222d',
          padding: '10px',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default MapComponent; 