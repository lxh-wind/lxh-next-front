'use client';

import React, { useState } from 'react';
import { ComponentType } from '../../components/types';
import { ArrowLeftOutlined, LockOutlined, ShareAltOutlined, MoreOutlined, FullscreenOutlined, CameraOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { parseRouteString, generateSvgPath, calculateRouteDistance } from '../../utils/mapService';
import MapComponent from '../../components/MapComponent';
import WorkoutStatsComponent from './WorkoutStatsComponent';


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
    decorationType = 'christmas',
    trainingTime = '01:37:18',
    totalTime = '01:37:28',
    avgPace = "06'20\"",
    avgHeartRate = 162,
    elevationGain = 40,
    avgStepFrequency = 168,
    avgStepLength = 0.93,
    showStats = true,
    statusBarTime = '15:33',
    badgeNumber = 8,
    badgeStyle = 'gold'
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

  const getBadgeColors = (style: string = 'gold') => {
    switch(style) {
      case 'silver':
        return {
          primary: '#E6E8EA',
          secondary: '#D1D5DB',
          accent: '#6B7280'
        };
      case 'bronze':
        return {
          primary: '#D6A074',
          secondary: '#B87333',
          accent: '#8B4513'
        };
      default: // gold
        return {
          primary: '#FFC936',
          secondary: '#FFD138',
          accent: '#FF8900'
        };
    }
  };

  const colors = getBadgeColors(badgeStyle);

  return (
    <div className="workout-result-component bg-gray-50">
      {/* iPhone Status Bar */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-white h-[44px] px-5 flex items-center justify-between">
        <div className="flex-1 flex items-center">
          <div className="text-black text-[16px] font-medium tracking-tight">{statusBarTime}</div>
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
        <div className="bg-white px-4 py-3.5 flex items-center">
          <div className="rounded-full bg-gray-50 p-2.5 mr-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-2 20c-.8 0-1.5-.7-1.5-1.5S10.2 21 11 21h5v-1.5c0-1.5-1.2-2.7-2.7-2.7h-3.5c-1.9 0-3.4-1.5-3.4-3.4 0-1.9 1.5-3.4 3.4-3.4h5.4c.6 0 1 .4 1 1s-.4 1-1 1h-5.4c-.8 0-1.4.6-1.4 1.4s.6 1.4 1.4 1.4h3.5c2.6 0 4.7 2.1 4.7 4.7V21h1c.8 0 1.5.7 1.5 1.5S19.8 24 19 24h-8z"/>
            </svg>
          </div>
          <div className="text-[17px] font-medium text-gray-900">{title}</div>
        </div>

        {/* Distance */}
        <div className="bg-white px-4 pb-5 pt-1 relative">
          <div className="flex items-baseline">
            <div className="text-[72px] font-bold leading-none tracking-[-0.03em]" 
              style={{ 
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                letterSpacing: '-0.02em'
              }}>
              {displayDistance.toFixed(2)}
            </div>
            <div className="text-[24px] ml-2 mb-1 font-medium text-gray-900">公里</div>
          </div>

          {showBadge && (
            <div className="ml-auto absolute right-4 top-[-20px] flex justify-center flex-col items-center">
              <div className="w-[68px] h-[68px] flex items-center justify-center relative">
                <svg className="w-full h-full" viewBox="0 0 1063 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <path d="M72.545848 305.231337a31.389273 31.389273 0 0 0-2.402442 14.690338c0.511996 5.198725 2.166136 10.239913 4.804883 14.729721a33.004028 33.004028 0 0 0 21.779508-22.055198c4.68673-12.563586 7.089171-25.836089 7.089171-39.266129v-7.16794c-13.036197 10.594372-23.709338 23.906259-31.27112 39.029824zM31.428657 349.341733a31.349889 31.349889 0 0 0 2.402441 14.690337c1.732908 10.988215 7.876856 20.755517 16.935242 26.978234 4.489808-6.459022 6.931634-14.178342 7.08917-22.055198v-9.846071a136.978533 136.978533 0 0 0-21.740123-41.629186c-3.150743 10.318682-4.804882 21.031207-4.844267 31.861884h0.157537z m48.363899 14.690337a39.778125 39.778125 0 0 0-12.090975 26.978234v2.441825a30.837893 30.837893 0 0 0 28.986832-9.84607c11.027599-11.421442 20.007215-24.693945 26.58439-39.226745a88.929709 88.929709 0 0 0-43.480247 19.652756z" fill={colors.primary}/>
                  <path d="M336.617459 382.463915l195.739883 198.614934 362.532317-370.369789a45.685767 45.685767 0 0 0 12.05159-29.420059L904.499423 39.072359A40.526426 40.526426 0 0 0 863.461001 0.003151h-135.324393c-10.830678 0.393843-21.14936 4.726114-29.026216 12.287896l-362.492933 370.212252z" fill={colors.secondary}/>
                  <path d="M725.694783 382.463915l-195.739883 198.614934L167.422583 210.70906a45.567614 45.567614 0 0 1-12.05159-29.420059L157.812819 39.072359A42.180566 42.180566 0 0 1 198.85124 0.003151h135.324394c10.830678 0.393843 21.14936 4.726114 29.026216 12.287896l362.492933 370.212252z" fill={colors.accent}/>
                  <path d="M198.890625 632.59349c0 185.499969 148.242438 335.869158 331.064275 335.869158 182.861222 0 331.10366-150.369189 331.10366-335.869158 0-185.499969-148.242438-335.947927-331.10366-335.947926a327.677227 327.677227 0 0 0-234.415247 98.106247 337.365761 337.365761 0 0 0-96.649028 237.841679z" fill={colors.secondary}/>
                  <path d="M660.474411 517.315697l96.649029 129.968131v-12.248512c0.590764-120.39775-90.268775-220.945823-208.539774-230.791893-118.270999-9.885455-224.096565 74.278756-242.922252 193.140519-18.786303 118.901148 55.768144 232.406649 171.124706 260.605795l-94.285972-129.968131 277.974263-210.705909z" fill={colors.accent}/>
                  <path d="M358.357583 632.475338a176.914195 176.914195 0 0 0 107.440322 163.641692 172.503156 172.503156 0 0 0 190.10793-38.281522 178.725872 178.725872 0 0 0 37.730142-192.86483 174.314833 174.314833 0 0 0-161.278635-109.015693 171.99116 171.99116 0 0 0-123.272803 51.475257A177.111117 177.111117 0 0 0 358.396967 632.475338z" fill={colors.primary}/>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[20px] font-semibold" style={{ color: colors.accent, transform: 'translateY(8px)' }}>
                    {badgeNumber}
                  </span>
                </div>
              </div>
              <div className="text-gray-400 text-[13px] mt-1">{areaName}</div>
            </div>
          )}
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

        {/* Workout Stats Section */}
        {showStats && (
          <div className="mt-2">
            <WorkoutStatsComponent 
              trainingTime={trainingTime}
              totalTime={totalTime}
              avgPace={avgPace}
              avgHeartRate={avgHeartRate}
              calories={calories}
              elevationGain={elevationGain}
              avgStepFrequency={avgStepFrequency}
              avgStepLength={avgStepLength}
            />
          </div>
        )}

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