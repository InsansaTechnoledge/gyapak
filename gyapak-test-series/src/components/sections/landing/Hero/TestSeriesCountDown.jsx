import React, { useState, useEffect } from 'react'
import { useCountdownTimer } from '../../../../hooks/useCountDownTimer'
import { CountdownDisplay } from '../../../common/countdownComponent/countDownDisplay'
import { ExamBadge } from '../../../common/countdownComponent/ExamBadge'
import { ActionButton } from '../../../common/countdownComponent/ActionButton'
import { CardContent } from '../../../common/countdownComponent/cardContent'
import { CardHeader } from '../../../common/countdownComponent/CardHeader'

const TestSeriesCountdownCard = ({ 
  examName = "UPSC Prelims Mock Test",
  examDate = "2025-06-15T10:00:00",
  examDuration = "2 hours",
  totalQuestions = 100,
  examCategory = "Civil Services",
  examLevel = "Advanced",
  examId = "UPSC-MT-2025-06"
}) => {
  const { days, hours, minutes, seconds, isExpired } = useCountdownTimer(examDate)
  const [animate, setAnimate] = useState(false);
  
  // Pulse animation effect on seconds change
  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 500);
    return () => clearTimeout(timer);
  }, [seconds]);

  return (
    <div className="w-full rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-white to-gray-50 border border-gray-100 hover:shadow-2xl transition-all duration-500 flex flex-col md:flex-row relative">
      {/* Decorative elements */}
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-500 opacity-10 rounded-full blur-xl"></div>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500 opacity-10 rounded-full blur-xl"></div>
      
      {/* Accent border with animation */}
      <div className={`md:w-2 w-full h-2 md:h-full bg-gradient-to-r md:bg-gradient-to-b from-indigo-600 via-purple-600 to-indigo-600 bg-size-200 ${animate ? 'animate-pulse' : ''}`}></div>
      
      <div className="flex-1 flex flex-col md:flex-row relative z-10">
        {/* Main content section */}
        <div className="flex-1 p-4 md:p-6 backdrop-blur-sm">
          <CardHeader 
            examName={examName} 
            examCategory={examCategory}
            examLevel={examLevel}
          />
          
          <CardContent 
            examDate={examDate}
            examDuration={examDuration}
            totalQuestions={totalQuestions}
          />
          
          {/* New feature highlight */}
          <div className="mt-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100 flex items-center">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
              <div className="w-5 h-5 rounded-full bg-indigo-500 animate-pulse"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-indigo-700">Live Performance Analytics</p>
              <p className="text-xs text-indigo-600 opacity-80">Track your progress in real-time during the test</p>
            </div>
          </div>
        </div>
        
        {/* Countdown and action section with enhanced styling */}
        <div className="flex flex-col md:w-64 md:border-l border-t md:border-t-0 border-gray-100 bg-gradient-to-b from-gray-50 to-white">
          {/* Countdown section */}
          <div className="p-4 md:p-6 flex-1 relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-indigo-100 opacity-30"></div>
            <div className="absolute -left-4 -bottom-4 w-16 h-16 rounded-full bg-purple-100 opacity-30"></div>
            
            <h3 className="text-sm font-medium text-gray-500 mb-2 relative z-10">
              {isExpired ? "Test Expired" : "Test Starts In"}
            </h3>
            
            <div className={`transition-all duration-300 ${animate ? 'scale-105' : 'scale-100'}`}>
              <CountdownDisplay 
                days={days}
                hours={hours}
                minutes={minutes}
                seconds={seconds}
                isExpired={isExpired}
              />
            </div>
            
            {/* Progression bar */}
            {!isExpired && (
              <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" 
                  style={{ 
                    width: `${100 - (((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60) + seconds) / (7 * 24 * 60 * 60)) * 100}%`,
                    minWidth: '5%'
                  }}
                ></div>
              </div>
            )}
          </div>
          
          {/* Action buttons with enhanced styling */}
          <div className="p-4 md:p-6 flex justify-between items-center border-t border-gray-100 bg-gradient-to-r from-white to-gray-50">
            <ExamBadge examId={examId} />
            <div className="transform transition-transform hover:scale-105">
              <ActionButton isExpired={isExpired} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestSeriesCountdownCard