


// // import React, { useEffect, useState } from 'react';
// // import Navbar from '../components/Navbar';
// // import DashboardLayout from '../components/DashboardLayout';
// // import {
// //   PieChart, Pie, Cell, Tooltip, AreaChart, Area,
// //   XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer
// // } from 'recharts';

// // const Statistics = () => {
// //   const [data, setData] = useState([]);
// //   const [total, setTotal] = useState(0);
// //   const [filteredData, setFilteredData] = useState([]);

// //   const COLORS = ['#00c6ff', '#5be9ff', '#87f5fb'];

// //   useEffect(() => {
// //     const fetchStatistics = async () => {
// //       try {
// //         const response = await fetch('http://localhost:5000/api/violations');
// //         const result = await response.json();

// //         if (response.ok) {
// //           setData(result);
// //           setTotal(result.length);
// //           filterData(result);
// //         } else {
// //           console.error('Failed to fetch statistics:', result.message);
// //         }
// //       } catch (error) {
// //         console.error('Error fetching statistics:', error);
// //       }
// //     };

// //     const filterData = (allData) => {
// //       const noHelmet = allData.filter(item => item.violationType === "No Helmet").length;
// //       const phoneUsage = allData.filter(item => item.violationType === "Phone Usage").length;
// //       const tripling = allData.filter(item => item.violationType === "Triple Riding").length;

// //       setFilteredData([
// //         { name: "No Helmet", value: noHelmet },
// //         { name: "Phone Usage", value: phoneUsage },
// //         { name: "Triple Riding", value: tripling },
// //       ]);
// //     };

// //     fetchStatistics();
// //   }, []);

// //   const dataWithPercent = filteredData.map(item => ({
// //     ...item,
// //     percent: total > 0 ? ((item.value / total) * 100).toFixed(1) : 0
// //   }));

// //   return (
// //     <div className="h-screen w-full bg-black text-white">
// //       <Navbar />
// //       <DashboardLayout>
// //         <div className="w-full h-full p-6 sm:p-8 bg-black text-white">
// //           <header className="mb-10 text-center">
// //             <h1 className="text-4xl font-bold text-white mb-2">Traffic Violation Statistics</h1>
// //             <p className="text-lg text-blue-300">Total Detections: {total}</p>
// //           </header>

// //           <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
// //             {dataWithPercent.map((item, idx) => (
// //               <div
// //                 key={idx}
// //                 className="bg-gray-900 rounded-2xl shadow-md p-6 flex flex-col items-center border border-gray-700 hover:shadow-xl transition"
// //               >
// //                 <h2 className="text-xl font-semibold mb-2 text-blue-100">{item.name}</h2>
// //                 <p className="text-3xl font-bold text-blue-400">{item.percent}%</p>
// //                 <p className="text-sm text-blue-200 mt-1">{item.value} detections</p>
// //               </div>
// //             ))}
// //           </section>

// //           <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
// //             <div className="bg-gray-900 rounded-2xl shadow-md p-6 border border-gray-700">
// //               <h2 className="text-xl font-semibold text-center mb-4 text-white">Violation Percentage</h2>
// //               <ResponsiveContainer width="100%" height={300}>
// //                 <PieChart>
// //                   <Pie
// //                     data={filteredData}
// //                     dataKey="value"
// //                     nameKey="name"
// //                     cx="50%"
// //                     cy="50%"
// //                     outerRadius={100}
// //                     label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
// //                   >
// //                     {filteredData.map((entry, idx) => (
// //                       <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
// //                     ))}
// //                   </Pie>
// //                   <Tooltip
// //                     contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: 'white' }}
// //                     itemStyle={{ color: 'white' }}
// //                   />
// //                 </PieChart>
// //               </ResponsiveContainer>
// //             </div>

// //             <div className="bg-gray-900 rounded-2xl shadow-md p-6 border border-gray-700">
// //               <h2 className="text-xl font-semibold text-center mb-4 text-white">Violation Trends</h2>
// //               <ResponsiveContainer width="100%" height={300}>
// //                 <AreaChart data={filteredData}>
// //                   <defs>
// //                     <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
// //                       <stop offset="0%" stopColor="#00c6ff" stopOpacity={0.8} />
// //                       <stop offset="100%" stopColor="#00c6ff" stopOpacity={0.1} />
// //                     </linearGradient>
// //                   </defs>
// //                   <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// //                   <XAxis dataKey="name" stroke="#E5E7EB" />
// //                   <YAxis allowDecimals={false} stroke="#E5E7EB" />
// //                   <Tooltip
// //                     contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: 'white' }}
// //                     itemStyle={{ color: 'white' }}
// //                   />
// //                   <Legend />
// //                   <Area
// //                     type="monotone"
// //                     dataKey="value"
// //                     stroke="#00c6ff"
// //                     fill="url(#colorValue)"
// //                     strokeWidth={3}
// //                     activeDot={{ r: 6 }}
// //                   />
// //                 </AreaChart>
// //               </ResponsiveContainer>
// //             </div>
// //           </section>
// //         </div>
// //       </DashboardLayout>
// //     </div>
// //   );
// // };

// // export default Statistics;


// import React, { useEffect, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import Navbar from '../components/Navbar';
// import DashboardLayout from '../components/DashboardLayout';
// import {
//   PieChart, Pie, Cell, Tooltip, AreaChart, Area,
//   XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer
// } from 'recharts';

// const Statistics = () => {
//   const [data, setData] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [filteredData, setFilteredData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // Professional color palette
//   const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
//   const CARD_COLORS = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-red-500', 'bg-purple-500'];
//   const CARD_HOVER = ['hover:bg-blue-600', 'hover:bg-emerald-600', 'hover:bg-amber-600', 'hover:bg-red-600', 'hover:bg-purple-600'];

//   useEffect(() => {
//     const fetchStatistics = async () => {
//       try {
//         setIsLoading(true);
//         const response = await fetch('http://localhost:5000/api/violations');
//         const result = await response.json();

//         if (response.ok) {
//           setData(result);
//           setTotal(result.length);
//           filterData(result);
//         } else {
//           console.error('Failed to fetch statistics:', result.message);
//         }
//       } catch (error) {
//         console.error('Error fetching statistics:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     const filterData = (allData) => {
//       const violations = [
//         "No Helmet",
//         "Phone Usage",
//         "Triple Riding",
//         "Red Light Jump",
//         "Wrong Way"
//       ];

//       const filtered = violations.map(violation => ({
//         name: violation,
//         value: allData.filter(item => item.violationType === violation).length
//       }));

//       setFilteredData(filtered);
//     };

//     fetchStatistics();
//   }, []);

//   const dataWithPercent = filteredData.map((item, idx) => ({
//     ...item,
//     percent: total > 0 ? ((item.value / total) * 100).toFixed(1) : 0,
//     color: COLORS[idx % COLORS.length],
//     cardColor: CARD_COLORS[idx % CARD_COLORS.length],
//     hoverColor: CARD_HOVER[idx % CARD_HOVER.length]
//   }));

//   // Animation variants
//   const container = {
//     hidden: { opacity: 0 },
//     show: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1
//       }
//     }
//   };

//   const item = {
//     hidden: { opacity: 0, y: 20 },
//     show: { opacity: 1, y: 0 }
//   };

//   return (
//     <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
//       <Navbar />
//       <DashboardLayout>
//         <div className="w-full p-4 sm:p-6">
//           <motion.header 
//             className="mb-8 text-center"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
//               Traffic Violation Analytics
//             </h1>
//             <p className="text-lg text-gray-600">
//               Comprehensive overview of detected violations
//             </p>
//           </motion.header>

//           {isLoading ? (
//             <div className="flex justify-center items-center h-64">
//               <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//             </div>
//           ) : (
//             <>
//               <motion.div 
//                 className="mb-8 text-center"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.3 }}
//               >
//                 <div className="inline-block px-6 py-3 bg-white rounded-full shadow-md">
//                   <span className="text-gray-700 font-medium">Total Detections: </span>
//                   <span className="text-blue-600 font-bold text-xl">{total}</span>
//                 </div>
//               </motion.div>

//               <motion.section 
//                 className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-10"
//                 variants={container}
//                 initial="hidden"
//                 animate="show"
//               >
//                 {dataWithPercent.map((item, idx) => (
//                   <motion.div
//                     key={idx}
//                     variants={item}
//                     className={`${item.cardColor} ${item.hoverColor} rounded-xl shadow-lg p-5 text-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
//                   >
//                     <div className="flex items-center justify-between mb-2">
//                       <h2 className="text-lg font-semibold">{item.name}</h2>
//                       <div className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center">
//                         <span className="font-bold">{item.percent}%</span>
//                       </div>
//                     </div>
//                     <div className="text-2xl font-bold">{item.value}</div>
//                     <div className="h-1 bg-white/30 mt-2 rounded-full">
//                       <div 
//                         className="h-full bg-white rounded-full" 
//                         style={{ width: `${item.percent}%` }}
//                       ></div>
//                     </div>
//                   </motion.div>
//                 ))}
//               </motion.section>

//               <motion.section 
//                 className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.5 }}
//               >
//                 <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
//                   <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">
//                     Violation Distribution
//                   </h2>
//                   <ResponsiveContainer width="100%" height={350}>
//                     <PieChart>
//                       <Pie
//                         data={filteredData}
//                         dataKey="value"
//                         nameKey="name"
//                         cx="50%"
//                         cy="50%"
//                         outerRadius={120}
//                         innerRadius={60}
//                         paddingAngle={2}
//                         label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                         labelLine={false}
//                       >
//                         {filteredData.map((entry, idx) => (
//                           <Cell 
//                             key={`cell-${idx}`} 
//                             fill={COLORS[idx % COLORS.length]} 
//                             stroke="#fff"
//                             strokeWidth={2}
//                           />
//                         ))}
//                       </Pie>
//                       <Tooltip
//                         contentStyle={{ 
//                           backgroundColor: '#fff',
//                           borderColor: '#e5e7eb',
//                           borderRadius: '0.5rem',
//                           boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
//                           color: '#1f2937'
//                         }}
//                         itemStyle={{ color: '#1f2937' }}
//                         formatter={(value, name, props) => [
//                           value, 
//                           `${name}: ${((props.payload.percent) * 100).toFixed(1)}%`
//                         ]}
//                       />
//                       <Legend 
//                         layout="horizontal"
//                         verticalAlign="bottom"
//                         align="center"
//                         wrapperStyle={{ paddingTop: '20px' }}
//                       />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>

//                 <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
//                   <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">
//                     Violation Trends
//                   </h2>
//                   <ResponsiveContainer width="100%" height={350}>
//                     <AreaChart data={filteredData}>
//                       <defs>
//                         <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
//                           <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
//                           <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
//                         </linearGradient>
//                       </defs>
//                       <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
//                       <XAxis 
//                         dataKey="name" 
//                         stroke="#6b7280"
//                         tickLine={false}
//                         axisLine={false}
//                       />
//                       <YAxis 
//                         allowDecimals={false} 
//                         stroke="#6b7280"
//                         tickLine={false}
//                         axisLine={false}
//                       />
//                       <Tooltip
//                         contentStyle={{ 
//                           backgroundColor: '#fff',
//                           borderColor: '#e5e7eb',
//                           borderRadius: '0.5rem',
//                           boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
//                           color: '#1f2937'
//                         }}
//                       />
//                       <Area
//                         type="monotone"
//                         dataKey="value"
//                         stroke="#3B82F6"
//                         fill="url(#colorValue)"
//                         strokeWidth={3}
//                         activeDot={{ 
//                           r: 6, 
//                           stroke: '#fff',
//                           strokeWidth: 2,
//                           fill: '#3B82F6'
//                         }}
//                       />
//                     </AreaChart>
//                   </ResponsiveContainer>
//                 </div>
//               </motion.section>
//             </>
//           )}
//         </div>
//       </DashboardLayout>
//     </div>
//   );
// };

// export default Statistics;




import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import DashboardLayout from '../components/DashboardLayout';
import {
  PieChart, Pie, Cell, Tooltip, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer
} from 'recharts';

const Statistics = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Professional color palette for 3 violation types
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B']; // Blue, Emerald, Amber
  const CARD_COLORS = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500'];
  const CARD_HOVER = ['hover:bg-blue-600', 'hover:bg-emerald-600', 'hover:bg-amber-600'];

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/violations`);
        const result = await response.json();

        if (response.ok) {
          setData(result);
          setTotal(result.length);
          filterData(result);
        } else {
          console.error('Failed to fetch statistics:', result.message);
        }
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const filterData = (allData) => {
      const violations = [
        "No Helmet",
        "Phone Usage",
        "Triple Riding"
      ];

      const filtered = violations.map(violation => ({
        name: violation,
        value: allData.filter(item => item.violationType === violation).length
      }));

      setFilteredData(filtered);
    };

    fetchStatistics();
  }, []);

  const dataWithPercent = filteredData.map((item, idx) => ({
    ...item,
    percent: total > 0 ? ((item.value / total) * 100).toFixed(1) : 0,
    color: COLORS[idx % COLORS.length],
    cardColor: CARD_COLORS[idx % CARD_COLORS.length],
    hoverColor: CARD_HOVER[idx % CARD_HOVER.length]
  }));

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <DashboardLayout>
        <div className="w-full p-4 sm:p-6">
          <motion.header
            className="mb-8 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
              Traffic Violation Analytics
            </h1>
            <p className="text-lg text-gray-600">
              Comprehensive overview of detected violations
            </p>
          </motion.header>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <motion.div
                className="mb-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="inline-block px-6 py-3 bg-white rounded-full shadow-md">
                  <span className="text-gray-700 font-medium">Total Detections: </span>
                  <span className="text-blue-600 font-bold text-xl">{total}</span>
                </div>
              </motion.div>

              <motion.section
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {dataWithPercent.map((item, idx) => (
                  <motion.div
                    key={idx}
                    variants={item}
                    className={`${item.cardColor} ${item.hoverColor} rounded-xl shadow-lg p-5 text-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-lg font-semibold">{item.name}</h2>
                      <div className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center">
                        <span className="font-bold">{item.percent}%</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold">{item.value}</div>
                    <div className="h-1 bg-white/30 mt-2 rounded-full">
                      <div
                        className="h-full bg-white rounded-full"
                        style={{ width: `${item.percent}%` }}
                      ></div>
                    </div>
                  </motion.div>
                ))}
              </motion.section>

              <motion.section
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
                  <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">
                    Violation Distribution
                  </h2>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={filteredData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        innerRadius={60}
                        paddingAngle={2}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {filteredData.map((entry, idx) => (
                          <Cell
                            key={`cell-${idx}`}
                            fill={COLORS[idx % COLORS.length]}
                            stroke="#fff"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          borderColor: '#e5e7eb',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          color: '#1f2937'
                        }}
                        itemStyle={{ color: '#1f2937' }}
                        formatter={(value, name, props) => [
                          value,
                          `${name}: ${((props.payload.percent) * 100).toFixed(1)}%`
                        ]}
                      />
                      <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        wrapperStyle={{ paddingTop: '20px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
                  <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">
                    Violation Frequency
                  </h2>
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={filteredData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                      <XAxis
                        dataKey="name"
                        stroke="#6b7280"
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        allowDecimals={false}
                        stroke="#6b7280"
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          borderColor: '#e5e7eb',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          color: '#1f2937'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#3B82F6"
                        fill="url(#colorValue)"
                        strokeWidth={3}
                        activeDot={{
                          r: 6,
                          stroke: '#fff',
                          strokeWidth: 2,
                          fill: '#3B82F6'
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.section>
            </>
          )}
        </div>
      </DashboardLayout>
    </div>
  );
};

export default Statistics;