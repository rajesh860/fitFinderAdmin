import React, { useEffect, useState } from "react";
import "./styles.scss";
import { Table, Tag, Space, Button, Card, Select } from "antd";
import PageHeader from "../../component/pageHeader";
import { useGetFeesCollectionQuery } from "../../service/gyms";
import moment from "moment";
import { useGetMyPlanQuery } from "../../service/plans/indx";
import RenewModal from "../../component/modal/renewModal";
import AddPaymentModel from "../../component/modal/addPaymentModel";

const { Option } = Select;

const statusColors = {
  active: "#10B981",
  completed: "#10B981",
  pending: "#FACC15",
  expired: "#EF4444",
};

const FeesCollection = () => {
  const [feeStatusFilter, setFeeStatusFilter] = useState("");
  const [searchText, setSearchText] = useState("");

  // ✅ Fetch all fee collections — initially skip
  const {
    data: apiResponse,
    isLoading,
    refetch,
  } = useGetFeesCollectionQuery(
    {
      fee_status: feeStatusFilter,
      searchText,
    },
    // {
    //   skip: !feeStatusFilter && !searchText, // 🚀 Run only when filter or search active
    // }
  );

  const { data: gymPlan } = useGetMyPlanQuery();

  // 🔹 Trigger refetch when filter changes
  useEffect(() => {
    if(feeStatusFilter || searchText){

      refetch();
    }
  }, [feeStatusFilter, searchText]);

  // 🔹 Modals
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRenewModalVisible, setIsRenewModalVisible] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);

  if (isLoading) return <p>Loading...</p>;
  if (!apiResponse?.data) return <p>No fee collection available</p>;

  // ✅ Map data for table
  const data =
    apiResponse?.data?.map((item) => {
      const current = item.current || {};
      const payments = item.payments || [];
      const user = item.member?.user || {};

      return {
        key: item._id,
        userId: user.userId || "-",
        memberId: item.member?._id || "",
        memberName: user.name || "-",
        memberEmail: user.email || "-",
        memberPhone: user.phone || "-",
        planName: current.planName || "-",
        feeAmount: current.totalAmount || 0,
        paidAmount: current.paidAmount || 0,
        dueAmount: current.pendingAmount || 0,
        status: current.status || "pending",
        paymentDate:
          payments?.length > 0
            ? moment(payments[0].createdAt).format("DD MMM YYYY")
            : "-",
        nextDueDate: current.endDate
          ? moment(current.endDate).format("DD MMM YYYY")
          : "-",
        payments,
      };
    }) || [];

  // ✅ Columns
  const columns = [
    { title: "User ID", dataIndex: "userId", key: "userId" },
    { title: "Member Name", dataIndex: "memberName", key: "memberName" },
    { title: "Email", dataIndex: "memberEmail", key: "memberEmail" },
    { title: "Phone", dataIndex: "memberPhone", key: "memberPhone" },
    { title: "Plan Name", dataIndex: "planName", key: "planName" },
    {
      title: "Fee Amount (₹)",
      dataIndex: "feeAmount",
      key: "feeAmount",
      render: (v) => `₹${v.toLocaleString()}`,
    },
    {
      title: "Paid Amount (₹)",
      dataIndex: "paidAmount",
      key: "paidAmount",
      render: (v) => `₹${v.toLocaleString()}`,
    },
    {
      title: "Due Amount (₹)",
      dataIndex: "dueAmount",
      key: "dueAmount",
      render: (v) => (
        <span style={{ color: v > 0 ? "#faad14" : "#52c41a" }}>
          ₹{v.toLocaleString()}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusColors[status]} style={{ textTransform: "uppercase" }}>
          {status}
        </Tag>
      ),
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
              setSelectedFee(record);
              setIsRenewModalVisible(true);
            }}
          >
            Renew Plan
          </Button>
        </Space>
      ),
    },
  ];

  // ✅ Totals summary
  const totalFees = apiResponse?.summary?.totalFees || 0;
  const totalCollection = apiResponse?.summary?.totalCollection || 0;
  const totalPending = apiResponse?.summary?.totalPending || 0;

  return (
    <div className="fees-collection-container">
      <PageHeader
        title="Fees Collection"
        breadcrumbs={["Financial", "Fees Collection"]}
        searchPlaceholder="Search by name, email, contact, date, time"
        searchText={searchText}
        onSearchChange={setSearchText}
      />

      {/* Summary */}
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
          value={feeStatusFilter || undefined}
          onChange={(v) => setFeeStatusFilter(v)}
          allowClear
        >
          <Option value="active">Active</Option>
          <Option value="completed">Completed</Option>
          <Option value="expired">Expired</Option>
        </Select>
      </div>

      {/* Table */}
      <div className="table-container">
        <Table
          dataSource={data}
          columns={columns}
          pagination={false}
          loading={isLoading}
          className="custom-table"
        />
      </div>

      {/* Modals */}
      <AddPaymentModel
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        selectedFee={selectedFee}
      />

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
