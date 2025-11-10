
import StatsCards from "../../component/StatsCards/StatsCards";
import RevenueChart from "../../component/RevenueChart/RevenueChart";
import MembershipChart from "../../component/MembershipChart/MembershipChart";
import "./styles.scss";
import { useGetAnalyticsQuery } from "../../service/gyms";

const Dashboard = () => {
    const userRole = localStorage.getItem("userRole")
  const { data, isLoading } = useGetAnalyticsQuery(
      undefined,
       { skip: userRole === "admin" },
  );

  if (isLoading) return <p style={{ color: "#fff" }}>Loading analytics...</p>;

  const analytics = data?.data || {};

  return (
    <>
      <div className="stats-cards-container">
        <StatsCards analytics={analytics} />
      </div>
      <div className="graph-container">
        <div className="revenue-col">
          <RevenueChart revenueData={analytics} />
        </div>
        <div className="membership-col">
          <MembershipChart plansStats={analytics.plansStats} monthlyStats={analytics.monthlyStats}/>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
