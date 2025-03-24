"use client";

import { useEffect, useRef, useState } from "react";

// The animation component for Pinduoduo-style marketing animation
export default function MarketingAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [countdown, setCountdown] = useState({ hours: 23, minutes: 59, seconds: 59 });
  const [participants, setParticipants] = useState<string[]>([
    'https://randomuser.me/api/portraits/women/12.jpg',
    'https://randomuser.me/api/portraits/men/32.jpg',
    'https://randomuser.me/api/portraits/women/22.jpg',
    'https://randomuser.me/api/portraits/men/45.jpg',
    'https://randomuser.me/api/portraits/women/33.jpg',
  ]);
  
  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Add new participant randomly
  useEffect(() => {
    const addParticipant = () => {
      const randomId = Math.floor(Math.random() * 100);
      const gender = Math.random() > 0.5 ? 'women' : 'men';
      const newParticipant = `https://randomuser.me/api/portraits/${gender}/${randomId}.jpg`;
      
      setParticipants(prev => {
        const newParticipants = [newParticipant, ...prev];
        return newParticipants.slice(0, 5); // Keep only 5 participants
      });
    };
    
    const interval = setInterval(addParticipant, 5000);
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    // Using Lottie via CDN since we couldn't install the package due to Node.js version incompatibility
    const loadLottie = async () => {
      // We'll dynamically load the Lottie library
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js';
      script.async = true;
      script.onload = () => {
        setLoaded(true);
        
        // Use direct URL to Lottie animation from LottieFiles
        if (containerRef.current && window.lottie) {
          // Red packet/coupon animation for Pinduoduo-style marketing
          window.lottie.loadAnimation({
            container: containerRef.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'https://assets2.lottiefiles.com/packages/lf20_rovf9gzu.json', // Red envelope animation
          });
        }
      };
      document.body.appendChild(script);
    };
    
    loadLottie();
    
    return () => {
      // Cleanup animation when component unmounts
      if (window.lottie && containerRef.current) {
        window.lottie.destroy();
      }
    };
  }, []);

  // Format numbers to always have two digits
  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-red-500 to-orange-400 p-4 relative overflow-hidden">
      {/* Floating bubbles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white/20 animate-float"
            style={{
              width: `${Math.random() * 60 + 20}px`,
              height: `${Math.random() * 60 + 20}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 8 + 8}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden relative z-10">
        {/* Top banner */}
        <div className="bg-gradient-to-r from-red-600 to-yellow-500 p-3 flex justify-between items-center">
          <div className="text-white font-bold">超值特惠</div>
          <div className="text-yellow-200 text-sm">限时秒杀</div>
        </div>
        
        <div className="p-6">
          <h1 className="text-2xl font-bold text-center text-red-600 mb-4">
            限时抢购活动
          </h1>
          
          {/* Animation container */}
          <div 
            ref={containerRef}
            className="w-full h-64 mb-6"
          >
            {!loaded && (
              <div className="flex justify-center items-center w-full h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-bold text-red-600">¥39.9</p>
                  <p className="text-sm text-gray-600 line-through">原价: ¥99.9</p>
                </div>
                <div className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full animate-pulse">
                  立减60元
                </div>
              </div>
              <div className="flex items-center mt-2">
                <div className="h-2 w-2/3 bg-red-500 rounded-full">
                  <div className="h-2 w-2/3 bg-red-300 rounded-full animate-pulse"></div>
                </div>
                <span className="text-xs text-red-600 ml-2">已抢63%</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-1 bg-red-100 p-3 rounded-lg text-center">
                <p className="text-xs text-gray-600">距结束</p>
                <p className="text-sm font-bold text-red-600">
                  {formatNumber(countdown.hours)}:{formatNumber(countdown.minutes)}:{formatNumber(countdown.seconds)}
                </p>
              </div>
              <div className="flex-1 bg-red-100 p-3 rounded-lg text-center">
                <p className="text-xs text-gray-600">参与人数</p>
                <p className="text-sm font-bold text-red-600">1,342</p>
              </div>
            </div>
            
            {/* Recent participants */}
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">最近参与</p>
              <div className="flex space-x-2">
                {participants.map((avatar, index) => (
                  <div key={index} className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm">
                    <img 
                      src={avatar} 
                      alt={`Participant ${index}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xs font-bold">
                  +99
                </div>
              </div>
            </div>
            
            <button className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition transform hover:scale-105 duration-200 active:scale-95 relative overflow-hidden">
              <span className="relative z-10">立即抢购</span>
              <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-400 opacity-0 hover:opacity-20 transition-opacity duration-300"></span>
            </button>
            
            <div className="flex justify-center space-x-3 mt-2">
              <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-bold rounded-full transition transform hover:scale-105 duration-200 active:scale-95">
                邀请好友
              </button>
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-full transition transform hover:scale-105 duration-200 active:scale-95">
                分享活动
              </button>
            </div>
            
            <p className="text-xs text-center text-gray-500">
              邀请好友参与可获得额外5元优惠券
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add TypeScript interface for window.lottie
declare global {
  interface Window {
    lottie: any;
  }
} 