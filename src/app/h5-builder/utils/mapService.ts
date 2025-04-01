/**
 * Map Service Utility
 * Provides functions for working with maps and routes in the WorkoutResult component.
 */

// 轨迹点类型定义
export interface RoutePoint {
  lat: number;
  lng: number;
}

// 确保仅在浏览器环境中运行相关代码
const isBrowser = typeof window !== 'undefined';

// 安全地记录控制台消息
const safeConsoleLog = (message: string, ...args: any[]) => {
  if (isBrowser) {
    console.log(message, ...args);
  }
};

const safeConsoleWarn = (message: string, ...args: any[]) => {
  if (isBrowser) {
    console.warn(message, ...args);
  }
};

const safeConsoleError = (message: string, error?: any) => {
  if (isBrowser) {
    console.error(message, error);
  }
};

// 将轨迹字符串转换为轨迹点数组
export const parseRouteString = (routeString: string): RoutePoint[] => {
  if (!routeString) return [];
  
  try {
    const points = routeString.split(';').map(point => {
      const [lat, lng] = point.split(',').map(Number);
      return { lat, lng };
    });
    
    // 验证点是否有效
    if (points.length < 2 || points.some(p => isNaN(p.lat) || isNaN(p.lng))) {
      safeConsoleWarn('Invalid route points, returning empty array');
      return [];
    }
    
    return points;
  } catch (error) {
    safeConsoleError('Error parsing route string:', error);
    return [];
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

// 寻找最近的路线点
export const findNearestRoutePoint = (
  point: RoutePoint, 
  routePoints: RoutePoint[], 
  maxDistanceKm: number = 0.2
): { index: number; point: RoutePoint; distance: number } | null => {
  if (!routePoints || routePoints.length === 0) {
    return null;
  }

  let nearestIndex = -1;
  let nearestDistance = Infinity;

  // 找到距离最近的路线点
  for (let i = 0; i < routePoints.length; i++) {
    const distance = calculateDistance(point, routePoints[i]);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = i;
    }
  }

  // 如果最近的点超出了最大距离，返回null
  if (nearestDistance > maxDistanceKm || nearestIndex === -1) {
    return null;
  }

  return {
    index: nearestIndex,
    point: routePoints[nearestIndex],
    distance: nearestDistance
  };
};

// 自动连接到现有路线
export const connectToNearbyRoute = (
  startPoint: RoutePoint,
  endPoint: RoutePoint,
  existingRoute: RoutePoint[],
  maxDistanceKm: number = 0.2
): RoutePoint[] => {
  // 找到起点和终点最近的路线点
  const nearestStart = findNearestRoutePoint(startPoint, existingRoute, maxDistanceKm);
  const nearestEnd = findNearestRoutePoint(endPoint, existingRoute, maxDistanceKm);

  if (!nearestStart || !nearestEnd) {
    // 如果起点或终点没有足够近的点，返回原始点
    return [startPoint, endPoint];
  }

  // 确定两个点的顺序
  const [lowerIndex, higherIndex] = 
    nearestStart.index < nearestEnd.index 
      ? [nearestStart.index, nearestEnd.index]
      : [nearestEnd.index, nearestStart.index];

  // 提取既有路线中的段落
  const segmentPoints = existingRoute.slice(lowerIndex, higherIndex + 1);

  // 如果起点索引大于终点索引，需要反转
  return nearestStart.index > nearestEnd.index
    ? segmentPoints.reverse()
    : segmentPoints;
};

// 自动构建闭环路线（确保起点和终点是同一点）
export const createClosedLoopRoute = (points: RoutePoint[]): RoutePoint[] => {
  if (points.length < 2) return points;

  const newPoints = [...points];
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];

  // 计算第一个点和最后一个点之间的距离
  const distance = calculateDistance(firstPoint, lastPoint);

  // 如果距离已经很小，直接让最后一个点等于第一个点
  if (distance < 0.02) { // 小于20米
    newPoints[newPoints.length - 1] = { ...firstPoint };
  } else {
    // 否则添加第一个点作为终点
    newPoints.push({ ...firstPoint });
  }

  return newPoints;
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