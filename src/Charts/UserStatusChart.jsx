import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#FF0000"];

function UserStatusChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/users").then((res) => {
      const counts = res.data.reduce((acc, user) => {
        acc[user.status || "active"] = (acc[user.status || "active"] || 0) + 1;
        return acc;
      }, {});
      setData(Object.entries(counts).map(([name, value]) => ({ name, value })));
    });
  }, []);

  return (
    <>
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
    </>
  );
}

export default UserStatusChart;
