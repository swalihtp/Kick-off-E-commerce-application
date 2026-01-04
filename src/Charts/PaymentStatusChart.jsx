import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#00C49F", "#FFBB28", "#FF8042"];

function PaymentStatusChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/orders").then((res) => {
      const counts = res.data.reduce((acc, order) => {
        acc[order.paymentStatus] = (acc[order.paymentStatus] || 0) + 1;
        return acc;
      }, {});
      setData(
        Object.entries(counts).map(([status, value]) => ({
          name: status,
          value,
        }))
      );
    });
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={120} label>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default PaymentStatusChart;
