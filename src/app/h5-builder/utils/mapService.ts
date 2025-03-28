/**
 * Map Service Utility
 * Provides functions for working with maps and routes in the WorkoutResult component.
 */

// 轨迹点类型定义
export interface RoutePoint {
  lat: number;
  lng: number;
}

// 默认轨迹点
export const DEFAULT_ROUTE_POINTS: RoutePoint[] = [
  { lat: 31.033, lng: 121.211 }, // 起点
  { lat: 31.036, lng: 121.214 },
  { lat: 31.038, lng: 121.219 },
  { lat: 31.042, lng: 121.223 },
  { lat: 31.046, lng: 121.227 },
  { lat: 31.049, lng: 121.230 },
  { lat: 31.053, lng: 121.229 },
  { lat: 31.056, lng: 121.226 },
  { lat: 31.058, lng: 121.221 },
  { lat: 31.055, lng: 121.218 },
  { lat: 31.051, lng: 121.215 },
  { lat: 31.047, lng: 121.211 },
  { lat: 31.042, lng: 121.208 },
  { lat: 31.037, lng: 121.208 },
  { lat: 31.033, lng: 121.211 }, // 终点 (回到起点)
];

// 将轨迹字符串转换为轨迹点数组
export const parseRouteString = (routeString: string): RoutePoint[] => {
  if (!routeString) return DEFAULT_ROUTE_POINTS;
  
  try {
    const points = routeString.split(';').map(point => {
      const [lat, lng] = point.split(',').map(Number);
      return { lat, lng };
    });
    
    // 验证点是否有效
    if (points.length < 2 || points.some(p => isNaN(p.lat) || isNaN(p.lng))) {
      console.warn('Invalid route points, using default route');
      return DEFAULT_ROUTE_POINTS;
    }
    
    return points;
  } catch (error) {
    console.error('Error parsing route string:', error);
    return DEFAULT_ROUTE_POINTS;
  }
};

// 将轨迹点数组转换为字符串
export const stringifyRoutePoints = (points: RoutePoint[]): string => {
  return points.map(p => `${p.lat},${p.lng}`).join(';');
};

// 计算轨迹长度（公里）
export const calculateRouteDistance = (points: RoutePoint[]): number => {
  let distance = 0;
  
  for (let i = 0; i < points.length - 1; i++) {
    distance += calculateDistance(points[i], points[i + 1]);
  }
  
  return parseFloat(distance.toFixed(2));
};

// 计算两点之间的距离（公里）
const calculateDistance = (point1: RoutePoint, point2: RoutePoint): number => {
  const R = 6371; // 地球半径（公里）
  const dLat = deg2rad(point2.lat - point1.lat);
  const dLng = deg2rad(point2.lng - point1.lng);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(point1.lat)) * Math.cos(deg2rad(point2.lat)) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance;
};

// 将角度转换为弧度
const deg2rad = (deg: number): number => {
  return deg * (Math.PI/180);
};

// 获取轨迹的边界框
export const getRouteBounds = (points: RoutePoint[]): {
  north: number;
  south: number;
  east: number;
  west: number;
} => {
  let minLat = points[0].lat;
  let maxLat = points[0].lat;
  let minLng = points[0].lng;
  let maxLng = points[0].lng;
  
  points.forEach(point => {
    minLat = Math.min(minLat, point.lat);
    maxLat = Math.max(maxLat, point.lat);
    minLng = Math.min(minLng, point.lng);
    maxLng = Math.max(maxLng, point.lng);
  });
  
  return {
    north: maxLat,
    south: minLat,
    east: maxLng,
    west: minLng
  };
};

// 生成SVG路径
export const generateSvgPath = (points: RoutePoint[], width: number, height: number): string => {
  if (points.length < 2) return '';
  
  const bounds = getRouteBounds(points);
  const padding = 0.1; // 10% padding
  
  // 计算宽高比例
  const latRange = (bounds.north - bounds.south) * (1 + padding * 2);
  const lngRange = (bounds.east - bounds.west) * (1 + padding * 2);
  
  // 添加padding
  const paddedSouth = bounds.south - latRange * padding / 2;
  const paddedWest = bounds.west - lngRange * padding / 2;
  
  // 转换点到SVG坐标
  const svgPoints = points.map(point => {
    const x = ((point.lng - paddedWest) / lngRange) * width;
    // 注意Y轴是反的
    const y = height - ((point.lat - paddedSouth) / latRange) * height;
    return { x, y };
  });
  
  // 构建SVG路径
  let path = `M${svgPoints[0].x},${svgPoints[0].y}`;
  
  for (let i = 1; i < svgPoints.length; i++) {
    path += ` L${svgPoints[i].x},${svgPoints[i].y}`;
  }
  
  return path;
}; 