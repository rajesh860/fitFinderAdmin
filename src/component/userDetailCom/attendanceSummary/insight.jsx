import React from "react";
import { Card } from "antd";
import "./styles.scss";

const Insights = ({ attendanceData = [] }) => {
  // Compute current streak
  const currentStreak = (() => {
    if (!attendanceData.length) return 0;
    let streak = 0;
    for (let i = attendanceData.length - 1; i >= 0; i--) {
      if (attendanceData[i].status === "present") streak++;
      else break;
    }
    return streak;
  })();

  // Compute most active time
  const mostActiveTime = (() => {
    if (!attendanceData.length) return "N/A";
    const timeCount = {};
    attendanceData.forEach((a) => {
      if (a.status === "present" && a.time) {
        const hour = new Date(a.time).getHours(); // get hour of session
        timeCount[hour] = (timeCount[hour] || 0) + 1;
      }
    });
    const sortedHours = Object.entries(timeCount).sort((a, b) => b[1] - a[1]);
    if (!sortedHours.length) return "N/A";
    const peakHour = parseInt(sortedHours[0][0], 10);
    const start = peakHour;
    const end = (peakHour + 2) % 24; // 2-hour slot
    return `${start}:00 - ${end}:00`;
  })();

  // Compute average session time placeholder
  const avgSession = "1hr 45min"; // Can be computed dynamically if session duration is available

  return (
    <Card className="insights-card">
      <h3 className="card-title">Insights</h3>
      <div className="card-row">
        <span>Most Active Time</span>
        <span className="white">{mostActiveTime}</span>
      </div>
      <div className="card-row">
        <span>Avg Session Time</span>
        <span className="white">{avgSession}</span>
      </div>
      <div className="card-row">
        <span>Current Streak</span>
        <span className="green">{currentStreak} days</span>
      </div>
    </Card>
  );
};

export default Insights;
