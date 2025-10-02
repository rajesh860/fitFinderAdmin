import React from "react";
import StatsCards from "../../component/StatsCards/StatsCards";
import RevenueChart from "../../component/RevenueChart/RevenueChart";
import MembershipChart from "../../component/MembershipChart/MembershipChart";
import "./styles.scss";
const Dashboard = () => {
  return (
    <>
      <div className="stats-cards-container">
        <StatsCards />
      </div>
      <div className="graph-container">
        <div className="revenue-col">
          <RevenueChart />
        </div>
        <div className="membership-col">
          <MembershipChart />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
