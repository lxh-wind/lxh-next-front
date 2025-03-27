import React, { useState, useRef, useEffect } from 'react';

interface Prize {
  id: string;
  name: string;
  probability: number;
  bgColor: string;
}

interface LuckyWheelProps {
  prizes: Prize[];
  title?: string;
  buttonText?: string;
}

const LuckyWheel: React.FC<LuckyWheelProps> = ({ prizes, title, buttonText = '抽奖' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotating, setRotating] = useState(false);
  const [result, setResult] = useState<Prize | null>(null);
  const [rotationAngle, setRotationAngle] = useState(0);

  // Draw the wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 10;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw segments
    const sliceAngle = (2 * Math.PI) / prizes.length;
    
    for (let i = 0; i < prizes.length; i++) {
      const startAngle = i * sliceAngle + rotationAngle;
      const endAngle = (i + 1) * sliceAngle + rotationAngle;
      
      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      
      // Fill with gradient to mimic Taobao style
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
      );
      gradient.addColorStop(0, '#FFF8E1');
      gradient.addColorStop(1, prizes[i].bgColor);
      
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Draw border
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#E8E8E8';
      ctx.stroke();
      
      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#FF5000'; // Taobao orange
      ctx.font = 'bold 14px Arial';
      ctx.fillText(prizes[i].name, radius - 20, 5);
      ctx.restore();
    }
    
    // Draw center button overlay
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius / 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#FF5000'; // Taobao orange
    ctx.fill();
    
    // Draw outer border
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#FF5000'; // Taobao orange
    ctx.stroke();

    // Draw decorative dots on the border
    const dotCount = 20;
    const dotRadius = 4;
    for (let i = 0; i < dotCount; i++) {
      const angle = (i / dotCount) * 2 * Math.PI;
      const dotX = centerX + Math.cos(angle) * (radius + 2);
      const dotY = centerY + Math.sin(angle) * (radius + 2);
      
      ctx.beginPath();
      ctx.arc(dotX, dotY, dotRadius, 0, 2 * Math.PI);
      ctx.fillStyle = i % 2 === 0 ? '#FFD000' : '#FF5000';
      ctx.fill();
    }
    
  }, [prizes, rotationAngle]);

  // Spin the wheel
  const spin = () => {
    if (rotating) return;
    
    setRotating(true);
    setResult(null);
    
    // Calculate result based on probability
    const random = Math.random();
    let cumulativeProbability = 0;
    let winningPrize: Prize | null = null;
    
    for (const prize of prizes) {
      cumulativeProbability += prize.probability;
      if (random <= cumulativeProbability && !winningPrize) {
        winningPrize = prize;
      }
    }
    
    // Default to last prize if no winner (should not happen if probabilities sum to 1)
    if (!winningPrize) winningPrize = prizes[prizes.length - 1];
    
    // Calculate the final angle to stop at
    const prizeIndex = prizes.findIndex(p => p.id === winningPrize.id);
    const sliceAngle = (2 * Math.PI) / prizes.length;
    const targetAngle = -(prizeIndex * sliceAngle) - sliceAngle / 2;
    
    // Add multiple rotations plus the target angle
    const spins = 5; // Number of complete rotations
    const finalAngle = targetAngle - spins * 2 * Math.PI;
    
    // Animate the rotation
    let startAngle = rotationAngle;
    const startTime = performance.now();
    const duration = 4000; // 4 seconds
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for natural slowdown
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
      const easedProgress = easeOut(progress);
      
      const currentAngle = startAngle + (finalAngle - startAngle) * easedProgress;
      setRotationAngle(currentAngle);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setRotating(false);
        setResult(winningPrize);
      }
    };
    
    requestAnimationFrame(animate);
  };

  return (
    <div className="lucky-wheel-container" style={{ position: 'relative', maxWidth: '320px', margin: '0 auto' }}>
      <div className="wheel-container" style={{ position: 'relative' }}>
        <canvas 
          ref={canvasRef} 
          width={300} 
          height={300} 
          style={{ 
            width: '100%', 
            height: 'auto',
            filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.2))'
          }}
        />
        
        <button
          onClick={spin}
          disabled={rotating}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(to bottom, #FFD000, #FF5000)',
            border: 'none',
            color: 'white',
            fontWeight: 'bold',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
            cursor: rotating ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            zIndex: 2
          }}
        >
          {buttonText}
        </button>
      </div>
      
      {result && (
        <div className="result-popup" style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
          textAlign: 'center',
          zIndex: 10,
          border: '2px solid #FF5000'
        }}>
          <h3 style={{ color: '#FF5000', margin: '0 0 10px 0' }}>恭喜您获得</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0' }}>{result.name}</p>
          <button 
            onClick={() => setResult(null)}
            style={{
              background: 'linear-gradient(to bottom, #FFD000, #FF5000)',
              border: 'none',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            确定
          </button>
        </div>
      )}
      
      <style jsx>{`
        @keyframes shine {
          0% { background-position: -100px; }
          100% { background-position: 320px; }
        }
      `}</style>
    </div>
  );
};

export default LuckyWheel; 