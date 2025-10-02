import React, { useState } from "react";
import { Card, Select } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./styles.scss";

const { Option } = Select;

const data = [
  { month: "Jan", revenue: 65000 },
  { month: "Feb", revenue: 72000 },
  { month: "Mar", revenue: 68000 },
  { month: "Apr", revenue: 78000 },
  { month: "May", revenue: 85000 },
  { month: "Jun", revenue: 90000 },
];

const RevenueChart = () => {
  const [duration, setDuration] = useState("6");

  return (
    <Card bordered={false} className="revenue-card">
      <div className="revenue-header">
        <h3>Revenue Trends</h3>
        <Select
          value={duration}
          onChange={setDuration}
          className="duration-select"
          dropdownStyle={{ background: "#1a1a1a" }}
        >
          <Option value="3">Last 3 Months</Option>
          <Option value="6">Last 6 Months</Option>
          <Option value="12">Last 12 Months</Option>
        </Select>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis dataKey="month" stroke="#a0a0a0" fontSize={12} />
            <YAxis
              stroke="#a0a0a0"
              fontSize={12}
              tickFormatter={(val) => `${val / 1000}k`}
              domain={[60000, 95000]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #333",
                color: "#fff",
              }}
              formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]}
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
      </div>
    </Card>
  );
};

export default RevenueChart;
