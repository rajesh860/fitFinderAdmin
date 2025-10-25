import React, { useState } from "react";
import "./styles.scss";
import {
  Table,
  Tag,
  Space,
  Button,
  Card,
  Modal,
  Input,
  Select,
  message,
} from "antd";
import PageHeader from "../../component/pageHeader";
import {
  useAddPendingPaymentMutation,
  useGetFeesCollectionQuery,
} from "../../service/gyms";
import moment from "moment";

const { Option } = Select;

const FeesCollection = () => {
  const [feeStatusFilter, setFeeStatusFilter] = useState("");
  const [searchText, setSearchText] = useState("");
  const { data: apiResponse, isLoading } = useGetFeesCollectionQuery(feeStatusFilter);
  const [trigger, { isLoading: isAddingPayment }] =
    useAddPendingPaymentMutation();

  // 🔹 Modal State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [paymentData, setPaymentData] = useState({
    amount: "",
    mode: "cash",
    remark: "",
  });

  // 🔹 Fee Status Filter

  if (isLoading) return <p>Loading...</p>;
  if (!apiResponse?.data) return <p>No fee collection available</p>;

  // 🔹 Transform API data for Table
  const data =
    apiResponse?.data?.map((item) => ({
      key: item._id,
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
      nextDueDate:
        item.endDate && moment(item.endDate).format("DD MMM YYYY"),
      payments: item.payments || [],
    })) || [];

  // 🔹 Apply Fee Status Filter
  const filteredData = data.filter((item) =>
    feeStatusFilter
      ? item.status.toLowerCase() === feeStatusFilter.toLowerCase()
      : true
  );

  // 🔹 Summary Calculations
  const summary = apiResponse?.summary || {};
  const totalFees = summary.totalFees || 0;
  const totalCollection = summary.totalCollection || 0;
  const totalPending = summary.totalPending || 0;

  // 🔹 Table Columns
  const columns = [
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
              setPaymentData({ amount: "", mode: "cash", remark: "" });
              setIsModalVisible(true);
            }}
          >
            Add Payment
          </Button>
        </Space>
      ),
    },
  ];

  // 🔹 Handle Add Payment
  const handleAddPayment = async () => {
    if (
      !paymentData.amount ||
      isNaN(paymentData.amount) ||
      Number(paymentData.amount) <= 0
    ) {
      return message.error("Please enter a valid amount");
    }

    try {
      await trigger({
        feeCollectionId: selectedFee.key,
        amount: Number(paymentData.amount),
        mode: paymentData.mode,
        remark: paymentData.remark,
      }).unwrap();

      message.success("Payment added successfully");
      setIsModalVisible(false);
    } catch (err) {
      console.error(err);
      message.error(err?.data?.message || "Failed to add payment");
    }
  };

  return (
    <div className="fees-collection-container">
      {/* 🔹 Header */}
      <PageHeader
        title="Fees Collection"
        breadcrumbs={["Financial", "Fees Collection"]}
        searchPlaceholder="Search by name, email, contact, date, time"
        searchText={searchText}
        onSearchChange={setSearchText}
      />

      {/* 🔹 Summary Cards */}
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

      {/* 🔹 Fee Status Filter */}
      <div style={{ marginBottom: 16 }}>
        <Select
          placeholder="Filter by Fee Status"
          style={{ width: 200 }}
          // defaultValue={"paid"}
          value={feeStatusFilter || "Select Status"}
          onChange={(value) => setFeeStatusFilter(value)}
          allowClear
        >
          <Option value="paid">Paid</Option>
          <Option value="pending">Pending</Option>
          <Option value="overdue">Over due</Option>
        </Select>
      </div>

      {/* 🔹 Table */}
      <div className="table-wrapper">
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 10 }}
          loading={isLoading}
          className="custom-table"
        />
      </div>

      {/* 🔹 Add Payment Modal */}
      <Modal
        title={`Add Payment for ${selectedFee?.memberName || ""}`}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleAddPayment}
        okText="Submit"
        confirmLoading={isAddingPayment}
      >
        {selectedFee && (
          <Card bordered style={{ marginBottom: 20, background: "#fafafa" }}>
            <p>
              <strong>Plan Name:</strong> {selectedFee.planName}
            </p>
            <p>
              <strong>Total Amount:</strong> ₹
              {selectedFee.feeAmount.toLocaleString()}
            </p>
            <p>
              <strong>Paid Amount:</strong> ₹
              {selectedFee.paidAmount.toLocaleString()}
            </p>
            <p>
              <strong>Pending Amount:</strong> ₹
              {selectedFee.dueAmount.toLocaleString()}
            </p>
          </Card>
        )}

        <Input
          placeholder="Amount"
          type="number"
          value={paymentData.amount}
          onChange={(e) =>
            setPaymentData({ ...paymentData, amount: e.target.value })
          }
          style={{ marginBottom: 10 }}
        />
        <Select
          value={paymentData.mode}
          onChange={(value) => setPaymentData({ ...paymentData, mode: value })}
          style={{ width: "100%", marginBottom: 10 }}
        >
          <Option value="cash">Cash</Option>
          <Option value="upi">UPI</Option>
          <Option value="card">Card</Option>
          <Option value="bank">Bank</Option>
        </Select>
        <Input.TextArea
          placeholder="Remark"
          value={paymentData.remark}
          onChange={(e) =>
            setPaymentData({ ...paymentData, remark: e.target.value })
          }
        />
      </Modal>
    </div>
  );
};

export default FeesCollection;
