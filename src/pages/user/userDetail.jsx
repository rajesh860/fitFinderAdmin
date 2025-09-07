import { Row, Col, Card } from "antd";
import dayjs from "dayjs";
import { useMemo, useState, useEffect } from "react";
import { generateMonthAttendance, summarize } from "../../utils/attendanceUtils";
import ProfileHeader from "../../component/profileHeader";
import DateFilters from "../../component/dateFilters";
import AttendanceCalendar from "../../component/attendanceCalendar";
import SummaryCards from "../../component/SummaryCards";
import "./styles.scss";
import { useGetUserDetailQuery } from "../../service/user/allUser";
import { useParams } from "react-router-dom";

const  UserDetail = ()=> {
  // ----- mock user (replace with API later)
  const {id} = useParams()
  const user = {
    name: "Sarah Johnson",
    id: "GYM-2024-001",
    phone: "+1 (555) 123-4567",
    email: "sarah.j@email.com",
    fee: "$89/month",
    height: "5'6\"",
    weight: "135 lbs",
    address: "123 Main St, NYC",
    createdAt: "Jan 15, 2024",
    updatedAt: dayjs().format("MMM DD, YYYY"),
    validTill: "Dec 31, 2024",
    avatar: "/vite.svg", // replace with your image in /src/assets if you like
  };

  // ----- filters
  const [period, setPeriod] = useState("current");
  const [range, setRange] = useState(null);
  const [monthDate, setMonthDate] = useState(dayjs());

  // Update monthDate when period changes
  useEffect(() => {
    if (period === "last") {
      setMonthDate(dayjs().subtract(1, "month"));
    } else if (period === "current") {
      setMonthDate(dayjs());
    }
  }, [period]);

  // Attendance map for the visible month
  const dataMap = useMemo(() => {
    return generateMonthAttendance(monthDate.year(), monthDate.month() + 1);
  }, [monthDate]);

  const summary = summarize(dataMap);

  const insights = {
    mostActiveTime: "6:00 AM",
    avgSession: "1.5 hrs",
    streak: "3 days",
  };

  const goal = { completed: summary.present + summary.today, target: 20 };
const {data} = useGetUserDetailQuery(id)
  return (
    <div className="container">
      <div className="member-profile-wrapper">
          <Card title="Member Profile & Attendance" className="title-card">

      
          <ProfileHeader user={data} />
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
            style={{ padding: 0 }}
            className="calendar-card"
          >
            <div className="calender-main">
              <AttendanceCalendar
                monthDate={monthDate}
                setMonthDate={setMonthDate}
                dataMap={dataMap}
              />
            </div>
            <div className="summary-cards">
              <SummaryCards summary={summary} insights={insights} goal={goal} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default UserDetail;
