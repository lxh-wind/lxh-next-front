'use client';

import React, { useEffect, useRef, useState } from 'react';
import { parseRouteString, stringifyRoutePoints } from '../utils/mapService';

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
}

const MapComponent: React.FC<MapComponentProps> = ({
  apiKey = '',
  securityJsCode = '',
  routePoints,
  trackColor = '#2aab58',
  trackWidth = 4,
  zoom = 14,
  width = '100%',
  height = '100%',
  onMapClick,
  editable = false,
  onRouteChange
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!apiKey) {
      setError('需要高德地图 API Key');
      return;
    }

    const loadAMapScript = () => {
      // 设置安全密钥
      if (securityJsCode) {
        window._AMapSecurityConfig = {
          securityJsCode: securityJsCode
        };
      }

      // 检查是否已经加载AMap
      if (window.AMap) {
        initMap();
        return;
      }

      // 加载高德地图脚本
      const script = document.createElement('script');
      script.src = `https://webapi.amap.com/maps?v=2.0&key=${apiKey}&plugin=AMap.ToolBar,AMap.Scale`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setMapLoaded(true);
        initMap();
      };
      script.onerror = () => {
        setError('加载高德地图API失败');
      };
      document.head.appendChild(script);
    };

    loadAMapScript();

    return () => {
      // 清理地图实例
      if (mapInstance.current) {
        mapInstance.current.destroy();
        mapInstance.current = null;
      }
    };
  }, [apiKey, securityJsCode]);

  const initMap = () => {
    if (!mapRef.current || !window.AMap) return;

    try {
      // 创建地图实例
      const map = new window.AMap.Map(mapRef.current, {
        zoom: zoom,
        resizeEnable: true,
        viewMode: '2D'
      });

      // 添加控件
      map.addControl(new window.AMap.ToolBar());
      map.addControl(new window.AMap.Scale());

      // 解析路径点
      const points = parseRouteString(routePoints);
      if (points.length < 2) {
        setError('路径点不足，无法显示路线');
        return;
      }

      // 计算地图中心点和缩放级别
      const bounds = new window.AMap.Bounds();
      const path = points.map((point) => {
        const aMapPoint = new window.AMap.LngLat(point.lng, point.lat);
        bounds.extend(aMapPoint);
        return aMapPoint;
      });

      // 设置地图视野
      map.setBounds(bounds, false, [30, 30, 30, 30]);

      // 创建折线
      const polyline = new window.AMap.Polyline({
        path: path,
        strokeColor: trackColor,
        strokeWeight: trackWidth,
        strokeStyle: 'solid',
        strokeOpacity: 1,
        zIndex: 50,
        showDir: true
      });

      // 将折线添加到地图
      map.add(polyline);

      // 添加起点和终点标记
      if (points.length >= 2) {
        // 起点标记
        const startMarker = new window.AMap.Marker({
          position: new window.AMap.LngLat(points[0].lng, points[0].lat),
          title: '起点',
          icon: new window.AMap.Icon({
            size: new window.AMap.Size(24, 24),
            image: 'https://a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
            imageSize: new window.AMap.Size(48, 48),
            imageOffset: new window.AMap.Pixel(0, 0)
          }),
          offset: new window.AMap.Pixel(-12, -12),
          draggable: editable,
          zIndex: 100
        });

        // 终点标记
        const endMarker = new window.AMap.Marker({
          position: new window.AMap.LngLat(points[points.length - 1].lng, points[points.length - 1].lat),
          title: '终点',
          icon: new window.AMap.Icon({
            size: new window.AMap.Size(24, 24),
            image: 'https://a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
            imageSize: new window.AMap.Size(48, 48),
            imageOffset: new window.AMap.Pixel(24, 0)
          }),
          offset: new window.AMap.Pixel(-12, -12),
          draggable: editable,
          zIndex: 100
        });

        map.add([startMarker, endMarker]);

        // 拖拽事件
        if (editable) {
          startMarker.on('dragend', (event: any) => {
            const position = event.target.getPosition();
            points[0] = { lat: position.getLat(), lng: position.getLng() };
            polyline.setPath(path);
            if (onRouteChange) {
              onRouteChange(stringifyRoutePoints(points));
            }
          });

          endMarker.on('dragend', (event: any) => {
            const position = event.target.getPosition();
            points[points.length - 1] = { lat: position.getLat(), lng: position.getLng() };
            polyline.setPath(path);
            if (onRouteChange) {
              onRouteChange(stringifyRoutePoints(points));
            }
          });
        }
      }

      // 地图点击事件
      if (onMapClick) {
        map.on('click', (event: any) => {
          const lngLat = event.lnglat;
          onMapClick(lngLat.getLat(), lngLat.getLng());
        });
      }

      mapInstance.current = map;
    } catch (err) {
      setError('初始化地图失败');
      console.error('Map initialization error:', err);
    }
  };

  // 当路径点更新时重新绘制
  useEffect(() => {
    if (mapInstance.current && mapLoaded) {
      // 清理之前的叠加物
      mapInstance.current.clearMap();

      // 重新绘制路径
      const points = parseRouteString(routePoints);
      if (points.length >= 2) {
        const path = points.map(point => new window.AMap.LngLat(point.lng, point.lat));
        
        // 创建折线
        const polyline = new window.AMap.Polyline({
          path: path,
          strokeColor: trackColor,
          strokeWeight: trackWidth,
          strokeStyle: 'solid',
          strokeOpacity: 1,
          zIndex: 50,
          showDir: true
        });

        // 添加到地图
        mapInstance.current.add(polyline);

        // 添加起点和终点标记
        const startMarker = new window.AMap.Marker({
          position: new window.AMap.LngLat(points[0].lng, points[0].lat),
          title: '起点',
          icon: new window.AMap.Icon({
            size: new window.AMap.Size(24, 24),
            image: 'https://a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
            imageSize: new window.AMap.Size(48, 48),
            imageOffset: new window.AMap.Pixel(0, 0)
          }),
          offset: new window.AMap.Pixel(-12, -12),
          draggable: editable,
          zIndex: 100
        });

        const endMarker = new window.AMap.Marker({
          position: new window.AMap.LngLat(points[points.length - 1].lng, points[points.length - 1].lat),
          title: '终点',
          icon: new window.AMap.Icon({
            size: new window.AMap.Size(24, 24),
            image: 'https://a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
            imageSize: new window.AMap.Size(48, 48),
            imageOffset: new window.AMap.Pixel(24, 0)
          }),
          offset: new window.AMap.Pixel(-12, -12),
          draggable: editable,
          zIndex: 100
        });

        mapInstance.current.add([startMarker, endMarker]);

        // 调整视野
        const bounds = new window.AMap.Bounds();
        path.forEach(point => bounds.extend(point));
        mapInstance.current.setBounds(bounds, false, [30, 30, 30, 30]);
      }
    }
  }, [routePoints, trackColor, trackWidth, editable, mapLoaded]);

  return (
    <div style={{ width, height, position: 'relative' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
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