import React, { useState } from 'react';
import Navbar from '../components/Navbar';

function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: true,
    dataSharing: false,
    autoUpdate: true
  });

  const handleToggle = (setting) => {
    setSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed text-white"
      style={{
        backgroundImage: `url('/bg-3.jpg')`,
      }}
    >
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold mb-6">Settings</h1>

          <div className="space-y-6">
            {[
              {
                key: 'notifications',
                label: 'Notifications',
                description: 'Receive alerts about detection events'
              },
              {
                key: 'darkMode',
                label: 'Dark Mode',
                description: 'Use dark theme for the interface'
              },
              {
                key: 'dataSharing',
                label: 'Data Sharing',
                description: 'Share anonymous data for research'
              },
              {
                key: 'autoUpdate',
                label: 'Auto Update',
                description: 'Automatically update detection models'
              }
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between pb-4 border-b border-white/20">
                <div>
                  <h3 className="font-semibold">{item.label}</h3>
                  <p className="text-sm text-gray-300">{item.description}</p>
                </div>
                <button
                  onClick={() => handleToggle(item.key)}
                  className={`w-12 h-6 rounded-full ${
                    settings[item.key] ? 'bg-green-400' : 'bg-gray-500'
                  } relative transition-colors`}
                >
                  <span
                    className={`absolute top-1 ${
                      settings[item.key] ? 'right-1' : 'left-1'
                    } bg-white w-4 h-4 rounded-full transition-all`}
                  ></span>
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
