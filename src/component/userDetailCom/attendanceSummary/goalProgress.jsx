import React from "react";
import { Card, Progress } from "antd";
import "./styles.scss";

const GoalProgress = ({ attendanceData = [], monthlyTarget = 30 }) => {
  const presentDays = attendanceData.filter(att => att.status === "present").length;
  const percent = Math.round((presentDays / monthlyTarget) * 100);

  return (
    <Card className="goal-card">
      <h3 className="card-title">Goal Progress</h3>
      <div className="goal-progress">
        <span className="white">Monthly Goal</span>
        <span className="blue">{percent}%</span>
      </div>
      <Progress
        percent={percent}
        strokeColor={{ from: "#4facfe", to: "#8f00ff" }}
        status="active"
        showInfo={false}
      />
      <p className="goal-subtext">{presentDays} out of {monthlyTarget} target days completed</p>
    </Card>
  );
};

export default GoalProgress;
