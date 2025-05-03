import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import Navbar from '../components/Navbar';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/videos');
        const data = await response.json();
        const latestVideos = data.slice(-3).reverse();
        setVideos(latestVideos);
        if (latestVideos.length > 0) {
          setSelectedVideo(latestVideos[0]);
        }
      } catch (err) {
        console.error('Error fetching videos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    // Automatically play the video when changed
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(e => console.log("Auto-play prevented:", e));
    }
  };

  return (
    <>
      <Navbar />
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Traffic Violation Videos</h1>
              <p className="text-gray-600 mt-2">
                Review captured violation videos and details
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-[60vh]">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : videos.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No videos available</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No violation videos have been captured yet.
                </p>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Video Thumbnails Sidebar */}
                <div className="w-full lg:w-1/4">
                  <div className="bg-white rounded-lg shadow-lg border border-blue-100 p-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Videos</h2>
                    <div className="space-y-4">
                      {videos.map((video, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                            selectedVideo?.name === video.name
                              ? 'border-blue-500 shadow-md'
                              : 'border-gray-200 hover:border-blue-300'
                          } transition-all duration-200`}
                          onClick={() => handleVideoClick(video)}
                        >
                          <div className="relative aspect-video">
                            <video className="w-full h-full object-cover" muted>
                              <source src={video.url} type="video/mp4" />
                            </video>
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                              <div className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center">
                                <svg
                                  className="w-5 h-5 text-blue-600"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div className="p-3 bg-gradient-to-r from-blue-50 to-white">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {video.name}
                            </p>
                            {video.violationType && (
                              <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                                {video.violationType}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Main Video Player Area */}
                <div className="flex-1">
                  <div className="bg-white rounded-lg shadow-lg border border-blue-100 overflow-hidden">
                    <div className="p-6">
                      {selectedVideo ? (
                        <div className="space-y-6">
                          <div className="aspect-video bg-gradient-to-br from-blue-100 to-gray-100 rounded-xl overflow-hidden shadow-inner">
                            <video
                              ref={videoRef}
                              className="w-full h-full object-contain"
                              controls
                              autoPlay
                              key={selectedVideo.url} // Force re-render when video changes
                            >
                              <source src={selectedVideo.url} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          </div>
                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                              {selectedVideo.name}
                            </h3>
                            <div className="flex flex-wrap gap-3">
                              {selectedVideo.violationType && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                                  <svg
                                    className="w-4 h-4 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                  </svg>
                                  {selectedVideo.violationType}
                                </span>
                              )}
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                <svg
                                  className="w-4 h-4 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                {new Date(selectedVideo.timestamp || Date.now()).toLocaleString()}
                              </span>
                              {selectedVideo.location && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                                  <svg
                                    className="w-4 h-4 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                  </svg>
                                  {selectedVideo.location}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          Select a video to view details
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default Videos;