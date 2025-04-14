import { useState, useEffect } from 'react'

export const useCountdownTimer = (targetDate) => {
  const calculateTimeLeft = () => {
    const difference = new Date(targetDate) - new Date()
    
    // If expired, return zeroes
    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true
      }
    }
    
    // Calculate remaining time
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isExpired: false
    }
  }
  
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())
  
  useEffect(() => {
    // Update countdown every second
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)
    
    // Clear timer on unmount
    return () => clearTimeout(timer)
  })
  
  return timeLeft
}