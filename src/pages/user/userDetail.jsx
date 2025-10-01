import { Row, Col, Card } from "antd";
import dayjs from "dayjs";
import { useMemo, useState, useEffect } from "react";
import ProfileHeader from "../../component/profileHeader";
import DateFilters from "../../component/dateFilters";
import AttendanceCalendar from "../../component/attendanceCalendar";
import SummaryCards from "../../component/SummaryCards";
import "./styles.scss";
import { useGetUserDetailQuery } from "../../service/user/allUser";
import { useParams } from "react-router-dom";
import moment from "moment";
import ProgressHistoryTable from "../../component/card/progressHistoryTable";
import { useGetProgressQuery } from "../../service/gyms";

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

  // ----- Attendance mapping
  const startOfMonth = monthDate.startOf(data?.user?.currentMembership?.membership_start);
  const membership_end = monthDate.startOf(data?.user?.currentMembership?.membership_end);
  const endOfMonth = monthDate.endOf("month");

 const attendance = useMemo(() => {
  const attendanceMap = {};

  // Mark present from API with time
  data?.attendance?.forEach((item) => {
    const dateKey = dayjs(item.date).format("YYYY-MM-DD");
    const timeKey = dayjs(item.date).format("hh:mm A");

    // Store object with status and time
    attendanceMap[dateKey] = {
      status: item.status,      // "present" or "absent"
      time: timeKey,            // HH:mm A format
    };
  });

  // Mark absent automatically for unmarked days
  let cursor = startOfMonth;
  while (cursor.isBefore(endOfMonth) || cursor.isSame(endOfMonth, "day")) {
    const dateKey = cursor.format("YYYY-MM-DD");

    if (!attendanceMap[dateKey] && cursor.isBefore(dayjs(), "day")) {
      attendanceMap[dateKey] = {
        status: "absent",
        time: null,
      };
    }

    cursor = cursor.add(1, "day");
  }

  // Convert to array for calendar
  return Object.entries(attendanceMap).map(([date, { status, time }]) => ({
    date,
    status,
    time,
  }));
}, [data?.attendance, monthDate, startOfMonth, endOfMonth]);


  // ----- Summary calculation
  const summary = useMemo(() => {
  let present = 0;
  let absent = 0;

  if (!data?.user?.membership_start) return { present: 0, absent: 0, attendanceRate: 0, today: 0 };

  const membershipStart = moment(data.user.membership_start).startOf("day");
  const today = moment().startOf("day");

  let cursor = membershipStart;

  while (cursor.isSameOrBefore(today, "day")) {
    const key = cursor.format("YYYY-MM-DD");

    const record = attendance.find((a) => moment(a.date).format("YYYY-MM-DD") === key);

    if (record?.status === "present") {
      present += 1;
    } else {
      // Either explicitly absent or no record → count as absent
      absent += 1;
    }

    cursor = cursor.add(1, "day");
  }

  const total = present + absent;
  const attendanceRate = total ? Math.round((present / total) * 100) : 0;

  const todayKey = today.format("YYYY-MM-DD");
  const todayPresent = attendance?.find((a) => a.date === todayKey && a.status === "present") ? 1 : 0;

  return { present, absent, attendanceRate, today: todayPresent };
}, [attendance, data?.user?.membership_start]);


  // const insights = {
  //   mostActiveTime: "6:00 AM",
  //   avgSession: "1.5 hrs",
  //   streak: "3 days",
  // };


 const insights = useMemo(() => {
  if (!attendance || attendance.length === 0) {
    return { mostActiveTime: "N/A", avgSession: "N/A", streak: "0 days" };
  } 

  // Most Active Time → First present record ka time directly from time property
  const firstPresent = attendance.find((a) => a.status === "present");
  const mostActiveTime = firstPresent ? firstPresent.time : "N/A";

  // Streak calculation
  let streak = 0;
  let cursor = moment().startOf("day");

  while (true) {
    const key = cursor.format("YYYY-MM-DD");
    const record = attendance.find(
      (a) => a.date === key && a.status === "present"
    );

    if (record) {
      streak += 1;
    } else {
      break; // Streak ends on first absent day
    }

    cursor = cursor.subtract(1, "day");
  }

  return {
    mostActiveTime,
    avgSession: "N/A",
    streak: `${streak} days`,
  };
}, [attendance]);


  const goal = { completed: summary.present + summary.today, target: 20 };

  const userProfile = data
    ? { ...data.user, attendance, progress: data.progress }
    : null;
  const {data:getProgress} = useGetProgressQuery(id)

  const mergerProgress = getProgress?.data && [getProgress?.data?.current,...getProgress?.data?.history] || []
  return (
    <div className="user-profile-container">
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading user details.</p>}

      {userProfile && (
        <div className="member-profile-wrapper">
          <Card title="Member Profile & Attendance" className="title-card">
            <ProfileHeader user={userProfile} progress={getProgress?.data?.current}/>
          </Card>

          <div className="calendar-con">
            <DateFilters
              period={period}
              onPeriodChange={setPeriod}
              range={range}
              onRangeChange={setRange}
              onToday={() => setPeriod("current")}
            />

            <Card bordered={false} style={{ padding: 0 }} className="calendar-card">
              <div className="calender-main">
                <AttendanceCalendar
                  monthDate={monthDate}
                  setMonthDate={setMonthDate}
                  attendance={attendance}
                  membership_end={membership_end}
                  membershipStart={data?.user?.currentMembership?.membership_start}
                />

                <ProgressHistoryTable getProgressHistory={mergerProgress} />
              </div>
              <div className="summary-cards">
                <SummaryCards summary={summary} insights={insights} goal={goal} />
                
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetail;
