import React, { useState } from 'react';
import { ArrowLeftOutlined, LockOutlined, ShareAltOutlined, MoreOutlined, FullscreenOutlined, CameraOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { parseRouteString, generateSvgPath, calculateRouteDistance } from '../../utils/mapService';
import MapComponent from '../../components/MapComponent';
import WorkoutStatsComponent from './WorkoutStatsComponent';

export interface WorkoutResultProps {
  title?: string;
  distance?: number;
  time?: number;
  calories?: number;
  pace?: number;
  steps?: number;
  energy?: number;
  extraText?: string;
  shareButtonText?: string;
  username?: string;
  avatar?: string;
  isPrivate?: boolean;
  mapImage?: string;
  useRealMap?: boolean;
  mapApiKey?: string;
  mapSecurityJsCode?: string;
  mapZoom?: number;
  mapTrackColor?: string;
  mapTrackWidth?: number;
  routePoints?: string;
  showBadge?: boolean;
  badgeType?: 'medal' | 'christmas' | 'newyear' | 'custom';
  customBadgeImage?: string;
  badgeText?: string;
  areaName?: string;
  mapCenter?: { lng: number; lat: number };
  trainingTime?: string;
  totalTime?: string;
  avgPace?: string;
  avgHeartRate?: number;
  elevationGain?: number;
  avgStepFrequency?: number;
  avgStepLength?: number;
}

const WorkoutResultStandalone: React.FC<WorkoutResultProps> = ({
  title = '户外跑步',
  distance = 15.34,
  time = 97, // In minutes
  calories = 1535,
  pace = 6.33, // minutes per km
  steps = 12586,
  energy = 42,
  areaName = '广州天河区',
  extraText = '已超越82%的跑步用户',
  shareButtonText = '分享到社区',
  username = '来自未来的哦哟',
  avatar = 'https://randomuser.me/api/portraits/men/32.jpg',
  isPrivate = true,
  mapImage = 'https://mdn.alipayobjects.com/huamei_n0yi1n/afts/img/A*9Kf4SJA4XvMAAAAAAAAAAAAADrB8AQ/original',
  useRealMap = true,
  mapApiKey = '7798b1134a46a58dbf25d7235afeaeba',
  mapSecurityJsCode = '1280315c2614cae0726cb81bd60bf429',
  mapZoom = 14,
  mapTrackColor = '#4CAF50',
  mapTrackWidth = 4,
  routePoints = '23.10937,113.23587;23.10792307436087,113.24174064178419;23.10397,113.24603824984325;23.09857,113.24761128356839;23.093169999999997,113.24603824984325;23.08921692563913,113.24174064178419;23.08777,113.23587;23.08921692563913,113.22999935821582;23.093169999999997,113.22570175015676;23.09857,113.22412871643162;23.10397,113.22570175015676;23.10792307436087,113.22999935821582;23.10937,113.23587;23.10792307436087,113.24174064178419;23.10397,113.24603824984325;23.09857,113.24761128356839;23.093169999999997,113.24603824984325;23.08921692563913,113.24174064178419;23.10937,113.23587',
  showBadge = true,
  badgeType = 'medal',
  customBadgeImage = '',
  badgeText = '完成5公里',
  mapCenter = { lng: 113.23587, lat: 23.09857 },
  trainingTime = '01:37:18',
  totalTime = '01:37:28',
  avgPace = "06'20\"",
  avgHeartRate = 162,
  elevationGain = 40,
  avgStepFrequency = 168,
  avgStepLength = 0.93
}) => {
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
  const parsedRoutePoints = parseRouteString(routePoints || '');
  
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
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white shadow-sm py-2.5 px-3.5 flex items-center justify-between">
        <div className="flex items-center">
          <ArrowLeftOutlined style={{ fontSize: '18px', color: '#333' }} />
          <div className="ml-4 flex items-center">
            <img 
              src={avatar || "https://via.placeholder.com/40"} 
              alt="User" 
              className="w-8 h-8 rounded-full object-cover" 
              style={{ border: '1px solid #f0f0f0' }}
            />
            <span className="ml-2 font-medium" style={{ color: '#333' }}>{username}</span>
          </div>
        </div>
        <div className="flex items-center">
          {isPrivate && (
            <div className="text-gray-700 flex items-center px-4 py-1 rounded-full bg-gray-100 mr-3">
              <LockOutlined className="mr-1.5" style={{ fontSize: '14px' }}/>
              <span style={{ fontSize: '14px' }}>仅自己可见</span>
            </div>
          )}
          <ShareAltOutlined className="ml-1 mr-3" style={{ fontSize: '18px', color: '#333' }} />
          <MoreOutlined style={{ fontSize: '20px', color: '#333' }} />
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 pb-6">
        {/* Runner Icon, Title, Area */}
        <div className="bg-white px-4 py-3 flex items-start">
          <div className="rounded-full bg-green-50 p-2 mr-3 mt-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
              <path d="M13 6v2h5a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h5V6a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <div className="font-medium text-lg">{title}</div>
            <div className="text-gray-400 text-sm">{areaName}</div>
          </div>
        </div>

        {/* Distance and Badge */}
        <div className="bg-white mt-0 pt-0 px-4 pb-5 relative">
          <div className="flex items-end">
            <div className="text-5xl font-bold tracking-tighter" 
              style={{ fontFamily: "'DIN Condensed', 'Arial Narrow', sans-serif" }}>
              {displayDistance.toFixed(2)}
            </div>
            <div className="text-lg ml-1 mb-1.5">公里</div>
          </div>
          
          {showBadge && (
            <div className="absolute right-4 top-0 flex flex-col items-center">
              <div className="w-16 h-16 relative flex items-center justify-center">
                {badgeType === 'medal' ? (
                  <>
                    <div className="w-12 h-12 rounded-full absolute" 
                      style={{ 
                        background: 'linear-gradient(45deg, #FFD700, #FFC107)',
                        boxShadow: '0 2px 8px rgba(255, 193, 7, 0.5)'
                      }}>
                    </div>
                    <div className="absolute -top-1 w-4 h-6 bg-blue-500 rounded-sm" 
                      style={{ left: 'calc(50% - 2px)', transform: 'translateX(-50%)' }}></div>
                    <div className="absolute -top-1 -left-1 w-2 h-5 bg-blue-700 -rotate-45"></div>
                    <div className="absolute -top-1 -right-1 w-2 h-5 bg-blue-700 rotate-45"></div>
                  </>
                ) : (
                  <img src={badgeImage} alt="Badge" className="w-full h-full object-contain" />
                )}
              </div>
              <div className="text-sm font-medium mt-1 text-center">{badgeText}</div>
            </div>
          )}
        </div>

        {/* Map Section */}
        <div className="bg-white mt-2 px-4 py-4">
          <div className="relative rounded-lg overflow-hidden" style={{ height: '200px' }}>
            {useRealMap ? (
              <MapComponent
                apiKey={mapApiKey}
                securityJsCode={mapSecurityJsCode}
                routePoints={routePoints || ''}
                trackColor={mapTrackColor || '#2aab58'}
                trackWidth={mapTrackWidth || 4}
                zoom={mapZoom}
                height="200px"
                center={mapCenter}
              />
            ) : (
              <div className="relative h-full w-full bg-gray-100" onClick={handleMapClick}>
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
                      stroke={mapTrackColor || "#2aab58"}
                      strokeWidth={mapTrackWidth || 4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                
                {/* Map controls */}
                <div className="absolute right-3 top-3 flex flex-col gap-3">
                  <div className="w-11 h-11 bg-white rounded-lg flex items-center justify-center shadow-md">
                    <FullscreenOutlined style={{ fontSize: '20px', color: '#666' }} />
                  </div>
                  <div className="w-11 h-11 bg-white rounded-lg flex items-center justify-center shadow-md">
                    <div className="transform rotate-180">
                      <CameraOutlined style={{ fontSize: '20px', color: '#666' }} />
                    </div>
                  </div>
                  <div className="w-11 h-11 bg-white rounded-lg flex items-center justify-center shadow-md">
                    <PlayCircleOutlined style={{ fontSize: '20px', color: '#666' }} />
                  </div>
                </div>
                
                {/* Editor mode tooltip */}
                {showMapEdit && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white p-4 text-center">
                    地图可在设置面板中配置为高德地图真实地图
                  </div>
                )}
              </div>
            )}
            <div className="absolute bottom-2 right-2 bg-white px-2 py-1 text-xs rounded shadow">
              查看详情 &gt;
            </div>
          </div>
        </div>

        {/* Workout Stats Section */}
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

        {/* Stats Section */}
        <div className="bg-white mt-2 px-4 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center">
              <div className="text-gray-500 text-sm">用时</div>
              <div className="font-medium text-base mt-1">{formatTime(time)}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-gray-500 text-sm">平均配速</div>
              <div className="font-medium text-base mt-1">{formatPace(paceValue)}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-gray-500 text-sm">千卡</div>
              <div className="font-medium text-base mt-1">{calories}</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center">
              <div className="text-gray-500 text-sm">步数</div>
              <div className="font-medium text-base mt-1">{steps.toLocaleString()}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-gray-500 text-sm">摄氧量</div>
              <div className="font-medium text-base mt-1">{energy}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-gray-500 text-sm">步频</div>
              <div className="font-medium text-base mt-1">157</div>
            </div>
          </div>
        </div>

        {/* Achievement Text */}
        <div className="bg-white mt-2 px-4 py-3 text-center">
          <div className="text-gray-500">{extraText}</div>
        </div>

        {/* Share Button */}
        <div className="mt-5 mx-4">
          <button 
            className="w-full h-12 rounded-lg text-white font-medium flex items-center justify-center"
            style={{
              background: 'linear-gradient(to right, #36d576, #28b458)',
              boxShadow: '0 3px 8px rgba(40, 180, 88, 0.4)',
              height: '48px'
            }}
          >
            <ShareAltOutlined style={{ fontSize: '18px', marginRight: '8px' }} />
            {shareButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutResultStandalone; 