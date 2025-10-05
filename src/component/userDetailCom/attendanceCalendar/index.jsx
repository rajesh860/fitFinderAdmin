// src/components/AttendanceCalendar.jsx
import React, { useState, useMemo } from "react";
import { Card, Select } from "antd";
import moment from "moment";
import "./styles.scss";

const { Option } = Select;

const AttendanceCalendar = ({ attendanceData = [], membership_start, membership_end }) => {
  const [month, setMonth] = useState(moment().month());
  const [year, setYear] = useState(moment().year());

  const joinDateObj = membership_start ? moment(membership_start) : null;
  const endDateObj = membership_end ? moment(membership_end) : null;
  const today = moment();

  // Attendance lookup keyed by YYYY-MM-DD
  const attendanceLookup = useMemo(() => {
    const lookup = {};
    attendanceData.forEach((att) => {
      const dateStr = moment(att.date).format("YYYY-MM-DD");
      lookup[dateStr] = att.status;
    });
    return lookup;
  }, [attendanceData]);

  // Generate weeks
  const daysInMonth = moment([year, month]).daysInMonth();
  const startDay = moment([year, month, 1]).day();
  const weeks = [];
  let currentDay = 1;
  for (let w = 0; w < 6; w++) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      if ((w === 0 && d < startDay) || currentDay > daysInMonth) {
        days.push(null);
      } else {
        days.push(currentDay++);
      }
    }
    weeks.push(days);
  }

  // Get class for each day
  const getDayClass = (day) => {
    if (!day) return "empty";

    const dayObj = moment([year, month, day]);
    const dayStr = dayObj.format("YYYY-MM-DD");

    if (joinDateObj && joinDateObj.isSame(dayObj, "day")) return "join";
    if (endDateObj && endDateObj.isSame(dayObj, "day")) return "end";
    if (today.isSame(dayObj, "day")) return "today";
    if (attendanceLookup[dayStr] === "present") return "present";
    if (attendanceLookup[dayStr] === "absent") return "absent";

    return "empty";
  };

  return (
    <Card className="calendar-card">
      {/* Header */}
      <div className="calendar-header">
        <Select
          value={month}
          onChange={(val) => setMonth(Number(val))}
          style={{ width: 120, marginRight: 10 }}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <Option key={i} value={i}>
              {moment().month(i).format("MMMM")}
            </Option>
          ))}
        </Select>

        <Select
          value={year}
          onChange={(val) => setYear(Number(val))}
          style={{ width: 100 }}
        >
          {Array.from({ length: 5 }, (_, i) => {
            const y = moment().year() - 2 + i;
            return (
              <Option key={y} value={y}>
                {y}
              </Option>
            );
          })}
        </Select>
      </div>

      {/* Calendar */}
      <div className="calendar">
        <div className="calendar-row header">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="calendar-cell header-cell">
              {d}
            </div>
          ))}
        </div>

        {weeks.map((week, wi) => (
          <div key={wi} className="calendar-row">
            {week.map((day, di) => {
              const cls = getDayClass(day);
              return (
                <div key={di} className={`calendar-cell ${cls}`}>
                  {day || ""}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="legend">
        <span className="legend-item">
          <span className="dot present"></span> Present
        </span>
        <span className="legend-item">
          <span className="dot absent"></span> Absent
        </span>
        <span className="legend-item">
          <span className="dot today"></span> Today
        </span>
        <span className="legend-item">
          <span className="dot join"></span> Join Date
        </span>
        <span className="legend-item">
          <span className="dot end"></span> End Date
        </span>
      </div>
    </Card>
  );
};

export default AttendanceCalendar;
