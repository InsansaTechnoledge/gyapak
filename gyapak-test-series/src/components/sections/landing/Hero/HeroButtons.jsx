import React, { useState } from 'react';
import { ArrowRight, BookOpen, Globe, Sparkles } from 'lucide-react';

const HeroButtons = () => {
  const [activeButton, setActiveButton] = useState(null);
  
  // Button configuration with enhanced variants
  const buttons = [
    {
      id: 'getStarted',
      label: 'Get Started',
      icon: ArrowRight,
      variant: 'primary',
      description: 'Create your free account'
    },
    {
      id: 'viewTest',
      label: 'View Test Series',
      icon: BookOpen,
      variant: 'secondary',
      description: 'Explore our practice tests'
    },
    {
      id: 'website',
      label: 'gyapak.in',
      icon: Globe,
      variant: 'accent',
      href: 'https://gyapak.in',
      description: 'Visit our official website'
    }
  ];

  // Enhanced button renderer with premium styling
  const renderButton = (button) => {
    const isActive = activeButton === button.id;
    const variant = button.variant;
    const ButtonTag = button.href ? 'a' : 'button';
    const buttonProps = button.href ? { 
      href: button.href, 
      target: "_blank", 
      rel: "noopener noreferrer" 
    } : {};
    
    // Dynamic styles based on variant
    const variantStyles = {
      primary: "bg-gradient-to-r from-indigo-600 via-purple-600 to-purple-700 text-white border-none shadow-md shadow-indigo-900/10 hover:shadow-lg hover:shadow-indigo-900/20",
      secondary: "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white border-none shadow-md shadow-purple-900/10 hover:shadow-lg hover:shadow-purple-900/20",
      accent: "bg-white text-indigo-900 border-2 border-indigo-100 shadow-md shadow-indigo-900/5 hover:shadow-lg hover:shadow-indigo-900/10"
    };
    
    // Special effects for active state
    const activeEffect = isActive ? "scale-[0.98] shadow-inner" : "";
    
    return (
      <div className="relative transform transition-all duration-300">
        {/* Subtle glow effect */}
        <div className={`absolute inset-0 rounded-xl blur-md opacity-20 ${
          variant === 'primary' ? 'bg-indigo-400' : 
          variant === 'secondary' ? 'bg-purple-400' : 'bg-indigo-200'
        } ${isActive ? 'opacity-40 scale-105' : 'opacity-0'} transition-all duration-300`}></div>
        
        <ButtonTag
          key={button.id}
          className={`group relative rounded-xl px-4 py-3 md:px-6 md:py-4 text-sm md:text-base font-medium w-full overflow-hidden transition-all duration-300 flex items-center justify-between space-x-2 ${variantStyles[variant]} ${activeEffect}`}
          onMouseEnter={() => setActiveButton(button.id)}
          onMouseLeave={() => setActiveButton(null)}
          aria-label={button.label}
          {...buttonProps}
        >
          {/* Background animation */}
          <div className={`absolute inset-0 -z-10 ${
            variant === 'accent' ? 'bg-gradient-to-r from-indigo-50 to-indigo-100' : 'bg-white/10'
          } opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
          
          {/* Sparkle effect for primary button */}
          {variant === 'primary' && (
            <div className="absolute top-0 right-0 -mt-1 -mr-1">
              <Sparkles size={16} className="text-yellow-300 animate-pulse" />
            </div>
          )}
          
          {/* Label and description with wrapper for alignment */}
          <div className="flex flex-col items-start">
            <span className="font-semibold">{button.label}</span>
            <span className={`text-xs opacity-80 mt-0.5 ${isActive ? 'opacity-100' : 'opacity-0 -translate-y-1'} transition-all duration-300`}>
              {button.description}
            </span>
          </div>
          
          {/* Icon with animation */}
          <div className={`flex items-center justify-center w-6 h-6 ${
            variant === 'accent' ? 'text-indigo-600' : 'text-white'
          } transition-all duration-300 ${isActive ? 'scale-110' : ''}`}>
            <button.icon size={16} className={`transition-all duration-300 ${
              isActive && button.icon === ArrowRight ? 'translate-x-1' : ''
            }`} />
          </div>
          
          {/* Interactive ripple effect on click */}
          <div className="absolute inset-0 overflow-hidden rounded-xl">
            <span className={`absolute inset-0 transform scale-0 rounded-full bg-white/20 origin-center ${
              isActive ? 'animate-ripple' : ''
            }`}></span>
          </div>
        </ButtonTag>
      </div>
    );
  };

  return (
    <div className="relative mt-8 md:mt-10">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-indigo-100/50 rounded-full blur-3xl opacity-30 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-purple-100/50 rounded-full blur-3xl opacity-30 transform translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      {/* Buttons container - Left aligned */}
      <div className="relative flex flex-col space-y-3 w-full ml-0 px-3">
        {buttons.map(renderButton)}
      </div>
      
      {/* Custom animation for the ripple effect */}
      <style jsx global>{`
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 0.6;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }
        .animate-ripple {
          animation: ripple 1s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default HeroButtons;