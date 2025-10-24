

import * as React from 'react';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaShoppingCart, FaHeart, FaClock, FaFileAlt, FaCalendarCheck, FaCheckCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';

// Placeholder for vendor-specific orders (replace with actual API data)
const vendorOrders = [
  { action: 'Received order #7890', user: 'Customer A', time: '10 mins ago', icon: FaShoppingCart, color: 'text-blue-500' },
  { action: 'Shipped order #7889', user: 'You', time: '1 hour ago', icon: FaCheckCircle, color: 'text-green-500' },
  { action: 'Customer requested refund #7888', user: 'Customer B', time: '3 hours ago', icon: FaFileAlt, color: 'text-red-500' },
  { action: 'Scheduled delivery for #7887', user: 'You', time: '5 hours ago', icon: FaCalendarCheck, color: 'text-yellow-500' },
  { action: 'Completed order #7886', user: 'You', time: '1 day ago', icon: FaCheckCircle, color: 'text-indigo-500' },
];

// Placeholder for vendor-specific stats (replace with actual API data)
const vendorStats = [
  { label: 'Total Sales', value: '$2,500', change: '+15%', icon: FaShoppingCart, trend: 'up' },
  { label: 'Pending Orders', value: '5', change: '+2', icon: FaClock, trend: 'up' },
  { label: 'Customer Reviews', value: '12', change: '+3', icon: FaHeart, trend: 'up' },
  { label: 'Active Listings', value: '8', change: '-1', icon: FaFileAlt, trend: 'down' },
];

export default function VendorDashboard() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const [isVendor, setIsVendor] = useState(false);
  const [vendorData, setVendorData] = useState({ orders: [], stats: [] });

  useEffect(() => {
    async function fetchCustomerData() {
      if (!user?.id) return;

      try {
        const response = await axios.get(`http://localhost:5000/api/auth/customer/${user.id}`);
        const data = response.data.customer;
        console.log('Fetched customer data:', data);

        setIsVendor(data?.isVendor || false);

        if (data?.isVendor) {
          // Fetch vendor-specific data (replace with your actual API endpoint)
          const vendorResponse = await axios.get(`http://localhost:5000/api/vendor/${user.id}/dashboard`, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          setVendorData({
            orders: vendorResponse.data.orders || vendorOrders, // Fallback to static data if API fails
            stats: vendorResponse.data.stats || vendorStats, // Fallback to static data if API fails
          });
        } else {
          // Use default customer data if not a vendor
          setVendorData({
            orders: vendorOrders, // Replace with customer-specific orders if needed
            stats: vendorStats, // Replace with customer-specific stats if needed
          });
        }
      } catch (error) {
        console.error('Error fetching customer data:', error);
        // Fallback to static data on error
        setVendorData({
          orders: vendorOrders,
          stats: vendorStats,
        });
      }
    }

    fetchCustomerData();
  }, [user]);

  // Redirect to login if user is not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="space-y-6  min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Vendor Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {vendorData.stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
          >
            <div className="flex justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg ${stat.trend === 'up' ? 'bg-green-50' : stat.trend === 'down' ? 'bg-red-50' : 'bg-gray-50'} flex items-center justify-center`}>
                <stat.icon className={`${stat.trend === 'up' ? 'text-green-500' : stat.trend === 'down' ? 'text-red-500' : 'text-gray-500'}`} />
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-green-600' : stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                {stat.change}
              </span>
              <span className="text-xs text-gray-500 ml-2">vs last week</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders Summary */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">{isVendor ? 'Vendor Orders Pipeline' : 'Orders Pipeline'}</h2>
            <select className="mt-2 sm:mt-0 px-3 py-1 text-sm border border-gray-300 rounded-lg text-gray-600 bg-white">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last Quarter</option>
            </select>
          </div>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <svg
                className="w-24 h-24 text-gray-300 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <p className="mt-2 text-gray-500">{isVendor ? 'Vendor orders pipeline visualization' : 'Orders pipeline visualization'}</p>
            </div>
          </div>
        </div>

        {/* Order Sources */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">{isVendor ? 'Vendor Order Sources' : 'Order Sources'}</h2>
          <div className="flex flex-col items-center">
            <div className="relative w-40 h-40 mb-6">
              <svg
                className="w-40 h-40 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                />
              </svg>
            </div>
            <div className="w-full space-y-3">
              {[
                { source: isVendor ? 'Online Store' : 'E-Commerce', percentage: 50, color: 'bg-blue-500' },
                { source: isVendor ? 'Bulk Orders' : 'Freelance Services', percentage: 30, color: 'bg-green-500' },
                { source: isVendor ? 'Custom Orders' : 'AI Designs', percentage: 15, color: 'bg-purple-500' },
                { source: 'Other', percentage: 5, color: 'bg-gray-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${item.color}`} />
                    <p className="text-sm text-gray-600">{item.source}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-800">{item.percentage}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">{isVendor ? 'Vendor Recent Activity' : 'Recent Activity'}</h2>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All Activity</button>
        </div>
        <div className="space-y-4">
          {vendorData.orders.map((item, i) => (
            <div key={i} className="flex items-start pb-4 border-b border-gray-100 last:border-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.color} bg-opacity-10 mr-3`}>
                <item.icon className={`${item.color} text-lg`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  {item.user} <span className="font-normal text-gray-600">{item.action}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">{item.time}</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-ellipsis-v"></i>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}




