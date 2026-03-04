import React from 'react';
import Navbar from '../components/Navbar';

function AboutPage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url('/bg-3.jpg')`,
      }}
    >
      <Navbar />
      <div className="container mx-auto px-4 py-12 flex justify-center items-center">
        <div className="max-w-4xl w-full bg-gradient-to-br from-black/60 to-gray-800/60 text-white backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-10">
          <h1 className="text-4xl font-bold text-cyan-400 mb-6 drop-shadow">About Traffiscan</h1>
          <p className="mb-4 text-gray-200 leading-relaxed">
            We are on a mission to make roads safer through smart, AI-powered traffic violation detection.
            Our system leverages advanced computer vision and deep learning models to automatically detect violations such as:
            <span className="text-yellow-300 font-medium"> Riding without a helmet</span>,
            <span className="text-pink-300 font-medium"> triple riding</span>,
            <span className="text-green-300 font-medium"> using mobile phones while driving</span>,
            <span className="text-red-300 font-medium"> wrong way detection</span> &amp;
            <span className="text-orange-300 font-medium"> breaking signal rules</span>, and more.
          </p>
          <p className="mb-4 text-gray-300 leading-relaxed">
            Our mission is to reduce traffic violations and accidents by providing real-time detection 
            of unsafe behaviors such as riding without helmets, using phones while driving, 
            triple riding on two-wheelers, and wrong-way driving.
          </p>
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-blue-400 mb-4 drop-shadow">Our Technology</h2>
            <p className="mb-4 text-gray-200 leading-relaxed">
              Traffiscan uses state-of-the-art computer vision and machine learning algorithms 
              to analyze traffic footage in real-time, identifying potential violations and safety hazards.
            </p>
            <p className="text-gray-200 leading-relaxed">
              The system is designed to work with existing traffic cameras and infrastructure, 
              making it easy to deploy and scale across different locations and environments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;



