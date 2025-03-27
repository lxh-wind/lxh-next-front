'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button, message } from 'antd';

interface Prize {
  id: string;
  name: string;
  probability: number;
  bgColor?: string;
  fontColor?: string;
}

interface LuckyWheelProps {
  title?: string;
  buttonText?: string;
  prizes: Prize[];
  rotationTime?: number;
  onComplete?: (prize: Prize) => void;
  style?: React.CSSProperties;
}

const defaultPrizes: Prize[] = [
  { id: '1', name: '1元', probability: 0.1, bgColor: '#FFEECC' },
  { id: '2', name: '谢谢参与', probability: 0.4, bgColor: '#FFF4D6' },
  { id: '3', name: '5元', probability: 0.05, bgColor: '#FFEECC' },
  { id: '4', name: '谢谢参与', probability: 0.4, bgColor: '#FFF4D6' },
  { id: '5', name: '10元', probability: 0.03, bgColor: '#FFEECC' },
  { id: '6', name: '再来一次', probability: 0.02, bgColor: '#FFF4D6' },
];

const LuckyWheel: React.FC<LuckyWheelProps> = ({
  title = '幸运大转盘',
  buttonText = '开始抽奖',
  prizes = defaultPrizes,
  rotationTime = 5000,
  onComplete,
  style = {}
}) => {
  const [rotating, setRotating] = useState(false);
  const [result, setResult] = useState<Prize | null>(null);
  const [currentDegree, setCurrentDegree] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const totalPrizes = prizes.length;
  const sectorDegree = 360 / totalPrizes;

  // 随机选择奖品，根据概率
  const selectRandomPrize = (): Prize => {
    const rand = Math.random();
    let cumulativeProbability = 0;

    for (const prize of prizes) {
      cumulativeProbability += prize.probability;
      if (rand <= cumulativeProbability) {
        return prize;
      }
    }
    
    // 如果没有匹配的奖品（可能概率总和不为1），返回最后一个奖品
    return prizes[prizes.length - 1];
  };

  // 开始旋转
  const startRotation = () => {
    if (rotating) return;
    
    setRotating(true);
    const selectedPrize = selectRandomPrize();
    setResult(selectedPrize);
    
    // 计算旋转角度
    const prizeIndex = prizes.findIndex(p => p.id === selectedPrize.id);
    const targetDegree = 360 * 5 + (360 - (prizeIndex * sectorDegree) - (sectorDegree / 2));
    
    // 设置新的旋转角度
    setCurrentDegree(prev => prev + targetDegree);
    
    // 旋转结束后的操作
    setTimeout(() => {
      setRotating(false);
      messageApi.success(`恭喜获得：${selectedPrize.name}`);
      if (onComplete) {
        onComplete(selectedPrize);
      }
    }, rotationTime);
  };

  // 重置转盘
  const resetWheel = () => {
    setRotating(false);
    setResult(null);
    setCurrentDegree(0);
  };

  // 绘制转盘
  const renderWheel = () => {
    return (
      <div 
        ref={wheelRef} 
        className="lucky-wheel-container relative"
        style={{ 
          width: '100%', 
          height: '280px', 
          margin: '0 auto',
          maxWidth: '280px'
        }}
      >
        <div 
          className="wheel" 
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            position: 'relative',
            overflow: 'hidden',
            background: '#FFCD00',
            boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
            transition: `transform ${rotationTime / 1000}s cubic-bezier(0.1, 0.7, 0.1, 1)`,
            transform: `rotate(${currentDegree}deg)`,
            border: '8px solid #FF5C5C'
          }}
        >
          {prizes.map((prize, index) => (
            <div 
              key={prize.id}
              className="sector"
              style={{
                position: 'absolute',
                width: '50%',
                height: '50%',
                top: '0',
                right: '50%',
                transformOrigin: '100% 100%',
                transform: `rotate(${index * sectorDegree}deg) skewY(-${90 - sectorDegree}deg)`,
                background: index % 2 === 0 ? '#FFEECC' : '#FFF4D6',
                borderRight: '1px solid #FF5C5C',
                overflow: 'hidden',
              }}
            >
              <div
                className="prize-text"
                style={{
                  position: 'absolute',
                  top: '25px',
                  right: '25px',
                  transform: 'rotate(20deg) skewY(45deg)',
                  color: '#FF5C5C',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  width: '60px',
                  textAlign: 'center',
                }}
              >
                {prize.name}
              </div>
            </div>
          ))}
        </div>
        
        {/* 转盘中心 */}
        <div
          className="wheel-center"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: '#FFDB4C',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FF5C5C',
            fontWeight: 'bold',
            zIndex: 10,
            borderWidth: '4px',
            borderStyle: 'solid',
            borderColor: '#FF5C5C',
            fontSize: '12px',
          }}
        >
          转动
        </div>
        
        {/* 指针 */}
        <div
          className="pointer"
          style={{
            position: 'absolute',
            top: '-16px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '30px',
            height: '50px',
            zIndex: 5,
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: '15px solid transparent',
              borderRight: '15px solid transparent',
              borderTop: '40px solid #FF5C5C',
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="lucky-wheel-component text-center">
      {contextHolder}
      
      {renderWheel()}
      
      <div className="wheel-action mt-4">
        <Button
          type="primary"
          onClick={startRotation}
          disabled={rotating}
          style={{ 
            background: '#FF5C5C', 
            borderColor: '#FF5C5C',
            borderRadius: '20px',
            padding: '0 25px',
            height: '40px',
            fontSize: '16px',
            marginTop: '12px'
          }}
        >
          {rotating ? '抽奖中...' : buttonText}
        </Button>
      </div>
      
      {result && (
        <div className="result mt-4">
          <p>恭喜获得：{result.name}</p>
        </div>
      )}
    </div>
  );
};

export default LuckyWheel; 