import React from "react";
import { Card } from "antd";
import "./styles.scss";

const AttendanceSummary = ({ attendanceData = [] }) => {
  const totalDays = attendanceData.length;
  const presentDays = attendanceData.filter(att => att.status === "present").length;
  const absentDays = attendanceData.filter(att => att.status === "absent").length;
  const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  return (
    <Card className="attendance-card">
      <h3 className="card-title">Attendance Summary</h3>
      <div className="card-row">
        <span>Present Days</span>
        <span className="green">{presentDays}</span>
      </div>
      <div className="card-row">
        <span>Absent Days</span>
        <span className="red">{absentDays}</span>
      </div>
      <div className="card-row">
        <span>Attendance Rate</span>
        <span className="blue">{attendanceRate}%</span>
      </div>
    </Card>
  );
};

export default AttendanceSummary;
