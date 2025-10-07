import { Breadcrumb, Input } from "antd";
import MembershipCard from "../../component/card/memberShipCard";
import { HomeOutlined, SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useGetMyPlanQuery } from "../../service/plans/indx";
import PageHeader from "../../component/pageHeader";

const AllPlan = () => {
  const [searchText, setSearchText] = useState("");
  const { data: plansData } = useGetMyPlanQuery();

  return (
    <div
      style={{
        minHeight: "100vh",
        // backgroundColor: "#0d1117",
        // padding: 20,
        color: "#c9d1d9",
      }}
    >
   <PageHeader
        title="All Plan"
        breadcrumbs={["Plan", "All Plan"]}
        searchPlaceholder="Search by name, email, contact, date, time"
        searchText={searchText}
        onSearchChange={setSearchText}
      />

      {/* Plans Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 16,
          paddingTop: 10,
        }}
      >
        {plansData?.length ? (
          plansData.map((plan, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "#161b22",
                border: "1px solid #30363d",
                borderRadius: "12px",
                padding: 4,
                transition: "0.3s",
                boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                // boxShadow: "0 0 10px rgba(0,0,0,0.3)",
              }}
            >
              <MembershipCard data={plan} />
            </div>
          ))
        ) : (
          <p style={{ color: "#8b949e", textAlign: "center", gridColumn: "1 / -1" }}>
            No plans found.
          </p>
        )}
      </div>
    </div>
  );
};

export default AllPlan;
