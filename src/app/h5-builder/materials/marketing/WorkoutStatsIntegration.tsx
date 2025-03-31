import React from 'react';
import WorkoutStatsComponent from './WorkoutStatsComponent';

interface WorkoutStatsIntegrationProps {
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

const WorkoutStatsIntegration: React.FC<WorkoutStatsIntegrationProps> = (props) => {
  return (
    <div className="workout-stats-integration mt-2">
      <WorkoutStatsComponent {...props} />
    </div>
  );
};

export default WorkoutStatsIntegration; 