import React from "react";
import { Card } from "antd";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "./styles.scss";

const data = [
  { name: "Gold", value: 45 },
  { name: "Silver", value: 40 },
  { name: "Platinum", value: 15 },
];

const COLORS = ["#FFB300", "#00C853", "#9C27B0"];

const MembershipChart = () => {
  return (
    <Card bordered={false} className="membership-card">
      <h3 className="chart-title">Membership Distribution</h3>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              innerRadius={70}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #333",
                color: "#fff",
              }}
              formatter={(value, name) => [`${value}%`, `${name}`]}
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
    </Card>
  );
};

export default MembershipChart;
