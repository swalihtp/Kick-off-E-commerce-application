import {
  LineChart, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

function OrdersChart({ data }) {
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-gray-900 font-semibold text-sm">{label}</p>
          <p className="text-blue-600 font-bold mt-1">
            {payload[0].value} orders
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom tick formatter for XAxis
  const formatXAxis = (tickItem) => {
    if (!tickItem) return '';
    // If it's a date string, show abbreviated format
    if (tickItem.includes('-')) {
      const date = new Date(tickItem);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return tickItem;
  };

  // Find max value for better YAxis scaling
  const maxValue = data ? Math.max(...data.map(item => item.count || 0)) : 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Orders Trend</h3>
          <p className="text-gray-500 text-sm mt-1">Daily order volume over time</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <div className="w-3 h-0.5 bg-blue-500 mr-2"></div>
            <span className="text-gray-600 text-sm">Orders</span>
          </div>
          <div className="px-3 py-1 bg-blue-50 rounded-full">
            <span className="text-blue-600 text-sm font-medium">
              {data ? data.length : 0} days
            </span>
          </div>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#f0f0f0" 
              vertical={false}
            />
            
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickFormatter={formatXAxis}
              tickMargin={10}
            />
            
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickMargin={10}
              domain={[0, maxValue * 1.1]}
            />
            
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: '#e5e7eb',
                strokeWidth: 1,
                strokeDasharray: '4 4'
              }}
            />
            
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{
                fill: "#3b82f6",
                stroke: "#ffffff",
                strokeWidth: 2,
                r: 4
              }}
              activeDot={{
                r: 6,
                fill: "#ffffff",
                stroke: "#3b82f6",
                strokeWidth: 3
              }}
              name="Orders"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="text-sm text-gray-500">
          <span className="text-gray-400">Peak: </span>
          <span className="font-semibold text-gray-700">
            {data ? Math.max(...data.map(item => item.count || 0)) : 0} orders
          </span>
        </div>
        <div className="text-sm text-gray-500">
          <span className="text-gray-400">Average: </span>
          <span className="font-semibold text-gray-700">
            {data ? Math.round(data.reduce((sum, item) => sum + (item.count || 0), 0) / data.length) : 0} orders/day
          </span>
        </div>
      </div>
    </div>
  );
}

export default OrdersChart;