import { Breadcrumb, Input } from "antd";
import MembershipCard from "../../component/card/memberShipCard";
import { HomeOutlined, SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useGetMyPlanQuery } from "../../service/plans/indx";

const AllPlan = () => {
  const [searchText, setSearchText] = useState("");

  // Plans array
  const plans = [
    {
      title: "Basic",
      price: "₹1,000",
      duration: "1 Month",
      features: ["Personal Trainer"],
      createdDate: "22 Aug 2025",
    },
    {
      title: "Silver",
      price: "₹1,800",
      duration: "3 Months",
      features: ["Diet Plan", "Supplements"],
      createdDate: "22 Aug 2025",
    },
    {
      title: "Gold",
      price: "₹3,000",
      duration: "6 Months",
      features: ["Personal Trainer", "Diet Plan", "Supplements", "Pool Access"],
      createdDate: "22 Aug 2025",
    },
    {
      title: "Platinum",
      price: "₹5,000",
      duration: "1 Year",
      features: ["Personal Trainer", "Diet Plan", "Supplements", "Pool Access"],
      createdDate: "22 Aug 2025",
    },
  ];
const {data:plansData} = useGetMyPlanQuery()
  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <h2 style={{ margin: 0 }}>All Plan</h2>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Breadcrumb>
            <Breadcrumb.Item href="">
              <HomeOutlined />
            </Breadcrumb.Item>
            <Breadcrumb.Item>Plan</Breadcrumb.Item>
            <Breadcrumb.Item>All Plan</Breadcrumb.Item>
          </Breadcrumb>

          <Input
            placeholder="Search by name, email, or contact"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
          />
        </div>
      </div>

      {/* Plans ko render karo */}
      <div style={{ display: "grid", gridTemplateColumns:"repeat(4, 1fr)", columnGap: 20 }}>
        {plansData?.map((plan, index) => (
          <MembershipCard key={index} data={plan} />
        ))}
      </div>
    </div>
  );
};

export default AllPlan;
