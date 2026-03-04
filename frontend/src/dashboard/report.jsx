import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import Navbar from '../components/Navbar';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

function Reports() {
  const [violations, setViolations] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchViolations();
  }, []);

  const fetchViolations = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/violations/all`);
      setViolations(res.data);
    } catch (error) {
      console.error('Error fetching violations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredViolations = violations.filter((v) => {
    const date = new Date(v.analyzedAt);
    const dateMatch =
      (!startDate || date >= new Date(startDate)) &&
      (!endDate || date <= new Date(endDate));
    const typeMatch = filterType === 'All' || v.violationType === filterType;
    return dateMatch && typeMatch;
  });

  const dailyCounts = {};
  const typeCounts = {};

  filteredViolations.forEach((v) => {
    const date = new Date(v.analyzedAt).toLocaleDateString();
    dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    typeCounts[v.violationType] = (typeCounts[v.violationType] || 0) + 1;
  });

  const handleExport = () => {
    const csv = Papa.unparse(
      filteredViolations.map((v) => ({
        Date: new Date(v.analyzedAt).toLocaleDateString(),
        Time: new Date(v.analyzedAt).toLocaleTimeString(),
        Type: v.violationType,
        Image: v.imageUrl,
      }))
    );
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'violation_report.csv');
  };

  // Professional color palette
  const colors = {
    background: '#f8fafc',
    cardBg: '#ffffff',
    primary: '#3b82f6',
    primaryDark: '#2563eb',
    text: '#1e293b',
    textLight: '#64748b',
    border: '#e2e8f0',
    chartColors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  };

  return (
    <>
      <Navbar />
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Traffic Violation Analytics
            </h1>
            <p className="text-gray-600 mb-6">
              Comprehensive analysis of detected traffic violations
            </p>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Violation Type
                  </label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="All">All Types</option>
                    <option value="No Helmet">No Helmet</option>
                    <option value="Phone Usage">Phone Usage</option>
                    <option value="Triple Riding">Triple Riding</option>
                    <option value="Wrong Way">Wrong Way</option>
                  </select>
                </div>
                <div className="self-end">
                  <button
                    onClick={handleExport}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Export CSV
                  </button>
                </div>
              </div>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {Object.entries(typeCounts).map(([type, count], index) => (
                    <div
                      key={type}
                      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-3"
                          style={{ backgroundColor: colors.chartColors[index] }}
                        ></div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                          {type}
                        </h3>
                      </div>
                      <p className="text-2xl font-bold text-gray-800 mt-2">
                        {count}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {((count / filteredViolations.length) * 100).toFixed(1)}% of total
                      </p>
                    </div>
                  ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Violation Trends
                    </h3>
                    <div className="h-80">
                      <Line
                        data={{
                          labels: Object.keys(dailyCounts),
                          datasets: [
                            {
                              label: 'Violations Count',
                              data: Object.values(dailyCounts),
                              borderColor: colors.primary,
                              backgroundColor: `${colors.primary}20`,
                              borderWidth: 2,
                              pointBackgroundColor: colors.primary,
                              pointRadius: 3,
                              pointHoverRadius: 5,
                              fill: true,
                              tension: 0.3,
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'top',
                              labels: {
                                color: colors.text,
                                font: {
                                  size: 12,
                                },
                              },
                            },
                          },
                          scales: {
                            x: {
                              grid: {
                                display: false,
                              },
                              ticks: {
                                color: colors.textLight,
                              },
                            },
                            y: {
                              beginAtZero: true,
                              grid: {
                                color: colors.border,
                              },
                              ticks: {
                                color: colors.textLight,
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Violation Distribution
                    </h3>
                    <div className="h-80">
                      <Pie
                        data={{
                          labels: Object.keys(typeCounts),
                          datasets: [
                            {
                              data: Object.values(typeCounts),
                              backgroundColor: colors.chartColors,
                              borderColor: colors.cardBg,
                              borderWidth: 1,
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'right',
                              labels: {
                                color: colors.text,
                                font: {
                                  size: 12,
                                },
                                padding: 20,
                                usePointStyle: true,
                                pointStyle: 'circle',
                              },
                            },
                            tooltip: {
                              callbacks: {
                                label: function (context) {
                                  const label = context.label || '';
                                  const value = context.raw || 0;
                                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                  const percentage = Math.round((value / total) * 100);
                                  return `${label}: ${value} (${percentage}%)`;
                                }
                              }
                            }
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Image Grid */}
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Violation Images
                    </h3>
                    <span className="text-sm text-gray-500">
                      {filteredViolations.length} records found
                    </span>
                  </div>
                  {filteredViolations.length === 0 ? (
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
                          strokeWidth={1}
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No violations found
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Try adjusting your filters to see results
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {filteredViolations.map((v, idx) => (
                        <div
                          key={idx}
                          className="group relative overflow-hidden rounded-md border border-gray-200 hover:shadow-md transition-shadow"
                        >
                          <img
                            src={v.imageUrl}
                            alt="Violation"
                            className="h-40 w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                            <p className="text-white text-sm font-medium">
                              {v.violationType}
                            </p>
                            <p className="text-white/80 text-xs">
                              {new Date(v.analyzedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="p-2 bg-white">
                            <p className="text-xs text-gray-700 truncate">
                              {v.violationType}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(v.analyzedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}

export default Reports;