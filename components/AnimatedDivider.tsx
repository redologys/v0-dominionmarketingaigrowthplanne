import React, { useState, useEffect, useRef } from 'react';

export const AnimatedDivider: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.unobserve(dividerRef.current!);
        }
      }, { threshold: 0.5 }
    );

    const currentRef = dividerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div ref={dividerRef} className={`relative w-full py-10 flex items-center justify-center transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Ambient particles */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute w-1 h-1 bg-amber-200/20 rounded-full animate-drift" style={{ left: '10%', animationDuration: '15s' }}></div>
          <div className="absolute w-1 h-1 bg-amber-200/20 rounded-full animate-drift" style={{ left: '20%', animationDuration: '10s', animationDelay: '-5s' }}></div>
          <div className="absolute w-px h-px bg-amber-200/20 rounded-full animate-drift" style={{ left: '35%', animationDuration: '12s', animationDelay: '-10s' }}></div>
          <div className="absolute w-1 h-1 bg-amber-200/20 rounded-full animate-drift" style={{ left: '50%', animationDuration: '18s', animationDelay: '-2s' }}></div>
          <div className="absolute w-px h-px bg-amber-200/20 rounded-full animate-drift" style={{ left: '70%', animationDuration: '9s', animationDelay: '-8s' }}></div>
          <div className="absolute w-1 h-1 bg-amber-200/20 rounded-full animate-drift" style={{ left: '85%', animationDuration: '14s' }}></div>
      </div>
      
      {/* The divider line */}
      <div className="relative w-full max-w-4xl h-px overflow-hidden">
        {/* Base soft gradient line */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent"></div>
        {/* Shimmer effect */}
        <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
            style={{ animationDuration: '5s', animationIterationCount: 'infinite', animationTimingFunction: 'ease-in-out' }}>
        </div>
      </div>
    </div>
  );
};
