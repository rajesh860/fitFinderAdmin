import React from "react";
import { Card } from "antd";
import {
  UsergroupAddOutlined,
  TeamOutlined,
  DollarOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import "./styles.scss";

const StatsCards = ({ analytics }) => {
  const statsData = [
    {
      title: "Total Members",
      value: analytics.totalMembers || 0,
      change: `${analytics.memberGrowthPercent >= 0 ? "+" : ""}${analytics.memberGrowthPercent}%`,
      subText: "vs last month",
      icon: <UsergroupAddOutlined />,
      iconBg: "#1e2b20",
      trend: analytics.memberGrowthPercent >= 0 ? "up" : "down",
    },
    {
      title: "Active Trainers",
      value: analytics.totalTrainers || 0,
      change: `${analytics.trainerGrowthPercent >= 0 ? "+" : ""}${analytics.trainerGrowthPercent}%`,
      subText: "vs last month",
      icon: <TeamOutlined />,
      iconBg: "#312a1c",
      trend: analytics.trainerGrowthPercent >= 0 ? "up" : "down",
    },
    {
      title: "Monthly Revenue",
      value: `₹${analytics.totalCollection?.toLocaleString() || 0}`,
      change: `${analytics.growthPercent >= 0 ? "+" : ""}${analytics.growthPercent}%`,
      subText: "vs last month",
      icon: <DollarOutlined />,
      iconBg: "#1e2b21",
      trend: analytics.growthPercent >= 0 ? "up" : "down",
    },
    {
      title: "Top Selling Plan",
      value: analytics.topSellingPlan?.name || "N/A",
      change: `${analytics.topSellingPlan?.soldCount || 0} sales`,
      subText: "highest sold plan",
      icon: <CalendarOutlined />,
      iconBg: "#1e2431",
      trend: "up",
    },
  ];

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
