import React from 'react';

function TrafficLightLogo() {
  return (
    <div className="relative flex flex-col items-center justify-center w-6 h-6 bg-gray-800 rounded-sm">
      <div className="absolute top-1 w-3 h-3 rounded-full bg-accent-red animate-pulse"></div>
      <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent-yellow"></div>
      <div className="absolute bottom-1 w-3 h-3 rounded-full bg-accent-green"></div>
    </div>
  );
}

export default TrafficLightLogo;