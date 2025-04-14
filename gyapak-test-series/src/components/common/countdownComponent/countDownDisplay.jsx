import React from 'react'

export const CountdownDisplay = ({ days, hours, minutes, seconds, isExpired }) => {
  const TimeUnit = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <div className="text-2xl font-bold text-indigo-700">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  )
  
  if (isExpired) {
    return (
      <div className="bg-red-50 p-3 rounded-lg">
        <p className="text-red-600 font-medium text-center">This test is no longer available</p>
      </div>
    )
  }
  
  return (
    <div className="flex justify-between items-center">
      <TimeUnit value={days} label="Days" />
      <div className="text-xl font-bold text-gray-300">:</div>
      <TimeUnit value={hours.toString().padStart(2, '0')} label="Hours" />
      <div className="text-xl font-bold text-gray-300">:</div>
      <TimeUnit value={minutes.toString().padStart(2, '0')} label="Minutes" />
      <div className="text-xl font-bold text-gray-300">:</div>
      <TimeUnit value={seconds.toString().padStart(2, '0')} label="Seconds" />
    </div>
  )
}