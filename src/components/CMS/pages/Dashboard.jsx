import { useContext } from 'react';

const Dashboard = () => {
  const stats = [
    { label: 'Total Users', value: '5,678', change: '+15%', icon: 'fas fa-users', trend: 'up' },
    { label: 'E-Commerce Sales', value: '$34,567', change: '+22%', icon: 'fas fa-shopping-cart', trend: 'up' },
    { label: 'Active Freelancers', value: '342', change: '+8%', icon: 'fas fa-user-tie', trend: 'up' },
    { label: 'AI Designs Generated', value: '1,245', change: '+45%', icon: 'fas fa-robot', trend: 'up' },
    { label: 'Social Posts', value: '876', change: '+12%', icon: 'fas fa-share-alt', trend: 'up' },
    { label: 'Avg. Session', value: '3m 12s', change: '+5%', icon: 'fas fa-chart-line', trend: 'up' },
  ];

  const recentActivity = [
    { action: 'New e-commerce order #4567', user: 'Customer', time: '15 mins ago', icon: 'fas fa-shopping-bag', color: 'text-green-500' },
    { action: 'Completed freelance project', user: 'Designer', time: '1 hour ago', icon: 'fas fa-palette', color: 'text-blue-500' },
    { action: 'Generated AI design template', user: 'AI System', time: '2 hours ago', icon: 'fas fa-robot', color: 'text-purple-500' },
    { action: 'Scheduled social media post', user: 'Marketer', time: '5 hours ago', icon: 'fas fa-calendar-alt', color: 'text-yellow-500' },
    { action: 'New user registration', user: 'System', time: '1 day ago', icon: 'fas fa-user-plus', color: 'text-indigo-500' },
  ];

  const quickActions = [
    { title: 'Add Product', icon: 'fas fa-plus', path: '/ecommerce/products/new' },
    { title: 'Create Project', icon: 'fas fa-project-diagram', path: '/freelancers/projects/new' },
    { title: 'Generate Design', icon: 'fas fa-magic', path: '/ai-design/generator' },
    { title: 'Schedule Post', icon: 'fas fa-calendar-plus', path: '/social/scheduler' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Dashboard Overview
        </h1>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200">
            Export Report
          </button>
          <button className="px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200">
            Refresh Data
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <a
            key={index}
            href={action.path}
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col items-center justify-center text-center"
          >
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
              <i className={`${action.icon} text-indigo-600`}></i>
            </div>
            <span className="text-sm font-medium text-gray-700">{action.title}</span>
          </a>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
          >
            <div className="flex justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg bg-${stat.trend === 'up' ? 'green' : 'red'}-50 flex items-center justify-center`}>
                <i className={`${stat.icon} text-${stat.trend === 'up' ? 'green' : 'red'}-500`}></i>
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </span>
              <span className="text-xs text-gray-500 ml-2">vs last week</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* E-Commerce Summary */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">E-Commerce Performance</h2>
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
              <p className="mt-2 text-gray-500">Sales performance chart</p>
            </div>
          </div>
        </div>

        {/* Platform Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Platform Distribution</h2>
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
                { platform: 'E-Commerce', percentage: 35, color: 'bg-indigo-500' },
                { platform: 'Freelancers', percentage: 25, color: 'bg-green-500' },
                { platform: 'AI Design', percentage: 20, color: 'bg-purple-500' },
                { platform: 'Social Media', percentage: 15, color: 'bg-yellow-500' },
                { platform: 'Other', percentage: 5, color: 'bg-gray-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${item.color}`} />
                    <p className="text-sm text-gray-600">{item.platform}</p>
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
          <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View All Activity
          </button>
        </div>
        
        <div className="space-y-4">
          {recentActivity.map((item, i) => (
            <div key={i} className="flex items-start pb-4 border-b border-gray-100 last:border-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.color} bg-opacity-10 mr-3`}>
                <i className={`${item.icon} ${item.color} text-lg`}></i>
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
};

export default Dashboard;