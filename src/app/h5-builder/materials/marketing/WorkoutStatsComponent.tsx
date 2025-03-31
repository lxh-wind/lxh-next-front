import React from 'react';

interface WorkoutStatsProps {
  trainingTime?: string;
  totalTime?: string; 
  avgPace?: string;
  avgHeartRate?: number;
  calories?: number;
  elevationGain?: number;
  avgStepFrequency?: number;
  avgStepLength?: number;
  className?: string;
  style?: React.CSSProperties;
}

const WorkoutStatsComponent: React.FC<WorkoutStatsProps> = ({
  trainingTime = '01:37:18',
  totalTime = '01:37:28',
  avgPace = "06'20\"",
  avgHeartRate = 162,
  calories = 1535,
  elevationGain = 40,
  avgStepFrequency = 168,
  avgStepLength = 0.93,
  className = '',
  style = {}
}) => {
  return (
    <div 
      className={`workout-stats-component bg-white ${className}`}
      style={{ 
        fontFamily: "'PingFang SC', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        ...style 
      }}
    >
      <div className="px-5 pt-5 pb-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-base font-medium text-gray-800 mb-0">运动数据</h2>
          </div>
          <div>
            <div className="text-[12px] font-bold text-gray-800 bg-gray-100 px-4 py-1.5 rounded-full">
              查看详情
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-y-6">
          {/* First row */}
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm mb-1 font-bold">训练时长</span>
            <span className="text-black text-2xl font-bold tracking-tight">{trainingTime}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm mb-1 font-bold">平均配速 <span className="text-gray-300">⟩</span></span>
            <span className="text-black text-2xl font-bold tracking-tight">{avgPace}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm mb-1 font-bold">运动消耗</span>
            <span className="text-black text-2xl font-bold tracking-tight">{calories} <span className="text-lg">千卡</span></span>
          </div>

          {/* Second row */}
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm mb-1 font-bold">总时长</span>
            <span className="text-black text-2xl font-bold tracking-tight">{totalTime}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm mb-1 font-bold">平均心率 <span className="text-gray-300">⟩</span></span>
            <span className="text-black text-2xl font-bold tracking-tight">{avgHeartRate} <span className="text-lg">次/分</span></span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm mb-1 font-bold">爬升高度 <span className="text-gray-300">⟩</span></span>
            <span className="text-black text-2xl font-bold tracking-tight">{elevationGain} <span className="text-lg">米</span></span>
          </div>

          {/* Third row */}
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm mb-1 font-bold">平均步频 <span className="text-gray-300">⟩</span></span>
            <span className="text-black text-2xl font-bold tracking-tight">{avgStepFrequency}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm mb-1 font-bold">平均步幅 <span className="text-gray-300">⟩</span></span>
            <span className="text-black text-2xl font-bold tracking-tight">{avgStepLength} <span className="text-lg">米</span></span>
          </div>
          <div className="flex flex-col"></div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutStatsComponent; 