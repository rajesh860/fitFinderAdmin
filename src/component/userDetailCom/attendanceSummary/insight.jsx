import React from "react";
import { Card } from "antd";
import "./styles.scss";

const Insights = ({ attendanceData = [] }) => {
  // Compute most active time & average session from attendanceData if available
  // For now, we keep placeholders, you can enhance later
  const currentStreak = (() => {
    if (!attendanceData.length) return 0;
    let streak = 0;
    let today = new Date();
    for (let i = attendanceData.length - 1; i >= 0; i--) {
      if (attendanceData[i].status === "present") streak++;
      else break;
    }
    return streak;
  })();

  return (
    <Card className="insights-card">
      <h3 className="card-title">Insights</h3>
      <div className="card-row">
        <span>Most Active Time</span>
        <span className="white">6:00 AM - 8:00 AM</span>
      </div>
      <div className="card-row">
        <span>Avg Session Time</span>
        <span className="white">1hr 45min</span>
      </div>
      <div className="card-row">
        <span>Current Streak</span>
        <span className="green">{currentStreak} days</span>
      </div>
    </Card>
  );
};

export default Insights;
