import React from 'react';
import Navbar from '../components/Navbar';

function AccountPage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url('/bg-3.jpg')` }}
    >
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-black bg-opacity-70 backdrop-blur-md rounded-lg shadow-lg p-8 text-white">
          
          {/* Profile Picture and Name */}
          <div className="flex items-center justify-center mb-4">
            <img
              src="/rose.jpg"
              alt="Rose Icon"
              className="w-12 h-12 rounded-full mr-3 border border-gray-300"
            />
            <div className="text-left">
              <h2 className="text-xl font-bold">Rose</h2>
              <p className="text-sm text-gray-300">Administrator</p>
            </div>
          </div>

          {/* Email */}
          <div className="text-left mt-6">
            <p className="text-sm text-gray-400">Email</p>
            <p className="text-base font-medium mb-4">rose.doe@example.com</p>

            {/* Last Login */}
            <p className="text-sm text-gray-400">Last Login</p>
            <p className="text-base font-medium mb-4">2023-10-15 09:30 AM</p>

            {/* Account Status */}
            <p className="text-sm text-gray-400">Account Status</p>
            <p className="text-base font-medium text-green-400 mb-6">● Active</p>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">
              Edit Profile
            </button>
            <button className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-100 hover:text-red-700">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
