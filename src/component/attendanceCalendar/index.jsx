import { Calendar } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import clsx from "clsx";
import "./styles.scss";

export default function AttendanceCalendar({
  monthDate,
  setMonthDate,
  attendance = [],
  membershipStart,
  membership_end
}) {
  // ✅ Membership start date (start of day)
  const membershipStartDate = membershipStart ? dayjs(membershipStart).startOf("day") : null;

  // ✅ Membership end date (start of day)
  const membershipEndDate = membership_end ? dayjs(membership_end).startOf("day") : null;

  // ✅ Convert attendance array to map for quick lookup
  const attendanceMap = attendance.reduce((acc, item) => {
    const key = dayjs(item.date).format("YYYY-MM-DD");
    acc[key] = item.status; // "present" or "absent"
    return acc;
  }, {});

  // ----- Month navigation
  const handlePrevMonth = () => setMonthDate(monthDate.subtract(1, "month"));
  const handleNextMonth = () => setMonthDate(monthDate.add(1, "month"));

  // ----- Render custom cell
  const dateFullCellRender = (value) => {
    const key = value.format("YYYY-MM-DD");
    const status = attendanceMap[key];
    const isToday = dayjs().isSame(value, "day");
    const isMembershipStart = membershipStartDate ? value.isSame(membershipStartDate, "day") : false;
    const isMembershipEnd = membershipEndDate ? value.isSame(membershipEndDate, "day") : false;

    let cellClass = "cell";

    // ✅ Membership start takes priority if same day
    if (isMembershipStart) {
      cellClass += " membership-start";
    } 
    // ✅ Membership end only if not same as start
    else if (isMembershipEnd) {
      cellClass += " membership-end";
    } 
    // ✅ Automatic absent for days after start but before today AND before end
    else if (
      membershipStartDate &&
      value.isAfter(membershipStartDate, "day") &&
      value.isBefore(dayjs(), "day") &&
      (!membershipEndDate || value.isBefore(membershipEndDate, "day"))
    ) {
      cellClass += " absent";
    } 
    else {
      cellClass += " empty"; // future/unmarked
    }

    // ✅ Today highlight
    if (isToday) cellClass += " today";

    return (
      <div className={clsx(cellClass)}>
        <div className="day">{value.date()}</div>
      </div>
    );
  };

  // ----- Custom month header
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

      {/* ✅ Legend section */}
      <div className="legend">
        <span className="pill present" /> Present
        <span className="pill absent" /> Absent
        <span className="pill today" /> Today
        <span className="pill membership-start" /> Joining Date
        <span className="pill membership-end" /> Membership End
      </div>
    </div>
  );
}
