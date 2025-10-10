import React, { useState, useMemo } from "react";
import { Card, Select, Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import moment from "moment";
import "./styles.scss";

const { Option } = Select;

const AttendanceCalendar = ({
  attendanceData = [],
  membership_start,
  membership_end,
  planHistory,
  selectedMembershipId,
  setSelectedMembershipId,
  planLoading,
}) => {
  // ✅ Convert start & end dates to moment
  const joinDateObj = membership_start ? moment(membership_start) : null;
  const endDateObj = membership_end ? moment(membership_end) : null;

  // ✅ Current month set as start month
  const [currentMonth, setCurrentMonth] = useState(
    joinDateObj ? joinDateObj.clone().startOf("month") : moment().startOf("month")
  );

  const today = moment();

  // ✅ Attendance lookup (YYYY-MM-DD -> status)
  const attendanceLookup = useMemo(() => {
    const lookup = {};
    attendanceData.forEach((att) => {
      const dateStr = moment(att.date).format("YYYY-MM-DD");
      lookup[dateStr] = att.status;
    });
    return lookup;
  }, [attendanceData]);

  // ✅ Navigation control
  const handlePrevMonth = () => {
    const prevMonth = currentMonth.clone().subtract(1, "month");
    if (joinDateObj && prevMonth.isBefore(joinDateObj, "month")) return; // don't go before start
    setCurrentMonth(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = currentMonth.clone().add(1, "month");
    if (endDateObj && nextMonth.isAfter(endDateObj, "month")) return; // don't go after end
    setCurrentMonth(nextMonth);
  };

  const isPrevDisabled = joinDateObj && currentMonth.isSame(joinDateObj, "month");
  const isNextDisabled = endDateObj && currentMonth.isSame(endDateObj, "month");

  // ✅ Calendar Grid Generate
  const daysInMonth = currentMonth.daysInMonth();
  const startDay = currentMonth.startOf("month").day();
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

  // ✅ Day class generator
  const getDayClass = (day) => {
    if (!day) return "empty";
    const dayObj = currentMonth.clone().date(day);
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
      {/* Header with Plan Dropdown + Arrows */}
      <div className="calendar-header">
        <div className="calendar-title">
          <h4>{currentMonth.format("MMMM YYYY")}</h4>

          <Select
            style={{ width: 260, marginTop: 8 }}
            loading={planLoading}
            value={selectedMembershipId || "No Plan Found"}
            onChange={(value) => setSelectedMembershipId(value)}
            
          >
            {planHistory?.data?.map((plan) => (
              <Option key={plan._id} value={plan._id}>
                {`${plan.plan?.name || "No Plan"} (${moment(
                  plan.membership_start
                ).format("DD MMM")} - ${moment(plan.membership_end).format("DD MMM")})`}
              </Option>
            ))}
          </Select>
        </div>
        <div className="calender-arrows">

        <Button
          icon={<LeftOutlined />}
          onClick={handlePrevMonth}
          disabled={isPrevDisabled}
          className="nav-btn"
          />
        <Button
          icon={<RightOutlined />}
          onClick={handleNextMonth}
          disabled={isNextDisabled}
          className="nav-btn"
          />
          </div>
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
