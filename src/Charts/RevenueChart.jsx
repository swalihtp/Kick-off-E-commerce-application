import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function RevenueChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/orders").then((res) => {
      const grouped = res.data.reduce((acc, order) => {
        const date = order.createdAt;
        acc[date] = (acc[date] || 0) + order.total;
        return acc;
      }, {});
      setData(Object.entries(grouped).map(([date, total]) => ({ date, total })));
    });
  }, []);
  
  

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="total" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default RevenueChart;
