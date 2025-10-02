import { Row, Col, Card } from "antd";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { useMemo, useState, useEffect } from "react";
import ProfileHeader from "../../component/profileHeader";
import DateFilters from "../../component/dateFilters";
import AttendanceCalendar from "../../component/attendanceCalendar";
import SummaryCards from "../../component/SummaryCards";
import "./styles.scss";
import { useGetUserDetailQuery } from "../../service/user/allUser";
import { useParams } from "react-router-dom";
import ProgressHistoryTable from "../../component/card/progressHistoryTable";
import { useGetProgressQuery } from "../../service/gyms";

// Dayjs plugins extend karo
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const UserDetail = () => {
  const { id } = useParams();

  // ----- filters
  const [period, setPeriod] = useState("current");
  const [range, setRange] = useState(null);
  const [monthDate, setMonthDate] = useState(dayjs());

  // Update monthDate when period changes
  useEffect(() => {
    if (period === "last") setMonthDate(dayjs().subtract(1, "month"));
    else setMonthDate(dayjs());
  }, [period]);

  // ----- API data
  const { data, isLoading, isError } = useGetUserDetailQuery(id);

  // ----- Membership dates
  const membershipStart = useMemo(() => {
    return data?.user?.currentMembership?.membership_start
      ? dayjs(data.user.currentMembership.membership_start).startOf("day")
      : null;
  }, [data?.user?.currentMembership?.membership_start]);

  const membershipEnd = useMemo(() => {
    return data?.user?.currentMembership?.membership_end
      ? dayjs(data.user.currentMembership.membership_end).startOf("day")
      : null;
  }, [data?.user?.currentMembership?.membership_end]);

  console.log("Membership Data:", data?.user?.currentMembership);

  // ----- Combine all attendance data (both from root and currentMembership)
  const allAttendanceData = useMemo(() => {
    const mainAttendance = data?.attendance || [];
    const currentMembershipAttendance =
      data?.user?.currentMembership?.attendance || [];

    // Combine both arrays and remove duplicates based on date
    const combined = [...mainAttendance, ...currentMembershipAttendance];

    // Remove duplicates - keep the latest record if same date exists
    const attendanceMap = {};

    combined.forEach((item) => {
      const dateKey = dayjs(item.date).format("YYYY-MM-DD");

      // If date already exists, keep the one with latest createdAt or updatedAt
      if (
        !attendanceMap[dateKey] ||
        dayjs(item.createdAt || item.updatedAt).isAfter(
          dayjs(
            attendanceMap[dateKey].createdAt || attendanceMap[dateKey].updatedAt
          )
        )
      ) {
        attendanceMap[dateKey] = item;
      }
    });

    return Object.values(attendanceMap);
  }, [data?.attendance, data?.user?.currentMembership?.attendance]);

  // ----- Date ranges for current month view
  const startOfMonth = useMemo(() => monthDate.startOf("month"), [monthDate]);
  const endOfMonth = useMemo(() => monthDate.endOf("month"), [monthDate]);

  // ----- Attendance mapping
  const attendance = useMemo(() => {
    const attendanceMap = {};

    // Mark present from combined attendance data with time
    allAttendanceData?.forEach((item) => {
      const dateKey = dayjs(item.date).format("YYYY-MM-DD");
      const timeKey = dayjs(item.date).format("hh:mm A");

      // Store object with status and time
      attendanceMap[dateKey] = {
        status: item.status, // "present" or "absent"
        time: timeKey, // HH:mm A format
        source: item.source || "combined", // Track source for debugging
      };
    });

    // Mark absent automatically for unmarked days within membership period
    let cursor = startOfMonth;
    while (cursor.isBefore(endOfMonth) || cursor.isSame(endOfMonth, "day")) {
      const dateKey = cursor.format("YYYY-MM-DD");

      // Only mark as absent if:
      // 1. No attendance record exists
      // 2. Date is before today
      // 3. Date is within membership period (if membership exists)
      const isBeforeToday = cursor.isBefore(dayjs(), "day");
      const isWithinMembership =
        !membershipStart ||
        ((cursor.isAfter(membershipStart, "day") ||
          cursor.isSame(membershipStart, "day")) &&
          (!membershipEnd ||
            cursor.isBefore(membershipEnd, "day") ||
            cursor.isSame(membershipEnd, "day")));

      if (!attendanceMap[dateKey] && isBeforeToday && isWithinMembership) {
        attendanceMap[dateKey] = {
          status: "absent",
          time: null,
          source: "auto",
        };
      }

      cursor = cursor.add(1, "day");
    }

    // Convert to array for calendar
    return Object.entries(attendanceMap).map(
      ([date, { status, time, source }]) => ({
        date,
        status,
        time,
        source,
      })
    );
  }, [
    allAttendanceData,
    monthDate,
    startOfMonth,
    endOfMonth,
    membershipStart,
    membershipEnd,
  ]);

  // ----- Summary calculation (Pure dayjs use karo)
  const summary = useMemo(() => {
    let present = 0;
    let absent = 0;

    if (!membershipStart) {
      return {
        present: 0,
        absent: 0,
        attendanceRate: 0,
        today: 0,
        totalDays: 0,
      };
    }

    const today = dayjs().startOf("day");
    let cursor = membershipStart.clone();

    // Calculate only for the period from membership start to today
    while (cursor.isSameOrBefore(today, "day")) {
      const key = cursor.format("YYYY-MM-DD");

      const record = attendance.find(
        (a) => dayjs(a.date).format("YYYY-MM-DD") === key
      );

      if (record?.status === "present") {
        present += 1;
      } else if (record?.status === "absent") {
        // Only count explicit absent records
        absent += 1;
      }
      // Don't count days without records (future days or before membership)

      cursor = cursor.add(1, "day");
    }

    const total = present + absent;
    const attendanceRate = total ? Math.round((present / total) * 100) : 0;

    const todayKey = today.format("YYYY-MM-DD");
    const todayPresent = attendance?.find(
      (a) => a.date === todayKey && a.status === "present"
    )
      ? 1
      : 0;

    return {
      present,
      absent,
      attendanceRate,
      today: todayPresent,
      totalDays: total,
    };
  }, [attendance, membershipStart]);

  // ----- Insights calculation
  const insights = useMemo(() => {
    if (!attendance || attendance.length === 0) {
      return { mostActiveTime: "N/A", avgSession: "N/A", streak: "0 days" };
    }

    // Most Active Time → First present record ka time directly from time property
    const presentRecords = attendance.filter(
      (a) => a.status === "present" && a.time
    );
    const mostActiveTime =
      presentRecords.length > 0 ? presentRecords[0].time : "N/A";

    // Streak calculation - consecutive present days
    let streak = 0;
    let cursor = dayjs().startOf("day");

    while (true) {
      const key = cursor.format("YYYY-MM-DD");
      const record = attendance.find(
        (a) => a.date === key && a.status === "present"
      );

      if (record) {
        streak += 1;
      } else {
        break; // Streak ends on first absent or missing day
      }

      cursor = cursor.subtract(1, "day");

      // Break if we go too far back in time (safety check)
      if (streak > 365) break;
    }

    return {
      mostActiveTime,
      avgSession: "N/A", // You can calculate this if you have session duration data
      streak: `${streak} days`,
    };
  }, [attendance]);

  const goal = {
    completed: summary.present,
    target: 20,
  };

  const userProfile = data
    ? {
        ...data.user,
        attendance,
        progress: data.progress,
        membershipStart: membershipStart?.format("YYYY-MM-DD"),
        membershipEnd: membershipEnd?.format("YYYY-MM-DD"),
      }
    : null;

  const { data: getProgress } = useGetProgressQuery(id);

  const mergerProgress =
    (getProgress?.data && [
      getProgress?.data?.current,
      ...(getProgress?.data?.history || []),
    ]) ||
    [];

  return (
    <div className="user-profile-container" style={{ minHeight: "100vh" }}>
      {isLoading && <p style={{ color: "#ffffff" }}>Loading...</p>}
      {isError && (
        <p style={{ color: "#ff4d4f" }}>Error loading user details.</p>
      )}

      {userProfile && (
        <div className="member-profile-wrapper">
          <Card
            title="Member Profile & Attendance"
            className="title-card"
            // style={{ background: "#1f1f1f" }}
          >
            <ProfileHeader
              user={userProfile}
              progress={getProgress?.data?.current}
            />
          </Card>

          <div className="calendar-con">
            <DateFilters
              period={period}
              onPeriodChange={setPeriod}
              range={range}
              onRangeChange={setRange}
              onToday={() => setPeriod("current")}
            />

            <Card
              bordered={false}
              style={{ padding: 0, background: "#1f1f1f" }}
              className="calendar-card"
            >
              <div className="calender-main">
                <AttendanceCalendar
                  monthDate={monthDate}
                  setMonthDate={setMonthDate}
                  attendance={attendance}
                  membership_end={membershipEnd}
                  membershipStart={membershipStart}
                />

                <ProgressHistoryTable getProgressHistory={mergerProgress} />
              </div>
              <div className="summary-cards">
                <SummaryCards
                  summary={summary}
                  insights={insights}
                  goal={goal}
                />
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetail;
