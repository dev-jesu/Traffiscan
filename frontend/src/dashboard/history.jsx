import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [thumbnails, setThumbnails] = useState({});
  const [relatedPhotos, setRelatedPhotos] = useState([]);
  const [activeTab, setActiveTab] = useState('video'); // 'video' or 'evidence'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/videos`)
      .then((res) => res.json())
      .then((data) => {
        setVideos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching videos:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    videos.forEach((video, index) => {
      generateThumbnail(video.url, index);
    });
  }, [videos]);

  const generateThumbnail = (videoUrl, index) => {
    const video = document.createElement('video');
    video.src = videoUrl;
    video.crossOrigin = 'anonymous';
    video.currentTime = 2;

    video.addEventListener('loadeddata', () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageUrl = canvas.toDataURL('image/png');
      setThumbnails((prev) => ({ ...prev, [index]: imageUrl }));
    });

    video.addEventListener('error', (e) => {
      console.error('Error generating thumbnail:', e);
    });
  };

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    setActiveTab('video');
    fetchRelatedPhotos(video.name);
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
  };

  const fetchRelatedPhotos = (videoName) => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/photos?videoName=${videoName}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          setRelatedPhotos(data);
        }
      })
      .catch((err) => console.error('Error fetching related photos:', err));
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
                Review captured violation videos and related evidence
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : videos.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {videos.map((video, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 cursor-pointer transition-all duration-200 hover:shadow-lg"
                    onClick={() => handleVideoSelect(video)}
                  >
                    <div className="relative aspect-video">
                      {thumbnails[index] ? (
                        <img
                          src={thumbnails[index]}
                          alt={`Thumbnail for ${video.name}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 animate-pulse"></div>
                      )}
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-blue-600"
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
                    <div className="p-4">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {video.name}
                      </p>
                      {video.violationType && (
                        <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                          {video.violationType}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Video Popup Modal */}
        <AnimatePresence>
          {selectedVideo && (
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="bg-white rounded-xl shadow-2xl w-full max-w-6xl overflow-hidden flex flex-col h-[90vh]"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Tabs */}
                <div className="border-b border-gray-200 bg-gray-50">
                  <nav className="flex">
                    <button
                      onClick={() => setActiveTab('video')}
                      className={`px-6 py-4 text-center border-b-2 font-medium text-sm ${activeTab === 'video'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                      Video Details
                    </button>
                    <button
                      onClick={() => setActiveTab('evidence')}
                      className={`px-6 py-4 text-center border-b-2 font-medium text-sm ${activeTab === 'evidence'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                      Related Evidence ({relatedPhotos.length})
                    </button>
                    <button
                      onClick={handleCloseModal}
                      className="ml-auto px-6 py-4 text-gray-500 hover:text-gray-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-auto">
                  <AnimatePresence mode="wait">
                    {activeTab === 'video' ? (
                      <motion.div
                        key="video-content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="h-full flex flex-col"
                      >
                        <div className="flex-1 bg-black flex items-center justify-center">
                          <video
                            className="w-full h-full object-contain"
                            controls
                            autoPlay
                          >
                            <source src={selectedVideo.url} type="video/mp4" />
                          </video>
                        </div>
                        <div className="p-6 border-t border-gray-200">
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            {selectedVideo.name}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedVideo.violationType && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                {selectedVideo.violationType}
                              </span>
                            )}
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                              {new Date(selectedVideo.timestamp || Date.now()).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="evidence-content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="p-6"
                      >
                        <h3 className="text-xl font-semibold text-gray-800 mb-6">
                          Evidence for {selectedVideo.name}
                        </h3>
                        {relatedPhotos.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedPhotos.map((photo, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                              >
                                <div className="h-48 bg-gray-100 overflow-hidden">
                                  <img
                                    src={photo.imageUrl}
                                    alt={`Evidence ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="p-4">
                                  <h4 className="font-medium text-gray-800 mb-1">
                                    {photo.violationType || `Evidence ${idx + 1}`}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    {new Date(photo.timestamp || Date.now()).toLocaleString()}
                                  </p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
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
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <h3 className="mt-4 text-sm font-medium text-gray-900">
                              No evidence available
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              No related evidence found for this video.
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DashboardLayout>
    </>
  );
};

export default Videos;