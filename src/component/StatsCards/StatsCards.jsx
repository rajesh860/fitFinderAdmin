import React from "react";
import { Card } from "antd";
import {
  UsergroupAddOutlined,
  TeamOutlined,
  DollarOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import "./styles.scss";

const statsData = [
  {
    title: "Total Members",
    value: "2,847",
    change: "+12%",
    subText: "vs last month",
    icon: <UsergroupAddOutlined />,
    iconBg: "#1e2b20",
    trend: "up",
  },
  {
    title: "Active Trainers",
    value: "24",
    change: "+3",
    subText: "new this month",
    icon: <TeamOutlined />,
    iconBg: "#312a1c",
    trend: "up",
  },
  {
    title: "Monthly Revenue",
    value: "$89,247",
    change: "+18%",
    subText: "vs last month",
    icon: <DollarOutlined />,
    iconBg: "#1e2b21",
    trend: "up",
  },
  {
    title: "Today's Bookings",
    value: "156",
    change: "-5%",
    subText: "vs yesterday",
    icon: <CalendarOutlined />,
    iconBg: "#1e2431",
    trend: "down",
  },
];

const StatsCards = () => {
  return (
    <>
      {statsData.map((stat, index) => (
        <Card key={index} className="stats-card" bordered={false}>
          <div className="stats-content">
            <div>
              <p className="stats-title">{stat.title}</p>
              <h2 className="stats-value">{stat.value}</h2>
              <p
                className={`stats-change ${
                  stat.trend === "up" ? "green" : "red"
                }`}
              >
                {stat.change}{" "}
                <span className="stats-subtext">{stat.subText}</span>
              </p>
            </div>
            <div
              className="stats-icon"
              style={{ backgroundColor: stat.iconBg }}
            >
              {stat.icon}
            </div>
          </div>
        </Card>
      ))}
    </>
  );
};

export default StatsCards;
