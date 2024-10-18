import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const GsapLoader = () => {
  const loaderRef = useRef(null);

  useEffect(() => {
    // GSAP animation for loader
    const animation = gsap.timeline({ repeat: -1 });
    
    animation
      .to(loaderRef.current, { scale: 1.2, opacity: 0.8, duration: 0.6, ease: 'power1.inOut' })
      .to(loaderRef.current, { scale: 1, opacity: 1, duration: 0.6, ease: 'power1.inOut' });

    return () => {
      animation.kill(); // Cleanup GSAP animation when component unmounts
    };
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div ref={loaderRef} className="w-16 h-16 border-8 border-t-transparent border-white rounded-full"></div>
    </div>
  );
};

export default GsapLoader;
