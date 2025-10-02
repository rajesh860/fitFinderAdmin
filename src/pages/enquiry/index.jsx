import { useState } from "react";
import {
  Table,
  Input,
  Breadcrumb,
  Tag,
  Modal,
  Button,
  Popconfirm,
  message,
  Form,
} from "antd";
import {
  HomeOutlined,
  SearchOutlined,
  CheckOutlined,
  CloseOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import {
  useApproveEnquiryMutation,
  useCancelEnquiryMutation,
  useCompleteEnquiryMutation,
  useGetQueryQuery,
} from "../../service/gyms/index";
import { toast } from "react-toastify";
import "./styles.scss";
const NewEnquiry = () => {
  const [searchText, setSearchText] = useState("");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [reason, setReason] = useState("");
  const [uniqueNumber, setUniqueNumber] = useState("");

  const { data, isLoading: loading } = useGetQueryQuery([
    "pending",
    "upcoming",
  ]); // Fetch data from API
  const [trigger, { data: cancelEnquiryResponse, isLoading }] =
    useCancelEnquiryMutation(); // Cancel Enquiry API
  const [trigg, { data: approvedEnquiryResponse }] =
    useApproveEnquiryMutation(); // Cancel Enquiry API
  const [trig, { data: completedEnquiryResponse }] =
    useCompleteEnquiryMutation(); // Cancel Enquiry API

  const handleApprove = async (record) => {
    const res = await trigg(record._id).unwrap();

    if (res.success) {
      toast.success(
        res.message || `Approved Enquiry of ${record.userId?.first_name}`
      );
    } else {
      toast.error(res.message || "Failed to approve enquiry");
    }
  };

  console.log(selectedEnquiry?._id);
  const handleReject = async () => {
    if (!reason.trim()) {
      message.error("Reason is required");
      return;
    }

    try {
      const res = await trigger({
        id: selectedEnquiry._id,
        reason: reason,
      }).unwrap();

      if (res.success) {
        toast.success(res.message || "Enquiry cancelled successfully");
      } else {
        message.error(res.message || "Failed to cancel enquiry");
      }
    } catch (error) {
      console.error("Cancel Error:", error);
      message.error(error?.data?.message || "Something went wrong");
    }

    setIsRejectModalOpen(false);
    setReason("");
  };

  const handleComplete = async () => {
    if (!uniqueNumber.trim()) {
      message.error("Unique number is required");
      return;
    }

    const res = await trig({
      id: selectedEnquiry._id,
      uniqueNumber: uniqueNumber,
    }).unwrap();

    if (res.success) {
      toast.success(res.message || `Enquiry marked as completed`);
      setIsCompleteModalOpen(false);
      setUniqueNumber("");
    } else {
      toast.error(res.message || "Failed to complete enquiry");
    }
  };

  const columns = [
    {
      title: "User Name",
      key: "userName",
      render: (_, record) => (
        <strong>{`${record.userId?.first_name || ""} ${
          record.userId?.last_name || ""
        }`}</strong>
      ),
    },
    {
      title: "User Contact",
      key: "userContact",
      render: (_, record) => record.userId?.phone || "-",
    },
    {
      title: "User Email",
      key: "userEmail",
      render: (_, record) => record.userId?.email || "-",
    },
    {
      title: "Enquiry Date",
      key: "date",
      dataIndex: "date",
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "Enquiry Time",
      key: "time",
      dataIndex: "time",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status) => (
        <Tag
          color={
            status === "pending"
              ? "orange"
              : status === "completed"
              ? "green"
              : status === "cancelled"
              ? "red"
              : "blue"
          }
        >
          {status.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: "Pending", value: "pending" },
        { text: "Completed", value: "completed" },
        { text: "Cancelled", value: "cancelled" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          {/* Approve Button */}
          <Popconfirm
            title="Are you sure to approve this enquiry?"
            onConfirm={() => handleApprove(record)}
            okText="Yes"
            cancelText="No"
            disabled={record.status === "upcoming"} // ✅ upcoming में approve भी disable कर सकते हो अगर जरूरत हो
          >
            {record.status !== "upcoming" && (
              <Button
                type="primary"
                icon={<CheckOutlined />}
                size="small"
                disabled={record.status === "upcoming"} // ✅ upcoming में approve disable
              />
            )}
          </Popconfirm>

          {/* Reject Button */}
          {record.status !== "upcoming" && ( // ✅ upcoming में reject button hide
            <Button
              danger
              icon={<CloseOutlined />}
              size="small"
              onClick={() => {
                setSelectedEnquiry(record);
                setIsRejectModalOpen(true);
              }}
            />
          )}

          {/* Completed Button */}
          <Button
            icon={<CheckCircleOutlined />}
            size="small"
            onClick={() => {
              setSelectedEnquiry(record);
              setIsCompleteModalOpen(true);
            }}
          />
        </div>
      ),
    },
  ];

  const filteredData = data?.data?.filter(
    (item) =>
      (item.userId?.first_name || "")
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      (item.userId?.last_name || "")
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      (item.userId?.email || "")
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      (item.userId?.phone || "").includes(searchText) ||
      new Date(item.date).toLocaleDateString().includes(searchText) ||
      (item.time || "").includes(searchText)
  );

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <h2 style={{ margin: 0, color: "white" }}>New Enquiries</h2>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Breadcrumb>
            <Breadcrumb.Item href="">
              <HomeOutlined />
            </Breadcrumb.Item>
            <Breadcrumb.Item>Enquiry</Breadcrumb.Item>
            <Breadcrumb.Item>New Enquiries</Breadcrumb.Item>
          </Breadcrumb>

          <Input
            placeholder="Search by name, email, contact, date, time"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="dark-table">
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey={(record) => record._id}
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            itemRender: (_, type, originalElement) => originalElement,
          }}
          bordered
          style={{ background: "#0D0D0D", color: "#fff", borderColor: "#333" }}
          rowClassName={() => "dark-table-row"}
        />
      </div>

      {/* Reject Modal */}
      <Modal
        title="Reject Enquiry"
        open={isRejectModalOpen}
        onCancel={() => setIsRejectModalOpen(false)}
        onOk={handleReject}
        okText="Submit"
        cancelText="Cancel"
        confirmLoading={isLoading}
      >
        <Form layout="vertical">
          <Form.Item label="Rejection Reason" required>
            <Input.TextArea
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter rejection reason"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Complete Modal */}
      <Modal
        title="Complete Enquiry"
        open={isCompleteModalOpen}
        onCancel={() => setIsCompleteModalOpen(false)}
        onOk={handleComplete}
        okText="Submit"
        cancelText="Cancel"
      >
        <Form layout="vertical">
          <Form.Item label="Unique Completion Number" required>
            <Input
              value={uniqueNumber}
              onChange={(e) => setUniqueNumber(e.target.value)}
              placeholder="Enter unique number"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NewEnquiry;
