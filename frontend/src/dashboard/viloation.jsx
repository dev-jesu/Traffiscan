import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import DashboardLayout from '../components/DashboardLayout';

const ViolationPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/photos`)
      .then((res) => res.json())
      .then((data) => {
        setPhotos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching violation photos:', err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar />
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white p-8">
          <h1 className="text-4xl font-extrabold mb-4 text-center">📸 Violation Photo History</h1>
          <p className="text-lg text-gray-300 mb-6 text-center">
            Browse all stored traffic violation snapshots captured during surveillance.
          </p>

          {loading ? (
            <p className="text-center text-white text-xl">Loading photos...</p>
          ) : photos.length === 0 ? (
            <p className="text-center text-gray-400 text-xl">No violation photos found in the database.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {photos.map((photo, index) => (
                <div
                  key={index}
                  className="bg-white/10 p-4 rounded-xl shadow-md hover:shadow-xl transition transform hover:scale-105"
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.violationType}
                    className="w-full h-48 object-cover rounded-md mb-3"
                  />
                  <div className="text-sm text-center">
                    <p className="font-semibold">{photo.violationType}</p>
                    <p className="text-gray-300 text-xs mt-1">{new Date(photo.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default ViolationPhotos;
