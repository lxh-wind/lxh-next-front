'use client';

import React, { useState } from 'react';
import { ComponentType } from '../../components/types';
import { ArrowLeftOutlined, LockOutlined, ShareAltOutlined, MoreOutlined, FullscreenOutlined, CameraOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { parseRouteString, generateSvgPath, calculateRouteDistance } from '../../utils/mapService';
import MapComponent from '../../components/MapComponent';


interface WorkoutResultProps {
  component: ComponentType;
}

export const WorkoutResultComponent: React.FC<WorkoutResultProps> = ({ component }) => {
  const {
    title = '户外跑步',
    distance = 10.00,
    unit = '公里',
    time = 65, // 1小时5分钟 (平均配速6.5分钟/公里)
    calories = 850, // 根据10公里距离调整
    caloriesUnit = '千卡',
    pace = 6.5, // 6分30秒/公里
    steps = 8500, // 根据10公里距离调整
    stepsUnit = '步',
    energy = 35,
    areaName = '广州天河区',
    extraText = '已超越75%的跑步用户',
    mapTrackColor = '#4caf50',
    mapTrackWidth = 4,
    mapImage = 'https://mdn.alipayobjects.com/huamei_n0yi1n/afts/img/A*9Kf4SJA4XvMAAAAAAAAAAAAADrB8AQ/original',
    showBadge = true,
    shareButtonText = '分享到社区',
    avatar = 'https://randomuser.me/api/portraits/men/32.jpg',
    username = '来自未来的哦哟',
    isPrivate = true,
    useRealMap = true,
    mapApiKey = '7798b1134a46a58dbf25d7235afeaeba',
    mapSecurityJsCode = '1280315c2614cae0726cb81bd60bf429',
    mapZoom = 14,
    routePoints = '23.11056,113.30167;23.11122,113.30303;23.11239,113.30378;23.11384,113.30393;23.11488,113.30301;23.11511,113.30187;23.11456,113.30091;23.11362,113.30024;23.11241,113.29991;23.11135,113.30042;23.11071,113.30119;23.11056,113.30167',
    badgeType = 'medal',
    customBadgeImage = '',
    badgeText = '完成5公里',
    mapCenter = { lng: 113.23587, lat: 23.09857 },
    showDecoration = false,
    decorationType = 'christmas'
  } = component.props as any; // Use type assertion to fix property access errors

  // State for showing map edit tooltip
  const [showMapEdit, setShowMapEdit] = useState(false);
  
  const handleMapClick = () => {
    setShowMapEdit(prev => !prev);
    setTimeout(() => {
      setShowMapEdit(false);
    }, 2000);
  };

  // Format the pace (min:sec per km)
  const formatPace = (pace: number) => {
    const min = Math.floor(pace);
    const sec = Math.round((pace - min) * 60);
    return `${min}'${sec.toString().padStart(2, '0')}"`;
  };

  // Format time (minutes to HH:MM:SS)
  const formatTime = (timeInMinutes: number) => {
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = Math.floor(timeInMinutes % 60);
    const seconds = Math.round((timeInMinutes * 60) % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Parse route points
  const parsedRoutePoints = parseRouteString(routePoints);
  
  // Generate SVG path for static map
  const svgPath = generateSvgPath(parsedRoutePoints, 1000, 1000);

  // Calculate distance from route points if using real maps
  let displayDistance = distance;
  if (useRealMap && parsedRoutePoints.length > 1) {
    const calculatedDistance = calculateRouteDistance(parsedRoutePoints);
    if (calculatedDistance > 0) {
      displayDistance = calculatedDistance;
    }
  }

  // Determine badge image based on type
  let badgeImage = '';
  if (showBadge) {
    if (badgeType === 'medal') {
      badgeImage = '/medal-badge.png';
    } else if (badgeType === 'christmas') {
      badgeImage = '/christmas-badge.png';
    } else if (badgeType === 'newyear') {
      badgeImage = '/newyear-badge.png';
    } else if (badgeType === 'custom') {
      badgeImage = customBadgeImage;
    }
  }

  // Ensure pace is a number
  const paceValue = typeof pace === 'string' ? parseFloat(pace) : pace;

  return (
    <div className="workout-result-component bg-gray-50">
      {/* iPhone Status Bar */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-white h-[44px] px-5 flex items-center justify-between">
        <div className="flex-1 flex items-center">
          <div className="text-black text-[16px] font-medium tracking-tight">15:33</div>
        </div>
        <div className="flex items-center gap-1">
          <div className="flex items-center h-4">
            <div className="flex gap-[1px] items-end h-[10px] pt-0.5">
              <div className="w-[3px] h-[4px] bg-black rounded-sm"></div>
              <div className="w-[3px] h-[6px] bg-black rounded-sm"></div>
              <div className="w-[3px] h-[8px] bg-black rounded-sm"></div>
              <div className="w-[3px] h-[10px] bg-black rounded-sm"></div>
            </div>
          </div>
          <div className="ml-1">
            <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
              <path d="M7.5 2.5C9.75 2.5 11.75 3.5 13 5L14.5 3C12.75 1 10.25 0 7.5 0C4.75 0 2.25 1 0.5 3L2 5C3.25 3.5 5.25 2.5 7.5 2.5Z" fill="black"/>
              <path d="M7.5 7.5C8.75 7.5 9.75 8 10.5 9L12 7C10.75 5.75 9.25 5 7.5 5C5.75 5 4.25 5.75 3 7L4.5 9C5.25 8 6.25 7.5 7.5 7.5Z" fill="black"/>
              <path d="M7.5 10C8.25 10 8.75 10.5 9 11L6 11C6.25 10.5 6.75 10 7.5 10Z" fill="black"/>
            </svg>
          </div>
          <div className="flex items-center ml-1">
            <div className="w-[25px] h-[13px] rounded-[3px] border-2 border-black relative p-[2px] flex items-center">
              <div className="absolute right-[2px] w-[18px] h-[7px] bg-[#34C759] rounded-sm"></div>
              <div className="absolute -right-[4px] h-[4px] w-[2px] bg-black rounded-r-sm"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Navigation Bar */}
      <div className="fixed top-[44px] left-0 right-0 z-10 bg-white shadow-sm py-2.5 px-3.5 flex items-center justify-between">
        <div className="flex items-center">
          <ArrowLeftOutlined style={{ fontSize: '20px', color: '#333' }} />
          <div className="ml-3 flex items-center">
            <img 
              src={avatar || "https://via.placeholder.com/40"} 
              alt="User" 
              className="w-7 h-7 rounded-full object-cover" 
              style={{ border: '1px solid #f0f0f0' }}
            />
            <span className="ml-2 text-[15px]" style={{ color: '#333' }}>{username}</span>
          </div>
        </div>
        <div className="flex items-center">
          {isPrivate && (
            <div className="text-gray-600 flex items-center px-3 py-1 rounded-full bg-gray-50 mr-2.5">
              <LockOutlined className="mr-1" style={{ fontSize: '13px' }}/>
              <span style={{ fontSize: '13px' }}>隐私</span>
            </div>
          )}
          <ShareAltOutlined className="ml-1 mr-3" style={{ fontSize: '19px', color: '#333' }} />
          <MoreOutlined style={{ fontSize: '22px', color: '#333' }} />
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-[96px] pb-24">
        {/* Runner Icon, Title, Area */}
        <div className="bg-white px-4 py-3.5 flex items-start">
          <div className="rounded-full bg-gray-50 p-2 mr-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
              <path d="M13 4.8c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4zm6 14.2c0 .6-.4 1-1 1H8c-.6 0-1-.4-1-1 0-3.9 3.1-7 7-7s7 3.1 7 7z"/>
            </svg>
          </div>
          <div>
            <div className="text-[15px] text-gray-900">{title}</div>
            <div className="text-gray-400 text-[13px] mt-0.5">{areaName} 最长跑步时间</div>
          </div>
          {showBadge && (
            <div className="ml-auto">
              <div className="w-[30px] h-[30px] rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-500 font-medium text-[15px]">8</span>
              </div>
            </div>
          )}
        </div>

        {/* Distance */}
        <div className="bg-white px-4 pb-5 pt-1">
          <div className="flex items-baseline">
            <div className="text-[64px] font-bold leading-none tracking-[-0.02em]" 
              style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
              {displayDistance.toFixed(2)}
            </div>
            <div className="text-[22px] ml-2 mb-1 font-medium">公里</div>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white">
          <div className="relative overflow-hidden" style={{ height: '240px' }}>
            {useRealMap ? (
              <MapComponent
                apiKey={mapApiKey}
                securityJsCode={mapSecurityJsCode}
                routePoints={routePoints}
                trackColor={mapTrackColor}
                trackWidth={mapTrackWidth}
                zoom={mapZoom}
                height="240px"
                center={mapCenter}
                showDecoration={showDecoration}
                decorationType={decorationType}
              />
            ) : (
              <div className="relative h-full w-full bg-gray-50" onClick={handleMapClick}>
                <img
                  src={mapImage}
                  alt="Route Map"
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
                {svgPath && (
                  <svg
                    className="absolute top-0 left-0 w-full h-full"
                    viewBox="0 0 1000 1000"
                    preserveAspectRatio="none"
                  >
                    <path
                      d={svgPath}
                      fill="none"
                      stroke="#4CAF50"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}

                {/* Map controls */}
                <div className="absolute right-3 top-3 flex flex-col gap-2">
                  <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <FullscreenOutlined style={{ fontSize: '17px', color: '#666' }} />
                  </div>
                  <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <div className="transform rotate-180">
                      <CameraOutlined style={{ fontSize: '17px', color: '#666' }} />
                    </div>
                  </div>
                  <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <PlayCircleOutlined style={{ fontSize: '17px', color: '#666' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white mt-2 px-4 py-4">
          <div className="flex justify-between items-center mb-3">
            <div className="text-gray-500 text-[13px]">训练时长</div>
            <div className="text-gray-500 text-[13px]">总时长</div>
          </div>
          <div className="flex justify-between items-center mb-7">
            <div className="font-medium text-[22px] tracking-[-0.01em]">01:05:00</div>
            <div className="font-medium text-[22px] tracking-[-0.01em]">01:05:10</div>
          </div>
          
          <div className="grid grid-cols-2 gap-x-12 gap-y-5">
            <div>
              <div className="text-gray-500 text-[13px] mb-1.5">平均配速</div>
              <div className="font-medium text-[22px] tracking-[-0.01em]">06'30"</div>
            </div>
            <div>
              <div className="text-gray-500 text-[13px] mb-1.5">平均心率</div>
              <div className="font-medium text-[22px] tracking-[-0.01em]">155<span className="text-base font-normal ml-1">次/分</span></div>
            </div>
            <div>
              <div className="text-gray-500 text-[13px] mb-1.5">运动消耗</div>
              <div className="font-medium text-[22px] tracking-[-0.01em]">850<span className="text-base font-normal ml-1">千卡</span></div>
            </div>
            <div>
              <div className="text-gray-500 text-[13px] mb-1.5">爬升高度</div>
              <div className="font-medium text-[22px] tracking-[-0.01em]">35<span className="text-base font-normal ml-1">米</span></div>
            </div>
            <div>
              <div className="text-gray-500 text-[13px] mb-1.5">平均步频</div>
              <div className="font-medium text-[22px] tracking-[-0.01em]">172</div>
            </div>
            <div>
              <div className="text-gray-500 text-[13px] mb-1.5">平均步幅</div>
              <div className="font-medium text-[22px] tracking-[-0.01em]">1.18<span className="text-base font-normal ml-1">米</span></div>
            </div>
          </div>
        </div>

        {/* Share Button */}
        <div className="fixed bottom-8 left-4 right-4">
          <button 
            className="w-full rounded-[10px] text-white font-medium flex items-center justify-center"
            style={{
              background: '#10B981',
              height: '46px',
              fontSize: '16px',
              letterSpacing: '-0.01em'
            }}
          >
            发布动态到社区
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutResultComponent; 