

import React from 'react';
import Menubar from './Menubar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-gray-50 text-gray-800">
      
     

      {/* Sidebar Menubar */}
      <Menubar />

      {/* Main Content */}
      <main className=" px-0 pb-0 w-full">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;




