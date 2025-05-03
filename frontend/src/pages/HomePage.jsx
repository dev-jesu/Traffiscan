import React from 'react';
import Navbar from '../components/Navbar';
import Menubar from '../components/Menubar';
import FeatureCards from '../components/FeatureCards';

function HomePage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url('/bg-3.jpg')`,
      }}
    >
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-6">
            Traffic Violation Detection System
          </h1>
          <p className="text-lg md:text-xl text-white">
            Real-time Monitoring | Instant Alerts | Smart Traffic Management
          </p>
        </div>

        <Menubar />

        <div className="mt-12">
          <FeatureCards />
        </div>
      </div>
    </div>
  );
}

export default HomePage;

