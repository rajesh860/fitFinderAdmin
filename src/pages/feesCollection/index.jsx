import React, { useState } from "react";
import "./styles.scss";
import {
  Table,
  Tag,
  Space,
  Button,
  Card,
  Select,
} from "antd";
import PageHeader from "../../component/pageHeader";
import {
  useGetFeesCollectionQuery,
} from "../../service/gyms";
import moment from "moment";
import { useGetMyPlanQuery } from "../../service/plans/indx";
import RenewModal from "../../component/modal/renewModal";
import AddPaymentModel from "../../component/modal/addPaymentModel";

const { Option } = Select;

const FeesCollection = () => {
  const [feeStatusFilter, setFeeStatusFilter] = useState("");
  const [searchText, setSearchText] = useState("");

  const { data: apiResponse, isLoading } = useGetFeesCollectionQuery({
    fee_status: feeStatusFilter,
    searchText,
  });


  const { data: gymPlan, isLoading: planLoading } = useGetMyPlanQuery();

  // 🔹 Modal States
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRenewModalVisible, setIsRenewModalVisible] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);

 

  if (isLoading) return <p>Loading...</p>;
  if (!apiResponse?.data) return <p>No fee collection available</p>;

  // ✅ Map API data to Table rows
  const data =
    apiResponse?.data?.map((item) => ({
      userId:item.member?.user?.userId,
      key: item._id,
      memberId: item.member?._id || "", // ✅ Add memberId here
      memberName: item.member?.user?.name || "-",
      memberEmail: item.member?.user?.email || "-",
      memberPhone: item.member?.user?.phone || "-",
      planName: item.planName || "-",
      feeAmount: item.totalAmount || 0,
      paidAmount: item.paidAmount || 0,
      dueAmount: item.pendingAmount || 0,
      status: item.status === "pending" ? "Pending" : "Paid",
      paymentDate:
        item.payments?.[0]?.date &&
        moment(item.payments[0].date).format("DD MMM YYYY"),
      nextDueDate: item.endDate && moment(item.endDate).format("DD MMM YYYY"),
      payments: item.payments || [],
    })) || [];

  const filteredData = data.filter((item) =>
    feeStatusFilter
      ? item.status.toLowerCase() === feeStatusFilter.toLowerCase()
      : true
  );

  const summary = apiResponse?.summary || {};
  const totalFees = summary.totalFees || 0;
  const totalCollection = summary.totalCollection || 0;
  const totalPending = summary.totalPending || 0;

 
  const columns = [
    {title:"user id",dataIndex:"userId",key:"userId"},
    { title: "Member Name", dataIndex: "memberName", key: "memberName" },
    { title: "Email", dataIndex: "memberEmail", key: "memberEmail" },
    { title: "Phone", dataIndex: "memberPhone", key: "memberPhone" },
    { title: "Plan Name", dataIndex: "planName", key: "planName" },
    {
      title: "Fee Amount (₹)",
      dataIndex: "feeAmount",
      key: "feeAmount",
      render: (value) => `₹${value.toLocaleString()}`,
    },
    {
      title: "Paid Amount (₹)",
      dataIndex: "paidAmount",
      key: "paidAmount",
      render: (value) => `₹${value.toLocaleString()}`,
    },
    {
      title: "Due Amount (₹)",
      dataIndex: "dueAmount",
      key: "dueAmount",
      render: (value) => (
        <span style={{ color: value > 0 ? "#faad14" : "#52c41a" }}>
          ₹{value.toLocaleString()}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = status === "Paid" ? "green" : "gold";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    { title: "Payment Date", dataIndex: "paymentDate", key: "paymentDate" },
    { title: "Next Due Date", dataIndex: "nextDueDate", key: "nextDueDate" },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => {
              setSelectedFee(record);
              setIsModalVisible(true);
            }}
          >
            Add Payment
          </Button>
          <Button
            type="primary"
            style={{ backgroundColor: "#f59e0b", borderColor: "#f59e0b" }}
            onClick={() => {
              setSelectedFee(record); // ✅ record me memberId hai
              setIsRenewModalVisible(true);
            }}
          >
            Renew Plan
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="fees-collection-container">
      <PageHeader
        title="Fees Collection"
        breadcrumbs={["Financial", "Fees Collection"]}
        searchPlaceholder="Search by name, email, contact, date, time"
        searchText={searchText}
        onSearchChange={setSearchText}
      />

      {/* Summary Cards */}
      <div className="summary-cards">
        <Card className="summary-card" bordered={false}>
          <h3>Total Fees</h3>
          <p className="amount">₹{totalFees.toLocaleString()}</p>
        </Card>
        <Card className="summary-card" bordered={false}>
          <h3>Total Collection</h3>
          <p className="amount success">₹{totalCollection.toLocaleString()}</p>
        </Card>
        <Card className="summary-card" bordered={false}>
          <h3>Pending Collection</h3>
          <p className="amount warning">₹{totalPending.toLocaleString()}</p>
        </Card>
      </div>

      {/* Filter */}
      <div style={{ marginBottom: 16 }}>
        <Select
          placeholder="Filter by Fee Status"
          style={{ width: 200 }}
          value={feeStatusFilter || "Select Status"}
          onChange={(value) => setFeeStatusFilter(value)}
          allowClear
        >
          <Option value="paid">Paid</Option>
          <Option value="pending">Pending</Option>
          <Option value="overdue">Over due</Option>
        </Select>
      </div>

      {/* Table */}
      <div className="table-container">

      <Table
        dataSource={filteredData}
        columns={columns}
        pagination={false}
        loading={isLoading}
        className="custom-table"
        />
        </div>

      {/* Add Payment Modal */}
    
<AddPaymentModel isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} selectedFee={selectedFee}/>
      {/* ✅ Renew Modal */}
      <RenewModal
        selectedFee={selectedFee}
        isRenewModalVisible={isRenewModalVisible}
        setIsRenewModalVisible={setIsRenewModalVisible}

        gymPlan={gymPlan}
      />
    </div>
  );
};

export default FeesCollection;
