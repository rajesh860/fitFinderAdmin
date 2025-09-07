import { Calendar } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import clsx from "clsx";
import "./styles.scss";

export default function AttendanceCalendar({
  monthDate,
  setMonthDate,
  dataMap,
}) {
  // ✅ Handle month navigation
  const handlePrevMonth = () => {
    const newMonthDate = monthDate.subtract(1, "month");
    setMonthDate(newMonthDate);
  };

  const handleNextMonth = () => {
    const newMonthDate = monthDate.add(1, "month");
    setMonthDate(newMonthDate);
  };

  // ✅ Render custom cell for each date
  const dateFullCellRender = (value) => {
    const key = value.format("YYYY-MM-DD");
    const status = dataMap[key];

    if (value.month() !== monthDate.month()) {
      return <div className="cell empty" />;
    }

    return (
      <div className={clsx("cell", status)}>
        <div className="day">{value.date()}</div>
      </div>
    );
  };

  // ✅ Custom month navigation header
  const headerRender = () => (
    <div className="calendar-header">
      <div className="title">
        <span className="month-title">{monthDate.format("MMMM YYYY")}</span>
      </div>

      <div className="btn-wrapper">
        <LeftOutlined className="nav-arrow" onClick={handlePrevMonth} />
        <RightOutlined className="nav-arrow" onClick={handleNextMonth} />
      </div>
    </div>
  );

  return (
    <div className="cal-wrap">
      <Calendar
        value={monthDate}
        headerRender={headerRender}
        dateFullCellRender={dateFullCellRender}
        fullscreen={false}
        className="attendance-cal"
      />

      {/* ✅ Legend */}
      <div className="legend">
        <span className="pill present" /> Present
        <span className="pill absent" /> Absent
        <span className="pill today" /> Today
      </div>
    </div>
  );
}
