// import React, { useState, useEffect } from 'react';
// import Modal from 'react-modal';
// import axios from 'axios';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import { motion } from 'framer-motion';
// import DashboardLayout from '../components/DashboardLayout';
// import Navbar from '../components/Navbar';

// Modal.setAppElement('#root');

// const Photos = () => {
//   const [violations, setViolations] = useState([]);
//   const [filteredViolations, setFilteredViolations] = useState([]);
//   const [selectedViolation, setSelectedViolation] = useState(null);
//   const [filterType, setFilterType] = useState('all');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     axios.get('http://localhost:5000/api/violations')
//       .then(response => {
//         setViolations(response.data);
//         setFilteredViolations(response.data);
//         setLoading(false);
//       })
//       .catch(error => {
//         console.error('Error fetching violations:', error);
//         setLoading(false);
//       });
//   }, []);

//   useEffect(() => {
//     let filtered = violations;

//     if (filterType !== 'all') {
//       filtered = filtered.filter((violation) => {
//         if (filterType === 'noHelmet') return violation.noHelmet === 1;
//         if (filterType === 'tripling') return violation.tripling === 1;
//         if (filterType === 'phoneUsage') return violation.phoneUsage === 1;
//         return true;
//       });
//     }

//     setFilteredViolations(filtered);
//   }, [filterType, violations]);

//   const openModal = (violation) => {
//     setSelectedViolation(violation);
//   };

//   const closeModal = () => {
//     setSelectedViolation(null);
//   };

//   const downloadPDF = async () => {
//     const input = document.getElementById('violation-details');
//     const canvas = await html2canvas(input);
//     const imgData = canvas.toDataURL('image/png');
//     const pdf = new jsPDF();
//     const imgProps = pdf.getImageProperties(imgData);
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
//     pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
//     pdf.save('violation_details.pdf');
//   };

//   return (
//     <>
//       <Navbar />
//       <DashboardLayout>
//         <div className="w-screen min-h-screen bg-black text-white m-0 p-0 pt-0">

//           {loading ? (
//             <div className="flex justify-center items-center h-[70vh]">
//               <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
//             </div>
//           ) : (
//             <>
//               <div className="flex flex-wrap gap-4 mb-6 justify-center pt-6">
//                 {['all', 'noHelmet', 'tripling', 'phoneUsage'].map((type) => (
//                   <motion.button
//                     key={type}
//                     whileHover={{ scale: 1.1 }}
//                     whileTap={{ scale: 0.95 }}
//                     className={`px-4 py-2 rounded-full ${filterType === type ? 'bg-blue-600 text-white' : 'bg-gray-300 text-black'} hover:bg-blue-500`}
//                     onClick={() => setFilterType(type)}
//                   >
//                     {type === 'all' ? 'All' : type === 'noHelmet' ? 'No Helmet' : type === 'tripling' ? 'Tripling' : 'Phone Usage'}
//                   </motion.button>
//                 ))}
//               </div>

//               <div className="flex flex-col items-center gap-4 pb-4">
//                 {filteredViolations.map((violation, index) => (
//                   <motion.div
//                     key={index}
//                     onClick={() => openModal(violation)}
//                     initial={{ opacity: 0, y: 50 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: index * 0.1, duration: 0.5 }}
//                     whileHover={{ scale: 1.05 }}
//                     className="cursor-pointer flex flex-col items-center w-full max-w-2xl bg-white rounded-lg p-4 shadow-md hover:shadow-xl transition duration-300"
//                   >
//                     <img
//                       src={violation.imageUrl}
//                       alt={`Violation image taken at ${new Date(violation.analyzedAt).toLocaleString()}`}
//                       className="rounded-lg w-full h-auto object-cover"
//                     />
//                     <div className="text-black text-center mt-4">
//                       <p><span className="font-semibold">Date:</span> {new Date(violation.analyzedAt).toLocaleString()}</p>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             </>
//           )}

//           <Modal
//             isOpen={!!selectedViolation}
//             onRequestClose={closeModal}
//             contentLabel="Violation Details"
//             style={{
//               overlay: {
//                 backgroundColor: 'rgba(0, 0, 0, 0.9)',
//                 zIndex: 1000,
//                 padding: 0,
//               },
//               content: {
//                 top: 0,
//                 left: 0,
//                 right: 0,
//                 bottom: 0,
//                 padding: 0,
//                 borderRadius: 0,
//                 border: 'none',
//                 overflow: 'hidden',
//                 background: 'transparent',
//               }
//             }}
//           >
//             {selectedViolation && (
//               <motion.div
//                 id="violation-details"
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 transition={{ type: 'spring', stiffness: 100, damping: 20 }}
//                 className="flex w-full h-full bg-white overflow-hidden"
//               >
//                 <div className="w-2/3 bg-black flex items-center justify-center p-4">
//                   <img
//                     src={selectedViolation.imageUrl}
//                     alt="Violation Enlarged"
//                     className="object-contain h-full w-full rounded-lg"
//                   />
//                 </div>

//                 <div className="w-1/3 bg-white p-8 overflow-y-auto flex flex-col justify-between">
//                   <div>
//                     <h2 className="text-3xl font-bold mb-8 text-center">Violation Details</h2>
//                     <div className="space-y-4">
//                       <div className="text-lg">
//                         <span className="font-semibold">Detected Violations:</span>
//                         <div className="mt-2 space-y-2">
//                           {selectedViolation.noHelmet === 1 && (
//                             <div className="flex items-center space-x-2">
//                               <span className="text-red-500 text-xl">🛑</span>
//                               <span>No Helmet</span>
//                             </div>
//                           )}
//                           {selectedViolation.tripling === 1 && (
//                             <div className="flex items-center space-x-2">
//                               <span className="text-yellow-500 text-xl">🛵</span>
//                               <span>Triple Riding</span>
//                             </div>
//                           )}
//                           {selectedViolation.phoneUsage === 1 && (
//                             <div className="flex items-center space-x-2">
//                               <span className="text-blue-500 text-xl">📱</span>
//                               <span>Phone Usage</span>
//                             </div>
//                           )}
//                           {selectedViolation.noHelmet === 0 &&
//                             selectedViolation.tripling === 0 &&
//                             selectedViolation.phoneUsage === 0 && (
//                               <div className="text-gray-500">No Violations Detected</div>
//                           )}
//                         </div>
//                       </div>

//                       <p className="text-lg">
//                         <span className="font-semibold">Analyzed At:</span><br />
//                         {selectedViolation.analyzedAt ? new Date(selectedViolation.analyzedAt).toLocaleString() : 'N/A'}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex flex-col space-y-4 mt-8">
//                     <button
//                       onClick={downloadPDF}
//                       className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition duration-300"
//                     >
//                       Download as PDF
//                     </button>
//                     <motion.button
//                       whileHover={{ rotate: [0, -10, 10, -10, 10, 0], transition: { duration: 0.6 } }}
//                       onClick={closeModal}
//                       className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition duration-300"
//                     >
//                       Close
//                     </motion.button>
//                   </div>
//                 </div>
//               </motion.div>
//             )}
//           </Modal>
//         </div>
//       </DashboardLayout>
//     </>
//   );
// };

// export default Photos;



import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import Navbar from '../components/Navbar';

Modal.setAppElement('#root');

const Photos = () => {
  const [violations, setViolations] = useState([]);
  const [filteredViolations, setFilteredViolations] = useState([]);
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchViolations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/violations`);
        setViolations(response.data);
        setFilteredViolations(response.data);
      } catch (error) {
        console.error('Error fetching violations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchViolations();
  }, []);

  useEffect(() => {
    let filtered = violations;

    if (filterType !== 'all') {
      filtered = filtered.filter((violation) => {
        if (filterType === 'noHelmet') return violation.noHelmet === 1;
        if (filterType === 'tripling') return violation.tripling === 1;
        if (filterType === 'phoneUsage') return violation.phoneUsage === 1;
        return true;
      });
    }

    if (searchTerm) {
      filtered = filtered.filter(violation =>
        new Date(violation.analyzedAt).toLocaleString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredViolations(filtered);
  }, [filterType, violations, searchTerm]);

  const openModal = (violation) => {
    setSelectedViolation(violation);
  };

  const closeModal = () => {
    setSelectedViolation(null);
  };

  const downloadPDF = async () => {
    const input = document.getElementById('violation-details');
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`violation_${selectedViolation._id}.pdf`);
  };

  const getViolationCount = (type) => {
    return violations.filter(v => v[type] === 1).length;
  };

  return (
    <>
      <Navbar />
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Traffic Violation Gallery</h1>
              <p className="text-gray-600 mt-2">
                Review and analyze captured traffic violations
              </p>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                    Search by date
                  </label>
                  <input
                    type="text"
                    id="search"
                    placeholder="Search by date..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    { type: 'all', label: 'All', color: 'gray' },
                    { type: 'noHelmet', label: 'No Helmet', color: 'red' },
                    { type: 'tripling', label: 'Tripling', color: 'yellow' },
                    { type: 'phoneUsage', label: 'Phone Usage', color: 'blue' }
                  ].map(({ type, label, color }) => (
                    <motion.button
                      key={type}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filterType === type
                          ? `bg-${color}-600 text-white shadow-md`
                          : `bg-${color}-100 text-${color}-800 hover:bg-${color}-200`
                        }`}
                      onClick={() => setFilterType(type)}
                    >
                      {label} {type !== 'all' && `(${getViolationCount(type)})`}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredViolations.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400"
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
                <h3 className="mt-4 text-lg font-medium text-gray-900">No violations found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filterType !== 'all'
                    ? "Try adjusting your search or filter criteria"
                    : "No violations have been recorded yet"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredViolations.map((violation, index) => (
                  <motion.div
                    key={violation._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => openModal(violation)}
                  >
                    <div className="relative aspect-video">
                      <img
                        src={violation.imageUrl}
                        alt={`Violation captured at ${new Date(violation.analyzedAt).toLocaleString()}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <div className="flex gap-2">
                          {violation.noHelmet === 1 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              No Helmet
                            </span>
                          )}
                          {violation.tripling === 1 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Tripling
                            </span>
                          )}
                          {violation.phoneUsage === 1 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Phone Usage
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-500">
                        {new Date(violation.analyzedAt).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Modal */}
          <Modal
            isOpen={!!selectedViolation}
            onRequestClose={closeModal}
            contentLabel="Violation Details"
            style={{
              overlay: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(4px)',
                zIndex: 50,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '1rem',
              },
              content: {
                position: 'relative',
                inset: 'auto',
                width: '90%',
                maxWidth: '1200px',
                maxHeight: '90vh',
                padding: 0,
                borderRadius: '0.75rem',
                border: 'none',
                overflow: 'hidden',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              }
            }}
          >
            {selectedViolation && (
              <motion.div
                id="violation-details"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col lg:flex-row w-full h-full"
              >
                <div className="lg:w-2/3 bg-gray-900 flex items-center justify-center p-8">
                  <img
                    src={selectedViolation.imageUrl}
                    alt="Violation Enlarged"
                    className="max-h-[70vh] object-contain rounded-lg shadow-xl"
                  />
                </div>

                <div className="lg:w-1/3 bg-white p-6 overflow-y-auto">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Violation Details</h2>
                    <button
                      onClick={closeModal}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Timestamp</h3>
                      <p className="mt-1 text-lg text-gray-900">
                        {new Date(selectedViolation.analyzedAt).toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Detected Violations</h3>
                      <div className="mt-3 space-y-3">
                        {selectedViolation.noHelmet === 1 && (
                          <div className="flex items-center p-3 rounded-lg bg-red-50">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                              </svg>
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-red-800">No Helmet</p>
                              <p className="text-sm text-red-600">Safety violation detected</p>
                            </div>
                          </div>
                        )}

                        {selectedViolation.tripling === 1 && (
                          <div className="flex items-center p-3 rounded-lg bg-yellow-50">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                              <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                              </svg>
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-yellow-800">Triple Riding</p>
                              <p className="text-sm text-yellow-600">Overcapacity violation</p>
                            </div>
                          </div>
                        )}

                        {selectedViolation.phoneUsage === 1 && (
                          <div className="flex items-center p-3 rounded-lg bg-blue-50">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-blue-800">Phone Usage</p>
                              <p className="text-sm text-blue-600">Distracted driving detected</p>
                            </div>
                          </div>
                        )}

                        {selectedViolation.noHelmet === 0 &&
                          selectedViolation.tripling === 0 &&
                          selectedViolation.phoneUsage === 0 && (
                            <div className="text-center py-4 text-gray-500">
                              No violations detected in this image
                            </div>
                          )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <button
                      onClick={downloadPDF}
                      className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Report
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </Modal>
        </div>
      </DashboardLayout>
    </>
  );
};

export default Photos;