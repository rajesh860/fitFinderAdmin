// src/components/BodyStats.jsx
import {
  DashboardOutlined,
  ColumnHeightOutlined,
  HeartOutlined,
  DotChartOutlined,
  SlidersOutlined,
} from "@ant-design/icons";

import "./styles.scss";

const BodyStats = ({ progress }) => {
  const current = progress || {};

  // Ab stats array me values dynamically current object se le rahe hain
  const stats = [
    {
      label: "Weight",
      value: current.weight ? `${current.weight} kg` : "-",
      icon: <DashboardOutlined />,
      color: "#2563eb",
    },
    {
      label: "Height",
      value: current.height ? `${current.height} cm` : "-",
      icon: <ColumnHeightOutlined />,
      color: "#16a34a",
    },
    {
      label: "Arm",
      value: current.arm ? `${current.arm} cm` : "-",
      icon: <SlidersOutlined />,
      color: "#8b5cf6",
    },
    {
      label: "Chest",
      value: current.chest ? `${current.chest} cm` : "-",
      icon: <HeartOutlined />,
      color: "#ea580c",
    },
    {
      label: "Waist",
      value: current.waist ? `${current.waist} cm` : "-",
      icon: <DotChartOutlined />,
      color: "#dc2626",
    },
    {
      label: "Thigh",
      value: current.thigh ? `${current.thigh} cm` : "-",
      icon: <DotChartOutlined />,
      color: "#0d9488",
    },
  ];

  return (
    <div className="body-stats">
      {stats.map((item, index) => (
        <div
          className="stat-card"
          key={index}
          style={{ backgroundColor: item.color }}
        >
          <div className="stat-top">
            <span className="label">{item.label}</span>
            <span className="icon">{item.icon}</span>
          </div>
          <div className="value">{item.value}</div>
        </div>
      ))}
    </div>
  );
};

export default BodyStats;
