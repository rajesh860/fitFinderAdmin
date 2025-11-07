import React from "react";
import { Card } from "antd";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import "./styles.scss";

const COLORS = ["#FFB300", "#00C853", "#9C27B0", "#2196F3", "#FF5252"];

const MembershipChart = ({ plansStats = [] }) => {
  // 🟣 Plan Distribution Pie Chart Data
  const planData =
    plansStats?.length > 0
      ? plansStats
          .filter((p) => p._id)
          .map((p) => ({ name: p._id, value: p.count }))
      : [
          { name: "Gold", value: 40 },
          { name: "Silver", value: 35 },
          { name: "Platinum", value: 25 },
        ];

 

  return (
    <Card bordered={false} className="membership-card">
      <h3 className="chart-title">Plans & Revenue Overview</h3>

      <div className="chart-wrapper">
        {/* 🔹 Pie Chart - Membership Distribution */}
        <div style={{ width: "100%", height: 280, marginBottom: 30 }}>
      
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={planData}
                innerRadius={70}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {planData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  color: "#fff",
                }}
                formatter={(value, name) => [`${value}`, `${name}`]}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                iconSize={10}
                formatter={(value) => (
                  <span style={{ color: "#fff", fontSize: 13 }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 🔹 Line Chart - Monthly Revenue */}
        {/* <div style={{ width: "100%", height: 280 }}>
          <h4 style={{ color: "#fff", marginBottom: 10 }}>
            Monthly Revenue (Last 12 Months)
          </h4>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="month" stroke="#a0a0a0" fontSize={12} />
              <YAxis
                stroke="#a0a0a0"
                fontSize={12}
                tickFormatter={(val) => `${val / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  color: "#fff",
                }}
                formatter={(value) => [`₹${value.toLocaleString()}`, "Revenue"]}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#00C853"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div> */}
      </div>
    </Card>
  );
};

export default MembershipChart;
