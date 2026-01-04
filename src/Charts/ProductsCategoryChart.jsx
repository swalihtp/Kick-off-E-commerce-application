import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function Chart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchingProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/products");
        const products = res.data;

        const count = products.reduce((acc, p) => {
          const key =
            (p.category && String(p.category).trim()) || "Uncategorized";
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});

        const formatted = Object.entries(count)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value);

        setData(formatted);
      } catch (err) {
        console.error("Something went wrong", err);
      }
    };

    fetchingProducts();
  }, []);

  const COLORS = ["#4b0082", "#ff7300", "#00C49F", "#FFBB28", "#8884d8"];

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"     
            nameKey="name"      
            cx="50%"
            cy="50%"
            outerRadius={120}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} products`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Chart;
