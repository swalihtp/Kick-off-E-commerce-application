import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

function OrderStatusChart({ data }) {
  // Define a color palette for different statuses
  const COLORS = {
    'Pending': '#f59e0b', // amber-500
    'Processing': '#3b82f6', // blue-500
    'Shipped': '#8b5cf6', // violet-500
    'Delivered': '#10b981', // emerald-500
    'Cancelled': '#ef4444', // red-500
    'Refunded': '#6b7280' // gray-500
  };

  // Default colors if we don't know the status
  const DEFAULT_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6b7280'];

  // Calculate total orders
  const totalOrders = data ? data.reduce((sum, item) => sum + (item.count || 0), 0) : 0;

  // Process data to include percentages
  const processedData = data ? data.map(item => ({
    ...item,
    percentage: totalOrders > 0 ? ((item.count / totalOrders) * 100).toFixed(1) : '0.0',
    color: COLORS[item.order_status] || DEFAULT_COLORS[data.indexOf(item) % DEFAULT_COLORS.length]
  })) : [];

  // Custom tooltip component - FIXED VERSION
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 min-w-40">
          <div className="flex items-center mb-2">
            <div 
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: item.color }}
            ></div>
            <p className="text-gray-900 font-semibold capitalize">{item.order_status}</p>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-500">Orders:</span>
              <span className="text-gray-900 font-bold">{item.count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Percentage:</span>
              <span className="text-gray-900 font-bold">{item.percentage}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Find most common status
  const mostCommonStatus = processedData.length > 0 
    ? processedData.reduce((max, item) => item.count > max.count ? item : max).order_status
    : 'N/A';

  // Calculate pending actions
  const pendingActions = processedData
    .filter(item => ['pending', 'processing'].includes(item.order_status.toLowerCase()))
    .reduce((sum, item) => sum + (item.count || 0), 0);

  // Calculate issues
  const issues = processedData
    .filter(item => ['cancelled', 'refunded'].includes(item.order_status.toLowerCase()))
    .reduce((sum, item) => sum + (item.count || 0), 0);

  // Calculate completion rate
  const completedCount = processedData.find(item => 
    item.order_status.toLowerCase() === 'delivered'
  )?.count || 0;
  
  const completionRate = totalOrders > 0 ? ((completedCount / totalOrders) * 100).toFixed(1) : '0.0';

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Order Status Distribution</h3>
          <p className="text-gray-500 text-sm mt-1">Breakdown of all orders by current status</p>
        </div>
        <div className="px-3 py-1 bg-purple-50 rounded-full">
          <span className="text-purple-600 text-sm font-medium">
            Total: {totalOrders} orders
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        {/* Chart Container */}
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={processedData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="count"
                nameKey="order_status"
                label={(entry) => `${entry.order_status}: ${entry.percentage}%`}
                labelLine={false}
              >
                {processedData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span className="text-gray-700 text-sm capitalize">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Status Details */}
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Status Overview</h4>
            <div className="space-y-3">
              {processedData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-gray-700 capitalize">{item.order_status}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-900 font-semibold">{item.count}</div>
                    <div className="text-gray-500 text-sm">{item.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Completion Rate */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {completionRate}%
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-gray-500">Most Common</p>
            <p className="text-gray-900 font-semibold capitalize">
              {mostCommonStatus}
            </p>
          </div>
          <div className="text-center p-3 bg-amber-50 rounded-lg">
            <p className="text-gray-500">Pending Actions</p>
            <p className="text-gray-900 font-semibold">
              {pendingActions}
            </p>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <p className="text-gray-500">Issues</p>
            <p className="text-gray-900 font-semibold">
              {issues}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderStatusChart;